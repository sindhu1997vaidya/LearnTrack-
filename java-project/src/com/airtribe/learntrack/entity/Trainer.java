package com.airtribe.learntrack.entity;

/**
 * Trainer entity extending Person to demonstrate inheritance and polymorphism.
 */
public class Trainer extends Person {
    private String specialization;
    private int yearsOfExperience;

    public Trainer() {
        super();
    }

    public Trainer(int id, String firstName, String lastName, String email, String specialization, int yearsOfExperience) {
        super(id, firstName, lastName, email);
        this.specialization = specialization;
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    @Override
    public String getDisplayName() {
        return "[Trainer] " + getFirstName() + " " + getLastName() + " (" + specialization + ", " + yearsOfExperience + " yrs)";
    }

    @Override
    public String toString() {
        return String.format(
            "Trainer[ID=%d, Name=%s %s, Email=%s, Specialization=%s, Experience=%d yrs]",
            getId(), getFirstName(), getLastName(), getEmail(), specialization, yearsOfExperience
        );
    }
}
