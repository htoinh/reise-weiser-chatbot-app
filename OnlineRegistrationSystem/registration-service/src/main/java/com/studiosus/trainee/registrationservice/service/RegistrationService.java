package com.studiosus.trainee.registrationservice.service;

import java.util.List;
import java.util.stream.Collectors;

import com.studiosus.trainee.registrationservice.model.Registration;
import com.studiosus.trainee.registrationservice.client.StudentClient;
import com.studiosus.trainee.registrationservice.dto.RegistrationRequest;
import com.studiosus.trainee.registrationservice.dto.RegistrationResponse;
import com.studiosus.trainee.registrationservice.dto.StudentDTO;
import com.studiosus.trainee.registrationservice.repository.RegistrationRepository;
import org.springframework.stereotype.Service;


@Service
//Handles logic for creating registrations and fetching registrations with student details
public class RegistrationService {
	
	private RegistrationRepository registrationRepository;
	private StudentClient studentClient;
	
	public RegistrationService(RegistrationRepository registrationRepository, StudentClient studentClient) {
		this.registrationRepository = registrationRepository;
		this.studentClient = studentClient;
	}
	
	//Creates a new registration and returns the saved registration
	public Registration createRegistration(RegistrationRequest request) {
		//Instantiate StudentClient to call Student Service
		StudentDTO student = studentClient.getStudentById(request.getStudentId());
		
		Registration registration = new Registration();
		registration.setStudentId(student.getId());
		registration.setCourseId(request.getCourseId());
		//Save student details after registration to the database
		return registrationRepository.save(registration);
	}
	
	
	public List<RegistrationResponse> getAllRegistrationsWithStudentDetails() {
		return registrationRepository.findAll().stream().map(reg -> {
			//For each registration, fetch the student details using StudentClient
			StudentDTO student = studentClient.getStudentById(reg.getStudentId());
			
			//Create a new RegistrationResponse object and populate it with registration and student details
			RegistrationResponse response = new RegistrationResponse();
			response.setRegistrationId(reg.getId());
			response.setCourseId(reg.getCourseId());
			response.setStudent(student);
			
			return response;
					//Gathers all registration responses into a list and returns them
		}).collect(Collectors.toList());
	}
}
