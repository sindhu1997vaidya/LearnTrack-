package com.airtribe.learntrack.exception;

/**
 * Thrown when a requested Student, Course, or Enrollment ID cannot be located.
 */
public class EntityNotFoundException extends Exception {
    public EntityNotFoundException(String message) {
        super(message);
    }
}
