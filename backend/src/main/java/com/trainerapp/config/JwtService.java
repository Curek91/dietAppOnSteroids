package com.trainerapp.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "diet_app_secret_key_should_be_extremely_secure_and_long_to_meet_security_requirements";
    private final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    public String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public String extractUsername(String token) {
        return getDecodedJWT(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            return !getDecodedJWT(token).getExpiresAt().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private DecodedJWT getDecodedJWT(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token);
    }
}
