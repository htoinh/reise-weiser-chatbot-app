package com.studiosus.trainee.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityConfigTest.EmptyController.class)
@Import(SecurityConfig.class)
public class SecurityConfigTest {

    @Controller
    static class EmptyController {}

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void publicAuthEndpoints_shouldNotBlockBySecurity() throws Exception {
        mockMvc.perform(post("/api/auth/dummy-endpoint"))
                .andExpect(status().isNotFound());
    }

    @Test
    void privateAuthEndpoints_shouldBlockBySecurity() throws Exception {
        mockMvc.perform(get("/api/dummy-private-endpoint"))
                .andExpect(status().isForbidden());
    }

    @Test
    void passwordEncoder() {
        assertInstanceOf(BCryptPasswordEncoder.class, passwordEncoder, "Password encoder should be BCryptPasswordEncoder");
        String rawPassword = "mySecretPassword";
        assertTrue(passwordEncoder.matches(rawPassword, passwordEncoder.encode(rawPassword)));
    }

}
