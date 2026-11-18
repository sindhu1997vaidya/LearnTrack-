import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { ArchitectureWorkspace } from './components/ArchitectureWorkspace';
import { ConsoleWorkspace } from './components/ConsoleWorkspace';
import { RecordsWorkspace } from './components/RecordsWorkspace';
import { SourceExplorer } from './components/SourceExplorer';
import { JAVA_PROJECT_FILES } from './data/javaProjectFiles';
import { LearnTrackRuntime } from './domain/learntrackEngine';
import { buildZipBlob } from './utils/zipExport';

type AppView = 'console' | 'records' | 'architecture' | 'source';

const NAV_ITEMS: Array<{ id: AppView; label: string }> = [
  { id: 'console', label: 'Console' },
  { id: 'records', label: 'Records' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'source', label: 'Source & Docs' },
];

export default function App() {
  const runtime = useMemo(() => new LearnTrackRuntime(), []);
  const [version, setVersion] = useState(0);
  const [activeView, setActiveView] = useState<AppView>('console');
  const [selectedSourcePath, setSelectedSourcePath] = useState<string>(
    'src/com/airtribe/learntrack/ui/Main.java',
  );

  const handleMutate = () => {
    setVersion((v) => v + 1);
  };

  const handleResetDemo = () => {
    runtime.seedInitialData();
    setVersion((v) => v + 1);
  };

  const handleOpenFile = (relativePath: string) => {
    setSelectedSourcePath(relativePath);
    setActiveView('source');
  };

  const handleExportZip = () => {
    const entries = JAVA_PROJECT_FILES.map((file) => ({
      path: `learntrack/${file.relativePath}`,
      content: file.content,
    }));
    const blob = buildZipBlob(entries);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'learntrack-core-java.zip';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element brand wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('console')}
            className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            LearnTrack
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="flex items-center gap-6 overflow-x-auto" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`py-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-slate-900 border-sky-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleExportZip}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Java Project
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8 space-y-6">
        {/* Contextual Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 text-balance">
              {activeView === 'console' && 'Student & Course Management Console'}
              {activeView === 'records' && 'In-Memory Records & Enrollment Manager'}
              {activeView === 'architecture' && 'Core Java OOP Architecture & JVM Notes'}
              {activeView === 'source' && 'com.airtribe.learntrack Source & Documentation'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {activeView === 'console' &&
                'Interactive simulation of com.airtribe.learntrack.ui.Main backed by ArrayList collections, static ID counters, and custom exceptions.'}
              {activeView === 'records' &&
                'Manage students, courses, enrollments, and polymorphic Person records synchronized directly with the console runtime.'}
              {activeView === 'architecture' &&
                'Explore class inheritance, overloaded constructors, service boundaries, and JVM execution fundamentals.'}
              {activeView === 'source' &&
                'Inspect or copy any Core Java class, custom exception, utility helper, or Markdown documentation file.'}
            </p>
          </div>
          <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">
            Package: <span className="font-mono text-slate-700">com.airtribe.learntrack</span> · JDK 17+
          </div>
        </div>

        {activeView === 'console' && (
          <ConsoleWorkspace
            runtime={runtime}
            version={version}
            onMutate={handleMutate}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeView === 'records' && (
          <RecordsWorkspace runtime={runtime} version={version} onMutate={handleMutate} />
        )}

        {activeView === 'architecture' && (
          <ArchitectureWorkspace onOpenFile={handleOpenFile} />
        )}

        {activeView === 'source' && (
          <SourceExplorer
            selectedPath={selectedSourcePath}
            onSelectPath={setSelectedSourcePath}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>LearnTrack · Core Java Student, Course &amp; Enrollment System</span>
          <span className="font-mono tabular-nums">
            {JAVA_PROJECT_FILES.length} Java &amp; Markdown files bundled
          </span>
        </div>
      </footer>
    </div>
  );
}
