import React, { useState } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { CLASS_RELATIONS, CLASS_SPECS, ClassSpec } from '../data/architectureData';

interface ArchitectureWorkspaceProps {
  onOpenFile: (relativePath: string) => void;
}

type ConceptTab = 'jvm' | 'design' | 'compile';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 82;

export const ArchitectureWorkspace: React.FC<ArchitectureWorkspaceProps> = ({
  onOpenFile,
}) => {
  const [selectedId, setSelectedId] = useState<string>('Student');
  const [conceptTab, setConceptTab] = useState<ConceptTab>('jvm');

  const selectedClass: ClassSpec =
    CLASS_SPECS.find((c) => c.id === selectedId) ?? CLASS_SPECS[0];

  const getNodeCenter = (id: string) => {
    const spec = CLASS_SPECS.find((c) => c.id === id);
    if (!spec) return { x: 0, y: 0 };
    return { x: spec.x + NODE_WIDTH / 2, y: spec.y + NODE_HEIGHT / 2 };
  };

  return (
    <div className="space-y-6">
      {/* Interactive Class Diagram + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                com.airtribe.learntrack Class Diagram
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any class box to inspect its fields, constructors, overridden methods, and source file.
              </p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
              Solid arrow = extends · Dashed = uses / stores
            </span>
          </div>

          <div className="p-4 bg-slate-50/70 overflow-x-auto flex-1">
            <svg
              viewBox="0 0 1190 550"
              className="w-full min-w-[760px] h-auto select-none"
              role="img"
              aria-label="LearnTrack Java class diagram"
            >
              <defs>
                <marker
                  id="arrow-extends"
                  viewBox="0 0 12 12"
                  refX="10"
                  refY="6"
                  markerWidth="10"
                  markerHeight="10"
                  orient="auto"
                >
                  <path d="M 1 1 L 11 6 L 1 11 z" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                </marker>
                <marker
                  id="arrow-uses"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Relationships */}
              {CLASS_RELATIONS.map((rel, idx) => {
                const start = getNodeCenter(rel.from);
                const end = getNodeCenter(rel.to);
                const isExtends = rel.type === 'extends';
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;

                return (
                  <g key={`${rel.from}-${rel.to}-${idx}`}>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={isExtends ? '#0284c7' : '#94a3b8'}
                      strokeWidth={isExtends ? 2 : 1.25}
                      strokeDasharray={isExtends ? undefined : '5 4'}
                      markerEnd={isExtends ? 'url(#arrow-extends)' : 'url(#arrow-uses)'}
                    />
                    <rect
                      x={midX - 42}
                      y={midY - 9}
                      width={84}
                      height={18}
                      rx={4}
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#475569"
                    >
                      {rel.label}
                    </text>
                  </g>
                );
              })}

              {/* Class Nodes */}
              {CLASS_SPECS.map((spec) => {
                const isSelected = spec.id === selectedClass.id;
                return (
                  <g
                    key={spec.id}
                    transform={`translate(${spec.x}, ${spec.y})`}
                    onClick={() => setSelectedId(spec.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      rx={8}
                      fill="#ffffff"
                      stroke={isSelected ? '#0284c7' : '#cbd5e1'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <rect
                      width={NODE_WIDTH}
                      height={26}
                      rx={8}
                      fill={isSelected ? '#e0f2fe' : '#f1f5f9'}
                    />
                    <rect
                      y={18}
                      width={NODE_WIDTH}
                      height={8}
                      fill={isSelected ? '#e0f2fe' : '#f1f5f9'}
                    />
                    <text
                      x={12}
                      y={17}
                      fontSize="12"
                      fontWeight="600"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fill="#0f172a"
                    >
                      {spec.name.length > 26 ? `${spec.name.slice(0, 24)}…` : spec.name}
                    </text>
                    <text
                      x={12}
                      y={44}
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#64748b"
                    >
                      {spec.pkg.replace('com.airtribe.learntrack.', '')}
                    </text>
                    <text
                      x={12}
                      y={64}
                      fontSize="10.5"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#334155"
                    >
                      {spec.fields[0]?.slice(0, 28) ?? ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Right-Hand Class Inspector */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-sky-700">{selectedClass.pkg}</div>
                <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                  {selectedClass.name}
                </h3>
              </div>
              <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{selectedClass.summary}</p>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Fields</h4>
              <ul className="space-y-1 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                {selectedClass.fields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1.5">
                Constructors &amp; Methods
              </h4>
              <ul className="space-y-1 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                {selectedClass.methods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1.5">OOP Takeaways</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {selectedClass.oopHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenFile(selectedClass.relatedFile)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Java Source
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      </div>

      {/* Interactive Documentation Concepts */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Core Java &amp; JVM Reference Notes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aligned with docs/JVM_Basics.md, docs/Design_Notes.md, and docs/Setup_Instructions.md.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                ['jvm', 'JVM · JRE · JDK'],
                ['design', 'ArrayList · static · OOP'],
                ['compile', 'Compile & Run'],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setConceptTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  conceptTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {conceptTab === 'jvm' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">JVM (Java Virtual Machine)</h3>
              <p className="text-slate-600 leading-relaxed">
                Executes compiled <code className="font-mono text-xs">.class</code> bytecode,
                manages heap memory and garbage collection, and translates instructions for the host CPU.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">JRE (Runtime Environment)</h3>
              <p className="text-slate-600 leading-relaxed">
                Packages the JVM together with core standard libraries such as{' '}
                <code className="font-mono text-xs">java.lang</code> and{' '}
                <code className="font-mono text-xs">java.util.ArrayList</code> required to run programs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">
                JDK &amp; Write Once, Run Anywhere
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Adds <code className="font-mono text-xs">javac</code> and developer tools on top of
                the JRE. Because <code className="font-mono text-xs">javac</code> emits portable
                bytecode, the same <code className="font-mono text-xs">.class</code> files run on any OS with a JVM.
              </p>
            </div>
          </div>
        )}

        {conceptTab === 'design' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Why ArrayList over Array?</h3>
              <p className="text-slate-600 leading-relaxed">
                Fixed arrays (<code className="font-mono text-xs">Student[]</code>) cannot grow
                without manual reallocation. <code className="font-mono text-xs">ArrayList&lt;T&gt;</code>{' '}
                resizes automatically as admins add students, courses, and enrollments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Where static Is Used</h3>
              <p className="text-slate-600 leading-relaxed">
                <code className="font-mono text-xs">IdGenerator</code> stores shared class-level ID
                counters (<code className="font-mono text-xs">studentIdCounter</code>,{' '}
                <code className="font-mono text-xs">courseIdCounter</code>) so IDs remain unique
                across all services without instantiating the helper class.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Inheritance &amp; Polymorphism</h3>
              <p className="text-slate-600 leading-relaxed">
                <code className="font-mono text-xs">Student</code> and{' '}
                <code className="font-mono text-xs">Trainer</code> extend{' '}
                <code className="font-mono text-xs">Person</code> via{' '}
                <code className="font-mono text-xs">super(...)</code> and override{' '}
                <code className="font-mono text-xs">getDisplayName()</code> for dynamic dispatch.
              </p>
            </div>
          </div>
        )}

        {conceptTab === 'compile' && (
          <div className="pt-5 space-y-3 text-sm">
            <p className="text-slate-600">
              Export the project using the button in the top bar, unzip it, and compile/run using JDK 17+:
            </p>
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed">
{`mkdir -p out
javac -d out $(find src -name "*.java")
java -cp out com.airtribe.learntrack.ui.Main`}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};
