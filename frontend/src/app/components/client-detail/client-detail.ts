import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/types';
import { ClientProfileComponent } from './profile/client-profile';
import { ClientProgressComponent } from './progress/client-progress';
import { ClientDietComponent } from './diet/client-diet';
import { ClientWorkoutComponent } from './workout/client-workout';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ClientProfileComponent,
    ClientProgressComponent,
    ClientDietComponent,
    ClientWorkoutComponent
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css'
})
export class ClientDetail implements OnInit {
  clientId = signal<number>(0);
  client = signal<Client | null>(null);
  activeTab = signal<string>('profile'); // 'profile', 'progress', 'diet', 'workout'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.clientId.set(id);
      this.loadClientData(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadClientData(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: (data) => this.client.set(data),
      error: (err) => {
        console.error('Error loading client', err);
        this.router.navigate(['/']);
      }
    });
  }

  switchTab(tabName: string): void {
    this.activeTab.set(tabName);
  }
}
