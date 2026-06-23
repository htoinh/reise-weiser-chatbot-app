package com.studiosus.trainee.registrationservice.dto;

import lombok.Data;

@Data
// Request object for creating a new registration
public class RegistrationRequest {
	private int studentId;
	private int courseId;
}
