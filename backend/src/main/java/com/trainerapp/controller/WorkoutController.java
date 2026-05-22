package com.trainerapp.controller;

import com.trainerapp.model.WorkoutPlan;
import com.trainerapp.repository.WorkoutPlanRepository;
import com.trainerapp.service.ClientService;
import com.trainerapp.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<WorkoutPlan>> getWorkoutPlansByClient(@PathVariable Long clientId) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(workoutService.getWorkoutPlansByClient(clientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getWorkoutPlanById(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        WorkoutPlan workoutPlan = workoutPlanRepository.findById(id).orElse(null);
        if (workoutPlan == null) {
            return ResponseEntity.notFound().build();
        }
        if (workoutPlan.getClient() == null || !clientService.isClientOwnedByTrainer(workoutPlan.getClient().getId(), username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(workoutPlan);
    }

    @PostMapping("/client/{clientId}")
    public ResponseEntity<WorkoutPlan> saveWorkoutPlan(@PathVariable Long clientId, @RequestBody WorkoutPlan workoutPlan) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(clientId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            return ResponseEntity.ok(workoutService.saveWorkoutPlan(clientId, workoutPlan));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        WorkoutPlan workoutPlan = workoutPlanRepository.findById(id).orElse(null);
        if (workoutPlan == null) {
            return ResponseEntity.notFound().build();
        }
        if (workoutPlan.getClient() == null || !clientService.isClientOwnedByTrainer(workoutPlan.getClient().getId(), username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        workoutService.deleteWorkoutPlan(id);
        return ResponseEntity.ok().build();
    }
}
