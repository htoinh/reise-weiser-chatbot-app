package com.studiosus.trainee.service;

import com.studiosus.trainee.dtos.ChatMessageRequest;
import com.studiosus.trainee.dtos.ChatMessageResponse;
import com.studiosus.trainee.entity.ChatMessage;
import com.studiosus.trainee.repository.ChatbotRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ChatbotService {

    private final ChatClient chatClient;
    private ChatbotRepository chatbotRepository;

    public ChatbotService(ChatClient.Builder chatClientBuilder, ChatbotRepository chatbotRepository) {
        this.chatClient = chatClientBuilder.build();
        this.chatbotRepository = chatbotRepository;
    }

    @Transactional
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        log.info("Routing user prompt to AI endpoint for conversationId: {}", request.getConversationId());
        log.info("Request Prompt: {}", request.getPromptMessage());


        try {
            log.info("Attempting to connect to Google Gemini AI...");
            var aiResponse = CompletableFuture.supplyAsync(() -> chatClient.prompt().user(request.getPromptMessage()).call().content()).get(60, TimeUnit.SECONDS);

            log.info("Successfully connected and received response from Gemini AI: {}", aiResponse);

            ChatMessageResponse responseDto = new ChatMessageResponse();
            responseDto.setMessageId(System.currentTimeMillis());
            responseDto.setConversationId(request.getConversationId());
            responseDto.setContent(Optional.ofNullable(aiResponse).orElse("I am unable to provide a response at this time."));

            log.info("Returning mapped response to client: {}", responseDto);
            ChatMessage message = ChatMessage.builder()
                    .conversationId(request.getConversationId())
                    .userPrompt(request.getPromptMessage())
                    .aiResponse(responseDto.getContent())
                    .createdAt(LocalDateTime.now())
                    .build();
            chatbotRepository.save(message);
            return responseDto;

        } catch (Exception e) {
            log.error("Failed to connect to Google Gemini AI or request timed out. Reason: {}", e.getMessage(), e);

            // Traverse the exception chain to find if any underlying cause is a 429 Quota Exceeded error
            Throwable cause = e;
            while (cause != null) {
                if (cause.getMessage() != null && cause.getMessage().contains("429")) {
                    throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "AI service quota exceeded. Please check your API limits or try again later.", e);
                }
                cause = cause.getCause();
            }

            throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT, "AI service connection timed out or failed", e);
        }
    }
}