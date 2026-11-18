package com.airtribe.learntrack.util;

/**
 * Utility class responsible for generating sequential, unique IDs using static counters.
 */
public class IdGenerator {
    private static int studentIdCounter = 1000;
    private static int trainerIdCounter = 200;
    private static int courseIdCounter = 100;
    private static int enrollmentIdCounter = 5000;

    private IdGenerator() {
        // Private constructor prevents instantiation of utility class
    }

    public static int getNextStudentId() {
        studentIdCounter++;
        return studentIdCounter;
    }

    public static int getNextTrainerId() {
        trainerIdCounter++;
        return trainerIdCounter;
    }

    public static int getNextCourseId() {
        courseIdCounter++;
        return courseIdCounter;
    }

    public static int getNextEnrollmentId() {
        enrollmentIdCounter++;
        return enrollmentIdCounter;
    }

    public static int getCurrentStudentCounter() {
        return studentIdCounter;
    }

    public static int getCurrentCourseCounter() {
        return courseIdCounter;
    }

    public static int getCurrentEnrollmentCounter() {
        return enrollmentIdCounter;
    }
}
