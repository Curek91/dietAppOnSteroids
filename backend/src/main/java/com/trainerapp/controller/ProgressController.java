package com.trainerapp.controller;

import com.trainerapp.model.Progress;
import com.trainerapp.repository.ProgressRepository;
import com.trainerapp.service.ClientService;
import com.trainerapp.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private ProgressRepository progressRepository;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Progress>> getProgressHistory(@PathVariable Long clientId) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(progressService.getProgressHistory(clientId));
    }

    @PostMapping("/client/{clientId}")
    public ResponseEntity<Progress> addProgress(@PathVariable Long clientId, @RequestBody Progress progress) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            return ResponseEntity.ok(progressService.addProgress(clientId, progress));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        Progress progress = progressRepository.findById(id).orElse(null);
        if (progress == null) {
            return ResponseEntity.notFound().build();
        }
        if (progress.getClient() == null || !clientService.isClientOwnedByTrainer(progress.getClient().getId(), username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        progressService.deleteProgress(id);
        return ResponseEntity.ok().build();
    }
}
