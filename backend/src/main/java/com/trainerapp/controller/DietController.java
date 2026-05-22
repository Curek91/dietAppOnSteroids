package com.trainerapp.controller;

import com.trainerapp.model.DietPlan;
import com.trainerapp.repository.DietPlanRepository;
import com.trainerapp.service.ClientService;
import com.trainerapp.service.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/diets")
public class DietController {

    @Autowired
    private DietService dietService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private DietPlanRepository dietPlanRepository;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<DietPlan>> getDietPlansByClient(@PathVariable Long clientId) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(dietService.getDietPlansByClient(clientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DietPlan> getDietPlanById(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        DietPlan dietPlan = dietPlanRepository.findById(id).orElse(null);
        if (dietPlan == null) {
            return ResponseEntity.notFound().build();
        }
        if (dietPlan.getClient() == null || !clientService.isClientOwnedByTrainer(dietPlan.getClient().getId(), username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(dietPlan);
    }

    @PostMapping("/client/{clientId}")
    public ResponseEntity<DietPlan> saveDietPlan(@PathVariable Long clientId, @RequestBody DietPlan dietPlan) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            return ResponseEntity.ok(dietService.saveDietPlan(clientId, dietPlan));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDietPlan(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        DietPlan dietPlan = dietPlanRepository.findById(id).orElse(null);
        if (dietPlan == null) {
            return ResponseEntity.notFound().build();
        }
        if (dietPlan.getClient() == null || !clientService.isClientOwnedByTrainer(dietPlan.getClient().getId(), username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        dietService.deleteDietPlan(id);
        return ResponseEntity.ok().build();
    }
}
