export interface ProjectFileItem {
  path: string;
  relativePath: string;
  name: string;
  group: 'entity' | 'service' | 'util' | 'exception' | 'ui' | 'docs' | 'root';
  language: 'java' | 'markdown';
  content: string;
}

const rawModules = import.meta.glob('/java-project/**/*.{java,md}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function classifyGroup(relativePath: string): ProjectFileItem['group'] {
  if (relativePath.includes('/entity/')) return 'entity';
  if (relativePath.includes('/service/')) return 'service';
  if (relativePath.includes('/util/')) return 'util';
  if (relativePath.includes('/exception/')) return 'exception';
  if (relativePath.includes('/ui/')) return 'ui';
  if (relativePath.startsWith('docs/')) return 'docs';
  return 'root';
}

const groupOrder: Record<ProjectFileItem['group'], number> = {
  root: 0,
  ui: 1,
  entity: 2,
  service: 3,
  util: 4,
  exception: 5,
  docs: 6,
};

export const JAVA_PROJECT_FILES: ProjectFileItem[] = Object.entries(rawModules)
  .map(([fullPath, content]) => {
    const relativePath = fullPath.replace(/^\/java-project\//, '');
    const parts = relativePath.split('/');
    const name = parts[parts.length - 1];
    return {
      path: fullPath,
      relativePath,
      name,
      group: classifyGroup(relativePath),
      language: (name.endsWith('.java') ? 'java' : 'markdown') as ProjectFileItem['language'],
      content,
    };
  })
  .sort((a, b) => {
    const ga = groupOrder[a.group];
    const gb = groupOrder[b.group];
    if (ga !== gb) return ga - gb;
    return a.relativePath.localeCompare(b.relativePath);
  });
