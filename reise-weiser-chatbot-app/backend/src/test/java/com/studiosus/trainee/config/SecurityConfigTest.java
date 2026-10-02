package com.studiosus.trainee.config;

import com.studiosus.trainee.repository.UserRepository;
import com.studiosus.trainee.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Controller;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
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

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private AuthenticationConfig authenticationConfig;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AuthenticationProvider authenticationProvider;

    @Test
    void publicAuthEndpoints_shouldNotBlockBySecurity() throws Exception {
        mockMvc.perform(post("/api/auth/register"))
                .andExpect(status().isNotFound());
        mockMvc.perform(post("/api/auth/login"))
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
