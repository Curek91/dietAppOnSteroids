import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  clients = signal<Client[]>([]);
  searchQuery = signal<string>('');
  viewMode = signal<'table' | 'grid'>('table');
  
  inactiveClient = computed(() => {
    const list = this.clients();
    if (list.length === 0) return { name: 'Brak', days: '—' };
    
    let oldestClient: Client | null = null;
    let oldestTime = Infinity;
    
    for (const c of list) {
      const dateStr = c.lastReportDate || c.createdDate;
      if (!dateStr) continue;
      
      const time = new Date(dateStr).getTime();
      if (time < oldestTime) {
        oldestTime = time;
        oldestClient = c;
      }
    }
    
    if (!oldestClient) {
      return { name: 'Brak', days: '—' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oldestDate = new Date(oldestTime);
    oldestDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - oldestDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let daysText = '';
    if (diffDays <= 0) {
      daysText = 'dzisiaj';
    } else if (diffDays === 1) {
      daysText = '1 dzień temu';
    } else {
      daysText = `${diffDays} dni temu`;
    }
    
    return {
      name: `${oldestClient.firstName} ${oldestClient.lastName}`,
      days: daysText
    };
  });
  
  // Modal state
  isModalOpen = signal<boolean>(false);
  modalTitle = signal<string>('Dodaj Podopiecznego');
  
  // Form model
  editingClient = signal<Client | null>(null);
  formFirstName = '';
  formLastName = '';
  formEmail = '';
  formPhone = '';
  formBirthDate = '';
  formNotes = '';

  constructor(
    private clientService: ClientService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
      },
      error: (err) => {
        console.error('Error loading clients', err);
      }
    });
  }

  filteredClients() {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.clients();
    }
    return this.clients().filter(client => 
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      (client.email && client.email.toLowerCase().includes(query))
    );
  }

  openAddModal(): void {
    this.editingClient.set(null);
    this.modalTitle.set('Dodaj Podopiecznego');
    this.formFirstName = '';
    this.formLastName = '';
    this.formEmail = '';
    this.formPhone = '';
    this.formBirthDate = '';
    this.formNotes = '';
    this.isModalOpen.set(true);
  }

  openEditModal(client: Client, event: Event): void {
    event.stopPropagation(); // Avoid navigating to details
    this.editingClient.set(client);
    this.modalTitle.set('Edytuj Podopiecznego');
    this.formFirstName = client.firstName;
    this.formLastName = client.lastName;
    this.formEmail = client.email || '';
    this.formPhone = client.phone || '';
    this.formBirthDate = client.birthDate || '';
    this.formNotes = client.notes || '';
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveClient(): void {
    if (!this.formFirstName || !this.formLastName) {
      alert('Imię i nazwisko są wymagane!');
      return;
    }

    const clientData: Client = {
      firstName: this.formFirstName,
      lastName: this.formLastName,
      email: this.formEmail || undefined,
      phone: this.formPhone || undefined,
      birthDate: this.formBirthDate || undefined,
      notes: this.formNotes || undefined
    };

    const editClient = this.editingClient();
    if (editClient && editClient.id) {
      this.clientService.updateClient(editClient.id, clientData).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error updating client', err)
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error creating client', err)
      });
    }
  }

  deleteClient(client: Client, event: Event): void {
    event.stopPropagation(); // Avoid navigating to details
    if (confirm(`Czy na pewno chcesz usunąć podopiecznego ${client.firstName} ${client.lastName}?`)) {
      if (client.id) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.loadClients();
          },
          error: (err) => console.error('Error deleting client', err)
        });
      }
    }
  }

  navigateToClient(clientId: number | undefined): void {
    if (clientId) {
      this.router.navigate(['/client', clientId]);
    }
  }

  getAge(birthDateStr: string | undefined): string {
    if (!birthDateStr) return 'N/A';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} lat`;
  }
}
