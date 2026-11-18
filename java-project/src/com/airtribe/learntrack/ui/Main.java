package com.airtribe.learntrack.ui;

import com.airtribe.learntrack.entity.Course;
import com.airtribe.learntrack.entity.Enrollment;
import com.airtribe.learntrack.entity.EnrollmentStatus;
import com.airtribe.learntrack.entity.Person;
import com.airtribe.learntrack.entity.Student;
import com.airtribe.learntrack.entity.Trainer;
import com.airtribe.learntrack.exception.EntityNotFoundException;
import com.airtribe.learntrack.exception.InvalidInputException;
import com.airtribe.learntrack.service.CourseService;
import com.airtribe.learntrack.service.EnrollmentService;
import com.airtribe.learntrack.service.StudentService;
import com.airtribe.learntrack.util.IdGenerator;
import com.airtribe.learntrack.util.InputValidator;

import java.util.ArrayList;
import java.util.Scanner;

/**
 * Menu-driven console entry point for LearnTrack.
 * Keeps UI input/output separate from service business logic.
 */
public class Main {
    private static final StudentService studentService = new StudentService();
    private static final CourseService courseService = new CourseService();
    private static final EnrollmentService enrollmentService = new EnrollmentService(studentService, courseService);
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        seedInitialData();
        System.out.println("====================================================");
        System.out.println("   Welcome to LearnTrack - Student & Course CLI");
        System.out.println("====================================================");

        boolean running = true;
        while (running) {
            printMainMenu();
            int choice = readMenuChoice();

            switch (choice) {
                case 1:
                    handleStudentMenu();
                    break;
                case 2:
                    handleCourseMenu();
                    break;
                case 3:
                    handleEnrollmentMenu();
                    break;
                case 4:
                    demonstratePolymorphism();
                    break;
                case 0:
                    running = false;
                    System.out.println("Exiting LearnTrack. Goodbye!");
                    break;
                default:
                    System.out.println("Invalid option. Please choose 0, 1, 2, 3, or 4.");
                    break;
            }
        }
        scanner.close();
    }

    private static void printMainMenu() {
        System.out.println("\n--- Main Menu ---");
        System.out.println("1. Student Management");
        System.out.println("2. Course Management");
        System.out.println("3. Enrollment Management");
        System.out.println("4. Polymorphism Demo (Person -> Student / Trainer)");
        System.out.println("0. Exit");
        System.out.print("Enter your choice: ");
    }

    private static void handleStudentMenu() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- Student Management ---");
            System.out.println("1. Add New Student");
            System.out.println("2. View All Students");
            System.out.println("3. Search Student by ID");
            System.out.println("4. Update Student Email / Batch");
            System.out.println("5. Deactivate Student");
            System.out.println("0. Back to Main Menu");
            System.out.print("Enter your choice: ");

            int choice = readMenuChoice();
            try {
                switch (choice) {
                    case 1:
                        addStudentFlow();
                        break;
                    case 2:
                        viewAllStudentsFlow();
                        break;
                    case 3:
                        searchStudentFlow();
                        break;
                    case 4:
                        updateStudentFlow();
                        break;
                    case 5:
                        deactivateStudentFlow();
                        break;
                    case 0:
                        back = true;
                        break;
                    default:
                        System.out.println("Unknown student menu option.");
                        break;
                }
            } catch (EntityNotFoundException | InvalidInputException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private static void handleCourseMenu() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- Course Management ---");
            System.out.println("1. Add New Course");
            System.out.println("2. View All Courses");
            System.out.println("3. Activate / Deactivate Course");
            System.out.println("0. Back to Main Menu");
            System.out.print("Enter your choice: ");

            int choice = readMenuChoice();
            try {
                switch (choice) {
                    case 1:
                        addCourseFlow();
                        break;
                    case 2:
                        viewAllCoursesFlow();
                        break;
                    case 3:
                        toggleCourseStatusFlow();
                        break;
                    case 0:
                        back = true;
                        break;
                    default:
                        System.out.println("Unknown course menu option.");
                        break;
                }
            } catch (EntityNotFoundException | InvalidInputException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private static void handleEnrollmentMenu() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- Enrollment Management ---");
            System.out.println("1. Enroll Student in a Course");
            System.out.println("2. View Enrollments for a Student");
            System.out.println("3. Mark Enrollment as Completed / Cancelled");
            System.out.println("4. View All Enrollments");
            System.out.println("0. Back to Main Menu");
            System.out.print("Enter your choice: ");

            int choice = readMenuChoice();
            try {
                switch (choice) {
                    case 1:
                        enrollStudentFlow();
                        break;
                    case 2:
                        viewStudentEnrollmentsFlow();
                        break;
                    case 3:
                        updateEnrollmentStatusFlow();
                        break;
                    case 4:
                        viewAllEnrollmentsFlow();
                        break;
                    case 0:
                        back = true;
                        break;
                    default:
                        System.out.println("Unknown enrollment menu option.");
                        break;
                }
            } catch (EntityNotFoundException | InvalidInputException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private static void addStudentFlow() throws InvalidInputException {
        System.out.print("First name: ");
        String firstName = scanner.nextLine();
        System.out.print("Last name: ");
        String lastName = scanner.nextLine();
        System.out.print("Email (leave blank to skip): ");
        String email = scanner.nextLine();
        System.out.print("Batch (e.g., Java-Cohort-2026): ");
        String batch = scanner.nextLine();

        Student created;
        if (email.trim().isEmpty()) {
            created = studentService.addStudent(firstName, lastName, batch);
        } else {
            created = studentService.addStudent(firstName, lastName, email, batch);
        }
        System.out.println("Added -> " + created);
    }

    private static void viewAllStudentsFlow() {
        ArrayList<Student> list = studentService.listStudents();
        if (list.isEmpty()) {
            System.out.println("No students registered yet.");
            return;
        }
        System.out.println("\nRegistered Students (" + list.size() + "):");
        for (Student s : list) {
            System.out.println("  " + s);
        }
    }

    private static void searchStudentFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Student ID: ");
        int id = InputValidator.parsePositiveInt(scanner.nextLine(), "Student ID");
        Student found = studentService.findStudentById(id);
        System.out.println("Found -> " + found);
    }

    private static void updateStudentFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Student ID to update: ");
        int id = InputValidator.parsePositiveInt(scanner.nextLine(), "Student ID");
        System.out.print("New Email (leave blank to keep existing): ");
        String email = scanner.nextLine();
        System.out.print("New Batch (leave blank to keep existing): ");
        String batch = scanner.nextLine();
        Student updated = studentService.updateStudent(id, email, batch);
        System.out.println("Updated -> " + updated);
    }

    private static void deactivateStudentFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Student ID to deactivate: ");
        int id = InputValidator.parsePositiveInt(scanner.nextLine(), "Student ID");
        studentService.deactivateStudent(id);
        System.out.println("Student ID " + id + " marked as INACTIVE.");
    }

    private static void addCourseFlow() throws InvalidInputException {
        System.out.print("Course name: ");
        String name = scanner.nextLine();
        System.out.print("Description: ");
        String description = scanner.nextLine();
        System.out.print("Duration (weeks): ");
        int weeks = InputValidator.parsePositiveInt(scanner.nextLine(), "Duration in weeks");

        Course created = courseService.addCourse(name, description, weeks);
        System.out.println("Added -> " + created);
    }

    private static void viewAllCoursesFlow() {
        ArrayList<Course> list = courseService.listCourses();
        if (list.isEmpty()) {
            System.out.println("No courses available yet.");
            return;
        }
        System.out.println("\nCourses (" + list.size() + "):");
        for (Course c : list) {
            System.out.println("  " + c);
        }
    }

    private static void toggleCourseStatusFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Course ID: ");
        int id = InputValidator.parsePositiveInt(scanner.nextLine(), "Course ID");
        Course existing = courseService.findCourseById(id);
        boolean nextState = !existing.isActive();
        courseService.setCourseActiveStatus(id, nextState);
        System.out.println("Course ID " + id + " is now " + (nextState ? "ACTIVE" : "INACTIVE") + ".");
    }

    private static void enrollStudentFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Student ID: ");
        int studentId = InputValidator.parsePositiveInt(scanner.nextLine(), "Student ID");
        System.out.print("Enter Course ID: ");
        int courseId = InputValidator.parsePositiveInt(scanner.nextLine(), "Course ID");

        Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
        System.out.println("Enrolled -> " + enrollment);
    }

    private static void viewStudentEnrollmentsFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Student ID: ");
        int studentId = InputValidator.parsePositiveInt(scanner.nextLine(), "Student ID");
        ArrayList<Enrollment> list = enrollmentService.getEnrollmentsByStudentId(studentId);
        if (list.isEmpty()) {
            System.out.println("No enrollments found for Student ID " + studentId + ".");
            return;
        }
        for (Enrollment e : list) {
            System.out.println("  " + e);
        }
    }

    private static void updateEnrollmentStatusFlow() throws InvalidInputException, EntityNotFoundException {
        System.out.print("Enter Enrollment ID: ");
        int enrollmentId = InputValidator.parsePositiveInt(scanner.nextLine(), "Enrollment ID");
        System.out.print("New Status (COMPLETED or CANCELLED): ");
        String rawStatus = InputValidator.requireNonEmpty(scanner.nextLine(), "Status").toUpperCase();

        EnrollmentStatus status;
        try {
            status = EnrollmentStatus.valueOf(rawStatus);
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid status. Enter COMPLETED or CANCELLED.");
        }

        Enrollment updated = enrollmentService.updateEnrollmentStatus(enrollmentId, status);
        System.out.println("Updated -> " + updated);
    }

    private static void viewAllEnrollmentsFlow() {
        ArrayList<Enrollment> list = enrollmentService.listAllEnrollments();
        if (list.isEmpty()) {
            System.out.println("No enrollments recorded yet.");
            return;
        }
        System.out.println("\nAll Enrollments (" + list.size() + "):");
        for (Enrollment e : list) {
            System.out.println("  " + e);
        }
    }

    private static void demonstratePolymorphism() {
        ArrayList<Person> people = new ArrayList<>();
        people.addAll(studentService.listStudents());
        people.add(new Trainer(
            IdGenerator.getNextTrainerId(),
            "Ananya",
            "Rao",
            "ananya.rao@airtribe.dev",
            "Core Java & OOP",
            8
        ));

        System.out.println("\n--- Polymorphism Demo (Person.getDisplayName()) ---");
        for (Person person : people) {
            System.out.println("  " + person.getDisplayName());
        }
    }

    private static int readMenuChoice() {
        String raw = scanner.nextLine();
        try {
            return Integer.parseInt(raw.trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static void seedInitialData() {
        try {
            Student s1 = studentService.addStudent("Aarav", "Mehta", "aarav.mehta@example.com", "Java-2026-A");
            Student s2 = studentService.addStudent("Priya", "Nair", "Java-2026-A");
            Course c1 = courseService.addCourse("Core Java Fundamentals", "Variables, OOP, Collections, and Exceptions", 6);
            Course c2 = courseService.addCourse("Data Structures in Java", "Arrays, Lists, Stacks, Queues, and Trees", 8);
            enrollmentService.enrollStudent(s1.getId(), c1.getId());
            enrollmentService.enrollStudent(s2.getId(), c2.getId());
        } catch (Exception ignored) {
            // Initial sample data is valid by construction
        }
    }
}
