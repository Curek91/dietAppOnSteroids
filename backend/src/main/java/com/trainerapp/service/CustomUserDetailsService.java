package com.trainerapp.service;

import com.trainerapp.model.Trainer;
import com.trainerapp.repository.TrainerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final TrainerRepository trainerRepository;

    public CustomUserDetailsService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Trainer trainer = trainerRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Trainer not found with username: " + username));

        return new User(
                trainer.getUsername(),
                trainer.getPassword(),
                Collections.emptyList()
        );
    }
}
