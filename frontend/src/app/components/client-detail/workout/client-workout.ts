import { Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../../services/workout.service';
import { WorkoutPlan, WorkoutDay, WorkoutExercise } from '../../../models/types';

@Component({
  selector: 'app-client-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-workout.html',
  styleUrls: ['../client-detail.css']
})
export class ClientWorkoutComponent implements OnInit {
  clientId = input.required<number>();

  // Workout builder state
  workoutPlans = signal<WorkoutPlan[]>([]);
  selectedWorkoutPlanId = signal<number | null>(null);
  workoutPlan = signal<WorkoutPlan | null>(null);

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkoutPlans(this.clientId());
  }

  loadWorkoutPlans(clientId: number): void {
    this.workoutService.getWorkoutPlansForClient(clientId).subscribe({
      next: (data) => {
        this.workoutPlans.set(data || []);
        if (data && data.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          const activePlan = data.find(p => {
            if (!p.startDate || !p.endDate) return false;
            return p.startDate <= todayStr && p.endDate >= todayStr;
          }) || data[0];

          this.selectedWorkoutPlanId.set(activePlan.id || null);
          this.workoutPlan.set(JSON.parse(JSON.stringify(activePlan))); // deep copy
        } else {
          this.createNewWorkoutPlan();
        }
      },
      error: (err) => console.error('Error loading workout plans', err)
    });
  }

  selectWorkoutPlan(id: any): void {
    const numericId = id ? +id : null;
    this.selectedWorkoutPlanId.set(numericId);
    
    const plan = this.workoutPlans().find(p => p.id === numericId || (!p.id && numericId === null));
    if (plan) {
      this.workoutPlan.set(JSON.parse(JSON.stringify(plan)));
    }
  }

  createNewWorkoutPlan(): void {
    const newPlan: WorkoutPlan = {
      name: 'Nowy Plan Treningowy',
      notes: 'Pamiętaj o rozgrzewce przed każdą sesją oraz rozciąganiu po treningu.',
      startDate: '',
      endDate: '',
      days: [
        {
          dayName: 'Dzień 1 - Całe ciało (FBW)',
          orderNum: 0,
          exercises: []
        }
      ]
    };

    const currentPlans = this.workoutPlans();
    const unsavedExists = currentPlans.some(p => !p.id);
    if (!unsavedExists) {
      this.workoutPlans.set([...currentPlans, newPlan]);
    }
    
    this.selectedWorkoutPlanId.set(null);
    this.workoutPlan.set(newPlan);
  }

  deleteActiveWorkoutPlan(): void {
    const plan = this.workoutPlan();
    if (!plan) return;

    if (plan.id) {
      if (confirm(`Czy na pewno chcesz trwale usunąć plan treningowy "${plan.name}"?`)) {
        this.workoutService.deleteWorkoutPlan(plan.id).subscribe({
          next: () => {
            alert('Plan treningowy został pomyślnie usunięty.');
            this.loadWorkoutPlans(this.clientId());
          },
          error: (err) => {
            console.error('Error deleting workout plan', err);
            alert('Wystąpił błąd podczas usuwania planu treningowego.');
          }
        });
      }
    } else {
      const updated = this.workoutPlans().filter(p => p.id);
      this.workoutPlans.set(updated);
      if (updated.length > 0) {
        this.selectWorkoutPlan(updated[0].id);
      } else {
        this.workoutPlan.set(null);
        this.selectedWorkoutPlanId.set(null);
      }
    }
  }

  addWorkoutDay(): void {
    const plan = this.workoutPlan();
    if (!plan) return;
    const name = prompt('Podaj nazwę nowego dnia treningowego (np. Dzień 2 - Góra, Dzień B):');
    if (name && name.trim()) {
      plan.days.push({
        dayName: name.trim(),
        orderNum: plan.days.length,
        exercises: []
      });
      this.workoutPlan.set({ ...plan });
    }
  }

  removeWorkoutDay(index: number): void {
    const plan = this.workoutPlan();
    if (!plan) return;
    if (confirm(`Czy na pewno chcesz usunąć dzień "${plan.days[index].dayName}" wraz z ćwiczeniami?`)) {
      plan.days.splice(index, 1);
      this.workoutPlan.set({ ...plan });
    }
  }

  addExerciseToDay(day: WorkoutDay): void {
    const plan = this.workoutPlan();
    if (!plan) return;

    const newEx: WorkoutExercise = {
      exerciseName: 'Nowe ćwiczenie',
      sets: 4,
      reps: '10',
      weight: 'Ciężar',
      notes: '',
      orderNum: day.exercises.length
    };

    day.exercises.push(newEx);
    this.workoutPlan.set({ ...plan });
  }

  removeExerciseFromDay(day: WorkoutDay, index: number): void {
    const plan = this.workoutPlan();
    if (!plan) return;
    day.exercises.splice(index, 1);
    this.workoutPlan.set({ ...plan });
  }

  saveWorkout(): void {
    const plan = this.workoutPlan();
    if (!plan) return;

    this.workoutService.saveWorkoutPlan(this.clientId(), plan).subscribe({
      next: () => {
        alert('Plan treningowy został pomyślnie zapisany!');
        this.loadWorkoutPlans(this.clientId());
      },
      error: (err) => {
        console.error('Error saving workout plan', err);
        alert('Wystąpił błąd podczas zapisywania treningu.');
      }
    });
  }
}
