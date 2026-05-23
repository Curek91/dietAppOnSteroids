import type { PlanConfig } from "@/lib/types";

export const PLANS: PlanConfig[] = [
  {
    tier: "starter",
    name: "Coach Starter",
    priceMonthly: 100,
    clientSlots: 5,
    aiRequestsMonthly: 200,
    photoAnalysesMonthly: 60,
    wearableSeats: 5,
    features: [
      "1 trener · 5 podopiecznych",
      "AI Coach Companion",
      "Analiza zdjęć posiłków (60/mc)",
      "Wearables: Apple Watch · Samsung · Garmin · Whoop · Oura",
      "Tygodniowe AI insights",
      "Plany diet AI"
    ]
  },
  {
    tier: "studio",
    name: "Coach Studio",
    priceMonthly: 249,
    clientSlots: 15,
    aiRequestsMonthly: 800,
    photoAnalysesMonthly: 250,
    wearableSeats: 15,
    badge: "Najpopularniejszy",
    features: [
      "1 trener · 15 podopiecznych",
      "AI Coach Pro (8x więcej zapytań)",
      "Analiza zdjęć (250/mc)",
      "AI form-check (video)",
      "Custom branding aplikacji",
      "Priorytetowe wsparcie"
    ]
  },
  {
    tier: "agency",
    name: "Coach Agency",
    priceMonthly: 599,
    clientSlots: 50,
    aiRequestsMonthly: 3000,
    photoAnalysesMonthly: 1000,
    wearableSeats: 50,
    features: [
      "Do 50 podopiecznych",
      "AI Pro+ (3000 zapytań)",
      "White-label · własna domena",
      "API + webhooks",
      "Multi-trainer seats",
      "Dedykowany Account Manager"
    ]
  }
];

export const ADDON_CLIENT_PRICE = 20; // PLN per extra client beyond plan
export const ADDON_AI_PACK_PRICE = 50; // PLN per +200 AI requests

export const getPlan = (tier: string): PlanConfig =>
  PLANS.find((p) => p.tier === tier) ?? PLANS[0];

export interface UnitEconomics {
  revenue: number;
  aiCost: number;
  storageCost: number;
  hostingCost: number;
  paymentFees: number;
  totalCogs: number;
  cogsPct: number;
  grossMargin: number;
  marginPct: number;
}

// Per-trainer per-month unit economics
export function unitEconomics(plan: PlanConfig, extraClients = 0): UnitEconomics {
  const revenue = plan.priceMonthly + extraClients * ADDON_CLIENT_PRICE;

  // OpenAI gpt-4o-mini ≈ 0.05 PLN per request (avg input+output)
  const aiCost = plan.aiRequestsMonthly * 0.04 + plan.photoAnalysesMonthly * 0.12;

  // Storage: 50 MB per client photos × 0.01 PLN per MB
  const totalClients = plan.clientSlots + extraClients;
  const storageCost = totalClients * 0.5;

  // Hosting per active trainer
  const hostingCost = 2.5;

  // Stripe-like fees (~2.9% + 1 PLN)
  const paymentFees = revenue * 0.029 + 1;

  const totalCogs = aiCost + storageCost + hostingCost + paymentFees;
  const grossMargin = revenue - totalCogs;

  return {
    revenue,
    aiCost,
    storageCost,
    hostingCost,
    paymentFees,
    totalCogs,
    cogsPct: (totalCogs / revenue) * 100,
    grossMargin,
    marginPct: (grossMargin / revenue) * 100
  };
}
