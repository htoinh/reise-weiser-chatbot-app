package com.studiosus.trainee.config;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    @Bean
    public Client googleGenAiClient(
            org.springframework.core.env.Environment environment){

        String apiKey = environment.getRequiredProperty("GEMINI_API_KEY");

        return Client.builder()
                .apiKey(apiKey)
                .httpOptions(HttpOptions.builder()
                        .timeout(45_000)
                        .build())

                        .build();
    }

}
