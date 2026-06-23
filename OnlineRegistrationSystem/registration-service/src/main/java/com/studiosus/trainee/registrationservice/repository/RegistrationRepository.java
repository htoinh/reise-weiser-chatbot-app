package com.studiosus.trainee.registrationservice.repository;

import com.studiosus.trainee.registrationservice.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Integer> {

}
