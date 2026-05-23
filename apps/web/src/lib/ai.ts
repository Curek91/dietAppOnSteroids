import type {
  AIInsight,
  ClientProfile,
  DietPlan,
  Meal,
  Product,
  ProgressEntry,
  WearableSnapshot
} from "@/lib/types";

// Latency in ms — mock makes it feel real
export const aiDelay = (min = 700, max = 1800) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

// ─── AI Coach chat reply ───────────────────────────────────────────
interface ChatContext {
  client?: ClientProfile | null;
  progress?: ProgressEntry[];
  wearables?: WearableSnapshot[];
  diet?: DietPlan | null;
  isTrainer: boolean;
  userName: string;
}

export async function aiChatReply(prompt: string, ctx: ChatContext): Promise<string> {
  await aiDelay();
  const p = prompt.toLowerCase();
  const lastW = ctx.wearables?.[ctx.wearables.length - 1];
  const firstP = ctx.progress?.[0];
  const lastP = ctx.progress?.[ctx.progress.length - 1];
  const weightChange =
    firstP?.weight && lastP?.weight ? (lastP.weight - firstP.weight).toFixed(1) : null;

  if (p.includes("dieta") || p.includes("kalorie") || p.includes("makro")) {
    if (ctx.diet) {
      return `Aktualny plan **${ctx.diet.name}** ma cel ${ctx.diet.targetKcal ?? "—"} kcal. ${
        ctx.diet.meals.length
      } posiłków zdefiniowanych. Sugestia: pilnuj 1.6–2.0 g białka/kg, rozłóż węgle wokół treningu, tłuszcze poza oknem treningowym.`;
    }
    return "Nie masz aktywnego planu. Powiedz mi swój cel (redukcja / masa / rekompozycja) i wagę — wygeneruję pierwszą wersję.";
  }
  if (p.includes("sen") || p.includes("regen")) {
    if (lastW) {
      const ok = lastW.sleepScore > 75;
      return `Sen ostatniej nocy: **${lastW.sleepHours} h** (score ${lastW.sleepScore}). ${
        ok
          ? "Bardzo dobrze — trzymaj rytm i unikaj kofeiny po 14:00."
          : "Poniżej optymalnego. Spróbuj ciemnego pokoju, 18°C i magnezu 30 min przed snem."
      }`;
    }
    return "Brak świeżych danych z urządzenia. Zsynchronizuj zegarek, aby zobaczyć rekomendacje.";
  }
  if (p.includes("trening") || p.includes("workout") || p.includes("siłow")) {
    if (lastW?.recovery != null && lastW.recovery < 45)
      return `⚠ Recovery dziś: **${lastW.recovery}%** — sugeruję sesję techniczną zamiast ciężkiej, lub deload o 20%. HRV ${lastW.hrv} ms.`;
    return "Wygląda na dobry dzień na trening — RHR i HRV w normie. Pamiętaj o rozgrzewce i kontroli tempa.";
  }
  if (p.includes("waga") || p.includes("postęp") || p.includes("postepy")) {
    if (weightChange) {
      const dir = Number(weightChange) < 0 ? "spadek" : "wzrost";
      return `Zmiana wagi od startu: **${weightChange} kg** (${dir}). ${
        ctx.client?.goal ?? ""
      } — kierunek wygląda dobrze. Pamiętaj, że tempo 0.5–1% mc/tydz jest optymalne dla redukcji.`;
    }
    return "Dodaj kilka pomiarów, abym mógł pokazać ci trend.";
  }
  if (p.includes("zdjęc") || p.includes("foto") || p.includes("posiłek")) {
    return "Zrób zdjęcie talerza — przeanalizuję makro w ~5 sekund. AI rozpozna składniki i oszacuje kcal/białko/tłuszcz/węgle z dokładnością ~90%.";
  }
  if (p.includes("hej") || p.includes("cześć") || p.includes("witaj") || p.includes("hi") || p.includes("hello")) {
    return `Cześć ${ctx.userName.split(" ")[0]}! Jestem twoim AI Coach. Mogę pomóc z dietą, treningiem, regeneracją lub analizą zdjęć posiłków. O co pytasz?`;
  }
  // Default helpful response
  const tips = ctx.isTrainer
    ? [
        "Mogę wygenerować plan diety dla wybranego klienta",
        "Mogę zrobić tygodniowe podsumowanie postępów wszystkich klientów",
        "Mogę zaproponować zmianę treningu na podstawie recovery z zegarka",
        "Mogę przeanalizować zdjęcie talerza i zwrócić makro"
      ]
    : [
        "Pokażę ci makro twojego dzisiejszego planu",
        "Przeanalizuję zdjęcie posiłku",
        "Powiem czy dziś warto trenować mocno (na podstawie zegarka)",
        "Wytłumaczę tygodniowy trend wagi"
      ];
  return `Mogę pomóc z wieloma rzeczami:\n• ${tips.join("\n• ")}`;
}

// ─── AI Diet Generator ─────────────────────────────────────────────
interface DietGenParams {
  clientId: string;
  goal: "cut" | "maintain" | "bulk";
  targetKcal: number;
  proteinPerKg: number;
  weightKg: number;
  restrictions: string[]; // e.g. ["vege", "nuts"]
  mealsCount: number;
}

export async function aiGenerateDiet(
  params: DietGenParams,
  products: Product[]
): Promise<DietPlan> {
  await aiDelay(1200, 2400);

  const veg = params.restrictions.includes("vege");
  const noNuts = params.restrictions.includes("nuts");

  const breakfast = veg
    ? ["prod-5", "prod-7", "prod-6", "prod-8"]
    : ["prod-5", "prod-7", "prod-6", "prod-8"];
  const lunch = veg ? ["prod-15", "prod-2", "prod-3"] : ["prod-1", "prod-2", "prod-3"];
  const snack = noNuts ? ["prod-8", "prod-6"] : ["prod-10", "prod-6"];
  const dinner = veg ? ["prod-15", "prod-11", "prod-9"] : ["prod-4", "prod-11", "prod-9"];

  const pickGrams = (kcalShare: number, items: string[]): { productId: string; grams: number }[] => {
    const target = params.targetKcal * kcalShare;
    return items.map((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return { productId: id, grams: 0 };
      const share = 1 / items.length;
      const grams = Math.round((target * share) / Math.max(p.kcal, 1) * 100);
      return { productId: id, grams: Math.max(40, Math.min(grams, 300)) };
    }).filter((i) => i.grams > 0);
  };

  const meals: Meal[] = [
    { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Śniadanie", items: pickGrams(0.28, breakfast) },
    { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Obiad", items: pickGrams(0.32, lunch) },
    { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Przekąska", items: pickGrams(0.15, snack) },
    { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Kolacja", items: pickGrams(0.25, dinner) }
  ].slice(0, params.mealsCount);

  const goalLabel = { cut: "Redukcja", maintain: "Utrzymanie", bulk: "Masa" }[params.goal];

  return {
    id: `d-${Math.random().toString(36).slice(2, 8)}`,
    clientId: params.clientId,
    name: `AI ${goalLabel} ${params.targetKcal}kcal`,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    notes: `Wygenerowane przez AI · ${params.proteinPerKg} g białka/kg · ${params.restrictions.join(", ") || "brak restrykcji"}`,
    meals,
    targetKcal: params.targetKcal,
    aiGenerated: true
  };
}

// ─── AI Photo Meal Analysis ────────────────────────────────────────
const POSSIBLE_DETECTED = [
  ["pierś z kurczaka", "ryż", "brokuły"],
  ["jajka", "awokado", "chleb pełnoziarnisty", "pomidor"],
  ["łosoś", "bataty", "szpinak", "oliwa"],
  ["wołowina", "ryż jaśminowy", "fasolka szparagowa"],
  ["tofu", "quinoa", "warzywa pieczone"],
  ["owsianka", "banan", "twaróg", "miód"],
  ["makaron pełnoziarnisty", "mielona wołowina", "sos pomidorowy"]
];

export async function aiAnalyzeMealPhoto(): Promise<{
  estimatedKcal: number;
  detectedItems: string[];
  macros: { kcal: number; protein: number; fat: number; carbs: number };
  confidence: number;
}> {
  await aiDelay(900, 1800);
  const detected = POSSIBLE_DETECTED[Math.floor(Math.random() * POSSIBLE_DETECTED.length)];
  const kcal = 380 + Math.round(Math.random() * 600);
  const protein = Math.round(kcal * (0.18 + Math.random() * 0.18) / 4);
  const fat = Math.round(kcal * (0.18 + Math.random() * 0.18) / 9);
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  return {
    estimatedKcal: kcal,
    detectedItems: detected,
    macros: { kcal, protein, fat, carbs },
    confidence: 0.82 + Math.random() * 0.14
  };
}

// ─── AI Weekly Insight Generator ───────────────────────────────────
export async function aiGenerateWeeklyInsight(
  client: ClientProfile,
  progress: ProgressEntry[],
  wearables: WearableSnapshot[]
): Promise<AIInsight> {
  await aiDelay();
  const last = wearables[wearables.length - 1];
  const week = wearables.slice(-7);
  const avgRec = week.length ? Math.round(week.reduce((a, b) => a + (b.recovery ?? 0), 0) / week.length) : 0;
  const avgSleep = week.length ? (week.reduce((a, b) => a + b.sleepHours, 0) / week.length).toFixed(1) : "—";
  const firstWeight = progress[0]?.weight;
  const lastWeight = progress[progress.length - 1]?.weight;
  const delta = firstWeight && lastWeight ? (lastWeight - firstWeight).toFixed(1) : null;

  const severity: AIInsight["severity"] =
    avgRec < 40 ? "warning" : avgRec > 70 ? "positive" : "info";

  const body = [
    delta ? `Zmiana wagi od startu: ${delta} kg.` : null,
    last ? `Recovery dziś: ${last.recovery}%, HRV ${last.hrv} ms, RHR ${last.restingHr}.` : null,
    `Średnia snu w tygodniu: ${avgSleep} h. Średnie recovery: ${avgRec}%.`,
    avgRec < 40
      ? "Rekomendacja: lżejszy mikrocykl, dodatkowy dzień regeneracji."
      : avgRec > 70
      ? "Świetna baza — można pchnąć intensywność o 5-10%."
      : "Trzymaj kurs, brak interwencji wymaganej."
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: `ai-i-${Math.random().toString(36).slice(2, 8)}`,
    scope: "trainer",
    subjectId: client.id,
    type: "progress_trend",
    title: `Tygodniówka: ${client.firstName}`,
    body,
    severity,
    generatedAt: new Date().toISOString()
  };
}
