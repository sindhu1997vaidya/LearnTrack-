import React, { useState } from 'react';
import { Check, Copy, FileCode2, FileText } from 'lucide-react';
import { JAVA_PROJECT_FILES, ProjectFileItem } from '../data/javaProjectFiles';

interface SourceExplorerProps {
  selectedPath: string;
  onSelectPath: (relativePath: string) => void;
}

const GROUP_LABELS: Record<ProjectFileItem['group'], string> = {
  root: 'Project Root',
  ui: 'com.airtribe.learntrack.ui',
  entity: 'com.airtribe.learntrack.entity',
  service: 'com.airtribe.learntrack.service',
  util: 'com.airtribe.learntrack.util',
  exception: 'com.airtribe.learntrack.exception',
  docs: 'docs',
};

const GROUP_ORDER: ProjectFileItem['group'][] = [
  'root',
  'ui',
  'entity',
  'service',
  'util',
  'exception',
  'docs',
];

export const SourceExplorer: React.FC<SourceExplorerProps> = ({
  selectedPath,
  onSelectPath,
}) => {
  const [copied, setCopied] = useState(false);

  const activeFile =
    JAVA_PROJECT_FILES.find((f) => f.relativePath === selectedPath) ?? JAVA_PROJECT_FILES[0];

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const lines = activeFile ? activeFile.content.split('\n') : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar Package Tree */}
      <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Java Project Files</h2>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {JAVA_PROJECT_FILES.length} files
          </span>
        </div>

        <div className="space-y-4">
          {GROUP_ORDER.map((group) => {
            const files = JAVA_PROJECT_FILES.filter((f) => f.group === group);
            if (files.length === 0) return null;
            return (
              <div key={group}>
                <div className="text-xs font-mono text-slate-500 mb-1.5 px-1">
                  {GROUP_LABELS[group]}
                </div>
                <div className="space-y-0.5">
                  {files.map((file) => {
                    const isSelected = activeFile?.relativePath === file.relativePath;
                    return (
                      <button
                        key={file.relativePath}
                        type="button"
                        onClick={() => onSelectPath(file.relativePath)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-xs font-mono rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-900 font-medium'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {file.language === 'java' ? (
                          <FileCode2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Code / Markdown Reader */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
        {activeFile && (
          <>
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-mono text-slate-700 truncate">
                  {activeFile.relativePath}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {activeFile.language === 'java' ? 'Core Java Source' : 'Markdown Documentation'} ·{' '}
                  {lines.length} lines
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy File
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto max-h-[640px] bg-slate-950 text-slate-100 p-4 font-mono text-xs leading-relaxed">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-slate-900/60">
                      <td className="pr-4 text-right text-slate-600 select-none tabular-nums w-10 align-top">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre text-slate-100">{line || ' '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
