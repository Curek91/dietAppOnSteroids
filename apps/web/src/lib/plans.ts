import type { PlanConfig } from "@/lib/types";

export const PLANS: PlanConfig[] = [
  {
    tier: "starter",
    name: "Trener",
    subtitle: "Wszystko, czego potrzebujesz do prowadzenia klientów online.",
    forWhom: "Idealny dla trenerów pracujących 1:1 i małych coachingów online.",
    ctaLabel: "Zacznij prowadzić klientów profesjonalnie",
    priceMonthly: 99,
    clientSlots: 50,
    aiRequestsMonthly: 500,
    photoAnalysesMonthly: 200,
    wearableSeats: 50,
    features: [
      "Plany treningowe i diety bez limitu",
      "Check-iny, zdjęcia progresu i pomiary",
      "Chat z klientami + przypomnienia",
      "Onboarding klienta + import z Excela",
      "AI generator planów",
      "Wszystko w jednej aplikacji",
      "Faktura VAT · anuluj kiedy chcesz"
    ]
  },
  {
    tier: "studio",
    name: "Studio",
    subtitle: "Skaluj coaching bez dodatkowego chaosu.",
    forWhom:
      "Dla trenerów, którzy chcą rosnąć bez siedzenia całego dnia w administracji.",
    ctaLabel: "Skaluj swoje studio online",
    priceMonthly: 249,
    clientSlots: 9999,
    aiRequestsMonthly: 3000,
    photoAnalysesMonthly: 1500,
    wearableSeats: 9999,
    badge: "Najczęściej wybierany przez trenerów 20+ klientów",
    features: [
      "Wszystko z planu Trener",
      "AI assistant do check-inów i follow-upów",
      "Automatyczne przypomnienia i workflow",
      "Własna marka: logo, kolory, nazwa aplikacji",
      "AI analiza zdjęć posiłków",
      "Priorytetowe wsparcie"
    ]
  },
  {
    tier: "agency",
    name: "Agencja",
    subtitle: "Dla zespołów trenerów i marek fitness.",
    forWhom: "Zbuduj własny system do prowadzenia klientów pod swoją marką.",
    ctaLabel: "Uruchom własną platformę fitness",
    priceMonthly: 399,
    clientSlots: 9999,
    aiRequestsMonthly: 10000,
    photoAnalysesMonthly: 5000,
    wearableSeats: 9999,
    features: [
      "Wszystko z planu Studio",
      "Konta dla całego zespołu trenerów",
      "White-label + własna domena",
      "Płatności klientów (Stripe Connect)",
      "Raporty i analityka biznesowa",
      "API + webhooki",
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
