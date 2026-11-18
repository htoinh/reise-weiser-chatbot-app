package com.studiosus.trainee.service;

import com.studiosus.trainee.dtos.AuthResponse;
import com.studiosus.trainee.dtos.LoginRequest;
import com.studiosus.trainee.dtos.RegisterRequest;
import com.studiosus.trainee.dtos.UserProfileResponse;
import com.studiosus.trainee.model.User;
import com.studiosus.trainee.repository.UserRepository;
import com.studiosus.trainee.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        String email = normalizeEmail(registerRequest.getEmail());
        String name = registerRequest.getName().strip();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        var user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .name(name)
                .build();
        try {
            userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.", ex);
        }
        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getName()))
                .name(user.getName());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        String email = normalizeEmail(loginRequest.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword()));
        var userName = userRepository.findByEmail(email)
                .map(User::getName)
                .orElse(null);
        return new AuthResponse(jwtService.generateToken(email, userName))
                .name(userName);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return new UserProfileResponse(user.getEmail()).name(user.getName());
    }

    private static String normalizeEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }

}
