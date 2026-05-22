package com.trainerapp.controller;

import com.trainerapp.model.Client;
import com.trainerapp.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getClientsForTrainer(getAuthenticatedUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(id, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.createClient(client, getAuthenticatedUsername());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(id, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            return ResponseEntity.ok(clientService.updateClient(id, client));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        if (!clientService.isClientOwnedByTrainer(id, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        clientService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
}
