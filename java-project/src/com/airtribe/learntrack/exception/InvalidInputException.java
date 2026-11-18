package com.airtribe.learntrack.exception;

/**
 * Thrown when user-provided input fails validation rules.
 */
public class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}
