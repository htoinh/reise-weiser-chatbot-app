package com.studiosus.trainee.registrationservice.controller;

import java.util.List;

import com.studiosus.trainee.registrationservice.model.Registration;
import com.studiosus.trainee.registrationservice.dto.RegistrationRequest;
import com.studiosus.trainee.registrationservice.dto.RegistrationResponse;
import com.studiosus.trainee.registrationservice.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {
	
	private RegistrationService registrationService;
	
	public RegistrationController(RegistrationService registrationService) {
		this.registrationService = registrationService;
	}
	
	@PostMapping
	//Creates a new registration
	public ResponseEntity<Registration> createRegistration(@RequestBody RegistrationRequest request) {
		return ResponseEntity.ok(registrationService.createRegistration(request));
	}
	
	@GetMapping
	//Returns a list of all registrations with student details
	public ResponseEntity<List<RegistrationResponse>> getAllRegistrations() {
		return ResponseEntity.ok(registrationService.getAllRegistrationsWithStudentDetails());
	}
}
