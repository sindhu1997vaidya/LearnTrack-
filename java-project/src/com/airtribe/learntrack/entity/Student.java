package com.airtribe.learntrack.entity;

/**
 * Student entity extending Person.
 * Demonstrates inheritance (super constructor calls), constructor overloading
 * (with and without email), and method overriding (getDisplayName).
 */
public class Student extends Person {
    private String batch;
    private boolean active;

    public Student() {
        super();
        this.active = true;
    }

    /**
     * Full parameterized constructor including email.
     */
    public Student(int id, String firstName, String lastName, String email, String batch, boolean active) {
        super(id, firstName, lastName, email);
        this.batch = batch;
        this.active = active;
    }

    /**
     * Overloaded constructor for creating an active student without an email address.
     */
    public Student(int id, String firstName, String lastName, String batch) {
        super(id, firstName, lastName, "N/A");
        this.batch = batch;
        this.active = true;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String getDisplayName() {
        return "[Student] " + getFirstName() + " " + getLastName() + " (Batch: " + batch + ")";
    }

    @Override
    public String toString() {
        String statusText = active ? "ACTIVE" : "INACTIVE";
        return String.format(
            "Student[ID=%d, Name=%s %s, Email=%s, Batch=%s, Status=%s]",
            getId(), getFirstName(), getLastName(), getEmail(), batch, statusText
        );
    }
}
