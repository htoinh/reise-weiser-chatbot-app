package com.studiosus.trainee.repository;

import com.studiosus.trainee.entity.ChatMessage;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotRepository extends JpaRepository<ChatMessage, Long> {
    @EntityGraph(attributePaths = "conversation")
    List<ChatMessage> findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc(String email);
}
