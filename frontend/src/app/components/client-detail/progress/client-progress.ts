import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Progress } from '../../../models/types';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-client-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-progress.html',
  styleUrls: ['../client-detail.css']
})
export class ClientProgressComponent implements OnInit, OnDestroy, AfterViewInit {
  clientId = input.required<number>();

  @ViewChild('progressChart') progressChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  progressList = signal<Progress[]>([]);
  chartInstance: Chart | null = null;
  
  // Progress form models
  progressDate = '';
  progressWeight = '';
  progressHeight = '';
  progressWaist = '';
  progressBiceps = '';
  progressChest = '';
  progressThigh = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadProgressHistory(this.clientId());
  }

  ngAfterViewInit(): void {
    if (this.progressList().length > 0) {
      setTimeout(() => this.renderChart(), 50);
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  loadProgressHistory(id: number): void {
    this.clientService.getProgressHistory(id).subscribe({
      next: (data) => {
        this.progressList.set(data);
        setTimeout(() => this.renderChart(), 50);
      },
      error: (err) => console.error('Error loading progress history', err)
    });
  }

  renderChart(): void {
    if (!this.progressChartCanvas) return;
    
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const data = this.progressList();
    if (data.length === 0) return;

    const labels = data.map(r => r.dateRecorded);
    const weights = data.map(r => r.weight || null);
    const waists = data.map(r => r.waistCircumference || null);
    const biceps = data.map(r => r.bicepsCircumference || null);
    const chests = data.map(r => r.chestCircumference || null);
    const thighs = data.map(r => r.thighCircumference || null);

    const ctx = this.progressChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Waga (kg)',
            data: weights,
            borderColor: 'hsl(200, 85%, 52%)',
            backgroundColor: 'rgba(14, 165, 233, 0.05)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Pas (cm)',
            data: waists,
            borderColor: 'hsl(10, 85%, 62%)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            yAxisID: 'yCircumference'
          },
          {
            label: 'Biceps (cm)',
            data: biceps,
            borderColor: 'hsl(30, 95%, 50%)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            yAxisID: 'yCircumference'
          },
          {
            label: 'Klatka (cm)',
            data: chests,
            borderColor: 'hsl(150, 60%, 42%)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            yAxisID: 'yCircumference'
          },
          {
            label: 'Udo (cm)',
            data: thighs,
            borderColor: 'hsl(270, 70%, 55%)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            yAxisID: 'yCircumference'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: 'hsl(24, 15%, 42%)', font: { family: 'Plus Jakarta Sans', weight: 'bold' } }
          },
          tooltip: {
            backgroundColor: 'rgba(25, 20, 15, 0.95)',
            titleFont: { family: 'Plus Jakarta Sans' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            borderColor: 'rgba(249,115,22,0.15)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: 'hsl(24, 10%, 55%)' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: 'hsl(200, 85%, 45%)' },
            title: { display: true, text: 'Masa ciała (kg)', color: 'hsl(200, 85%, 45%)' }
          },
          yCircumference: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: 'hsl(24, 15%, 42%)' },
            title: { display: true, text: 'Obwody (cm)', color: 'hsl(24, 15%, 42%)' }
          }
        }
      }
    });
  }

  saveProgress(): void {
    if (!this.progressDate) {
      alert('Data pomiaru jest wymagana!');
      return;
    }

    const record: Progress = {
      dateRecorded: this.progressDate,
      weight: this.progressWeight ? parseFloat(this.progressWeight) : undefined,
      height: this.progressHeight ? parseFloat(this.progressHeight) : undefined,
      waistCircumference: this.progressWaist ? parseFloat(this.progressWaist) : undefined,
      bicepsCircumference: this.progressBiceps ? parseFloat(this.progressBiceps) : undefined,
      chestCircumference: this.progressChest ? parseFloat(this.progressChest) : undefined,
      thighCircumference: this.progressThigh ? parseFloat(this.progressThigh) : undefined
    };

    this.clientService.addProgress(this.clientId(), record).subscribe({
      next: () => {
        this.progressWeight = '';
        this.progressHeight = '';
        this.progressWaist = '';
        this.progressBiceps = '';
        this.progressChest = '';
        this.progressThigh = '';
        this.loadProgressHistory(this.clientId());
      },
      error: (err) => console.error('Error adding progress record', err)
    });
  }

  deleteProgressRecord(recordId: number | undefined): void {
    if (!recordId) return;
    if (confirm('Czy na pewno chcesz usunąć ten pomiar?')) {
      this.clientService.deleteProgress(recordId).subscribe({
        next: () => this.loadProgressHistory(this.clientId()),
        error: (err) => console.error('Error deleting progress', err)
      });
    }
  }
}
