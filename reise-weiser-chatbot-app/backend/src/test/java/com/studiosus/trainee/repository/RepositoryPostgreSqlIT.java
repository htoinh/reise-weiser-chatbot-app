package com.studiosus.trainee.repository;

import com.studiosus.trainee.entity.ChatMessage;
import com.studiosus.trainee.entity.Conversation;
import com.studiosus.trainee.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest(properties = "spring.flyway.enabled=true")
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RepositoryPostgreSqlIT {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:17");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ChatbotRepository chatbotRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void userRepository_savesFindsByEmailAndEnforcesUniqueEmail() {
        var alice = userRepository.saveAndFlush(User.builder()
                .email("alice.it@example.com")
                .passwordHash("$2a$10$hashedPasswordValue")
                .name("Alice")
                .build());

        var found = userRepository.findByEmail("alice.it@example.com");
        assertTrue(found.isPresent());
        assertEquals(alice.getId(), found.get().getId());
        assertEquals("Alice", found.get().getName());

        assertThrows(DataIntegrityViolationException.class, () ->
                userRepository.saveAndFlush(User.builder()
                        .email("alice.it@example.com")
                        .passwordHash("$2a$10$otherHash")
                        .name("Duplicate")
                        .build()));
    }

    @Test
    void conversationAndChatbotRepositories_enforceOwnershipAndChronologicalOrdering() {
        var alice = userRepository.save(User.builder()
                .email("alice.chat@example.com")
                .passwordHash("$2a$10$hash1")
                .name("Alice")
                .build());
        var bob = userRepository.save(User.builder()
                .email("bob.chat@example.com")
                .passwordHash("$2a$10$hash2")
                .name("Bob")
                .build());

        var aliceConv = new Conversation(null, alice, "Rome Weekend", LocalDateTime.now(), LocalDateTime.now());
        aliceConv = conversationRepository.save(aliceConv);

        var bobConv = new Conversation(null, bob, "Tokyo Trip", LocalDateTime.now(), LocalDateTime.now());
        bobConv = conversationRepository.save(bobConv);

        assertTrue(conversationRepository.findByIdAndUser_Email(aliceConv.getId(), "alice.chat@example.com").isPresent());
        assertTrue(conversationRepository.findByIdAndUser_Email(aliceConv.getId(), "bob.chat@example.com").isEmpty());

        chatbotRepository.save(ChatMessage.builder()
                .conversationId(aliceConv.getId())
                .userPrompt("First question")
                .aiResponse("First answer")
                .createdAt(LocalDateTime.now())
                .build());
        chatbotRepository.save(ChatMessage.builder()
                .conversationId(bobConv.getId())
                .userPrompt("Bob secret question")
                .aiResponse("Bob secret answer")
                .createdAt(LocalDateTime.now())
                .build());
        chatbotRepository.save(ChatMessage.builder()
                .conversationId(aliceConv.getId())
                .userPrompt("Second question")
                .aiResponse("Second answer")
                .createdAt(LocalDateTime.now())
                .build());

        entityManager.flush();
        entityManager.clear();

        var aliceMessages = chatbotRepository
                .findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc("alice.chat@example.com");

        assertEquals(2, aliceMessages.size());
        assertEquals("First question", aliceMessages.get(0).getUserPrompt());
        assertEquals("Second question", aliceMessages.get(1).getUserPrompt());
        assertEquals("Rome Weekend", aliceMessages.get(0).getConversation().getTitle());

        entityManager.clear();
        conversationRepository.deleteById(aliceConv.getId());
        entityManager.flush();
        entityManager.clear();

        assertTrue(chatbotRepository.findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc("alice.chat@example.com").isEmpty());
        assertEquals(1, chatbotRepository.findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc("bob.chat@example.com").size());
    }

}
