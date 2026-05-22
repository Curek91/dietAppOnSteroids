package com.trainerapp.service;

import com.trainerapp.model.Client;
import com.trainerapp.model.WorkoutDay;
import com.trainerapp.model.WorkoutExercise;
import com.trainerapp.model.WorkoutPlan;
import com.trainerapp.repository.ClientRepository;
import com.trainerapp.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkoutService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<WorkoutPlan> getWorkoutPlansByClient(Long clientId) {
        return workoutPlanRepository.findByClientId(clientId);
    }

    public Optional<WorkoutPlan> getWorkoutPlanById(Long id) {
        return workoutPlanRepository.findById(id);
    }

    public WorkoutPlan saveWorkoutPlan(Long clientId, WorkoutPlan workoutPlan) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + clientId));
        workoutPlan.setClient(client);

        // Properly set bidirectional relations to cascade save
        if (workoutPlan.getDays() != null) {
            for (int i = 0; i < workoutPlan.getDays().size(); i++) {
                WorkoutDay day = workoutPlan.getDays().get(i);
                day.setWorkoutPlan(workoutPlan);
                if (day.getOrderNum() == null) {
                    day.setOrderNum(i);
                }

                if (day.getExercises() != null) {
                    for (int j = 0; j < day.getExercises().size(); j++) {
                        WorkoutExercise exercise = day.getExercises().get(j);
                        exercise.setWorkoutDay(day);
                        if (exercise.getOrderNum() == null) {
                            exercise.setOrderNum(j);
                        }
                    }
                }
            }
        }

        return workoutPlanRepository.save(workoutPlan);
    }

    public void deleteWorkoutPlan(Long id) {
        workoutPlanRepository.deleteById(id);
    }
}
