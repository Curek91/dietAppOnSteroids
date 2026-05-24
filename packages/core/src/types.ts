// Shared domain types — single source of truth for web and mobile.
// The web app re-exports these from @/lib/types to keep the existing import paths working.

export type Role = "trainer" | "client";

export interface User {
  id: string;
  username: string;
  password: string; // demo only
  role: Role;
  fullName: string;
  email: string;
  avatarHue: number;
  trainerId?: string;
}

export interface ClientProfile {
  id: string;
  trainerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  notes: string;
  goal: string;
  startedAt: string;
  avatarHue: number;
  wearableDevice?: WearableDevice;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
}

export interface Product {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  photoUrl?: string;
  emoji?: string;
}

export interface MealItem {
  productId: string;
  grams: number;
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
}

export interface DietPlan {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  meals: Meal[];
  targetKcal?: number;
  aiGenerated?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  days: WorkoutDay[];
}

export interface Macros {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export type MealPhotoStatus = "pending" | "approved" | "flagged";

export interface MealPhoto {
  id: string;
  clientId: string;
  dietPlanId?: string;
  mealName: string;
  dataUrl: string;
  note?: string;
  uploadedAt: string;
  status: MealPhotoStatus;
  trainerComment?: string;
  aiAnalysis?: {
    estimatedKcal: number;
    detectedItems: string[];
    macros: Macros;
    confidence: number;
  };
}

export type WearableDevice =
  | "apple_watch"
  | "samsung_health"
  | "garmin"
  | "whoop"
  | "oura"
  | "fitbit";

export interface WearableSnapshot {
  id: string;
  clientId: string;
  date: string;
  device: WearableDevice;
  restingHr: number;
  hrv: number;
  sleepHours: number;
  sleepScore: number;
  steps: number;
  activeKcal: number;
  strain?: number;
  recovery?: number;
  workoutMinutes?: number;
}

export type PlanTier = "starter" | "studio" | "agency";

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  clientSlots: number;
  aiRequestsMonthly: number;
  photoAnalysesMonthly: number;
  wearableSeats: number;
  features: string[];
  badge?: string;
}

export interface Subscription {
  trainerId: string;
  tier: PlanTier;
  renewsAt: string;
  aiUsedThisMonth: number;
  photoAnalysesThisMonth: number;
  extraSeats: number;
}
