package com.trainerapp.repository;

import com.trainerapp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByTrainerUsername(String username);
    List<Client> findByTrainerIsNull();
}
