import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Search,
  UserCheck,
  UserX,
  XCircle,
} from 'lucide-react';
import {
  EnrollmentStatus,
  LearnTrackRuntime,
} from '../domain/learntrackEngine';

interface RecordsWorkspaceProps {
  runtime: LearnTrackRuntime;
  version: number;
  onMutate: () => void;
}

type RecordTab = 'students' | 'courses' | 'enrollments' | 'trainers';

export const RecordsWorkspace: React.FC<RecordsWorkspaceProps> = ({
  runtime,
  version,
  onMutate,
}) => {
  const [activeTab, setActiveTab] = useState<RecordTab>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active'>('all');
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  // Add Student form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('Java-2026-A');

  // Add Course form state
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('6');

  // Enroll form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    runtime.students[0]?.getId().toString() ?? '',
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    runtime.courses[0]?.getId().toString() ?? '',
  );

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return runtime.students.filter((s) => {
      if (statusFilter === 'active' && !s.isActive()) return false;
      if (!q) return true;
      return (
        s.getId().toString().includes(q) ||
        `${s.getFirstName()} ${s.getLastName()}`.toLowerCase().includes(q) ||
        s.getBatch().toLowerCase().includes(q) ||
        s.getEmail().toLowerCase().includes(q)
      );
    });
  }, [runtime.students, searchQuery, statusFilter, version]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return runtime.courses.filter((c) => {
      if (statusFilter === 'active' && !c.isActive()) return false;
      if (!q) return true;
      return (
        c.getId().toString().includes(q) ||
        c.getCourseName().toLowerCase().includes(q) ||
        c.getDescription().toLowerCase().includes(q)
      );
    });
  }, [runtime.courses, searchQuery, statusFilter, version]);

  const filteredEnrollments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return runtime.enrollments.filter((e) => {
      if (statusFilter === 'active' && e.getStatus() !== EnrollmentStatus.ACTIVE) return false;
      if (!q) return true;
      return (
        e.getId().toString().includes(q) ||
        e.getStudentId().toString().includes(q) ||
        e.getCourseId().toString().includes(q) ||
        e.getStatus().toLowerCase().includes(q)
      );
    });
  }, [runtime.enrollments, searchQuery, statusFilter, version]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = runtime.addStudent(firstName, lastName, email, batch);
      setFeedback({
        kind: 'ok',
        text: `Added Student ID ${created.getId()} (${created.getFirstName()} ${created.getLastName()})`,
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      onMutate();
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Unable to add student.',
      });
      onMutate();
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const weeks = Number.parseInt(durationWeeks, 10);
      const created = runtime.addCourse(courseName, courseDesc, weeks);
      setFeedback({
        kind: 'ok',
        text: `Added Course ID ${created.getId()} (${created.getCourseName()})`,
      });
      setCourseName('');
      setCourseDesc('');
      setDurationWeeks('6');
      onMutate();
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Unable to add course.',
      });
      onMutate();
    }
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentId = Number.parseInt(selectedStudentId, 10);
      const courseId = Number.parseInt(selectedCourseId, 10);
      const created = runtime.enrollStudent(studentId, courseId);
      setFeedback({
        kind: 'ok',
        text: `Created Enrollment ID ${created.getId()} for Student ${studentId} in Course ${courseId}`,
      });
      onMutate();
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Unable to create enrollment.',
      });
      onMutate();
    }
  };

  return (
    <div className="space-y-6" data-version={version}>
      {/* Segmented Workspace Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {(
            [
              ['students', `Students (${runtime.students.length})`],
              ['courses', `Courses (${runtime.courses.length})`],
              ['enrollments', `Enrollments (${runtime.enrollments.length})`],
              ['trainers', `Trainers (${runtime.trainers.length})`],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setFeedback(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, name, or batch..."
              aria-label="Search records"
              className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {activeTab !== 'trainers' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Only
              </button>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border text-sm ${
            feedback.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-medium underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Students Table + Quick Add */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Registered Students (ArrayList&lt;Student&gt;)
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                Showing {filteredStudents.length} of {runtime.students.length}
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No students match your current filter. Add a new student or clear the search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-4">ID</th>
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Batch</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.getId()} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-mono tabular-nums text-slate-900">
                          {student.getId()}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {student.getFirstName()} {student.getLastName()}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{student.getEmail()}</td>
                        <td className="py-2.5 px-4 font-mono text-xs text-slate-700">
                          {student.getBatch()}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              student.isActive() ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                          >
                            {student.isActive() ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              runtime.setStudentActiveStatus(student.getId(), !student.isActive());
                              onMutate();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {student.isActive() ? (
                              <>
                                <UserX className="w-3.5 h-3.5" /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form
            onSubmit={handleAddStudent}
            className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900">Add Student</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Leave email blank to invoke the overloaded 4-argument Student constructor.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g., Kavya"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Sharma"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavya@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Batch</label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </form>
        </div>
      )}

      {/* Courses Table + Quick Add */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Course Catalog (ArrayList&lt;Course&gt;)
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                Showing {filteredCourses.length} of {runtime.courses.length}
              </span>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No courses match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-4">ID</th>
                      <th className="py-2.5 px-4">Course Name</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 text-right">Weeks</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.map((course) => (
                      <tr key={course.getId()} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-mono tabular-nums text-slate-900">
                          {course.getId()}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {course.getCourseName()}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">
                          {course.getDescription()}
                        </td>
                        <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-900">
                          {course.getDurationInWeeks()}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              course.isActive() ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                          >
                            {course.isActive() ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              runtime.setCourseActiveStatus(course.getId(), !course.isActive());
                              onMutate();
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {course.isActive() ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form
            onSubmit={handleAddCourse}
            className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900">Add Course</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigns sequential ID via IdGenerator.getNextCourseId().
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Spring Boot Foundations"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="REST APIs, dependency injection, JPA"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duration (Weeks)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </form>
        </div>
      )}

      {/* Enrollments Table + Quick Enroll */}
      {activeTab === 'enrollments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Enrollments (ArrayList&lt;Enrollment&gt;)
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                Showing {filteredEnrollments.length} of {runtime.enrollments.length}
              </span>
            </div>

            {filteredEnrollments.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No enrollments recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-4">ID</th>
                      <th className="py-2.5 px-4">Student</th>
                      <th className="py-2.5 px-4">Course</th>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEnrollments.map((enr) => {
                      const st = runtime.students.find((s) => s.getId() === enr.getStudentId());
                      const co = runtime.courses.find((c) => c.getId() === enr.getCourseId());
                      const status = enr.getStatus();
                      return (
                        <tr key={enr.getId()} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-4 font-mono tabular-nums text-slate-900">
                            {enr.getId()}
                          </td>
                          <td className="py-2.5 px-4 text-slate-900">
                            <span className="font-mono text-xs text-slate-500 mr-1.5">
                              #{enr.getStudentId()}
                            </span>
                            {st ? `${st.getFirstName()} ${st.getLastName()}` : 'Unknown'}
                          </td>
                          <td className="py-2.5 px-4 text-slate-900">
                            <span className="font-mono text-xs text-slate-500 mr-1.5">
                              #{enr.getCourseId()}
                            </span>
                            {co ? co.getCourseName() : 'Unknown'}
                          </td>
                          <td className="py-2.5 px-4 font-mono tabular-nums text-xs text-slate-600">
                            {enr.getEnrollmentDate()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`text-xs font-semibold ${
                                status === EnrollmentStatus.ACTIVE
                                  ? 'text-sky-700'
                                  : status === EnrollmentStatus.COMPLETED
                                    ? 'text-emerald-700'
                                    : 'text-rose-700'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                runtime.updateEnrollmentStatus(
                                  enr.getId(),
                                  EnrollmentStatus.COMPLETED,
                                );
                                onMutate();
                              }}
                              className="px-2 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                runtime.updateEnrollmentStatus(
                                  enr.getId(),
                                  EnrollmentStatus.CANCELLED,
                                );
                                onMutate();
                              }}
                              className="px-2 py-1 text-xs font-medium text-rose-700 border border-rose-200 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form
            onSubmit={handleEnroll}
            className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900">Enroll Student</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Validates active Student, active Course, and prevents duplicate active enrollments.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-sky-500"
                >
                  {runtime.students.map((s) => (
                    <option key={s.getId()} value={s.getId()}>
                      #{s.getId()} · {s.getFirstName()} {s.getLastName()}{' '}
                      {s.isActive() ? '' : '(Inactive)'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-sky-500"
                >
                  {runtime.courses.map((c) => (
                    <option key={c.getId()} value={c.getId()}>
                      #{c.getId()} · {c.getCourseName()} {c.isActive() ? '' : '(Inactive)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Enroll Student
            </button>
          </form>
        </div>
      )}

      {/* Trainers & Polymorphism View */}
      {activeTab === 'trainers' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">
              Trainers &amp; Polymorphic Person.getDisplayName() Output
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrates Student and Trainer subclasses overriding Person.getDisplayName().
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[...runtime.trainers, ...runtime.students].map((person) => (
              <div
                key={`${person.constructor.name}-${person.getId()}`}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div className="font-mono text-slate-900">{person.getDisplayName()}</div>
                <div className="text-xs text-slate-500">
                  ID {person.getId()} · {person.getEmail()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
