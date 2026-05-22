package com.trainerapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diet_meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_plan_id", nullable = false)
    @JsonIgnore
    private DietPlan dietPlan;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "order_num")
    private Integer orderNum;

    @OneToMany(mappedBy = "dietMeal", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<DietMealProduct> mealProducts = new ArrayList<>();
}
