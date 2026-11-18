package com.airtribe.learntrack.service;

import com.airtribe.learntrack.entity.Student;
import com.airtribe.learntrack.exception.EntityNotFoundException;
import com.airtribe.learntrack.exception.InvalidInputException;
import com.airtribe.learntrack.util.IdGenerator;
import com.airtribe.learntrack.util.InputValidator;

import java.util.ArrayList;

/**
 * Business service for managing Student records using an in-memory ArrayList.
 */
public class StudentService {
    private final ArrayList<Student> students = new ArrayList<>();

    /**
     * Adds a student with an email address.
     */
    public Student addStudent(String firstName, String lastName, String email, String batch) throws InvalidInputException {
        String validFirst = InputValidator.requireNonEmpty(firstName, "First name");
        String validLast = InputValidator.requireNonEmpty(lastName, "Last name");
        String validEmail = InputValidator.validateEmail(email);
        String validBatch = InputValidator.requireNonEmpty(batch, "Batch");

        int id = IdGenerator.getNextStudentId();
        Student student = new Student(id, validFirst, validLast, validEmail, validBatch, true);
        students.add(student);
        return student;
    }

    /**
     * Overloaded addStudent method without an email address.
     */
    public Student addStudent(String firstName, String lastName, String batch) throws InvalidInputException {
        String validFirst = InputValidator.requireNonEmpty(firstName, "First name");
        String validLast = InputValidator.requireNonEmpty(lastName, "Last name");
        String validBatch = InputValidator.requireNonEmpty(batch, "Batch");

        int id = IdGenerator.getNextStudentId();
        Student student = new Student(id, validFirst, validLast, validBatch);
        students.add(student);
        return student;
    }

    public ArrayList<Student> listStudents() {
        return new ArrayList<>(students);
    }

    public ArrayList<Student> listStudents(boolean onlyActive) {
        if (!onlyActive) {
            return listStudents();
        }
        ArrayList<Student> activeList = new ArrayList<>();
        for (Student student : students) {
            if (student.isActive()) {
                activeList.add(student);
            }
        }
        return activeList;
    }

    public Student findStudentById(int id) throws EntityNotFoundException {
        for (Student student : students) {
            if (student.getId() == id) {
                return student;
            }
        }
        throw new EntityNotFoundException("Student with ID " + id + " was not found.");
    }

    public Student updateStudent(int id, String email, String batch)
            throws EntityNotFoundException, InvalidInputException {
        Student student = findStudentById(id);
        if (email != null && !email.trim().isEmpty()) {
            student.setEmail(InputValidator.validateEmail(email));
        }
        if (batch != null && !batch.trim().isEmpty()) {
            student.setBatch(InputValidator.requireNonEmpty(batch, "Batch"));
        }
        return student;
    }

    public void deactivateStudent(int id) throws EntityNotFoundException {
        Student student = findStudentById(id);
        student.setActive(false);
    }

    public void activateStudent(int id) throws EntityNotFoundException {
        Student student = findStudentById(id);
        student.setActive(true);
    }

    public void removeStudent(int id) throws EntityNotFoundException {
        Student student = findStudentById(id);
        students.remove(student);
    }
}
