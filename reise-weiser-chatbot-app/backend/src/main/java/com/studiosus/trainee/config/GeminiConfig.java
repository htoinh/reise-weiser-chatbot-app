package com.studiosus.trainee.config;

import lombok.extern.slf4j.Slf4j;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class GeminiConfig {

    @Bean
    public CommandLineRunner verifyGeminiInitialization(ChatModel chatModel) {
        return args -> log.info("Successfully initialized Spring AI Google Gemini ChatModel initialized: {} ", chatModel.getClass().getSimpleName());
    }

}
