export type Role = "trainer" | "client";

export interface User {
  id: string;
  username: string;
  password: string; // demo only
  role: Role;
  fullName: string;
  email: string;
  avatarHue: number;
  trainerId?: string; // for clients
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

export interface MealRecipe {
  steps: string[];
  prepTimeMinutes?: number;
  note?: string;
  updatedAt?: string;
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  /** Optional preparation recipe attached to this meal by the trainer. */
  recipe?: MealRecipe;
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

// ─── Meal exchanges (Wymiany posiłków) ────────────────────────────
// Unifies three coaching flows around food:
//   - swap_request    — client asks to replace planned meal items with alternatives
//   - pre_approval    — client declares what they will eat today, trainer confirms upfront
//   - trainer_recipe  — trainer attaches a recipe/preparation guide to a meal in a plan
export type MealProposalKind = "swap_request" | "pre_approval" | "trainer_recipe";
export type MealProposalStatus = "pending" | "approved" | "rejected" | "counter";

export interface MealProposal {
  id: string;
  clientId: string;
  trainerId: string;
  dietPlanId: string;
  mealId: string;
  mealName: string;
  date: string;            // YYYY-MM-DD this proposal targets
  kind: MealProposalKind;
  // What client/trainer proposed instead (or the recipe ingredients)
  proposedItems: MealItem[];
  // Optional cooking steps for trainer_recipe; client may also fill for context
  recipeSteps?: string[];
  prepTimeMinutes?: number;
  note?: string;           // why client wants the swap / pre-approval context / recipe note
  status: MealProposalStatus;
  trainerComment?: string; // trainer's reply when responding
  // For counter-proposals from trainer
  counterItems?: MealItem[];
  createdAt: string;
  respondedAt?: string;
}

// ─── Meal photo proofs ────────────────────────────────────────────
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

// ─── Wearables ─────────────────────────────────────────────────────
export type WearableDevice = "apple_watch" | "samsung_health" | "garmin" | "whoop" | "oura" | "fitbit";

export interface WearableSnapshot {
  id: string;
  clientId: string;
  date: string;
  device: WearableDevice;
  restingHr: number;
  hrv: number;
  sleepHours: number;
  sleepScore: number; // 0-100
  steps: number;
  activeKcal: number;
  strain?: number; // 0-21 (Whoop scale)
  recovery?: number; // 0-100
  workoutMinutes?: number;
}

// ─── AI ────────────────────────────────────────────────────────────
export type AIInsightType =
  | "progress_trend"
  | "macro_imbalance"
  | "recovery_alert"
  | "sleep_alert"
  | "compliance_drop"
  | "milestone"
  | "suggestion";

export type AIInsightSeverity = "positive" | "info" | "warning" | "critical";

export interface AIInsight {
  id: string;
  scope: "trainer" | "client";
  subjectId: string; // clientId or trainerId
  type: AIInsightType;
  title: string;
  body: string;
  severity: AIInsightSeverity;
  generatedAt: string;
  read?: boolean;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
}

// ─── Billing / Subscription ───────────────────────────────────────
export type PlanTier = "starter" | "studio" | "agency";

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  priceMonthly: number; // PLN
  clientSlots: number;
  aiRequestsMonthly: number;
  photoAnalysesMonthly: number;
  wearableSeats: number;
  features: string[];
  badge?: string;
  /** One-line promise shown right under the plan name. Tells the story for this stage of business. */
  subtitle?: string;
  /** Tagline shown at the bottom of the pricing card: "Dla kogo jest ten plan". */
  forWhom?: string;
  /** Per-plan CTA label (instead of a generic "Wybierz plan"). */
  ctaLabel?: string;
}

export interface Subscription {
  trainerId: string;
  tier: PlanTier;
  renewsAt: string;
  aiUsedThisMonth: number;
  photoAnalysesThisMonth: number;
  extraSeats: number;
}
