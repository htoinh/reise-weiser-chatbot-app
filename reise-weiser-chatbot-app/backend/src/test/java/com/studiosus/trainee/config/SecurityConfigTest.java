package com.studiosus.trainee.config;

import com.studiosus.trainee.repository.UserRepository;
import com.studiosus.trainee.security.JwtAuthenticationFilter;
import com.studiosus.trainee.security.JwtService;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityConfigTest.ProbeController.class)
@Import({SecurityConfig.class, AuthenticationConfig.class, JwtAuthenticationFilter.class, SecurityConfigTest.ProbeController.class})
public class SecurityConfigTest {

    @RestController
    static class ProbeController {
        @GetMapping("/private-probe")
        public String probe() {
            return "ok";
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AuthenticationProvider authenticationProvider;

    @Test
    void publicAuthEndpoints_shouldNotBlockBySecurity() throws Exception {
        mockMvc.perform(post("/register"))
                .andExpect(status().isNotFound());
        mockMvc.perform(post("/login"))
                .andExpect(status().isNotFound());
    }

    @Test
    void privateAuthEndpoints_shouldBlockBySecurity() throws Exception {
        mockMvc.perform(get("/private-probe"))
                .andExpect(status().isForbidden());
    }

    @Test
    void jwtAuthenticationFilter_acceptsValidBearerTokenAndRejectsInvalidDisabledOrMissingUsers() throws Exception {
        when(jwtService.extractUsername("valid-jwt")).thenReturn("alice@example.com");
        when(userDetailsService.loadUserByUsername("alice@example.com"))
                .thenReturn(new User("alice@example.com", "hash", List.of()));

        mockMvc.perform(get("/private-probe").header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));

        when(jwtService.extractUsername("tampered-jwt")).thenThrow(new JwtException("bad signature"));
        mockMvc.perform(get("/private-probe").header("Authorization", "Bearer tampered-jwt"))
                .andExpect(status().isUnauthorized());

        when(jwtService.extractUsername("blank-jwt")).thenReturn("   ");
        mockMvc.perform(get("/private-probe").header("Authorization", "Bearer blank-jwt"))
                .andExpect(status().isUnauthorized());

        when(jwtService.extractUsername("disabled-jwt")).thenReturn("disabled@example.com");
        when(userDetailsService.loadUserByUsername("disabled@example.com"))
                .thenReturn(User.withUsername("disabled@example.com").password("hash").disabled(true).authorities(List.of()).build());
        mockMvc.perform(get("/private-probe").header("Authorization", "Bearer disabled-jwt"))
                .andExpect(status().isUnauthorized());

        when(jwtService.extractUsername("ghost-jwt")).thenReturn("ghost@example.com");
        when(userDetailsService.loadUserByUsername("ghost@example.com"))
                .thenThrow(new UsernameNotFoundException("missing"));
        mockMvc.perform(get("/private-probe").header("Authorization", "Bearer ghost-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void passwordEncoder() {
        assertInstanceOf(BCryptPasswordEncoder.class, passwordEncoder, "Password encoder should be BCryptPasswordEncoder");
        String rawPassword = "mySecretPassword";
        assertTrue(passwordEncoder.matches(rawPassword, passwordEncoder.encode(rawPassword)));
    }

}
