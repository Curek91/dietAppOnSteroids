package com.trainerapp.service;

import com.trainerapp.model.Client;
import com.trainerapp.model.DietMeal;
import com.trainerapp.model.DietMealProduct;
import com.trainerapp.model.DietPlan;
import com.trainerapp.repository.ClientRepository;
import com.trainerapp.repository.DietPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DietService {

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<DietPlan> getDietPlansByClient(Long clientId) {
        return dietPlanRepository.findByClientId(clientId);
    }

    public Optional<DietPlan> getDietPlanById(Long id) {
        return dietPlanRepository.findById(id);
    }

    public DietPlan saveDietPlan(Long clientId, DietPlan dietPlan) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + clientId));
        dietPlan.setClient(client);

        // Properly set bidirectional relations to cascade save
        if (dietPlan.getMeals() != null) {
            for (int i = 0; i < dietPlan.getMeals().size(); i++) {
                DietMeal meal = dietPlan.getMeals().get(i);
                meal.setDietPlan(dietPlan);
                if (meal.getOrderNum() == null) {
                    meal.setOrderNum(i);
                }

                if (meal.getMealProducts() != null) {
                    for (DietMealProduct mealProduct : meal.getMealProducts()) {
                        mealProduct.setDietMeal(meal);
                    }
                }
            }
        }

        return dietPlanRepository.save(dietPlan);
    }

    public void deleteDietPlan(Long id) {
        dietPlanRepository.deleteById(id);
    }
}
