package com.studiosus.trainee.controller;

import com.studiosus.trainee.config.AuthenticationConfig;
import com.studiosus.trainee.config.SecurityConfig;
import com.studiosus.trainee.dtos.ChatHistoryResponseInner;
import com.studiosus.trainee.dtos.ChatMessageRequest;
import com.studiosus.trainee.dtos.ChatMessageResponse;
import com.studiosus.trainee.dtos.ConversationResponse;
import com.studiosus.trainee.security.JwtService;
import com.studiosus.trainee.service.ChatbotService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ChatbotController.class)
@Import({SecurityConfig.class, AuthenticationConfig.class})
class ChatbotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ChatbotService chatbotService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void createConversation_returns201Created() throws Exception {
        when(chatbotService.createConversation())
                .thenReturn(new ConversationResponse(15L, "New conversation"));

        mockMvc.perform(post("/chatbot/conversation").with(user("alice@example.com")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.conversationId").value(15))
                .andExpect(jsonPath("$.title").value("New conversation"));
    }

    @Test
    void chatSend_returns200AndPropagates403Error() throws Exception {
        when(chatbotService.processMessage(any(ChatMessageRequest.class)))
                .thenReturn(new ChatMessageResponse("Visit Kotor old town.").messageId(88L).conversationId(15L));

        mockMvc.perform(post("/chatbot/message")
                        .with(user("alice@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"conversationId":15,"promptMessage":"What to see in Montenegro?"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messageId").value(88))
                .andExpect(jsonPath("$.conversationId").value(15))
                .andExpect(jsonPath("$.content").value("Visit Kotor old town."));

        when(chatbotService.processMessage(any(ChatMessageRequest.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.FORBIDDEN, "Conversation not found"));

        mockMvc.perform(post("/chatbot/message")
                        .with(user("alice@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"conversationId":999,"promptMessage":"Unauthorized conversation"}
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/chatbot/message")
                        .with(user("alice@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"conversationId":15,"promptMessage":"   "}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void chatHistoryGet_returns200List() throws Exception {
        var entry = new ChatHistoryResponseInner()
                .messageId(10L)
                .conversationId(15L)
                .title("Montenegro Trip")
                .createdAt(OffsetDateTime.parse("2026-11-18T10:00:00Z"))
                .userPrompt("Ideas?")
                .aiResponse("Visit Kotor.");
        when(chatbotService.getChatHistory()).thenReturn(List.of(entry));

        mockMvc.perform(get("/chat-history").with(user("alice@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].messageId").value(10))
                .andExpect(jsonPath("$[0].title").value("Montenegro Trip"))
                .andExpect(jsonPath("$[0].userPrompt").value("Ideas?"))
                .andExpect(jsonPath("$[0].aiResponse").value("Visit Kotor."));
    }

}
