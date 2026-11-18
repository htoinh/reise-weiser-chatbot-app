package com.studiosus.trainee.controller;

import com.studiosus.trainee.config.AuthenticationConfig;
import com.studiosus.trainee.config.SecurityConfig;
import com.studiosus.trainee.dtos.AuthResponse;
import com.studiosus.trainee.dtos.LoginRequest;
import com.studiosus.trainee.dtos.RegisterRequest;
import com.studiosus.trainee.dtos.UserProfileResponse;
import com.studiosus.trainee.security.JwtService;
import com.studiosus.trainee.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@Import({SecurityConfig.class, AuthenticationConfig.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void registerUser_returns200AndToken_andRejects400OnInvalidPayload() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(new AuthResponse("jwt-register").name("Alice"));

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Alice","email":"alice@example.com","password":"Password123!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-register"))
                .andExpect(jsonPath("$.name").value("Alice"));

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Alice","email":"alice@example.com","password":""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginUser_returns200AndToken() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(new AuthResponse("jwt-login").name("Alice"));

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"Password123!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-login"))
                .andExpect(jsonPath("$.name").value("Alice"));
    }

    @Test
    void getCurrentUser_requiresAuthAndReturns200WhenAuthenticated() throws Exception {
        when(authService.getCurrentUser())
                .thenReturn(new UserProfileResponse("alice@example.com").name("Alice"));

        mockMvc.perform(get("/current-user"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/current-user").with(user("alice@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.name").value("Alice"));
    }

}
