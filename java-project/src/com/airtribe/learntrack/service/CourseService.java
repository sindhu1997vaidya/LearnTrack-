package com.airtribe.learntrack.service;

import com.airtribe.learntrack.entity.Course;
import com.airtribe.learntrack.exception.EntityNotFoundException;
import com.airtribe.learntrack.exception.InvalidInputException;
import com.airtribe.learntrack.util.IdGenerator;
import com.airtribe.learntrack.util.InputValidator;

import java.util.ArrayList;

/**
 * Business service for managing Course records using an in-memory ArrayList.
 */
public class CourseService {
    private final ArrayList<Course> courses = new ArrayList<>();

    public Course addCourse(String courseName, String description, int durationInWeeks) throws InvalidInputException {
        String validName = InputValidator.requireNonEmpty(courseName, "Course name");
        String validDescription = InputValidator.requireNonEmpty(description, "Description");
        if (durationInWeeks <= 0) {
            throw new InvalidInputException("Duration in weeks must be greater than zero.");
        }

        int id = IdGenerator.getNextCourseId();
        Course course = new Course(id, validName, validDescription, durationInWeeks, true);
        courses.add(course);
        return course;
    }

    public ArrayList<Course> listCourses() {
        return new ArrayList<>(courses);
    }

    public Course findCourseById(int id) throws EntityNotFoundException {
        for (Course course : courses) {
            if (course.getId() == id) {
                return course;
            }
        }
        throw new EntityNotFoundException("Course with ID " + id + " was not found.");
    }

    public Course updateCourse(int id, String courseName, String description, int durationInWeeks)
            throws EntityNotFoundException, InvalidInputException {
        Course course = findCourseById(id);
        course.setCourseName(InputValidator.requireNonEmpty(courseName, "Course name"));
        course.setDescription(InputValidator.requireNonEmpty(description, "Description"));
        if (durationInWeeks <= 0) {
            throw new InvalidInputException("Duration in weeks must be greater than zero.");
        }
        course.setDurationInWeeks(durationInWeeks);
        return course;
    }

    public void setCourseActiveStatus(int id, boolean active) throws EntityNotFoundException {
        Course course = findCourseById(id);
        course.setActive(active);
    }
}
