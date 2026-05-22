package com.trainerapp.service;

import com.trainerapp.model.Client;
import com.trainerapp.model.Progress;
import com.trainerapp.repository.ClientRepository;
import com.trainerapp.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Progress> getProgressHistory(Long clientId) {
        return progressRepository.findByClientIdOrderByDateRecordedAsc(clientId);
    }

    public Progress addProgress(Long clientId, Progress progress) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + clientId));
        progress.setClient(client);
        return progressRepository.save(progress);
    }

    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }
}
