package com.airtribe.learntrack.service;

import com.airtribe.learntrack.entity.Course;
import com.airtribe.learntrack.entity.Enrollment;
import com.airtribe.learntrack.entity.EnrollmentStatus;
import com.airtribe.learntrack.entity.Student;
import com.airtribe.learntrack.exception.EntityNotFoundException;
import com.airtribe.learntrack.exception.InvalidInputException;
import com.airtribe.learntrack.util.IdGenerator;

import java.time.LocalDate;
import java.util.ArrayList;

/**
 * Business service for managing student enrollments in courses.
 */
public class EnrollmentService {
    private final ArrayList<Enrollment> enrollments = new ArrayList<>();
    private final StudentService studentService;
    private final CourseService courseService;

    public EnrollmentService(StudentService studentService, CourseService courseService) {
        this.studentService = studentService;
        this.courseService = courseService;
    }

    public Enrollment enrollStudent(int studentId, int courseId)
            throws EntityNotFoundException, InvalidInputException {
        Student student = studentService.findStudentById(studentId);
        if (!student.isActive()) {
            throw new InvalidInputException("Cannot enroll inactive student ID " + studentId + ".");
        }

        Course course = courseService.findCourseById(courseId);
        if (!course.isActive()) {
            throw new InvalidInputException("Cannot enroll in inactive course ID " + courseId + ".");
        }

        for (Enrollment existing : enrollments) {
            if (existing.getStudentId() == studentId
                    && existing.getCourseId() == courseId
                    && existing.getStatus() == EnrollmentStatus.ACTIVE) {
                throw new InvalidInputException(
                    "Student " + studentId + " already has an ACTIVE enrollment in course " + courseId + "."
                );
            }
        }

        int enrollmentId = IdGenerator.getNextEnrollmentId();
        String today = LocalDate.now().toString();
        Enrollment enrollment = new Enrollment(enrollmentId, studentId, courseId, today, EnrollmentStatus.ACTIVE);
        enrollments.add(enrollment);
        return enrollment;
    }

    public ArrayList<Enrollment> getEnrollmentsByStudentId(int studentId) throws EntityNotFoundException {
        studentService.findStudentById(studentId);
        ArrayList<Enrollment> results = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            if (enrollment.getStudentId() == studentId) {
                results.add(enrollment);
            }
        }
        return results;
    }

    public ArrayList<Enrollment> listAllEnrollments() {
        return new ArrayList<>(enrollments);
    }

    public Enrollment findEnrollmentById(int enrollmentId) throws EntityNotFoundException {
        for (Enrollment enrollment : enrollments) {
            if (enrollment.getId() == enrollmentId) {
                return enrollment;
            }
        }
        throw new EntityNotFoundException("Enrollment with ID " + enrollmentId + " was not found.");
    }

    public Enrollment updateEnrollmentStatus(int enrollmentId, EnrollmentStatus newStatus)
            throws EntityNotFoundException {
        Enrollment enrollment = findEnrollmentById(enrollmentId);
        enrollment.setStatus(newStatus);
        return enrollment;
    }
}
