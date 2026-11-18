package com.studiosus.trainee.controller;

import com.studiosus.trainee.apis.ChatApi;
import com.studiosus.trainee.dtos.ChatHistoryResponseInner;
import com.studiosus.trainee.dtos.ChatMessageRequest;
import com.studiosus.trainee.dtos.ChatMessageResponse;
import com.studiosus.trainee.dtos.ConversationResponse;
import com.studiosus.trainee.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatbotController implements ChatApi {

    private final ChatbotService chatbotService;

    @Override
    public ResponseEntity<ChatMessageResponse> chatSend(@Valid @RequestBody ChatMessageRequest request) {
        log.info("Received chatbot request to process prompt for conversationId: {}", request.getConversationId());
        return ResponseEntity.ok(chatbotService.processMessage(request));
    }

    @Override
    public ResponseEntity<List<ChatHistoryResponseInner>> chatHistoryGet() {
        return ResponseEntity.ok(chatbotService.getChatHistory());
    }

    @Override
    public ResponseEntity<ConversationResponse> createConversation() {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatbotService.createConversation());
    }
}
