package com.studiosus.trainee.repository;

import com.studiosus.trainee.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByIdAndUser_Email(Long conversationId, String userEmail);
}
