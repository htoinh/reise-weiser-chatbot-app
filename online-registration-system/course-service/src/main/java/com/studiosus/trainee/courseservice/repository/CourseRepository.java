package com.studiosus.trainee.courseservice.repository;

import java.util.List;

import com.studiosus.trainee.courseservice.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findByStudentId(int studentId);

}
