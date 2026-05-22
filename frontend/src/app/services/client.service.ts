import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Progress } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://dietapponsteroids.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Client CRUD
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  // Client Progress
  getProgressHistory(clientId: number): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.apiUrl}/progress/client/${clientId}`);
  }

  addProgress(clientId: number, progress: Progress): Observable<Progress> {
    return this.http.post<Progress>(`${this.apiUrl}/progress/client/${clientId}`, progress);
  }

  deleteProgress(progressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/progress/${progressId}`);
  }
}
