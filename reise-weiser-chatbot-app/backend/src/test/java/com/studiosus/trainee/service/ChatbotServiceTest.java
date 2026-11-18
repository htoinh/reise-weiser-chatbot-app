package com.studiosus.trainee.service;

import com.studiosus.trainee.dtos.ChatMessageRequest;
import com.studiosus.trainee.entity.ChatMessage;
import com.studiosus.trainee.entity.Conversation;
import com.studiosus.trainee.model.User;
import com.studiosus.trainee.repository.ChatbotRepository;
import com.studiosus.trainee.repository.ConversationRepository;
import com.studiosus.trainee.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

    @Mock
    private ChatClient.Builder chatClientBuilder;

    @Mock
    private ChatClient chatClient;

    @Mock
    private ChatbotRepository chatbotRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private UserRepository userRepository;

    private ChatbotService chatbotService;

    @BeforeEach
    void setUp() {
        when(chatClientBuilder.build()).thenReturn(chatClient);
        chatbotService = new ChatbotService(chatClientBuilder, chatbotRepository, conversationRepository, userRepository);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("alice@example.com", null, List.of()));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void processMessage_formatsPlainTextUpdatesTitleAndSavesMessage() {
        var conversation = new Conversation(7L, User.builder().email("alice@example.com").build(),
                "New conversation", LocalDateTime.now(), LocalDateTime.now());
        when(conversationRepository.findByIdAndUser_Email(7L, "alice@example.com"))
                .thenReturn(Optional.of(conversation));

        var requestSpec = mock(ChatClient.ChatClientRequestSpec.class);
        var callSpec = mock(ChatClient.CallResponseSpec.class);
        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.system(anyString())).thenReturn(requestSpec);
        when(requestSpec.user(anyString())).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(callSpec);
        when(callSpec.content()).thenReturn("**Rome** is wonderful!\nVisit Trastevere.", "Three Days Exploring Historic Rome");

        when(chatbotRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage msg = invocation.getArgument(0);
            msg.setId(101L);
            return msg;
        });

        var req = new ChatMessageRequest().conversationId(7L).promptMessage("Plan 3 days in Rome");
        var res = chatbotService.processMessage(req);

        assertEquals(101L, res.getMessageId());
        assertEquals(7L, res.getConversationId());
        assertEquals("Rome is wonderful! Visit Trastevere.", res.getContent());
        assertEquals("Three Days Exploring Historic Rome", conversation.getTitle());
        verify(chatbotRepository).save(any(ChatMessage.class));
        verify(conversationRepository).save(conversation);
    }

    @Test
    void processMessage_throws403WhenConversationNotOwnedByUser() {
        when(conversationRepository.findByIdAndUser_Email(99L, "alice@example.com"))
                .thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () ->
                chatbotService.processMessage(new ChatMessageRequest().conversationId(99L).promptMessage("Hi")));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    void processMessage_mapsQuota429AndUpstream502Errors() {
        var conversation = new Conversation(7L, User.builder().email("alice@example.com").build(),
                "Existing title", LocalDateTime.now(), LocalDateTime.now());
        when(conversationRepository.findByIdAndUser_Email(7L, "alice@example.com"))
                .thenReturn(Optional.of(conversation));

        var requestSpec = mock(ChatClient.ChatClientRequestSpec.class);
        var callSpec = mock(ChatClient.CallResponseSpec.class);
        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.system(anyString())).thenReturn(requestSpec);
        when(requestSpec.user(anyString())).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(callSpec);
        when(callSpec.content()).thenThrow(
                new RuntimeException("HTTP 429 quota exceeded"),
                new RuntimeException("Connection reset"));

        var quotaEx = assertThrows(ResponseStatusException.class, () ->
                chatbotService.processMessage(new ChatMessageRequest().conversationId(7L).promptMessage("Hi")));
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, quotaEx.getStatusCode());

        var upstreamEx = assertThrows(ResponseStatusException.class, () ->
                chatbotService.processMessage(new ChatMessageRequest().conversationId(7L).promptMessage("Hi")));
        assertEquals(HttpStatus.BAD_GATEWAY, upstreamEx.getStatusCode());
    }

    @Test
    void formatContent_stripsAsterisksNewlinesAndCapsAt99Words() {
        String over100Words = String.join(" ", Collections.nCopies(110, "*word*")) + "\nextra";
        String formatted = ChatbotService.formatContent(over100Words);

        assertFalse(formatted.contains("*"));
        assertFalse(formatted.contains("\n"));
        assertEquals(99, formatted.split("\\s+").length);
        assertEquals("I am unable to provide a response at this time.", ChatbotService.formatContent("   "));
    }

    @Test
    void getChatHistory_returnsChronologicalDtosForAuthenticatedUser() {
        var conv = new Conversation(5L, User.builder().email("alice@example.com").build(),
                "Lisbon Guide", LocalDateTime.now(), LocalDateTime.now());
        var msg = ChatMessage.builder()
                .id(12L)
                .conversationId(5L)
                .userPrompt("Best viewpoints?")
                .aiResponse("Miradouro da Senhora do Monte.")
                .createdAt(LocalDateTime.of(2026, 11, 18, 10, 30))
                .conversation(conv)
                .build();
        when(chatbotRepository.findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc("alice@example.com"))
                .thenReturn(List.of(msg));

        var history = chatbotService.getChatHistory();

        assertEquals(1, history.size());
        assertEquals(12L, history.getFirst().getMessageId());
        assertEquals(5L, history.getFirst().getConversationId());
        assertEquals("Lisbon Guide", history.getFirst().getTitle());
        assertEquals("Best viewpoints?", history.getFirst().getUserPrompt());
        assertEquals("Miradouro da Senhora do Monte.", history.getFirst().getAiResponse());
    }

    @Test
    void createConversation_savesConversationForAuthenticatedUser_andThrows401WhenUserMissing() {
        var user = User.builder().id(1L).email("alice@example.com").name("Alice").build();
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(conversationRepository.save(any(Conversation.class))).thenAnswer(inv -> {
            Conversation c = inv.getArgument(0);
            c.setId(33L);
            return c;
        });

        var created = chatbotService.createConversation();
        assertEquals(33L, created.getConversationId());
        assertEquals("New conversation", created.getTitle());

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class, () -> chatbotService.createConversation());
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

}
