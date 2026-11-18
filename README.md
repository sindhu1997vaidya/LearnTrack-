# LearnTrack — Student & Course Management System

LearnTrack is a console-based Student, Course, and Enrollment management application built in **Core Java**. It demonstrates clean package organization, OOP fundamentals (encapsulation, inheritance, polymorphism, constructor & method overloading), `ArrayList` collections, `static` utilities, and custom exception handling.

## Package Structure

```text
src/
└── com/airtribe/learntrack/
    ├── entity/
    │   ├── Person.java
    │   ├── Student.java
    │   ├── Trainer.java
    │   ├── Course.java
    │   ├── EnrollmentStatus.java
    │   └── Enrollment.java
    ├── exception/
    │   ├── EntityNotFoundException.java
    │   └── InvalidInputException.java
    ├── service/
    │   ├── StudentService.java
    │   ├── CourseService.java
    │   └── EnrollmentService.java
    ├── util/
    │   ├── IdGenerator.java
    │   └── InputValidator.java
    └── ui/
        └── Main.java
docs/
├── Setup_Instructions.md
├── JVM_Basics.md
└── Design_Notes.md
```

## Class Diagram

```mermaid
classDiagram
    class Person {
        -int id
        -String firstName
        -String lastName
        -String email
        +getDisplayName() String
    }
    class Student {
        -String batch
        -boolean active
        +Student(id, firstName, lastName, email, batch, active)
        +Student(id, firstName, lastName, batch)
        +getDisplayName() String
    }
    class Trainer {
        -String specialization
        -int yearsOfExperience
        +getDisplayName() String
    }
    class Course {
        -int id
        -String courseName
        -String description
        -int durationInWeeks
        -boolean active
    }
    class EnrollmentStatus {
        <<enumeration>>
        ACTIVE
        COMPLETED
        CANCELLED
    }
    class Enrollment {
        -int id
        -int studentId
        -int courseId
        -String enrollmentDate
        -EnrollmentStatus status
    }
    class StudentService {
        -ArrayList~Student~ students
        +addStudent(...)
        +findStudentById(int id)
        +deactivateStudent(int id)
        +listStudents()
    }
    class CourseService {
        -ArrayList~Course~ courses
        +addCourse(...)
        +findCourseById(int id)
        +setCourseActiveStatus(int id, boolean active)
    }
    class EnrollmentService {
        -ArrayList~Enrollment~ enrollments
        +enrollStudent(int studentId, int courseId)
        +getEnrollmentsByStudentId(int studentId)
        +updateEnrollmentStatus(int enrollmentId, EnrollmentStatus status)
    }
    class IdGenerator {
        -static int studentIdCounter
        -static int courseIdCounter
        -static int enrollmentIdCounter
        +static getNextStudentId() int
        +static getNextCourseId() int
        +static getNextEnrollmentId() int
    }
    class Main {
        +static main(String[] args)
    }

    Person <|-- Student
    Person <|-- Trainer
    Enrollment --> EnrollmentStatus
    EnrollmentService --> StudentService
    EnrollmentService --> CourseService
    StudentService o-- Student
    CourseService o-- Course
    EnrollmentService o-- Enrollment
    StudentService ..> IdGenerator
    CourseService ..> IdGenerator
    EnrollmentService ..> IdGenerator
    Main --> StudentService
    Main --> CourseService
    Main --> EnrollmentService
```

## How to Compile & Run

From the project root directory (`java-project/`):

```bash
# 1. Create output directory
mkdir -p out

# 2. Compile all Java sources
javac -d out $(find src -name "*.java")

# 3. Run the console application
java -cp out com.airtribe.learntrack.ui.Main
```

On Windows PowerShell:

```powershell
mkdir -Force out
javac -d out (Get-ChildItem -Recurse -Filter *.java src | ForEach-Object { $_.FullName })
java -cp out com.airtribe.learntrack.ui.Main
```
