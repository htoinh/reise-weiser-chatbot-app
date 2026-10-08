package com.studiosus.trainee.service;

import com.studiosus.trainee.dtos.AuthResponse;
import com.studiosus.trainee.dtos.LoginRequest;
import com.studiosus.trainee.dtos.RegisterRequest;
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

    public AuthResponse register(RegisterRequest registerRequest) {
        var user = User.builder().email(registerRequest.getEmail()).passwordHash(passwordEncoder.encode(registerRequest.getPassword())).name(registerRequest.getName()).build();
        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user.getEmail()));

    }

    public AuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        return new AuthResponse(jwtService.generateToken(loginRequest.getEmail()));
    }

}
