"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedAIInsights,
  seedClients,
  seedDietPlans,
  seedMealPhotos,
  seedMealProposals,
  seedProducts,
  seedProgress,
  seedSubscriptions,
  seedUsers,
  seedWearables,
  seedWorkoutPlans
} from "@/data/seed";
import { getPlan } from "@/lib/plans";
import type {
  AIInsight,
  AIMessage,
  ClientProfile,
  DietPlan,
  MealItem,
  MealPhoto,
  MealPhotoStatus,
  MealProposal,
  MealProposalKind,
  MealProposalStatus,
  MealRecipe,
  PlanTier,
  ProgressEntry,
  Product,
  Subscription,
  User,
  WearableSnapshot,
  WorkoutPlan
} from "@/lib/types";

interface AppState {
  currentUserId: string | null;
  users: User[];
  clients: ClientProfile[];
  progress: ProgressEntry[];
  products: Product[];
  dietPlans: DietPlan[];
  workoutPlans: WorkoutPlan[];
  mealPhotos: MealPhoto[];
  mealProposals: MealProposal[];
  wearables: WearableSnapshot[];
  aiInsights: AIInsight[];
  aiChat: AIMessage[];
  subscriptions: Subscription[];

  login: (u: string, p: string) => User | null;
  logout: () => void;
  currentUser: () => User | null;

  addClient: (c: Omit<ClientProfile, "id" | "startedAt">) => ClientProfile | null;
  canAddClient: () => { ok: boolean; reason?: string; current: number; limit: number };
  updateClient: (id: string, patch: Partial<ClientProfile>) => void;
  removeClient: (id: string) => void;

  addProgress: (entry: Omit<ProgressEntry, "id">) => void;
  removeProgress: (id: string) => void;

  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;

  upsertDietPlan: (plan: DietPlan) => void;
  removeDietPlan: (id: string) => void;
  addMeal: (planId: string, name: string) => void;
  addMealItem: (planId: string, mealId: string, productId: string, grams: number) => void;
  updateMealItem: (planId: string, mealId: string, productId: string, grams: number) => void;
  removeMealItem: (planId: string, mealId: string, productId: string) => void;
  setMealRecipe: (planId: string, mealId: string, recipe: MealRecipe | undefined) => void;

  upsertWorkoutPlan: (plan: WorkoutPlan) => void;
  removeWorkoutPlan: (id: string) => void;
  addWorkoutDay: (planId: string, name: string) => void;
  addExercise: (planId: string, dayId: string) => void;
  updateExercise: (
    planId: string,
    dayId: string,
    exerciseId: string,
    patch: Partial<{ name: string; sets: number; reps: string; weight: string; notes: string }>
  ) => void;
  removeExercise: (planId: string, dayId: string, exerciseId: string) => void;

  // photos
  addMealPhoto: (photo: Omit<MealPhoto, "id" | "uploadedAt" | "status">) => MealPhoto;
  setMealPhotoStatus: (id: string, status: MealPhotoStatus, comment?: string) => void;
  removeMealPhoto: (id: string) => void;

  // meal proposals (Wymiany)
  proposeMealChange: (
    input: Omit<MealProposal, "id" | "createdAt" | "status" | "respondedAt" | "trainerComment" | "counterItems">
  ) => MealProposal;
  respondToProposal: (
    id: string,
    status: MealProposalStatus,
    payload?: { comment?: string; counterItems?: MealItem[] }
  ) => void;
  addTrainerRecipe: (
    input: Omit<MealProposal, "id" | "createdAt" | "status" | "respondedAt" | "trainerComment" | "counterItems" | "kind">
  ) => MealProposal;

  // wearables
  syncWearable: (clientId: string) => void;

  // AI
  pushAIInsight: (i: Omit<AIInsight, "id" | "generatedAt">) => void;
  markInsightRead: (id: string) => void;
  pushChat: (msg: Omit<AIMessage, "id" | "ts">) => void;
  clearChat: () => void;
  trackAIUsage: (trainerId: string, kind: "request" | "photo") => void;

  // subscription
  changePlan: (trainerId: string, tier: PlanTier) => void;
}

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      users: seedUsers,
      clients: seedClients,
      progress: seedProgress,
      products: seedProducts,
      dietPlans: seedDietPlans,
      workoutPlans: seedWorkoutPlans,
      mealPhotos: seedMealPhotos,
      mealProposals: seedMealProposals,
      wearables: seedWearables,
      aiInsights: seedAIInsights,
      aiChat: [],
      subscriptions: seedSubscriptions,

      currentUser: () => {
        const id = get().currentUserId;
        if (!id) return null;
        return get().users.find((u) => u.id === id) ?? null;
      },

      login: (username, password) => {
        const u = get().users.find(
          (x) => x.username.toLowerCase() === username.toLowerCase() && x.password === password
        );
        if (u) {
          set({ currentUserId: u.id });
          return u;
        }
        return null;
      },

      logout: () => set({ currentUserId: null }),

      canAddClient: () => {
        const me = get().currentUser();
        if (!me || me.role !== "trainer") return { ok: false, current: 0, limit: 0, reason: "Tylko trener może dodawać klientów." };
        const sub = get().subscriptions.find((s) => s.trainerId === me.id);
        const plan = getPlan(sub?.tier ?? "starter");
        const current = get().clients.filter((c) => c.trainerId === me.id).length;
        const limit = plan.clientSlots + (sub?.extraSeats ?? 0);
        if (current >= limit)
          return { ok: false, current, limit, reason: "Limit slotów wyczerpany — upgrade planu." };
        return { ok: true, current, limit };
      },

      addClient: (c) => {
        const check = get().canAddClient();
        if (!check.ok) return null;
        const newClient: ClientProfile = {
          ...c,
          id: newId("c"),
          startedAt: new Date().toISOString().slice(0, 10)
        };
        set({ clients: [...get().clients, newClient] });
        return newClient;
      },
      updateClient: (id, patch) =>
        set({ clients: get().clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }),
      removeClient: (id) =>
        set({
          clients: get().clients.filter((c) => c.id !== id),
          progress: get().progress.filter((p) => p.clientId !== id),
          dietPlans: get().dietPlans.filter((d) => d.clientId !== id),
          workoutPlans: get().workoutPlans.filter((w) => w.clientId !== id),
          mealPhotos: get().mealPhotos.filter((m) => m.clientId !== id),
          wearables: get().wearables.filter((w) => w.clientId !== id)
        }),

      addProgress: (entry) =>
        set({ progress: [...get().progress, { ...entry, id: newId("p") }] }),
      removeProgress: (id) => set({ progress: get().progress.filter((p) => p.id !== id) }),

      addProduct: (p) => {
        const np: Product = { ...p, id: newId("prod") };
        set({ products: [...get().products, np] });
        return np;
      },
      updateProduct: (id, patch) =>
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),

      upsertDietPlan: (plan) => {
        const existing = get().dietPlans.find((d) => d.id === plan.id);
        if (existing) {
          set({ dietPlans: get().dietPlans.map((d) => (d.id === plan.id ? plan : d)) });
        } else {
          set({ dietPlans: [...get().dietPlans, plan] });
        }
      },
      removeDietPlan: (id) => set({ dietPlans: get().dietPlans.filter((d) => d.id !== id) }),
      addMeal: (planId, name) =>
        set({
          dietPlans: get().dietPlans.map((d) =>
            d.id === planId
              ? { ...d, meals: [...d.meals, { id: newId("m"), name, items: [] }] }
              : d
          )
        }),
      addMealItem: (planId, mealId, productId, grams) =>
        set({
          dietPlans: get().dietPlans.map((d) =>
            d.id !== planId
              ? d
              : {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id !== mealId
                      ? m
                      : m.items.some((i) => i.productId === productId)
                      ? m
                      : { ...m, items: [...m.items, { productId, grams }] }
                  )
                }
          )
        }),
      updateMealItem: (planId, mealId, productId, grams) =>
        set({
          dietPlans: get().dietPlans.map((d) =>
            d.id !== planId
              ? d
              : {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id !== mealId
                      ? m
                      : {
                          ...m,
                          items: m.items.map((i) =>
                            i.productId === productId ? { ...i, grams } : i
                          )
                        }
                  )
                }
          )
        }),
      removeMealItem: (planId, mealId, productId) =>
        set({
          dietPlans: get().dietPlans.map((d) =>
            d.id !== planId
              ? d
              : {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id !== mealId
                      ? m
                      : { ...m, items: m.items.filter((i) => i.productId !== productId) }
                  )
                }
          )
        }),
      setMealRecipe: (planId, mealId, recipe) =>
        set({
          dietPlans: get().dietPlans.map((d) =>
            d.id !== planId
              ? d
              : {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id !== mealId
                      ? m
                      : {
                          ...m,
                          recipe: recipe
                            ? { ...recipe, updatedAt: new Date().toISOString() }
                            : undefined
                        }
                  )
                }
          )
        }),

      upsertWorkoutPlan: (plan) => {
        const existing = get().workoutPlans.find((w) => w.id === plan.id);
        if (existing) {
          set({ workoutPlans: get().workoutPlans.map((w) => (w.id === plan.id ? plan : w)) });
        } else {
          set({ workoutPlans: [...get().workoutPlans, plan] });
        }
      },
      removeWorkoutPlan: (id) =>
        set({ workoutPlans: get().workoutPlans.filter((w) => w.id !== id) }),
      addWorkoutDay: (planId, name) =>
        set({
          workoutPlans: get().workoutPlans.map((p) =>
            p.id !== planId
              ? p
              : { ...p, days: [...p.days, { id: newId("wd"), name, exercises: [] }] }
          )
        }),
      addExercise: (planId, dayId) =>
        set({
          workoutPlans: get().workoutPlans.map((p) =>
            p.id !== planId
              ? p
              : {
                  ...p,
                  days: p.days.map((d) =>
                    d.id !== dayId
                      ? d
                      : {
                          ...d,
                          exercises: [
                            ...d.exercises,
                            {
                              id: newId("ex"),
                              name: "Nowe ćwiczenie",
                              sets: 3,
                              reps: "10",
                              weight: "—"
                            }
                          ]
                        }
                  )
                }
          )
        }),
      updateExercise: (planId, dayId, exerciseId, patch) =>
        set({
          workoutPlans: get().workoutPlans.map((p) =>
            p.id !== planId
              ? p
              : {
                  ...p,
                  days: p.days.map((d) =>
                    d.id !== dayId
                      ? d
                      : {
                          ...d,
                          exercises: d.exercises.map((e) =>
                            e.id !== exerciseId ? e : { ...e, ...patch }
                          )
                        }
                  )
                }
          )
        }),
      removeExercise: (planId, dayId, exerciseId) =>
        set({
          workoutPlans: get().workoutPlans.map((p) =>
            p.id !== planId
              ? p
              : {
                  ...p,
                  days: p.days.map((d) =>
                    d.id !== dayId
                      ? d
                      : { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }
                  )
                }
          )
        }),

      addMealPhoto: (photo) => {
        const np: MealPhoto = {
          ...photo,
          id: newId("mp"),
          uploadedAt: new Date().toISOString(),
          status: "pending"
        };
        set({ mealPhotos: [np, ...get().mealPhotos] });
        return np;
      },
      setMealPhotoStatus: (id, status, comment) =>
        set({
          mealPhotos: get().mealPhotos.map((m) =>
            m.id === id ? { ...m, status, trainerComment: comment ?? m.trainerComment } : m
          )
        }),
      removeMealPhoto: (id) => set({ mealPhotos: get().mealPhotos.filter((m) => m.id !== id) }),

      proposeMealChange: (input) => {
        const proposal: MealProposal = {
          ...input,
          id: newId("mprop"),
          status: "pending",
          createdAt: new Date().toISOString()
        };
        set({ mealProposals: [proposal, ...get().mealProposals] });
        return proposal;
      },
      respondToProposal: (id, status, payload) =>
        set({
          mealProposals: get().mealProposals.map((p) =>
            p.id !== id
              ? p
              : {
                  ...p,
                  status,
                  trainerComment: payload?.comment ?? p.trainerComment,
                  counterItems: payload?.counterItems ?? p.counterItems,
                  respondedAt: new Date().toISOString()
                }
          )
        }),
      addTrainerRecipe: (input) => {
        const recipe: MealProposal = {
          ...input,
          kind: "trainer_recipe",
          id: newId("mprop"),
          status: "approved",
          createdAt: new Date().toISOString(),
          respondedAt: new Date().toISOString()
        };
        set({ mealProposals: [recipe, ...get().mealProposals] });
        return recipe;
      },

      syncWearable: (clientId) => {
        const client = get().clients.find((c) => c.id === clientId);
        if (!client) return;
        const last = [...get().wearables].filter((w) => w.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date))[0];
        const today = new Date().toISOString().slice(0, 10);
        if (last?.date === today) return;
        const snap: WearableSnapshot = {
          id: newId("wear"),
          clientId,
          date: today,
          device: client.wearableDevice ?? "apple_watch",
          restingHr: 56 + Math.round(Math.random() * 10),
          hrv: 50 + Math.round(Math.random() * 25),
          sleepHours: Math.round((6.5 + Math.random() * 1.5) * 10) / 10,
          sleepScore: 65 + Math.round(Math.random() * 30),
          steps: 6000 + Math.round(Math.random() * 6000),
          activeKcal: 350 + Math.round(Math.random() * 400),
          strain: Math.round((8 + Math.random() * 10) * 10) / 10,
          recovery: 40 + Math.round(Math.random() * 55),
          workoutMinutes: 30 + Math.round(Math.random() * 60)
        };
        set({ wearables: [...get().wearables, snap] });
      },

      pushAIInsight: (i) =>
        set({
          aiInsights: [
            ...get().aiInsights,
            { ...i, id: newId("ai-i"), generatedAt: new Date().toISOString() }
          ]
        }),
      markInsightRead: (id) =>
        set({ aiInsights: get().aiInsights.map((i) => (i.id === id ? { ...i, read: true } : i)) }),

      pushChat: (msg) =>
        set({
          aiChat: [...get().aiChat, { ...msg, id: newId("msg"), ts: new Date().toISOString() }]
        }),
      clearChat: () => set({ aiChat: [] }),

      trackAIUsage: (trainerId, kind) =>
        set({
          subscriptions: get().subscriptions.map((s) =>
            s.trainerId !== trainerId
              ? s
              : {
                  ...s,
                  aiUsedThisMonth: kind === "request" ? s.aiUsedThisMonth + 1 : s.aiUsedThisMonth,
                  photoAnalysesThisMonth:
                    kind === "photo" ? s.photoAnalysesThisMonth + 1 : s.photoAnalysesThisMonth
                }
          )
        }),

      changePlan: (trainerId, tier) =>
        set({
          subscriptions: get().subscriptions.map((s) =>
            s.trainerId === trainerId ? { ...s, tier } : s
          )
        })
    }),
    {
      name: "dietapp-store-v4",
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        users: state.users,
        clients: state.clients,
        progress: state.progress,
        products: state.products,
        dietPlans: state.dietPlans,
        workoutPlans: state.workoutPlans,
        mealPhotos: state.mealPhotos,
        mealProposals: state.mealProposals,
        wearables: state.wearables,
        aiInsights: state.aiInsights,
        aiChat: state.aiChat,
        subscriptions: state.subscriptions
      })
    }
  )
);

export const newClientId = () => newId("c");
