package com.studiosus.trainee.security;

import com.studiosus.trainee.model.User;
import com.studiosus.trainee.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAndUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void jwtService_generatesExtractsClaimsAndRejectsExpiredOrTamperedTokens() {
        var jwtService = new JwtService("unit-test-secret-key-at-least-32-bytes!!", 60_000L);

        String tokenWithName = jwtService.generateToken("alice@example.com", "Alice");
        assertEquals("alice@example.com", jwtService.extractUsername(tokenWithName));
        assertEquals("Alice", jwtService.extractName(tokenWithName));

        String tokenWithoutName = jwtService.generateToken("bob@example.com");
        assertEquals("bob@example.com", jwtService.extractUsername(tokenWithoutName));
        assertNull(jwtService.extractName(tokenWithoutName));

        var otherKeyService = new JwtService("different-secret-key-at-least-32-bytes!!", 60_000L);
        assertThrows(JwtException.class, () -> otherKeyService.extractUsername(tokenWithName));

        var expiredService = new JwtService("unit-test-secret-key-at-least-32-bytes!!", -1_000L);
        String expiredToken = expiredService.generateToken("alice@example.com", "Alice");
        assertThrows(JwtException.class, () -> jwtService.extractUsername(expiredToken));
    }

    @Test
    void customUserDetailsService_loadsUserOrThrowsWhenNotFound() {
        var user = User.builder().email("alice@example.com").passwordHash("hashed").name("Alice").build();
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        var loaded = customUserDetailsService.loadUserByUsername("alice@example.com");
        assertEquals("alice@example.com", loaded.getUsername());

        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("missing@example.com"));
    }

}
