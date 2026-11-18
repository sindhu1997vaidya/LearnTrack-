export interface ClassSpec {
  id: string;
  name: string;
  pkg: string;
  kind: 'class' | 'enum' | 'exception' | 'utility' | 'service' | 'ui';
  summary: string;
  fields: string[];
  methods: string[];
  oopHighlights: string[];
  relatedFile: string;
  x: number;
  y: number;
}

export interface ClassRelation {
  from: string;
  to: string;
  type: 'extends' | 'uses' | 'aggregates' | 'throws';
  label: string;
}

export const CLASS_SPECS: ClassSpec[] = [
  {
    id: 'Person',
    name: 'Person',
    pkg: 'com.airtribe.learntrack.entity',
    kind: 'class',
    summary: 'Base class encapsulating shared identity attributes and a polymorphic display method.',
    fields: [
      '- id: int',
      '- firstName: String',
      '- lastName: String',
      '- email: String',
    ],
    methods: [
      '+ Person()',
      '+ Person(id, firstName, lastName, email)',
      '+ getId(), getFirstName(), getLastName(), getEmail()',
      '+ getDisplayName(): String',
    ],
    oopHighlights: [
      'Encapsulation via private fields + public getters/setters',
      'Common parent for Student and Trainer hierarchies',
    ],
    relatedFile: 'src/com/airtribe/learntrack/entity/Person.java',
    x: 240,
    y: 40,
  },
  {
    id: 'Student',
    name: 'Student',
    pkg: 'com.airtribe.learntrack.entity',
    kind: 'class',
    summary: 'Extends Person with cohort batch and active lifecycle flag; demonstrates constructor overloading.',
    fields: ['- batch: String', '- active: boolean'],
    methods: [
      '+ Student(id, first, last, email, batch, active)',
      '+ Student(id, first, last, batch)',
      '+ isActive(): boolean / setActive(boolean)',
      '@Override + getDisplayName(): String',
    ],
    oopHighlights: [
      'Calls super(...) to initialize inherited Person fields',
      'Overloaded constructors (with and without email)',
      'Overrides getDisplayName() for runtime polymorphism',
    ],
    relatedFile: 'src/com/airtribe/learntrack/entity/Student.java',
    x: 60,
    y: 230,
  },
  {
    id: 'Trainer',
    name: 'Trainer',
    pkg: 'com.airtribe.learntrack.entity',
    kind: 'class',
    summary: 'Extends Person with specialization and experience to showcase polymorphic Person collections.',
    fields: ['- specialization: String', '- yearsOfExperience: int'],
    methods: [
      '+ Trainer(id, first, last, email, spec, yrs)',
      '@Override + getDisplayName(): String',
    ],
    oopHighlights: [
      'Shares Person contract alongside Student',
      'Demonstrates dynamic dispatch when stored in ArrayList<Person>',
    ],
    relatedFile: 'src/com/airtribe/learntrack/entity/Trainer.java',
    x: 370,
    y: 230,
  },
  {
    id: 'Course',
    name: 'Course',
    pkg: 'com.airtribe.learntrack.entity',
    kind: 'class',
    summary: 'Represents a structured training course with duration in weeks and active toggle.',
    fields: [
      '- id: int',
      '- courseName: String',
      '- description: String',
      '- durationInWeeks: int',
      '- active: boolean',
    ],
    methods: [
      '+ Course(id, name, desc, weeks, active)',
      '+ Course(id, name, desc, weeks)',
      '+ getters / setters',
    ],
    oopHighlights: [
      'Constructor chaining via this(...)',
      'Soft-toggle active status instead of destructive removal',
    ],
    relatedFile: 'src/com/airtribe/learntrack/entity/Course.java',
    x: 660,
    y: 40,
  },
  {
    id: 'Enrollment',
    name: 'Enrollment',
    pkg: 'com.airtribe.learntrack.entity',
    kind: 'class',
    summary: 'Associates a Student ID and Course ID with enrollment date and EnrollmentStatus.',
    fields: [
      '- id: int',
      '- studentId: int',
      '- courseId: int',
      '- enrollmentDate: String',
      '- status: EnrollmentStatus',
    ],
    methods: [
      '+ Enrollment(id, studentId, courseId, date, status)',
      '+ getStatus() / setStatus(EnrollmentStatus)',
    ],
    oopHighlights: [
      'Uses EnrollmentStatus enum (ACTIVE, COMPLETED, CANCELLED)',
    ],
    relatedFile: 'src/com/airtribe/learntrack/entity/Enrollment.java',
    x: 660,
    y: 230,
  },
  {
    id: 'StudentService',
    name: 'StudentService',
    pkg: 'com.airtribe.learntrack.service',
    kind: 'service',
    summary: 'Manages in-memory ArrayList<Student> with overloaded addStudent and listStudents methods.',
    fields: ['- students: ArrayList<Student>'],
    methods: [
      '+ addStudent(first, last, email, batch)',
      '+ addStudent(first, last, batch)',
      '+ findStudentById(int id)',
      '+ updateStudent(id, email, batch)',
      '+ deactivateStudent(int id)',
    ],
    oopHighlights: [
      'Dynamic ArrayList storage replaces fixed-size arrays',
      'Method overloading on addStudent and listStudents',
    ],
    relatedFile: 'src/com/airtribe/learntrack/service/StudentService.java',
    x: 60,
    y: 430,
  },
  {
    id: 'CourseService',
    name: 'CourseService',
    pkg: 'com.airtribe.learntrack.service',
    kind: 'service',
    summary: 'Manages in-memory ArrayList<Course> and course activation state.',
    fields: ['- courses: ArrayList<Course>'],
    methods: [
      '+ addCourse(name, desc, weeks)',
      '+ listCourses(): ArrayList<Course>',
      '+ findCourseById(int id)',
      '+ setCourseActiveStatus(id, active)',
    ],
    oopHighlights: ['Clean separation between console UI and business validation'],
    relatedFile: 'src/com/airtribe/learntrack/service/CourseService.java',
    x: 360,
    y: 430,
  },
  {
    id: 'EnrollmentService',
    name: 'EnrollmentService',
    pkg: 'com.airtribe.learntrack.service',
    kind: 'service',
    summary: 'Coordinates StudentService and CourseService to validate and track enrollments.',
    fields: [
      '- enrollments: ArrayList<Enrollment>',
      '- studentService: StudentService',
      '- courseService: CourseService',
    ],
    methods: [
      '+ enrollStudent(studentId, courseId)',
      '+ getEnrollmentsByStudentId(studentId)',
      '+ updateEnrollmentStatus(id, status)',
    ],
    oopHighlights: [
      'Composition: collaborates with StudentService & CourseService',
      'Prevents enrolling inactive students or duplicate active enrollments',
    ],
    relatedFile: 'src/com/airtribe/learntrack/service/EnrollmentService.java',
    x: 660,
    y: 430,
  },
  {
    id: 'IdGenerator',
    name: 'IdGenerator',
    pkg: 'com.airtribe.learntrack.util',
    kind: 'utility',
    summary: 'Provides application-wide sequential IDs using private static counters and static methods.',
    fields: [
      '- static studentIdCounter = 1000',
      '- static courseIdCounter = 100',
      '- static enrollmentIdCounter = 5000',
    ],
    methods: [
      '+ static getNextStudentId(): int',
      '+ static getNextCourseId(): int',
      '+ static getNextEnrollmentId(): int',
    ],
    oopHighlights: [
      'Private constructor enforces non-instantiable utility pattern',
      'Static state shared across all service instances',
    ],
    relatedFile: 'src/com/airtribe/learntrack/util/IdGenerator.java',
    x: 940,
    y: 120,
  },
  {
    id: 'Exceptions',
    name: 'EntityNotFoundException & InvalidInputException',
    pkg: 'com.airtribe.learntrack.exception',
    kind: 'exception',
    summary: 'Custom checked exceptions caught in Main.java to surface clean user messages instead of crashing.',
    fields: ['- message: String (inherited from Exception)'],
    methods: [
      '+ EntityNotFoundException(String message)',
      '+ InvalidInputException(String message)',
    ],
    oopHighlights: ['Checked exceptions enforce explicit try-catch handling in UI'],
    relatedFile: 'src/com/airtribe/learntrack/exception/EntityNotFoundException.java',
    x: 940,
    y: 280,
  },
  {
    id: 'Main',
    name: 'Main',
    pkg: 'com.airtribe.learntrack.ui',
    kind: 'ui',
    summary: 'Menu-driven Scanner console application delegating domain operations to service classes.',
    fields: [
      '- static final studentService: StudentService',
      '- static final courseService: CourseService',
      '- static final enrollmentService: EnrollmentService',
    ],
    methods: [
      '+ static main(String[] args)',
      '- handleStudentMenu() / handleCourseMenu()',
      '- handleEnrollmentMenu() / demonstratePolymorphism()',
    ],
    oopHighlights: [
      'while + switch menu loop with NumberFormatException recovery',
      'Zero business rules stored in UI layer',
    ],
    relatedFile: 'src/com/airtribe/learntrack/ui/Main.java',
    x: 940,
    y: 430,
  },
];

export const CLASS_RELATIONS: ClassRelation[] = [
  { from: 'Student', to: 'Person', type: 'extends', label: 'extends' },
  { from: 'Trainer', to: 'Person', type: 'extends', label: 'extends' },
  { from: 'StudentService', to: 'Student', type: 'aggregates', label: 'ArrayList<Student>' },
  { from: 'CourseService', to: 'Course', type: 'aggregates', label: 'ArrayList<Course>' },
  { from: 'EnrollmentService', to: 'Enrollment', type: 'aggregates', label: 'ArrayList<Enrollment>' },
  { from: 'EnrollmentService', to: 'StudentService', type: 'uses', label: 'validates' },
  { from: 'EnrollmentService', to: 'CourseService', type: 'uses', label: 'validates' },
  { from: 'Main', to: 'StudentService', type: 'uses', label: 'calls' },
  { from: 'Main', to: 'CourseService', type: 'uses', label: 'calls' },
  { from: 'Main', to: 'EnrollmentService', type: 'uses', label: 'calls' },
];
