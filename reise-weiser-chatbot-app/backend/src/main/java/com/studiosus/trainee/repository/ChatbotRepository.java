package com.studiosus.trainee.repository;

import com.studiosus.trainee.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatbotRepository extends JpaRepository<ChatMessage, Long> {
}
