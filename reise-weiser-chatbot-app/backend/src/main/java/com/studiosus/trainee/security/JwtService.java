package com.studiosus.trainee.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final String secretKey;
    private final long jwtExpirationMs;

    public JwtService(
            @Value("${application.security.jwt.secret-key}") String secretKey,
            @Value("${application.security.jwt.expiration:86400000}") long jwtExpirationMs) {
        String trimmed = secretKey == null ? "" : secretKey.strip();
        if (trimmed.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY must not be blank");
        }
        this.secretKey = trimmed;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(String username) {
        return generateToken(username, null);
    }

    public String generateToken(String username, String name) {
        var builder = Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs));
        if (name != null && !name.isBlank()) {
            builder.claim("name", name);
        }
        return builder.signWith(getSignInKey()).compact();
    }

    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractName(String token) {
        return extractClaim(token, claims -> claims.get("name", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

}
