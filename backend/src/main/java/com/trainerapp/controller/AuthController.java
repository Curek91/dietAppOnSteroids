package com.trainerapp.controller;

import com.trainerapp.config.JwtService;
import com.trainerapp.model.Trainer;
import com.trainerapp.repository.TrainerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TrainerRepository trainerRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, TrainerRepository trainerRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.trainerRepository = trainerRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            Trainer trainer = trainerRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Trainer not found"));

            String token = jwtService.generateToken(trainer.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", trainer.getUsername());
            response.put("name", trainer.getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nieprawidłowy login lub hasło");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
