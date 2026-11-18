package com.airtribe.learntrack.util;

import com.airtribe.learntrack.exception.InvalidInputException;

/**
 * Helper class containing static input validation and parsing methods.
 */
public class InputValidator {

    private InputValidator() {
        // Prevent instantiation
    }

    public static String requireNonEmpty(String value, String fieldName) throws InvalidInputException {
        if (value == null || value.trim().isEmpty()) {
            throw new InvalidInputException(fieldName + " cannot be empty.");
        }
        return value.trim();
    }

    public static String validateEmail(String email) throws InvalidInputException {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidInputException("Email cannot be empty.");
        }
        String trimmed = email.trim();
        if (!trimmed.contains("@") || !trimmed.contains(".")) {
            throw new InvalidInputException("Invalid email format: " + trimmed);
        }
        return trimmed;
    }

    public static int parsePositiveInt(String rawInput, String fieldName) throws InvalidInputException {
        try {
            int parsed = Integer.parseInt(rawInput.trim());
            if (parsed <= 0) {
                throw new InvalidInputException(fieldName + " must be greater than zero.");
            }
            return parsed;
        } catch (NumberFormatException e) {
            throw new InvalidInputException(fieldName + " must be a valid whole number.");
        }
    }
}
