package com.trainerapp.service;

import com.trainerapp.model.Client;
import com.trainerapp.model.Trainer;
import com.trainerapp.model.Progress;
import com.trainerapp.repository.ClientRepository;
import com.trainerapp.repository.TrainerRepository;
import com.trainerapp.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private ProgressRepository progressRepository;

    public List<Client> getClientsForTrainer(String username) {
        List<Client> clients = clientRepository.findByTrainerUsername(username);
        for (Client client : clients) {
            List<Progress> progress = progressRepository.findByClientIdOrderByDateRecordedAsc(client.getId());
            if (!progress.isEmpty()) {
                client.setLastReportDate(progress.get(progress.size() - 1).getDateRecorded());
            }
        }
        return clients;
    }

    public boolean isClientOwnedByTrainer(Long clientId, String username) {
        return clientRepository.findById(clientId)
                .map(client -> client.getTrainer() != null && client.getTrainer().getUsername().equals(username))
                .orElse(false);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        clientOpt.ifPresent(client -> {
            List<Progress> progress = progressRepository.findByClientIdOrderByDateRecordedAsc(client.getId());
            if (!progress.isEmpty()) {
                client.setLastReportDate(progress.get(progress.size() - 1).getDateRecorded());
            }
        });
        return clientOpt;
    }

    public Client createClient(Client client, String trainerUsername) {
        Trainer trainer = trainerRepository.findByUsername(trainerUsername)
                .orElseThrow(() -> new RuntimeException("Trainer not found: " + trainerUsername));
        client.setTrainer(trainer);
        return clientRepository.save(client);
    }

    public Client updateClient(Long id, Client updatedClient) {
        return clientRepository.findById(id).map(client -> {
            client.setFirstName(updatedClient.getFirstName());
            client.setLastName(updatedClient.getLastName());
            client.setEmail(updatedClient.getEmail());
            client.setPhone(updatedClient.getPhone());
            client.setBirthDate(updatedClient.getBirthDate());
            client.setNotes(updatedClient.getNotes());
            return clientRepository.save(client);
        }).orElseThrow(() -> new RuntimeException("Client not found with id " + id));
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
