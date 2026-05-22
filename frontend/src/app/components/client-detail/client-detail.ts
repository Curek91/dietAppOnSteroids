import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { DietService } from '../../services/diet.service';
import { WorkoutService } from '../../services/workout.service';
import { AuthService } from '../../services/auth.service';
import { 
  Client, Progress, Product, 
  DietPlan, DietMeal, DietMealProduct,
  WorkoutPlan, WorkoutDay, WorkoutExercise 
} from '../../models/types';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css'
})
export class ClientDetail implements OnInit, OnDestroy {
  @ViewChild('progressChart') progressChartCanvas!: ElementRef<HTMLCanvasElement>;
  protected readonly Math = Math;
  
  clientId = signal<number>(0);
  client = signal<Client | null>(null);
  activeTab = signal<string>('profile'); // 'profile', 'progress', 'diet', 'workout'
  
  // Progress state
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

  // Diet builder state
  dietPlans = signal<DietPlan[]>([]);
  selectedDietPlanId = signal<number | null>(null);
  dietPlan = signal<DietPlan | null>(null);
  availableProducts = signal<Product[]>([]);
  productSearchQuery = signal<string>('');
  
  // Custom Product modal
  isProductModalOpen = signal<boolean>(false);
  newProductName = '';
  newProductKcal = '';
  newProductProtein = '';
  newProductFat = '';
  newProductCarbs = '';

  // Workout builder state
  workoutPlans = signal<WorkoutPlan[]>([]);
  selectedWorkoutPlanId = signal<number | null>(null);
  workoutPlan = signal<WorkoutPlan | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private productService: ProductService,
    private dietService: DietService,
    private workoutService: WorkoutService,
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

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  loadClientData(id: number): void {
    // 1. Load client info
    this.clientService.getClient(id).subscribe({
      next: (data) => this.client.set(data),
      error: (err) => {
        console.error('Error loading client', err);
        this.router.navigate(['/']);
      }
    });

    // 2. Load progress history
    this.loadProgressHistory(id);

    // 3. Load diet plans
    this.loadDietPlan(id);

    // 4. Load workout plans
    this.loadWorkoutPlans(id);

    // 5. Load products
    this.loadProducts();
  }

  // --- TAB MANAGEMENT ---
  switchTab(tabName: string): void {
    this.activeTab.set(tabName);
    if (tabName === 'progress') {
      // Small timeout to allow canvas element to render in DOM
      setTimeout(() => this.renderChart(), 50);
    }
  }

  // --- PROGRESS TRACKING ---
  loadProgressHistory(id: number): void {
    this.clientService.getProgressHistory(id).subscribe({
      next: (data) => {
        this.progressList.set(data);
        if (this.activeTab() === 'progress') {
          this.renderChart();
        }
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
        // Reset form
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

  // --- DIET BUILDER ---
  loadDietPlan(clientId: number): void {
    this.dietService.getDietPlansForClient(clientId).subscribe({
      next: (data) => {
        this.dietPlans.set(data || []);
        
        if (data && data.length > 0) {
          const currentId = this.selectedDietPlanId();
          const exists = data.find(p => p.id === currentId);
          const activePlan = exists || data[0];
          
          this.selectedDietPlanId.set(activePlan.id || null);
          this.dietPlan.set(JSON.parse(JSON.stringify(activePlan))); // deep copy
        } else {
          // Initialize a blank/default plan locally
          this.createNewDietPlan();
        }
      },
      error: (err) => console.error('Error loading diet plans', err)
    });
  }

  selectDietPlan(val: any): void {
    const id = val === 'undefined' || val === undefined || val === null || val === "" ? undefined : parseInt(val, 10);
    this.selectedDietPlanId.set(id || null);
    const plan = this.dietPlans().find(p => p.id === id || (!p.id && id === undefined));
    if (plan) {
      this.dietPlan.set(JSON.parse(JSON.stringify(plan)));
    }
  }

  createNewDietPlan(): void {
    const newPlan: DietPlan = {
      name: 'Nowy Plan Diety',
      notes: 'Pamiętaj o odpowiednim nawodnieniu (minimum 3L wody dziennie).',
      startDate: '',
      endDate: '',
      meals: [
        { name: 'Śniadanie', orderNum: 0, mealProducts: [] },
        { name: 'Obiad', orderNum: 1, mealProducts: [] },
        { name: 'Drugie Śniadanie', orderNum: 2, mealProducts: [] },
        { name: 'Kolacja', orderNum: 3, mealProducts: [] }
      ]
    };

    const currentPlans = this.dietPlans();
    const unsavedExists = currentPlans.some(p => !p.id);
    if (!unsavedExists) {
      this.dietPlans.set([...currentPlans, newPlan]);
    }
    
    this.selectedDietPlanId.set(undefined as any);
    this.dietPlan.set(newPlan);
  }

  deleteActiveDietPlan(): void {
    const plan = this.dietPlan();
    if (!plan) return;

    if (plan.id) {
      if (confirm(`Czy na pewno chcesz trwale usunąć plan diety "${plan.name}"?`)) {
        this.dietService.deleteDietPlan(plan.id).subscribe({
          next: () => {
            alert('Plan dietetyczny został pomyślnie usunięty.');
            this.selectedDietPlanId.set(null);
            this.loadDietPlan(this.clientId());
          },
          error: (err) => {
            console.error('Error deleting diet plan', err);
            alert('Wystąpił błąd podczas usuwania planu diety.');
          }
        });
      }
    } else {
      // Local unsaved plan, just filter it out
      const updated = this.dietPlans().filter(p => p.id);
      this.dietPlans.set(updated);
      this.selectedDietPlanId.set(null);
      if (updated.length > 0) {
        this.selectDietPlan(updated[0].id);
      } else {
        this.createNewDietPlan();
      }
    }
  }

  loadProducts(): void {
    this.productService.getProducts(this.productSearchQuery()).subscribe({
      next: (data) => this.availableProducts.set(data),
      error: (err) => console.error('Error loading products', err)
    });
  }

  onProductSearch(): void {
    this.loadProducts();
  }

  addProductToMeal(product: Product, meal: DietMeal): void {
    const plan = this.dietPlan();
    if (!plan) return;

    const mealProduct: DietMealProduct = {
      product: product,
      amount: 100 // Default to 100g
    };

    meal.mealProducts.push(mealProduct);
    this.dietPlan.set({ ...plan });
  }

  removeProductFromMeal(meal: DietMeal, index: number): void {
    const plan = this.dietPlan();
    if (!plan) return;
    meal.mealProducts.splice(index, 1);
    this.dietPlan.set({ ...plan });
  }

  addMeal(): void {
    const plan = this.dietPlan();
    if (!plan) return;
    const mealName = prompt('Podaj nazwę nowego posiłku (np. Przekąska, Drugie śniadanie):');
    if (mealName && mealName.trim()) {
      plan.meals.push({
        name: mealName.trim(),
        orderNum: plan.meals.length,
        mealProducts: []
      });
      this.dietPlan.set({ ...plan });
    }
  }

  removeMeal(index: number): void {
    const plan = this.dietPlan();
    if (!plan) return;
    if (confirm(`Czy na pewno chcesz usunąć posiłek "${plan.meals[index].name}"?`)) {
      plan.meals.splice(index, 1);
      this.dietPlan.set({ ...plan });
    }
  }

  saveDiet(): void {
    const plan = this.dietPlan();
    if (!plan) return;

    this.dietService.saveDietPlan(this.clientId(), plan).subscribe({
      next: (savedPlan) => {
        alert('Plan dietetyczny został pomyślnie zapisany!');
        this.selectedDietPlanId.set(savedPlan.id || null);
        this.loadDietPlan(this.clientId());
      },
      error: (err) => {
        console.error('Error saving diet plan', err);
        alert('Wystąpił błąd podczas zapisywania diety.');
      }
    });
  }

  // Calculates total daily values dynamically using Angular computed values or methods
  getDailyTotals() {
    const plan = this.dietPlan();
    let kcal = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;

    if (plan && plan.meals) {
      for (const meal of plan.meals) {
        for (const mp of meal.mealProducts) {
          const ratio = (mp.amount || 0) / 100.0;
          kcal += (mp.product.calories || 0) * ratio;
          protein += (mp.product.protein || 0) * ratio;
          fat += (mp.product.fat || 0) * ratio;
          carbs += (mp.product.carbohydrates || 0) * ratio;
        }
      }
    }

    return {
      kcal: Math.round(kcal),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10
    };
  }

  getMealTotals(meal: DietMeal) {
    let kcal = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;

    for (const mp of meal.mealProducts) {
      const ratio = (mp.amount || 0) / 100.0;
      kcal += (mp.product.calories || 0) * ratio;
      protein += (mp.product.protein || 0) * ratio;
      fat += (mp.product.fat || 0) * ratio;
      carbs += (mp.product.carbohydrates || 0) * ratio;
    }

    return {
      kcal: Math.round(kcal),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10
    };
  }

  // Custom Product Creation Modal
  openProductModal(): void {
    this.newProductName = '';
    this.newProductKcal = '';
    this.newProductProtein = '';
    this.newProductFat = '';
    this.newProductCarbs = '';
    this.isProductModalOpen.set(true);
  }

  closeProductModal(): void {
    this.isProductModalOpen.set(false);
  }

  createCustomProduct(): void {
    if (!this.newProductName || !this.newProductKcal || !this.newProductProtein || !this.newProductFat || !this.newProductCarbs) {
      alert('Wszystkie pola są wymagane do utworzenia produktu!');
      return;
    }

    const prod: Product = {
      name: this.newProductName,
      calories: parseFloat(this.newProductKcal),
      protein: parseFloat(this.newProductProtein),
      fat: parseFloat(this.newProductFat),
      carbohydrates: parseFloat(this.newProductCarbs),
      unit: 'g'
    };

    this.productService.createProduct(prod).subscribe({
      next: () => {
        this.closeProductModal();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error creating product', err);
        alert('Błąd podczas dodawania produktu do bazy (produkt o tej nazwie może już istnieć).');
      }
    });
  }

  // --- WORKOUT BUILDER ---
  loadWorkoutPlans(clientId: number): void {
    this.workoutService.getWorkoutPlansForClient(clientId).subscribe({
      next: (data) => {
        this.workoutPlans.set(data || []);
        if (data && data.length > 0) {
          // Find currently active plan based on dates, or default to the first one
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
      next: (savedPlan) => {
        alert('Plan treningowy został pomyślnie zapisany!');
        this.loadWorkoutPlans(this.clientId());
      },
      error: (err) => {
        console.error('Error saving workout plan', err);
        alert('Wystąpił błąd podczas zapisywania treningu.');
      }
    });
  }

  updateClientProfile(): void {
    const c = this.client();
    if (!c || !c.id) return;
    this.clientService.updateClient(c.id, c).subscribe({
      next: (updated) => {
        this.client.set(updated);
        alert('Profil podopiecznego został pomyślnie zaktualizowany!');
      },
      error: (err) => console.error('Error updating profile', err)
    });
  }
}
