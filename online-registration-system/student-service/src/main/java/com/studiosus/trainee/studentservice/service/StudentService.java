package com.studiosus.trainee.studentservice.service;

import java.util.List;


import com.studiosus.trainee.studentservice.model.Student;
import com.studiosus.trainee.studentservice.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

	private StudentRepository studentRepository;

	
	public StudentService(StudentRepository studentRepository) {
		this.studentRepository = studentRepository;
	}

	// Save students to database
	public Student addStudent(Student student) {
		return studentRepository.save(student);
	}

	// Get all patients from database
	public List<Student> getAllStudents() {
		return studentRepository.findAll();
	}
	
	// Get a student by ID
	public Student getStudentById(int id) {
		return studentRepository.findStudentById(id);
	}

}
