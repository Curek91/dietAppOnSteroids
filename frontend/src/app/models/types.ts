export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string; // YYYY-MM-DD
  notes?: string;
  createdDate?: string;
  lastReportDate?: string; // YYYY-MM-DD
}

export interface Progress {
  id?: number;
  dateRecorded: string; // YYYY-MM-DD
  weight?: number;
  height?: number;
  waistCircumference?: number;
  bicepsCircumference?: number;
  chestCircumference?: number;
  thighCircumference?: number;
}

export interface Product {
  id?: number;
  name: string;
  calories: number; // kcal per 100g
  protein: number; // g per 100g
  fat: number; // g per 100g
  carbohydrates: number; // g per 100g
  unit?: string; // "g" or "szt"
}

export interface DietMealProduct {
  id?: number;
  product: Product;
  amount: number; // in grams or units
}

export interface DietMeal {
  id?: number;
  name: string;
  orderNum?: number;
  mealProducts: DietMealProduct[];
}

export interface DietPlan {
  id?: number;
  name: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  notes?: string;
  meals: DietMeal[];
}

export interface WorkoutExercise {
  id?: number;
  exerciseName: string;
  sets: number;
  reps: string;
  weight: string;
  notes?: string;
  orderNum?: number;
}

export interface WorkoutDay {
  id?: number;
  dayName: string;
  orderNum?: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  notes?: string;
  days: WorkoutDay[];
}
