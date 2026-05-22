import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../models/types';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-profile.html',
  styleUrls: ['../client-detail.css']
})
export class ClientProfileComponent {
  client = input.required<Client>();
  profileUpdated = output<Client>();

  constructor(private clientService: ClientService) {}

  updateClientProfile(): void {
    const c = this.client();
    if (!c || !c.id) return;
    this.clientService.updateClient(c.id, c).subscribe({
      next: (updated) => {
        alert('Profil podopiecznego został pomyślnie zaktualizowany!');
        this.profileUpdated.emit(updated);
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Wystąpił błąd podczas aktualizacji profilu.');
      }
    });
  }
}
