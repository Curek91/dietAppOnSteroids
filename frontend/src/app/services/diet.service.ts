import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietPlan } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  private apiUrl = 'http://localhost:8080/api/diets';

  constructor(private http: HttpClient) {}

  getDietPlansForClient(clientId: number): Observable<DietPlan[]> {
    return this.http.get<DietPlan[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getDietPlan(id: number): Observable<DietPlan> {
    return this.http.get<DietPlan>(`${this.apiUrl}/${id}`);
  }

  saveDietPlan(clientId: number, dietPlan: DietPlan): Observable<DietPlan> {
    return this.http.post<DietPlan>(`${this.apiUrl}/client/${clientId}`, dietPlan);
  }

  deleteDietPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
