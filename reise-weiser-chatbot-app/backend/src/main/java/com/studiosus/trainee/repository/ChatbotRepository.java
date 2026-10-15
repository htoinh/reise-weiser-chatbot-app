package com.studiosus.trainee.repository;

import com.studiosus.trainee.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc(String email);
}
