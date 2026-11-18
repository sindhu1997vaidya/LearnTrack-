export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class EntityNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EntityNotFoundException';
  }
}

export class InvalidInputException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputException';
  }
}

export class Person {
  private id: number;
  private firstName: string;
  private lastName: string;
  private email: string;

  constructor(id: number, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  getId(): number {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getDisplayName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Student extends Person {
  private batch: string;
  private active: boolean;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    batch: string,
    active = true,
  ) {
    super(id, firstName, lastName, email || 'N/A');
    this.batch = batch;
    this.active = active;
  }

  getBatch(): string {
    return this.batch;
  }

  setBatch(batch: string): void {
    this.batch = batch;
  }

  isActive(): boolean {
    return this.active;
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  override getDisplayName(): string {
    return `[Student] ${this.getFirstName()} ${this.getLastName()} (Batch: ${this.batch})`;
  }

  toJavaString(): string {
    const statusText = this.active ? 'ACTIVE' : 'INACTIVE';
    return `Student[ID=${this.getId()}, Name=${this.getFirstName()} ${this.getLastName()}, Email=${this.getEmail()}, Batch=${this.batch}, Status=${statusText}]`;
  }
}

export class Trainer extends Person {
  private specialization: string;
  private yearsOfExperience: number;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    specialization: string,
    yearsOfExperience: number,
  ) {
    super(id, firstName, lastName, email);
    this.specialization = specialization;
    this.yearsOfExperience = yearsOfExperience;
  }

  getSpecialization(): string {
    return this.specialization;
  }

  getYearsOfExperience(): number {
    return this.yearsOfExperience;
  }

  override getDisplayName(): string {
    return `[Trainer] ${this.getFirstName()} ${this.getLastName()} (${this.specialization}, ${this.yearsOfExperience} yrs)`;
  }
}

export class Course {
  private id: number;
  private courseName: string;
  private description: string;
  private durationInWeeks: number;
  private active: boolean;

  constructor(
    id: number,
    courseName: string,
    description: string,
    durationInWeeks: number,
    active = true,
  ) {
    this.id = id;
    this.courseName = courseName;
    this.description = description;
    this.durationInWeeks = durationInWeeks;
    this.active = active;
  }

  getId(): number {
    return this.id;
  }

  getCourseName(): string {
    return this.courseName;
  }

  getDescription(): string {
    return this.description;
  }

  getDurationInWeeks(): number {
    return this.durationInWeeks;
  }

  isActive(): boolean {
    return this.active;
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  toJavaString(): string {
    const statusText = this.active ? 'ACTIVE' : 'INACTIVE';
    return `Course[ID=${this.id}, Name=${this.courseName}, Duration=${this.durationInWeeks} weeks, Status=${statusText}, Description=${this.description}]`;
  }
}

export class Enrollment {
  private id: number;
  private studentId: number;
  private courseId: number;
  private enrollmentDate: string;
  private status: EnrollmentStatus;

  constructor(
    id: number,
    studentId: number,
    courseId: number,
    enrollmentDate: string,
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE,
  ) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.enrollmentDate = enrollmentDate;
    this.status = status;
  }

  getId(): number {
    return this.id;
  }

  getStudentId(): number {
    return this.studentId;
  }

  getCourseId(): number {
    return this.courseId;
  }

  getEnrollmentDate(): string {
    return this.enrollmentDate;
  }

  getStatus(): EnrollmentStatus {
    return this.status;
  }

  setStatus(status: EnrollmentStatus): void {
    this.status = status;
  }

  toJavaString(): string {
    return `Enrollment[ID=${this.id}, StudentID=${this.studentId}, CourseID=${this.courseId}, Date=${this.enrollmentDate}, Status=${this.status}]`;
  }
}

export interface ExecutionTrace {
  id: number;
  javaCall: string;
  detail: string;
  status: 'ok' | 'exception';
  timestamp: string;
}

export class IdGeneratorState {
  studentIdCounter = 1000;
  trainerIdCounter = 200;
  courseIdCounter = 100;
  enrollmentIdCounter = 5000;

  getNextStudentId(): number {
    this.studentIdCounter += 1;
    return this.studentIdCounter;
  }

  getNextTrainerId(): number {
    this.trainerIdCounter += 1;
    return this.trainerIdCounter;
  }

  getNextCourseId(): number {
    this.courseIdCounter += 1;
    return this.courseIdCounter;
  }

  getNextEnrollmentId(): number {
    this.enrollmentIdCounter += 1;
    return this.enrollmentIdCounter;
  }
}

export const InputValidator = {
  requireNonEmpty(value: string, fieldName: string): string {
    if (!value || value.trim().length === 0) {
      throw new InvalidInputException(`${fieldName} cannot be empty.`);
    }
    return value.trim();
  },

  validateEmail(email: string): string {
    const trimmed = email.trim();
    if (!trimmed) {
      throw new InvalidInputException('Email cannot be empty.');
    }
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      throw new InvalidInputException(`Invalid email format: ${trimmed}`);
    }
    return trimmed;
  },

  parsePositiveInt(raw: string, fieldName: string): number {
    const trimmed = raw.trim();
    if (!/^-?\d+$/.test(trimmed)) {
      throw new InvalidInputException(`${fieldName} must be a valid whole number.`);
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (parsed <= 0) {
      throw new InvalidInputException(`${fieldName} must be greater than zero.`);
    }
    return parsed;
  },
};

export class LearnTrackRuntime {
  readonly idGen = new IdGeneratorState();
  readonly students: Student[] = [];
  readonly trainers: Trainer[] = [];
  readonly courses: Course[] = [];
  readonly enrollments: Enrollment[] = [];
  readonly traces: ExecutionTrace[] = [];
  private traceSeq = 1;

  constructor() {
    this.seedInitialData();
  }

  private recordTrace(javaCall: string, detail: string, status: 'ok' | 'exception' = 'ok') {
    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 8);
    this.traces.unshift({
      id: this.traceSeq++,
      javaCall,
      detail,
      status,
      timestamp,
    });
    if (this.traces.length > 20) {
      this.traces.length = 20;
    }
  }

  recordExceptionTrace(javaCall: string, message: string) {
    this.recordTrace(javaCall, message, 'exception');
  }

  seedInitialData(): void {
    this.idGen.studentIdCounter = 1000;
    this.idGen.trainerIdCounter = 200;
    this.idGen.courseIdCounter = 100;
    this.idGen.enrollmentIdCounter = 5000;
    this.students.length = 0;
    this.trainers.length = 0;
    this.courses.length = 0;
    this.enrollments.length = 0;
    this.traces.length = 0;

    const s1 = this.addStudent('Aarav', 'Mehta', 'aarav.mehta@example.com', 'Java-2026-A');
    const s2 = this.addStudent('Priya', 'Nair', '', 'Java-2026-A');
    const s3 = this.addStudent('Rohan', 'Kulkarni', 'rohan.k@example.com', 'Java-2026-B');

    this.trainers.push(
      new Trainer(
        this.idGen.getNextTrainerId(),
        'Ananya',
        'Rao',
        'ananya.rao@airtribe.dev',
        'Core Java & OOP',
        8,
      ),
      new Trainer(
        this.idGen.getNextTrainerId(),
        'Vikram',
        'Sen',
        'vikram.sen@airtribe.dev',
        'Collections & JVM Internals',
        6,
      ),
    );

    const c1 = this.addCourse(
      'Core Java Fundamentals',
      'Variables, OOP, Collections, and Exceptions',
      6,
    );
    const c2 = this.addCourse(
      'Data Structures in Java',
      'Arrays, Lists, Stacks, Queues, and Trees',
      8,
    );
    this.addCourse(
      'JVM & Clean Code Craft',
      'Bytecode execution, modular design, and refactoring',
      4,
    );

    this.enrollStudent(s1.getId(), c1.getId());
    this.enrollStudent(s2.getId(), c2.getId());
    this.enrollStudent(s3.getId(), c1.getId());

    this.recordTrace(
      'Main.seedInitialData()',
      'Loaded 3 students, 2 trainers, 3 courses, and 3 enrollments into ArrayList stores',
    );
  }

  addStudent(firstName: string, lastName: string, email: string, batch: string): Student {
    try {
      const validFirst = InputValidator.requireNonEmpty(firstName, 'First name');
      const validLast = InputValidator.requireNonEmpty(lastName, 'Last name');
      const validBatch = InputValidator.requireNonEmpty(batch, 'Batch');
      const hasEmail = email.trim().length > 0;
      const validEmail = hasEmail ? InputValidator.validateEmail(email) : 'N/A';

      const id = this.idGen.getNextStudentId();
      const student = new Student(id, validFirst, validLast, validEmail, validBatch, true);
      this.students.push(student);

      this.recordTrace(
        hasEmail
          ? 'StudentService.addStudent(first, last, email, batch)'
          : 'StudentService.addStudent(first, last, batch)',
        `Created Student ID ${id} via ${hasEmail ? '6-arg' : '4-arg overloaded'} constructor`,
      );
      return student;
    } catch (err) {
      if (err instanceof Error) {
        this.recordExceptionTrace('StudentService.addStudent(...)', err.message);
      }
      throw err;
    }
  }

  findStudentById(id: number): Student {
    const found = this.students.find((s) => s.getId() === id);
    if (!found) {
      const msg = `Student with ID ${id} was not found.`;
      this.recordExceptionTrace(`StudentService.findStudentById(${id})`, `EntityNotFoundException: ${msg}`);
      throw new EntityNotFoundException(msg);
    }
    this.recordTrace(`StudentService.findStudentById(${id})`, `Matched ${found.getDisplayName()}`);
    return found;
  }

  updateStudent(id: number, email: string, batch: string): Student {
    const student = this.findStudentById(id);
    if (email.trim().length > 0) {
      student.setEmail(InputValidator.validateEmail(email));
    }
    if (batch.trim().length > 0) {
      student.setBatch(InputValidator.requireNonEmpty(batch, 'Batch'));
    }
    this.recordTrace(
      `StudentService.updateStudent(${id}, email, batch)`,
      `Updated record for Student ID ${id}`,
    );
    return student;
  }

  setStudentActiveStatus(id: number, active: boolean): Student {
    const student = this.findStudentById(id);
    student.setActive(active);
    this.recordTrace(
      active ? `StudentService.activateStudent(${id})` : `StudentService.deactivateStudent(${id})`,
      `Set active=${active} on Student ID ${id}`,
    );
    return student;
  }

  addCourse(courseName: string, description: string, durationInWeeks: number): Course {
    try {
      const validName = InputValidator.requireNonEmpty(courseName, 'Course name');
      const validDesc = InputValidator.requireNonEmpty(description, 'Description');
      if (!Number.isInteger(durationInWeeks) || durationInWeeks <= 0) {
        throw new InvalidInputException('Duration in weeks must be greater than zero.');
      }
      const id = this.idGen.getNextCourseId();
      const course = new Course(id, validName, validDesc, durationInWeeks, true);
      this.courses.push(course);
      this.recordTrace(
        'CourseService.addCourse(name, desc, weeks)',
        `Created Course ID ${id} (${validName})`,
      );
      return course;
    } catch (err) {
      if (err instanceof Error) {
        this.recordExceptionTrace('CourseService.addCourse(...)', err.message);
      }
      throw err;
    }
  }

  findCourseById(id: number): Course {
    const found = this.courses.find((c) => c.getId() === id);
    if (!found) {
      const msg = `Course with ID ${id} was not found.`;
      this.recordExceptionTrace(`CourseService.findCourseById(${id})`, `EntityNotFoundException: ${msg}`);
      throw new EntityNotFoundException(msg);
    }
    return found;
  }

  setCourseActiveStatus(id: number, active: boolean): Course {
    const course = this.findCourseById(id);
    course.setActive(active);
    this.recordTrace(
      `CourseService.setCourseActiveStatus(${id}, ${active})`,
      `Course ${course.getCourseName()} is now ${active ? 'ACTIVE' : 'INACTIVE'}`,
    );
    return course;
  }

  enrollStudent(studentId: number, courseId: number): Enrollment {
    try {
      const student = this.findStudentById(studentId);
      if (!student.isActive()) {
        throw new InvalidInputException(`Cannot enroll inactive student ID ${studentId}.`);
      }
      const course = this.findCourseById(courseId);
      if (!course.isActive()) {
        throw new InvalidInputException(`Cannot enroll in inactive course ID ${courseId}.`);
      }
      const duplicate = this.enrollments.find(
        (e) =>
          e.getStudentId() === studentId &&
          e.getCourseId() === courseId &&
          e.getStatus() === EnrollmentStatus.ACTIVE,
      );
      if (duplicate) {
        throw new InvalidInputException(
          `Student ${studentId} already has an ACTIVE enrollment in course ${courseId}.`,
        );
      }

      const id = this.idGen.getNextEnrollmentId();
      const today = new Date().toISOString().slice(0, 10);
      const enrollment = new Enrollment(id, studentId, courseId, today, EnrollmentStatus.ACTIVE);
      this.enrollments.push(enrollment);
      this.recordTrace(
        `EnrollmentService.enrollStudent(${studentId}, ${courseId})`,
        `Created Enrollment ID ${id} (${today})`,
      );
      return enrollment;
    } catch (err) {
      if (err instanceof Error) {
        this.recordExceptionTrace(
          `EnrollmentService.enrollStudent(${studentId}, ${courseId})`,
          `${err.name}: ${err.message}`,
        );
      }
      throw err;
    }
  }

  getEnrollmentsByStudentId(studentId: number): Enrollment[] {
    this.findStudentById(studentId);
    const list = this.enrollments.filter((e) => e.getStudentId() === studentId);
    this.recordTrace(
      `EnrollmentService.getEnrollmentsByStudentId(${studentId})`,
      `Returned ${list.length} enrollment(s)`,
    );
    return list;
  }

  updateEnrollmentStatus(enrollmentId: number, newStatus: EnrollmentStatus): Enrollment {
    const enrollment = this.enrollments.find((e) => e.getId() === enrollmentId);
    if (!enrollment) {
      const msg = `Enrollment with ID ${enrollmentId} was not found.`;
      this.recordExceptionTrace(
        `EnrollmentService.updateEnrollmentStatus(${enrollmentId}, ${newStatus})`,
        `EntityNotFoundException: ${msg}`,
      );
      throw new EntityNotFoundException(msg);
    }
    enrollment.setStatus(newStatus);
    this.recordTrace(
      `EnrollmentService.updateEnrollmentStatus(${enrollmentId}, ${newStatus})`,
      `Enrollment ID ${enrollmentId} updated to ${newStatus}`,
    );
    return enrollment;
  }

  getPolymorphismDemo(): Person[] {
    const people: Person[] = [...this.students, ...this.trainers];
    this.recordTrace(
      'Main.demonstratePolymorphism()',
      `Iterated ArrayList<Person> of size ${people.length} calling overridden getDisplayName()`,
    );
    return people;
  }
}
