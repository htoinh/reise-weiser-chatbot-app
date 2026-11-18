package com.studiosus.trainee.service;

import com.studiosus.trainee.dtos.LoginRequest;
import com.studiosus.trainee.dtos.RegisterRequest;
import com.studiosus.trainee.model.User;
import com.studiosus.trainee.repository.UserRepository;
import com.studiosus.trainee.security.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService("test-secret-key-at-least-32-bytes-long!!", 60_000L);
        authService = new AuthService(userRepository, new BCryptPasswordEncoder(), authenticationManager, jwtService);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void register_normalizesEmailHashesPasswordSavesUserAndReturnsJwtWithName() {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        var req = new RegisterRequest()
                .email("  Alice@Example.com ")
                .password("Password123!")
                .name("  Alice  ");

        var res = authService.register(req);

        var captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).saveAndFlush(captor.capture());
        assertEquals("alice@example.com", captor.getValue().getEmail());
        assertEquals("Alice", captor.getValue().getName());
        assertTrue(captor.getValue().getPasswordHash().startsWith("$2"));
        assertEquals("Alice", res.getName());
        assertEquals("alice@example.com", jwtService.extractUsername(res.getToken()));
        assertEquals("Alice", jwtService.extractName(res.getToken()));
    }

    @Test
    void register_throws409WhenEmailAlreadyExistsOrConstraintRaces() {
        var req = new RegisterRequest()
                .email("alice@example.com")
                .password("Password123!")
                .name("Alice");

        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(User.builder().email("alice@example.com").build()));
        var existingEx = assertThrows(ResponseStatusException.class, () -> authService.register(req));
        assertEquals(HttpStatus.CONFLICT, existingEx.getStatusCode());

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        when(userRepository.saveAndFlush(any(User.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));
        var raceEx = assertThrows(ResponseStatusException.class, () -> authService.register(req));
        assertEquals(HttpStatus.CONFLICT, raceEx.getStatusCode());
    }

    @Test
    void login_normalizesEmailAuthenticatesAndReturnsJwtWithDatabaseName() {
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(User.builder().email("alice@example.com").name("Alice").build()));

        var res = authService.login(new LoginRequest().email(" Alice@Example.com ").password("Password123!"));

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("alice@example.com", "Password123!"));
        assertEquals("Alice", res.getName());
        assertEquals("alice@example.com", jwtService.extractUsername(res.getToken()));
        assertEquals("Alice", jwtService.extractName(res.getToken()));
    }

    @Test
    void getCurrentUser_returnsProfileWhenAuthenticated() {
        var auth = new UsernamePasswordAuthenticationToken("alice@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(User.builder().email("alice@example.com").name("Alice").build()));

        var profile = authService.getCurrentUser();

        assertEquals("alice@example.com", profile.getEmail());
        assertEquals("Alice", profile.getName());
    }

    @Test
    void getCurrentUser_throws401WhenAnonymousOrUserMissing() {
        SecurityContextHolder.clearContext();
        var unauthEx = assertThrows(ResponseStatusException.class, () -> authService.getCurrentUser());
        assertEquals(HttpStatus.UNAUTHORIZED, unauthEx.getStatusCode());

        var auth = new UsernamePasswordAuthenticationToken("ghost@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        var missingEx = assertThrows(ResponseStatusException.class, () -> authService.getCurrentUser());
        assertEquals(HttpStatus.UNAUTHORIZED, missingEx.getStatusCode());
    }

}
