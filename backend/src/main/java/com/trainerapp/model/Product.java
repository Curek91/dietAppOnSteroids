package com.trainerapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "calories", nullable = false)
    private Double calories; // kcal per 100g (or per unit)

    @Column(name = "protein", nullable = false)
    private Double protein; // grams per 100g

    @Column(name = "fat", nullable = false)
    private Double fat; // grams per 100g

    @Column(name = "carbohydrates", nullable = false)
    private Double carbohydrates; // grams per 100g

    @Column(name = "unit")
    private String unit; // default "g" or "szt"
}
