package com.studiosus.trainee.service;

import com.studiosus.trainee.dto.AuthDtos;
import com.studiosus.trainee.model.User;
import com.studiosus.trainee.repository.UserRepository;
import com.studiosus.trainee.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest registerRequest) {
        var user = User.builder().email(registerRequest.email()).passwordHash(passwordEncoder.encode(registerRequest.password())).name(registerRequest.name()).build();
        userRepository.save(user);
        return new AuthDtos.AuthResponse(jwtService.generateToken(user.getEmail()));

    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        return new AuthDtos.AuthResponse(jwtService.generateToken(loginRequest.email()));
    }

}
