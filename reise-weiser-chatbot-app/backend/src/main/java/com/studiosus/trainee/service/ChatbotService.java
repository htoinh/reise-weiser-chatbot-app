package com.studiosus.trainee.service;

import com.studiosus.trainee.entity.Conversation;
import com.studiosus.trainee.dtos.ChatHistoryResponseInner;
import com.studiosus.trainee.dtos.ChatMessageRequest;
import com.studiosus.trainee.dtos.ChatMessageResponse;
import com.studiosus.trainee.dtos.ConversationResponse;
import com.studiosus.trainee.entity.ChatMessage;
import com.studiosus.trainee.repository.ChatbotRepository;
import com.studiosus.trainee.repository.ConversationRepository;
import com.studiosus.trainee.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ChatbotService {

    private final ChatClient chatClient;
    private final ChatbotRepository chatbotRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;


    public ChatbotService(ChatClient.Builder chatClientBuilder, ChatbotRepository chatbotRepository, ConversationRepository conversationRepository, UserRepository userRepository) {
        this.chatClient = chatClientBuilder.build();
        this.chatbotRepository = chatbotRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        log.info("Routing user prompt to AI endpoint for conversationId: {}", request.getConversationId());
        log.info("Request Prompt: {}", request.getPromptMessage());

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

       var conversation = conversationRepository
                .findByIdAndUser_Email(request.getConversationId(), email)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.FORBIDDEN, "Conversation not found"));

        try {
            log.info("Attempting to connect to Google Gemini AI...");
            var aiResponse = CompletableFuture.supplyAsync(() -> chatClient.prompt()
                            .user(request.getPromptMessage())
                            .call()
                            .content())
                    .get(60, TimeUnit.SECONDS);

            log.info("Successfully connected and received response from Gemini AI: {}", aiResponse);


            //Generate a title according to the prompt
            if ("New conversation".equals(conversation.getTitle())
                    || "Test conversation".equals(conversation.getTitle())){
                String prompt = request.getPromptMessage().strip();
                String title = prompt.substring(0, Math.min(prompt.length(), 80));

                try {
                    String generatedTitle = CompletableFuture.supplyAsync(() ->
                            chatClient.prompt()
                                    .system("""
                               Create a short conversation title of 5–8 words.
                               Use the same language as the user's message.
                               Return only the title, without quotation marks.
                               """)
                                    .user(prompt)
                                    .call()
                                    .content()
                    ).get(15, TimeUnit.SECONDS);
                    if (generatedTitle != null && !generatedTitle.isBlank()) {
                        title = generatedTitle.strip();
                        title = title.substring(0, Math.min(title.length(), 80));
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("Title generation interrupted; using prompt as title");
                } catch (Exception e) {
                    log.warn("Title generation failed; using prompt as title");
                }
                conversation.setTitle(title);
            }

            ChatMessageResponse responseDto = new ChatMessageResponse();
            responseDto.setConversationId(request.getConversationId());
            responseDto.setContent(Optional.ofNullable(aiResponse).orElse("I am unable to provide a response at this time."));

            log.info("Returning mapped response to client: {}", responseDto);
            ChatMessage message = ChatMessage.builder()
                    .conversationId(request.getConversationId())
                    .userPrompt(request.getPromptMessage())
                    .aiResponse(responseDto.getContent())
                    .createdAt(LocalDateTime.now())
                    .build();

            ChatMessage savedMessage = chatbotRepository.save(message);
            responseDto.setMessageId(savedMessage.getId());
            log.info("Returning mapped response to client: {}", responseDto);
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

    @Transactional(readOnly = true)
    public List<ChatHistoryResponseInner> getChatHistory() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return chatbotRepository
                .findAllByConversation_User_EmailOrderByCreatedAtAscIdAsc(email)
                .stream()
                .map(message -> new ChatHistoryResponseInner()
                        .messageId(message.getId())
                        .conversationId(message.getConversationId())
                        .userPrompt(message.getUserPrompt())
                        .aiResponse(message.getAiResponse())
                        .title(message.getConversation().getTitle())
                        .createdAt(message.getCreatedAt()
                                .atZone(ZoneId.systemDefault())
                                .toOffsetDateTime()
                        )
                )
                .toList();
    }

    @Transactional
    public ConversationResponse createConversation() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var conversation = new Conversation();
        conversation.setUser(user);
        conversation.setTitle("New conversation");
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        var savedConversation = conversationRepository.save(conversation);

        return new ConversationResponse()
                .conversationId(savedConversation.getId())
                .title(savedConversation.getTitle());
    }
}