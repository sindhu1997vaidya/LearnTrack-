import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Send, Terminal as TerminalIcon } from 'lucide-react';
import {
  EnrollmentStatus,
  InputValidator,
  LearnTrackRuntime,
} from '../domain/learntrackEngine';

interface ConsoleWorkspaceProps {
  runtime: LearnTrackRuntime;
  version: number;
  onMutate: () => void;
  onResetDemo: () => void;
}

interface TerminalLine {
  id: number;
  kind: 'system' | 'prompt' | 'input' | 'output' | 'error';
  text: string;
}

type CliStep =
  | { kind: 'MAIN_MENU' }
  | { kind: 'STUDENT_MENU' }
  | { kind: 'COURSE_MENU' }
  | { kind: 'ENROLLMENT_MENU' }
  | { kind: 'ADD_STUDENT_FIRST' }
  | { kind: 'ADD_STUDENT_LAST'; firstName: string }
  | { kind: 'ADD_STUDENT_EMAIL'; firstName: string; lastName: string }
  | { kind: 'ADD_STUDENT_BATCH'; firstName: string; lastName: string; email: string }
  | { kind: 'SEARCH_STUDENT_ID' }
  | { kind: 'UPDATE_STUDENT_ID' }
  | { kind: 'UPDATE_STUDENT_EMAIL'; id: number }
  | { kind: 'UPDATE_STUDENT_BATCH'; id: number; email: string }
  | { kind: 'DEACTIVATE_STUDENT_ID' }
  | { kind: 'ADD_COURSE_NAME' }
  | { kind: 'ADD_COURSE_DESC'; name: string }
  | { kind: 'ADD_COURSE_WEEKS'; name: string; desc: string }
  | { kind: 'TOGGLE_COURSE_ID' }
  | { kind: 'ENROLL_STUDENT_ID' }
  | { kind: 'ENROLL_COURSE_ID'; studentId: number }
  | { kind: 'VIEW_STUDENT_ENROLLMENTS_ID' }
  | { kind: 'UPDATE_ENROLLMENT_ID' }
  | { kind: 'UPDATE_ENROLLMENT_STATUS'; enrollmentId: number }
  | { kind: 'EXITED' };

const MAIN_MENU_LINES = [
  '',
  '--- Main Menu ---',
  '1. Student Management',
  '2. Course Management',
  '3. Enrollment Management',
  '4. Polymorphism Demo (Person -> Student / Trainer)',
  '0. Exit',
];

const STUDENT_MENU_LINES = [
  '',
  '--- Student Management ---',
  '1. Add New Student',
  '2. View All Students',
  '3. Search Student by ID',
  '4. Update Student Email / Batch',
  '5. Deactivate Student',
  '0. Back to Main Menu',
];

const COURSE_MENU_LINES = [
  '',
  '--- Course Management ---',
  '1. Add New Course',
  '2. View All Courses',
  '3. Activate / Deactivate Course',
  '0. Back to Main Menu',
];

const ENROLLMENT_MENU_LINES = [
  '',
  '--- Enrollment Management ---',
  '1. Enroll Student in a Course',
  '2. View Enrollments for a Student',
  '3. Mark Enrollment as Completed / Cancelled',
  '4. View All Enrollments',
  '0. Back to Main Menu',
];

function getPromptLabel(step: CliStep): string {
  switch (step.kind) {
    case 'MAIN_MENU':
    case 'STUDENT_MENU':
    case 'COURSE_MENU':
    case 'ENROLLMENT_MENU':
      return 'Enter your choice: ';
    case 'ADD_STUDENT_FIRST':
      return 'First name: ';
    case 'ADD_STUDENT_LAST':
      return 'Last name: ';
    case 'ADD_STUDENT_EMAIL':
      return 'Email (leave blank to skip): ';
    case 'ADD_STUDENT_BATCH':
      return 'Batch (e.g., Java-Cohort-2026): ';
    case 'SEARCH_STUDENT_ID':
      return 'Enter Student ID: ';
    case 'UPDATE_STUDENT_ID':
      return 'Enter Student ID to update: ';
    case 'UPDATE_STUDENT_EMAIL':
      return 'New Email (leave blank to keep existing): ';
    case 'UPDATE_STUDENT_BATCH':
      return 'New Batch (leave blank to keep existing): ';
    case 'DEACTIVATE_STUDENT_ID':
      return 'Enter Student ID to deactivate: ';
    case 'ADD_COURSE_NAME':
      return 'Course name: ';
    case 'ADD_COURSE_DESC':
      return 'Description: ';
    case 'ADD_COURSE_WEEKS':
      return 'Duration (weeks): ';
    case 'TOGGLE_COURSE_ID':
      return 'Enter Course ID: ';
    case 'ENROLL_STUDENT_ID':
      return 'Enter Student ID: ';
    case 'ENROLL_COURSE_ID':
      return 'Enter Course ID: ';
    case 'VIEW_STUDENT_ENROLLMENTS_ID':
      return 'Enter Student ID: ';
    case 'UPDATE_ENROLLMENT_ID':
      return 'Enter Enrollment ID: ';
    case 'UPDATE_ENROLLMENT_STATUS':
      return 'New Status (COMPLETED or CANCELLED): ';
    case 'EXITED':
      return 'Process finished with exit code 0 (click Restart Session)';
  }
}

export const ConsoleWorkspace: React.FC<ConsoleWorkspaceProps> = ({
  runtime,
  version,
  onMutate,
  onResetDemo,
}) => {
  const lineSeq = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const createInitialLines = (): TerminalLine[] => {
    const initial = [
      { id: lineSeq.current++, kind: 'system' as const, text: '$ java -cp out com.airtribe.learntrack.ui.Main' },
      { id: lineSeq.current++, kind: 'output' as const, text: '====================================================' },
      { id: lineSeq.current++, kind: 'output' as const, text: '   Welcome to LearnTrack - Student & Course CLI' },
      { id: lineSeq.current++, kind: 'output' as const, text: '====================================================' },
      ...MAIN_MENU_LINES.map((text) => ({ id: lineSeq.current++, kind: 'output' as const, text })),
    ];
    return initial;
  };

  const [lines, setLines] = useState<TerminalLine[]>(createInitialLines);
  const [step, setStep] = useState<CliStep>({ kind: 'MAIN_MENU' });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, step]);

  const appendLines = (items: Array<{ kind: TerminalLine['kind']; text: string }>) => {
    setLines((prev) => [
      ...prev,
      ...items.map((item) => ({ id: lineSeq.current++, kind: item.kind, text: item.text })),
    ]);
  };

  const handleRestartCli = () => {
    setLines(createInitialLines());
    setStep({ kind: 'MAIN_MENU' });
    setInputValue('');
    inputRef.current?.focus();
  };

  const processInput = (raw: string) => {
    if (step.kind === 'EXITED') return;

    const prompt = getPromptLabel(step);
    const out: Array<{ kind: TerminalLine['kind']; text: string }> = [
      { kind: 'input', text: `${prompt}${raw}` },
    ];

    const pushMenu = (menuLines: string[]) => {
      menuLines.forEach((line) => out.push({ kind: 'output', text: line }));
    };

    try {
      switch (step.kind) {
        case 'MAIN_MENU': {
          const choice = /^\s*-?\d+\s*$/.test(raw) ? Number.parseInt(raw.trim(), 10) : -1;
          if (choice === 1) {
            pushMenu(STUDENT_MENU_LINES);
            setStep({ kind: 'STUDENT_MENU' });
          } else if (choice === 2) {
            pushMenu(COURSE_MENU_LINES);
            setStep({ kind: 'COURSE_MENU' });
          } else if (choice === 3) {
            pushMenu(ENROLLMENT_MENU_LINES);
            setStep({ kind: 'ENROLLMENT_MENU' });
          } else if (choice === 4) {
            const people = runtime.getPolymorphismDemo();
            out.push({ kind: 'output', text: '' });
            out.push({ kind: 'output', text: '--- Polymorphism Demo (Person.getDisplayName()) ---' });
            people.forEach((p) => {
              out.push({ kind: 'output', text: `  ${p.getDisplayName()}` });
            });
            pushMenu(MAIN_MENU_LINES);
            setStep({ kind: 'MAIN_MENU' });
            onMutate();
          } else if (choice === 0) {
            out.push({ kind: 'output', text: 'Exiting LearnTrack. Goodbye!' });
            setStep({ kind: 'EXITED' });
          } else {
            out.push({
              kind: 'error',
              text: 'Invalid option. Please choose 0, 1, 2, 3, or 4.',
            });
            pushMenu(MAIN_MENU_LINES);
          }
          break;
        }

        case 'STUDENT_MENU': {
          const choice = /^\s*-?\d+\s*$/.test(raw) ? Number.parseInt(raw.trim(), 10) : -1;
          if (choice === 1) {
            setStep({ kind: 'ADD_STUDENT_FIRST' });
          } else if (choice === 2) {
            if (runtime.students.length === 0) {
              out.push({ kind: 'output', text: 'No students registered yet.' });
            } else {
              out.push({ kind: 'output', text: `\nRegistered Students (${runtime.students.length}):` });
              runtime.students.forEach((s) => {
                out.push({ kind: 'output', text: `  ${s.toJavaString()}` });
              });
            }
            pushMenu(STUDENT_MENU_LINES);
          } else if (choice === 3) {
            setStep({ kind: 'SEARCH_STUDENT_ID' });
          } else if (choice === 4) {
            setStep({ kind: 'UPDATE_STUDENT_ID' });
          } else if (choice === 5) {
            setStep({ kind: 'DEACTIVATE_STUDENT_ID' });
          } else if (choice === 0) {
            pushMenu(MAIN_MENU_LINES);
            setStep({ kind: 'MAIN_MENU' });
          } else {
            out.push({ kind: 'error', text: 'Unknown student menu option.' });
            pushMenu(STUDENT_MENU_LINES);
          }
          break;
        }

        case 'ADD_STUDENT_FIRST':
          setStep({ kind: 'ADD_STUDENT_LAST', firstName: raw });
          break;

        case 'ADD_STUDENT_LAST':
          setStep({ kind: 'ADD_STUDENT_EMAIL', firstName: step.firstName, lastName: raw });
          break;

        case 'ADD_STUDENT_EMAIL':
          setStep({
            kind: 'ADD_STUDENT_BATCH',
            firstName: step.firstName,
            lastName: step.lastName,
            email: raw,
          });
          break;

        case 'ADD_STUDENT_BATCH': {
          const created = runtime.addStudent(step.firstName, step.lastName, step.email, raw);
          out.push({ kind: 'output', text: `Added -> ${created.toJavaString()}` });
          pushMenu(STUDENT_MENU_LINES);
          setStep({ kind: 'STUDENT_MENU' });
          onMutate();
          break;
        }

        case 'SEARCH_STUDENT_ID': {
          const id = InputValidator.parsePositiveInt(raw, 'Student ID');
          const found = runtime.findStudentById(id);
          out.push({ kind: 'output', text: `Found -> ${found.toJavaString()}` });
          pushMenu(STUDENT_MENU_LINES);
          setStep({ kind: 'STUDENT_MENU' });
          onMutate();
          break;
        }

        case 'UPDATE_STUDENT_ID': {
          const id = InputValidator.parsePositiveInt(raw, 'Student ID');
          runtime.findStudentById(id);
          setStep({ kind: 'UPDATE_STUDENT_EMAIL', id });
          break;
        }

        case 'UPDATE_STUDENT_EMAIL':
          setStep({ kind: 'UPDATE_STUDENT_BATCH', id: step.id, email: raw });
          break;

        case 'UPDATE_STUDENT_BATCH': {
          const updated = runtime.updateStudent(step.id, step.email, raw);
          out.push({ kind: 'output', text: `Updated -> ${updated.toJavaString()}` });
          pushMenu(STUDENT_MENU_LINES);
          setStep({ kind: 'STUDENT_MENU' });
          onMutate();
          break;
        }

        case 'DEACTIVATE_STUDENT_ID': {
          const id = InputValidator.parsePositiveInt(raw, 'Student ID');
          runtime.setStudentActiveStatus(id, false);
          out.push({ kind: 'output', text: `Student ID ${id} marked as INACTIVE.` });
          pushMenu(STUDENT_MENU_LINES);
          setStep({ kind: 'STUDENT_MENU' });
          onMutate();
          break;
        }

        case 'COURSE_MENU': {
          const choice = /^\s*-?\d+\s*$/.test(raw) ? Number.parseInt(raw.trim(), 10) : -1;
          if (choice === 1) {
            setStep({ kind: 'ADD_COURSE_NAME' });
          } else if (choice === 2) {
            if (runtime.courses.length === 0) {
              out.push({ kind: 'output', text: 'No courses available yet.' });
            } else {
              out.push({ kind: 'output', text: `\nCourses (${runtime.courses.length}):` });
              runtime.courses.forEach((c) => {
                out.push({ kind: 'output', text: `  ${c.toJavaString()}` });
              });
            }
            pushMenu(COURSE_MENU_LINES);
          } else if (choice === 3) {
            setStep({ kind: 'TOGGLE_COURSE_ID' });
          } else if (choice === 0) {
            pushMenu(MAIN_MENU_LINES);
            setStep({ kind: 'MAIN_MENU' });
          } else {
            out.push({ kind: 'error', text: 'Unknown course menu option.' });
            pushMenu(COURSE_MENU_LINES);
          }
          break;
        }

        case 'ADD_COURSE_NAME':
          setStep({ kind: 'ADD_COURSE_DESC', name: raw });
          break;

        case 'ADD_COURSE_DESC':
          setStep({ kind: 'ADD_COURSE_WEEKS', name: step.name, desc: raw });
          break;

        case 'ADD_COURSE_WEEKS': {
          const weeks = InputValidator.parsePositiveInt(raw, 'Duration in weeks');
          const created = runtime.addCourse(step.name, step.desc, weeks);
          out.push({ kind: 'output', text: `Added -> ${created.toJavaString()}` });
          pushMenu(COURSE_MENU_LINES);
          setStep({ kind: 'COURSE_MENU' });
          onMutate();
          break;
        }

        case 'TOGGLE_COURSE_ID': {
          const id = InputValidator.parsePositiveInt(raw, 'Course ID');
          const existing = runtime.findCourseById(id);
          const nextState = !existing.isActive();
          runtime.setCourseActiveStatus(id, nextState);
          out.push({
            kind: 'output',
            text: `Course ID ${id} is now ${nextState ? 'ACTIVE' : 'INACTIVE'}.`,
          });
          pushMenu(COURSE_MENU_LINES);
          setStep({ kind: 'COURSE_MENU' });
          onMutate();
          break;
        }

        case 'ENROLLMENT_MENU': {
          const choice = /^\s*-?\d+\s*$/.test(raw) ? Number.parseInt(raw.trim(), 10) : -1;
          if (choice === 1) {
            setStep({ kind: 'ENROLL_STUDENT_ID' });
          } else if (choice === 2) {
            setStep({ kind: 'VIEW_STUDENT_ENROLLMENTS_ID' });
          } else if (choice === 3) {
            setStep({ kind: 'UPDATE_ENROLLMENT_ID' });
          } else if (choice === 4) {
            if (runtime.enrollments.length === 0) {
              out.push({ kind: 'output', text: 'No enrollments recorded yet.' });
            } else {
              out.push({ kind: 'output', text: `\nAll Enrollments (${runtime.enrollments.length}):` });
              runtime.enrollments.forEach((e) => {
                out.push({ kind: 'output', text: `  ${e.toJavaString()}` });
              });
            }
            pushMenu(ENROLLMENT_MENU_LINES);
          } else if (choice === 0) {
            pushMenu(MAIN_MENU_LINES);
            setStep({ kind: 'MAIN_MENU' });
          } else {
            out.push({ kind: 'error', text: 'Unknown enrollment menu option.' });
            pushMenu(ENROLLMENT_MENU_LINES);
          }
          break;
        }

        case 'ENROLL_STUDENT_ID': {
          const studentId = InputValidator.parsePositiveInt(raw, 'Student ID');
          setStep({ kind: 'ENROLL_COURSE_ID', studentId });
          break;
        }

        case 'ENROLL_COURSE_ID': {
          const courseId = InputValidator.parsePositiveInt(raw, 'Course ID');
          const created = runtime.enrollStudent(step.studentId, courseId);
          out.push({ kind: 'output', text: `Enrolled -> ${created.toJavaString()}` });
          pushMenu(ENROLLMENT_MENU_LINES);
          setStep({ kind: 'ENROLLMENT_MENU' });
          onMutate();
          break;
        }

        case 'VIEW_STUDENT_ENROLLMENTS_ID': {
          const studentId = InputValidator.parsePositiveInt(raw, 'Student ID');
          const list = runtime.getEnrollmentsByStudentId(studentId);
          if (list.length === 0) {
            out.push({ kind: 'output', text: `No enrollments found for Student ID ${studentId}.` });
          } else {
            list.forEach((e) => out.push({ kind: 'output', text: `  ${e.toJavaString()}` }));
          }
          pushMenu(ENROLLMENT_MENU_LINES);
          setStep({ kind: 'ENROLLMENT_MENU' });
          onMutate();
          break;
        }

        case 'UPDATE_ENROLLMENT_ID': {
          const enrollmentId = InputValidator.parsePositiveInt(raw, 'Enrollment ID');
          setStep({ kind: 'UPDATE_ENROLLMENT_STATUS', enrollmentId });
          break;
        }

        case 'UPDATE_ENROLLMENT_STATUS': {
          const cleaned = InputValidator.requireNonEmpty(raw, 'Status').toUpperCase();
          if (
            cleaned !== EnrollmentStatus.COMPLETED &&
            cleaned !== EnrollmentStatus.CANCELLED &&
            cleaned !== EnrollmentStatus.ACTIVE
          ) {
            throw new Error('Invalid status. Enter COMPLETED or CANCELLED.');
          }
          const updated = runtime.updateEnrollmentStatus(
            step.enrollmentId,
            cleaned as EnrollmentStatus,
          );
          out.push({ kind: 'output', text: `Updated -> ${updated.toJavaString()}` });
          pushMenu(ENROLLMENT_MENU_LINES);
          setStep({ kind: 'ENROLLMENT_MENU' });
          onMutate();
          break;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected input error.';
      out.push({ kind: 'error', text: `Error: ${msg}` });
      if (
        step.kind.startsWith('ADD_STUDENT') ||
        step.kind.startsWith('SEARCH_STUDENT') ||
        step.kind.startsWith('UPDATE_STUDENT') ||
        step.kind.startsWith('DEACTIVATE_STUDENT')
      ) {
        pushMenu(STUDENT_MENU_LINES);
        setStep({ kind: 'STUDENT_MENU' });
      } else if (
        step.kind.startsWith('ADD_COURSE') ||
        step.kind.startsWith('TOGGLE_COURSE')
      ) {
        pushMenu(COURSE_MENU_LINES);
        setStep({ kind: 'COURSE_MENU' });
      } else if (
        step.kind.startsWith('ENROLL_') ||
        step.kind.startsWith('VIEW_STUDENT_ENROLLMENTS') ||
        step.kind.startsWith('UPDATE_ENROLLMENT')
      ) {
        pushMenu(ENROLLMENT_MENU_LINES);
        setStep({ kind: 'ENROLLMENT_MENU' });
      }
      onMutate();
    }

    appendLines(out);
    setInputValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processInput(inputValue);
  };

  const quickOptions = (() => {
    switch (step.kind) {
      case 'MAIN_MENU':
        return [
          { label: '1 · Students', value: '1' },
          { label: '2 · Courses', value: '2' },
          { label: '3 · Enrollments', value: '3' },
          { label: '4 · Polymorphism', value: '4' },
          { label: '0 · Exit', value: '0' },
        ];
      case 'STUDENT_MENU':
        return [
          { label: '1 · Add Student', value: '1' },
          { label: '2 · View All', value: '2' },
          { label: '3 · Search ID', value: '3' },
          { label: '4 · Update', value: '4' },
          { label: '5 · Deactivate', value: '5' },
          { label: '0 · Back', value: '0' },
        ];
      case 'COURSE_MENU':
        return [
          { label: '1 · Add Course', value: '1' },
          { label: '2 · View All', value: '2' },
          { label: '3 · Toggle Status', value: '3' },
          { label: '0 · Back', value: '0' },
        ];
      case 'ENROLLMENT_MENU':
        return [
          { label: '1 · Enroll', value: '1' },
          { label: '2 · By Student', value: '2' },
          { label: '3 · Update Status', value: '3' },
          { label: '4 · View All', value: '4' },
          { label: '0 · Back', value: '0' },
        ];
      case 'UPDATE_ENROLLMENT_STATUS':
        return [
          { label: 'COMPLETED', value: 'COMPLETED' },
          { label: 'CANCELLED', value: 'CANCELLED' },
        ];
      default:
        return [];
    }
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" data-version={version}>
      {/* Left Interactive Stage: Menu-Driven Java Console */}
      <section className="lg:col-span-8 flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden min-h-[580px]">
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <TerminalIcon className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-sm font-medium text-slate-100 truncate">
              com.airtribe.learntrack.ui.Main
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestartCli}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart Session
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 font-mono text-[13px] leading-relaxed overflow-y-auto max-h-[430px] space-y-0.5 cursor-text"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={
                line.kind === 'error'
                  ? 'text-rose-400 whitespace-pre-wrap'
                  : line.kind === 'input'
                    ? 'text-sky-300 font-medium whitespace-pre-wrap'
                    : line.kind === 'system'
                      ? 'text-slate-400 whitespace-pre-wrap'
                      : 'text-slate-200 whitespace-pre-wrap'
              }
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>

        {quickOptions.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Quick select:</span>
            {quickOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => processInput(opt.value)}
                className="px-2.5 py-1 text-xs font-mono font-medium text-slate-200 bg-slate-800 hover:bg-sky-700 hover:text-white rounded border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-t border-slate-800"
        >
          <span className="font-mono text-xs text-sky-400 whitespace-nowrap shrink-0">
            {getPromptLabel(step)}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            disabled={step.kind === 'EXITED'}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              step.kind === 'EXITED' ? 'Session ended' : 'Type choice or value and press Enter'
            }
            aria-label="Console input"
            className="flex-1 bg-slate-950 text-slate-100 placeholder:text-slate-500 font-mono text-sm px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={step.kind === 'EXITED'}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </section>

      {/* Right Control & In-Memory JVM State Deck */}
      <aside className="lg:col-span-4 flex flex-col gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              In-Memory State &amp; Static Counters
            </h2>
            <button
              type="button"
              onClick={() => {
                onResetDemo();
                handleRestartCli();
              }}
              className="text-xs font-medium text-sky-700 hover:text-sky-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset Seed Data
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-slate-600">ArrayList&lt;Student&gt; size</span>
              <span className="font-mono tabular-nums font-medium text-slate-900">
                {runtime.students.length} (
                {runtime.students.filter((s) => s.isActive()).length} active)
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-slate-600">ArrayList&lt;Course&gt; size</span>
              <span className="font-mono tabular-nums font-medium text-slate-900">
                {runtime.courses.length} (
                {runtime.courses.filter((c) => c.isActive()).length} active)
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-slate-600">ArrayList&lt;Enrollment&gt; size</span>
              <span className="font-mono tabular-nums font-medium text-slate-900">
                {runtime.enrollments.length}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-700 mb-2.5">
              IdGenerator Static Counters
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Student</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {runtime.idGen.studentIdCounter}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Course</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {runtime.idGen.courseIdCounter}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Enrollment</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {runtime.idGen.enrollmentIdCounter}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Recent Service &amp; Exception Calls
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Tracks methods invoked across StudentService, CourseService, and EnrollmentService.
          </p>

          <div className="space-y-2.5 overflow-y-auto max-h-[250px] pr-1">
            {runtime.traces.slice(0, 7).map((trace) => (
              <div
                key={trace.id}
                className="py-2 border-b border-slate-100 last:border-b-0 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-medium text-slate-900 truncate">
                    {trace.javaCall}
                  </span>
                  <span
                    className={`font-medium shrink-0 ${
                      trace.status === 'exception' ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {trace.status === 'exception' ? 'Caught' : 'OK'}
                  </span>
                </div>
                <div className="text-slate-600 mt-0.5 leading-snug">{trace.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
