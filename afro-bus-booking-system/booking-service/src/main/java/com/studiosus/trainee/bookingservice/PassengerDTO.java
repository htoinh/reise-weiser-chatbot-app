package com.studiosus.trainee.bookingservice;

import lombok.Data;

@Data
public class PassengerDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String dateOfBirth;
    private String gender;
    private String passengerId;
}
