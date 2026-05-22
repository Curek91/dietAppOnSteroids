import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutPlan } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'http://localhost:8080/api/workouts';

  constructor(private http: HttpClient) {}

  getWorkoutPlansForClient(clientId: number): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getWorkoutPlan(id: number): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.apiUrl}/${id}`);
  }

  saveWorkoutPlan(clientId: number, workoutPlan: WorkoutPlan): Observable<WorkoutPlan> {
    return this.http.post<WorkoutPlan>(`${this.apiUrl}/client/${clientId}`, workoutPlan);
  }

  deleteWorkoutPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
