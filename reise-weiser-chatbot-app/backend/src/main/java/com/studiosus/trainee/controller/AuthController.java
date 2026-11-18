package com.studiosus.trainee.controller;

import com.studiosus.trainee.apis.AuthenticationApi;
import com.studiosus.trainee.dtos.AuthResponse;
import com.studiosus.trainee.dtos.LoginRequest;
import com.studiosus.trainee.dtos.RegisterRequest;
import com.studiosus.trainee.dtos.UserProfileResponse;
import com.studiosus.trainee.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthenticationApi {

    private final AuthService authService;

    @Override
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @Override
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @Override
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

}
