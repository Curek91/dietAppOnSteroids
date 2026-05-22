import { Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { DietService } from '../../../services/diet.service';
import { Product, DietPlan, DietMeal, DietMealProduct } from '../../../models/types';

@Component({
  selector: 'app-client-diet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-diet.html',
  styleUrls: ['../client-detail.css']
})
export class ClientDietComponent implements OnInit {
  clientId = input.required<number>();

  protected readonly Math = Math;

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

  constructor(
    private dietService: DietService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.clientId();
    this.loadDietPlan(id);
    this.loadProducts();
  }

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
      amount: 100
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
}
