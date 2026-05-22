package com.trainerapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workout_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id", nullable = false)
    @JsonIgnore
    private WorkoutDay workoutDay;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "reps")
    private String reps; // e.g. "8-10" or "12" or "Max"

    @Column(name = "weight")
    private String weight; // e.g. "100kg" or "Bodyweight" or "RPE 8"

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "order_num")
    private Integer orderNum;
}
