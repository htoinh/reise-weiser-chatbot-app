package com.studiosus.trainee;

import com.studiosus.trainee.repository.ChatbotRepository;
import com.studiosus.trainee.repository.ConversationRepository;
import com.studiosus.trainee.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = {
        "GEMINI_API_KEY=test-gemini-api-key",
        "JWT_SECRET_KEY=test-jwt-secret-key-at-least-32-bytes-long!",
        "spring.autoconfigure.exclude=" +
                "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration," +
                "org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration," +
                "org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration," +
                "org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration"
})
class ReiseWeiserChatbotApplicationTests {

    @MockitoBean
    private ChatModel chatModel;

    @MockitoBean
    private ChatClient.Builder chatClientBuilder;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ChatbotRepository chatbotRepository;

    @MockitoBean
    private ConversationRepository conversationRepository;

    @Test
    void contextLoads() {
    }

}
