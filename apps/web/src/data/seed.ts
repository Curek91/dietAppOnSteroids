import type {
  AIInsight,
  CalendarEvent,
  CalendarEventKind,
  CalendarEventStatus,
  ClientProfile,
  DietPlan,
  MealPhoto,
  MealProposal,
  ProgressEntry,
  ProgressPhoto,
  Product,
  Subscription,
  User,
  WearableSnapshot,
  WorkoutPlan
} from "@/lib/types";

export const seedUsers: User[] = [
  {
    id: "u-trainer-1",
    username: "trener",
    password: "trener",
    role: "trainer",
    fullName: "Alex Morgan",
    email: "alex@dietapp.io",
    avatarHue: 24
  },
  {
    id: "u-trainer-2",
    username: "zdzisiek",
    password: "123456",
    role: "trainer",
    fullName: "Zdzisław Biceps",
    email: "zdzisiek@dietapp.io",
    avatarHue: 14
  },
  {
    id: "u-client-1",
    username: "klient",
    password: "klient",
    role: "client",
    fullName: "Marta Nowak",
    email: "marta@dietapp.io",
    avatarHue: 320,
    trainerId: "u-trainer-1"
  },
  {
    id: "u-client-2",
    username: "kuba",
    password: "kuba",
    role: "client",
    fullName: "Kuba Wiśniewski",
    email: "kuba@dietapp.io",
    avatarHue: 200,
    trainerId: "u-trainer-1"
  }
];

export const seedClients: ClientProfile[] = [
  {
    id: "c-1",
    trainerId: "u-trainer-1",
    firstName: "Marta",
    lastName: "Nowak",
    email: "marta@dietapp.io",
    phone: "+48 600 100 200",
    birthDate: "1994-03-12",
    notes: "Alergia na orzechy. Trenuje 4x w tyg.",
    goal: "Redukcja −6 kg",
    startedAt: "2026-01-10",
    avatarHue: 320,
    wearableDevice: "apple_watch"
  },
  {
    id: "c-2",
    trainerId: "u-trainer-1",
    firstName: "Kuba",
    lastName: "Wiśniewski",
    email: "kuba@dietapp.io",
    phone: "+48 600 222 333",
    birthDate: "1991-08-04",
    notes: "Powrót po kontuzji barku, brak deadliftów.",
    goal: "Masa +4 kg, siła",
    startedAt: "2025-11-02",
    avatarHue: 200,
    wearableDevice: "garmin"
  },
  {
    id: "c-3",
    trainerId: "u-trainer-1",
    firstName: "Ola",
    lastName: "Kamińska",
    email: "ola@dietapp.io",
    phone: "+48 601 555 777",
    birthDate: "1998-12-22",
    notes: "Wegetarianka. Cel sylwetkowy: wakacje.",
    goal: "Rekompozycja",
    startedAt: "2026-02-18",
    avatarHue: 280,
    wearableDevice: "whoop"
  },
  {
    id: "c-4",
    trainerId: "u-trainer-1",
    firstName: "Piotr",
    lastName: "Lewandowski",
    email: "piotr@dietapp.io",
    phone: "+48 602 888 111",
    birthDate: "1986-06-30",
    notes: "Praca biurowa, mało ruchu w tygodniu.",
    goal: "Zdrowie metaboliczne",
    startedAt: "2025-09-15",
    avatarHue: 160,
    wearableDevice: "samsung_health"
  },
  {
    id: "c-5",
    trainerId: "u-trainer-2",
    firstName: "Tomek",
    lastName: "Adamski",
    email: "tomek@dietapp.io",
    phone: "+48 605 444 333",
    birthDate: "1989-04-21",
    notes: "Strongman amator, dieta wysokokaloryczna.",
    goal: "Siła maksymalna",
    startedAt: "2025-12-01",
    avatarHue: 30,
    wearableDevice: "garmin"
  }
];

export const seedProgress: ProgressEntry[] = [
  { id: "p-1", clientId: "c-1", date: "2026-01-10", weight: 72.0, bodyFat: 26.0, waist: 80, chest: 92, arm: 28, thigh: 58 },
  { id: "p-2", clientId: "c-1", date: "2026-02-10", weight: 70.4, bodyFat: 25.1, waist: 78, chest: 92, arm: 28, thigh: 58 },
  { id: "p-3", clientId: "c-1", date: "2026-03-10", weight: 68.9, bodyFat: 24.0, waist: 76, chest: 91, arm: 28, thigh: 57 },
  { id: "p-4", clientId: "c-1", date: "2026-04-10", weight: 67.5, bodyFat: 22.8, waist: 75, chest: 90, arm: 28, thigh: 57 },
  { id: "p-5", clientId: "c-1", date: "2026-05-10", weight: 66.1, bodyFat: 21.5, waist: 73, chest: 90, arm: 28, thigh: 56 },
  { id: "p-6", clientId: "c-2", date: "2025-11-02", weight: 78.0, bodyFat: 18.0, waist: 84, chest: 102, arm: 36, thigh: 60 },
  { id: "p-7", clientId: "c-2", date: "2026-01-02", weight: 79.5, bodyFat: 17.5, waist: 84, chest: 104, arm: 37, thigh: 61 },
  { id: "p-8", clientId: "c-2", date: "2026-03-02", weight: 81.2, bodyFat: 17.0, waist: 85, chest: 106, arm: 38, thigh: 62 },
  { id: "p-9", clientId: "c-2", date: "2026-05-02", weight: 82.4, bodyFat: 16.6, waist: 85, chest: 107, arm: 39, thigh: 63 },
  { id: "p-10", clientId: "c-3", date: "2026-02-18", weight: 60.0, bodyFat: 24.0, waist: 70, chest: 86, arm: 26, thigh: 54 },
  { id: "p-11", clientId: "c-3", date: "2026-04-18", weight: 59.0, bodyFat: 22.4, waist: 68, chest: 86, arm: 26, thigh: 54 },
  { id: "p-12", clientId: "c-4", date: "2025-09-15", weight: 95.0, bodyFat: 28.0, waist: 105, chest: 108, arm: 35, thigh: 65 },
  { id: "p-13", clientId: "c-4", date: "2025-12-15", weight: 92.4, bodyFat: 26.0, waist: 102, chest: 107, arm: 35, thigh: 64 },
  { id: "p-14", clientId: "c-4", date: "2026-03-15", weight: 89.1, bodyFat: 23.8, waist: 99, chest: 106, arm: 35, thigh: 63 },
  { id: "p-15", clientId: "c-4", date: "2026-05-15", weight: 87.6, bodyFat: 22.4, waist: 97, chest: 105, arm: 35, thigh: 62 }
];

export const seedProducts: Product[] = [
  { id: "prod-1", name: "Pierś z kurczaka", kcal: 165, protein: 31, fat: 3.6, carbs: 0, emoji: "🍗" },
  { id: "prod-2", name: "Ryż basmati", kcal: 350, protein: 7, fat: 0.5, carbs: 78, emoji: "🍚" },
  { id: "prod-3", name: "Brokuły", kcal: 34, protein: 2.8, fat: 0.4, carbs: 7, emoji: "🥦" },
  { id: "prod-4", name: "Łosoś", kcal: 208, protein: 20, fat: 13, carbs: 0, emoji: "🐟" },
  { id: "prod-5", name: "Płatki owsiane", kcal: 379, protein: 13, fat: 6.5, carbs: 67, emoji: "🥣" },
  { id: "prod-6", name: "Banan", kcal: 89, protein: 1.1, fat: 0.3, carbs: 23, emoji: "🍌" },
  { id: "prod-7", name: "Jajko", kcal: 155, protein: 13, fat: 11, carbs: 1.1, emoji: "🥚" },
  { id: "prod-8", name: "Twaróg półtłusty", kcal: 133, protein: 19, fat: 5, carbs: 3.5, emoji: "🧀" },
  { id: "prod-9", name: "Awokado", kcal: 160, protein: 2, fat: 15, carbs: 9, emoji: "🥑" },
  { id: "prod-10", name: "Migdały", kcal: 579, protein: 21, fat: 50, carbs: 22, emoji: "🌰" },
  { id: "prod-11", name: "Bataty", kcal: 86, protein: 1.6, fat: 0.1, carbs: 20, emoji: "🍠" },
  { id: "prod-12", name: "Wołowina chuda", kcal: 217, protein: 26, fat: 12, carbs: 0, emoji: "🥩" },
  { id: "prod-13", name: "Olej rzepakowy", kcal: 884, protein: 0, fat: 100, carbs: 0, emoji: "🫒" },
  { id: "prod-14", name: "Pomidor", kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9, emoji: "🍅" },
  { id: "prod-15", name: "Tofu", kcal: 144, protein: 17, fat: 9, carbs: 3, emoji: "🌱" }
];

export const seedDietPlans: DietPlan[] = [
  {
    id: "d-1",
    clientId: "c-1",
    name: "Redukcja — Maj 2026",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    notes: "Deficyt 400 kcal. Wysokie białko.",
    targetKcal: 1700,
    meals: [
      {
        id: "m-1",
        name: "Śniadanie",
        items: [
          { productId: "prod-5", grams: 60 },
          { productId: "prod-6", grams: 120 },
          { productId: "prod-8", grams: 150 }
        ],
        recipe: {
          prepTimeMinutes: 8,
          note: "Najszybsze śniadanie redukcyjne — wszystko w jednej misce.",
          steps: [
            "Płatki owsiane zalej 200 ml gorącej wody lub mleka, odstaw na 3 min.",
            "Banana pokrój w plasterki i wmieszaj do owsianki.",
            "Na wierzch dodaj twaróg, posyp cynamonem do smaku."
          ]
        }
      },
      {
        id: "m-2",
        name: "Obiad",
        items: [
          { productId: "prod-1", grams: 180 },
          { productId: "prod-2", grams: 70 },
          { productId: "prod-3", grams: 200 }
        ],
        recipe: {
          prepTimeMinutes: 25,
          note: "Mój sprawdzony obiad redukcyjny — możesz robić go 3 dni z rzędu i dalej smakuje.",
          steps: [
            "Pokrój pierś na kawałki 2cm, marynuj w łyżce sosu sojowego + ząbku czosnku + szczypcie imbiru — 10 min.",
            "Ryż wsyp do garnka, zalej zimną wodą (proporcja 1:2), gotuj 12 min pod przykryciem na małym ogniu.",
            "Brokuł podziel na różyczki, blanszuj 3 min we wrzątku, odcedź.",
            "Kurczak smaż 6–7 min na średnim ogniu na łyżeczce oleju, aż złocisty.",
            "Podawaj kurczaka na ryżu, brokuł obok, polej oliwą do smaku."
          ]
        }
      },
      {
        id: "m-3",
        name: "Kolacja",
        items: [
          { productId: "prod-4", grams: 150 },
          { productId: "prod-11", grams: 150 },
          { productId: "prod-9", grams: 60 }
        ],
        recipe: {
          prepTimeMinutes: 30,
          note: "Kolacja na ciepło — łosoś z piekarnika to game changer.",
          steps: [
            "Piekarnik nagrzej do 200°C.",
            "Bataty pokrój w słupki, wymieszaj z odrobiną oliwy i soli, piecz 25 min.",
            "Łososia ułóż obok batatów na ostatnie 12 min pieczenia.",
            "Awokado pokrój w plasterki — podaj na świeżo obok łososia."
          ]
        }
      }
    ]
  },
  {
    id: "d-2",
    clientId: "c-2",
    name: "Masa — Wiosna 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    notes: "Nadwyżka 350 kcal. Trening 5x/tydz.",
    targetKcal: 3100,
    meals: [
      {
        id: "m-4",
        name: "Śniadanie",
        items: [
          { productId: "prod-5", grams: 100 },
          { productId: "prod-7", grams: 150 },
          { productId: "prod-6", grams: 150 }
        ],
        recipe: {
          prepTimeMinutes: 12,
          note: "Wysokokaloryczne śniadanie na masie — kalorie i białko jednym uderzeniem.",
          steps: [
            "Płatki owsiane zalej szklanką mleka, dodaj łyżkę masła orzechowego, ugotuj 4 min.",
            "Jajka rozbij na patelnię, smaż 3 min na omlet (ewentualnie z odrobiną sera).",
            "Banana pokrój w plasterki, dodaj na wierzch owsianki.",
            "Wszystko podawaj razem — owsianka + omlet + banan na talerzu."
          ]
        }
      },
      {
        id: "m-5",
        name: "Obiad",
        items: [
          { productId: "prod-12", grams: 200 },
          { productId: "prod-2", grams: 120 },
          { productId: "prod-3", grams: 250 }
        ]
      },
      {
        id: "m-6",
        name: "Posiłek 3",
        items: [
          { productId: "prod-1", grams: 200 },
          { productId: "prod-11", grams: 250 }
        ]
      },
      {
        id: "m-7",
        name: "Kolacja",
        items: [
          { productId: "prod-8", grams: 200 },
          { productId: "prod-10", grams: 40 }
        ]
      }
    ]
  }
];

export const seedWorkoutPlans: WorkoutPlan[] = [
  {
    id: "w-1",
    clientId: "c-1",
    name: "Full Body 3x/tydz",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    notes: "Tempo kontrolowane, 60s przerwy.",
    days: [
      {
        id: "wd-1",
        name: "Dzień A — Push/Pull",
        exercises: [
          { id: "ex-1", name: "Wyciskanie hantli", sets: 4, reps: "10-12", weight: "12 kg", notes: "Pełen zakres" },
          { id: "ex-2", name: "Wiosłowanie sztangą", sets: 4, reps: "10", weight: "30 kg" },
          { id: "ex-3", name: "Przysiad goblet", sets: 3, reps: "12", weight: "18 kg" },
          { id: "ex-4", name: "Plank", sets: 3, reps: "45s", weight: "BW" }
        ]
      },
      {
        id: "wd-2",
        name: "Dzień B — Nogi",
        exercises: [
          { id: "ex-5", name: "Hip thrust", sets: 4, reps: "10", weight: "60 kg" },
          { id: "ex-6", name: "Wykroki", sets: 3, reps: "12/nogę", weight: "10 kg" },
          { id: "ex-7", name: "Wspięcia na palce", sets: 4, reps: "15", weight: "20 kg" }
        ]
      }
    ]
  },
  {
    id: "w-2",
    clientId: "c-2",
    name: "Push / Pull / Legs",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    notes: "Bez deadliftów (kontuzja).",
    days: [
      {
        id: "wd-3",
        name: "Push",
        exercises: [
          { id: "ex-8", name: "Wyciskanie sztangi", sets: 4, reps: "6-8", weight: "85 kg" },
          { id: "ex-9", name: "OHP", sets: 4, reps: "8", weight: "45 kg" },
          { id: "ex-10", name: "Pompki na poręczach", sets: 3, reps: "10", weight: "+10 kg" }
        ]
      },
      {
        id: "wd-4",
        name: "Pull",
        exercises: [
          { id: "ex-11", name: "Podciąganie", sets: 4, reps: "8", weight: "BW" },
          { id: "ex-12", name: "Wiosłowanie hantlem", sets: 4, reps: "10", weight: "32 kg" },
          { id: "ex-13", name: "Uginanie ramion", sets: 3, reps: "12", weight: "16 kg" }
        ]
      },
      {
        id: "wd-5",
        name: "Legs",
        exercises: [
          { id: "ex-14", name: "Przysiad ze sztangą", sets: 5, reps: "5", weight: "110 kg", notes: "RPE 8" },
          { id: "ex-15", name: "Wypychanie nogami", sets: 3, reps: "10", weight: "180 kg" },
          { id: "ex-16", name: "Hamstring curl", sets: 3, reps: "12", weight: "40 kg" }
        ]
      }
    ]
  }
];

// ─── Wearables (last 14 days, varied per device) ─────────────────
const today = () => new Date("2026-05-22");
const dayBack = (n: number) => {
  const d = today();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const rng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function generateWearableHistory(clientId: string, device: ClientProfile["wearableDevice"], seed: number, profile: { rhrBase: number; hrvBase: number; sleepBase: number; strainBase: number; stepsBase: number }): WearableSnapshot[] {
  const r = rng(seed);
  return Array.from({ length: 14 }, (_, i) => {
    const noise = (amp: number) => (r() - 0.5) * amp;
    return {
      id: `wear-${clientId}-${i}`,
      clientId,
      date: dayBack(13 - i),
      device: device ?? "apple_watch",
      restingHr: Math.round(profile.rhrBase + noise(6)),
      hrv: Math.round(profile.hrvBase + noise(14)),
      sleepHours: Math.round((profile.sleepBase + noise(1.4)) * 10) / 10,
      sleepScore: Math.round(70 + r() * 25),
      steps: Math.round(profile.stepsBase + noise(3500)),
      activeKcal: Math.round(420 + r() * 400),
      strain: Math.round((profile.strainBase + noise(4)) * 10) / 10,
      recovery: Math.round(50 + r() * 45),
      workoutMinutes: Math.round(35 + r() * 50)
    };
  });
}

export const seedWearables: WearableSnapshot[] = [
  ...generateWearableHistory("c-1", "apple_watch", 11, { rhrBase: 58, hrvBase: 62, sleepBase: 7.4, strainBase: 12, stepsBase: 9200 }),
  ...generateWearableHistory("c-2", "garmin", 22, { rhrBase: 52, hrvBase: 78, sleepBase: 7.8, strainBase: 16, stepsBase: 11500 }),
  ...generateWearableHistory("c-3", "whoop", 33, { rhrBase: 64, hrvBase: 55, sleepBase: 7.0, strainBase: 11, stepsBase: 8800 }),
  ...generateWearableHistory("c-4", "samsung_health", 44, { rhrBase: 70, hrvBase: 42, sleepBase: 6.2, strainBase: 8, stepsBase: 5200 })
];

// ─── Meal photo proofs ─────────────────────────────────────────────
// Photos use SVG data URLs (gradient placeholders) so seed has zero external deps
const photoSvg = (h1: number, h2: number, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${h1},80%,70%)'/><stop offset='100%' stop-color='hsl(${h2},80%,50%)'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' font-family='system-ui' font-size='110' font-weight='700' fill='white' opacity='0.85'>${label}</text></svg>`
  )}`;

export const seedMealPhotos: MealPhoto[] = [
  {
    id: "mp-1",
    clientId: "c-1",
    dietPlanId: "d-1",
    mealName: "Śniadanie",
    dataUrl: photoSvg(28, 12, "🥣"),
    note: "Owsianka z bananem i twarogiem ❤",
    uploadedAt: "2026-05-22T07:42:00Z",
    status: "approved",
    trainerComment: "Super! Trzymaj tę porcję owsianki.",
    aiAnalysis: {
      estimatedKcal: 510,
      detectedItems: ["płatki owsiane", "banan", "twaróg"],
      macros: { kcal: 510, protein: 32, fat: 8, carbs: 75 },
      confidence: 0.92
    }
  },
  {
    id: "mp-2",
    clientId: "c-1",
    dietPlanId: "d-1",
    mealName: "Obiad",
    dataUrl: photoSvg(120, 80, "🥗"),
    note: "Kurczak z ryżem i brokułami",
    uploadedAt: "2026-05-21T13:18:00Z",
    status: "pending",
    aiAnalysis: {
      estimatedKcal: 640,
      detectedItems: ["pierś z kurczaka", "ryż", "brokuły", "oliwa"],
      macros: { kcal: 640, protein: 58, fat: 14, carbs: 72 },
      confidence: 0.88
    }
  },
  {
    id: "mp-3",
    clientId: "c-2",
    dietPlanId: "d-2",
    mealName: "Posiłek 3",
    dataUrl: photoSvg(15, 350, "🥩"),
    note: "Wołowina + bataty",
    uploadedAt: "2026-05-21T16:50:00Z",
    status: "approved",
    trainerComment: "Mocne. Brakuje warzyw — dorzuć szpinak.",
    aiAnalysis: {
      estimatedKcal: 820,
      detectedItems: ["wołowina", "bataty"],
      macros: { kcal: 820, protein: 65, fat: 28, carbs: 70 },
      confidence: 0.9
    }
  },
  {
    id: "mp-4",
    clientId: "c-3",
    dietPlanId: undefined,
    mealName: "Kolacja",
    dataUrl: photoSvg(280, 200, "🌱"),
    note: "Tofu stir-fry",
    uploadedAt: "2026-05-22T19:05:00Z",
    status: "flagged",
    trainerComment: "Za mało białka, dodaj tempeh lub edamame.",
    aiAnalysis: {
      estimatedKcal: 380,
      detectedItems: ["tofu", "warzywa", "ryż"],
      macros: { kcal: 380, protein: 18, fat: 12, carbs: 50 },
      confidence: 0.86
    }
  }
];

// ─── AI Insights ──────────────────────────────────────────────────
export const seedAIInsights: AIInsight[] = [
  {
    id: "ai-i-1",
    scope: "trainer",
    subjectId: "u-trainer-1",
    type: "compliance_drop",
    title: "Piotr — spadek aktywności",
    body: "Średnia kroków spadła o 28% w ostatnim tygodniu (5.2k vs 7.2k). HRV poniżej baseline. Sugeruję rozmowę motywacyjną + lekki regen.",
    severity: "warning",
    generatedAt: "2026-05-22T06:30:00Z"
  },
  {
    id: "ai-i-2",
    scope: "trainer",
    subjectId: "u-trainer-1",
    type: "milestone",
    title: "Marta — kamień milowy 🏆",
    body: "Marta zrzuciła 5.9 kg w 4 miesiące. Trzyma deficyt na poziomie 92% adherencji (zdjęcia + makro).",
    severity: "positive",
    generatedAt: "2026-05-22T05:10:00Z"
  },
  {
    id: "ai-i-3",
    scope: "trainer",
    subjectId: "u-trainer-1",
    type: "recovery_alert",
    title: "Kuba — niski recovery (Garmin)",
    body: "Recovery 38% trzeci dzień z rzędu. Zaplanowany dziś ciężki Pull. Sugerowane: deload set lub przesunięcie sesji.",
    severity: "critical",
    generatedAt: "2026-05-22T07:01:00Z"
  },
  {
    id: "ai-i-4",
    scope: "trainer",
    subjectId: "u-trainer-1",
    type: "suggestion",
    title: "Optymalizacja diety Oli",
    body: "Aktualne makro: 1450 kcal / 65 g białka. Dla rekompozycji sugeruję podbicie białka do 100 g + utrzymanie deficytu 200 kcal.",
    severity: "info",
    generatedAt: "2026-05-21T20:15:00Z"
  },
  {
    id: "ai-i-5",
    scope: "client",
    subjectId: "c-1",
    type: "milestone",
    title: "Świetna konsekwencja!",
    body: "92% dni z dobrym deficytem. Twoje HRV rośnie — to znak adaptacji do treningu.",
    severity: "positive",
    generatedAt: "2026-05-22T05:10:00Z"
  },
  {
    id: "ai-i-6",
    scope: "client",
    subjectId: "c-1",
    type: "sleep_alert",
    title: "Sen powyżej średniej",
    body: "Średni sen 7h 28min (+18min vs poprzedni tydzień). Zostaw rytm — wspiera redukcję.",
    severity: "info",
    generatedAt: "2026-05-22T05:11:00Z"
  }
];

// ─── Meal proposals (Wymiany posiłków) ────────────────────────────
// Three flows in one stream: swap requests from clients, pre-approvals,
// and trainer-attached recipes.
export const seedMealProposals: MealProposal[] = [
  {
    id: "mp-prop-1",
    clientId: "c-1",
    trainerId: "u-trainer-1",
    dietPlanId: "d-1",
    mealId: "m-2",
    mealName: "Obiad",
    date: "2026-05-24",
    kind: "swap_request",
    proposedItems: [
      { productId: "prod-4", grams: 180 }, // łosoś zamiast kurczaka
      { productId: "prod-11", grams: 180 }, // bataty zamiast ryżu
      { productId: "prod-3", grams: 200 }
    ],
    note: "Nie mam dziś kurczaka, mam łososia w lodówce. Zamienię ryż na bataty?",
    status: "pending",
    createdAt: "2026-05-24T10:14:00Z"
  },
  {
    id: "mp-prop-2",
    clientId: "c-2",
    trainerId: "u-trainer-1",
    dietPlanId: "d-2",
    mealId: "m-4",
    mealName: "Śniadanie",
    date: "2026-05-23",
    kind: "swap_request",
    proposedItems: [
      { productId: "prod-7", grams: 200 },
      { productId: "prod-6", grams: 200 },
      { productId: "prod-5", grams: 50 }
    ],
    note: "Mogę zrobić omlet bananowy z owsianki?",
    status: "approved",
    trainerComment: "Tak, kalorycznie spina się. Trzymaj porcje.",
    respondedAt: "2026-05-23T07:25:00Z",
    createdAt: "2026-05-23T07:08:00Z"
  },
  {
    id: "mp-prop-3",
    clientId: "c-1",
    trainerId: "u-trainer-1",
    dietPlanId: "d-1",
    mealId: "m-3",
    mealName: "Kolacja",
    date: "2026-05-24",
    kind: "pre_approval",
    proposedItems: [
      { productId: "prod-4", grams: 150 },
      { productId: "prod-11", grams: 150 },
      { productId: "prod-9", grams: 60 }
    ],
    note: "Zrobię dokładnie jak w planie — chcę mieć pewność, że ok przed kupnem.",
    status: "approved",
    trainerComment: "Idealnie. Tak trzymaj.",
    respondedAt: "2026-05-24T11:02:00Z",
    createdAt: "2026-05-24T10:55:00Z"
  },
  {
    id: "mp-prop-4",
    clientId: "c-3",
    trainerId: "u-trainer-1",
    dietPlanId: "d-2",
    mealId: "m-5",
    mealName: "Obiad",
    date: "2026-05-22",
    kind: "swap_request",
    proposedItems: [
      { productId: "prod-2", grams: 200 },
      { productId: "prod-14", grams: 200 }
    ],
    note: "Wczoraj był ciężki dzień, mogę zjeść pizzę? Albo coś prostszego.",
    status: "counter",
    counterItems: [
      { productId: "prod-1", grams: 150 },
      { productId: "prod-2", grams: 100 },
      { productId: "prod-14", grams: 200 }
    ],
    trainerComment: "Pizza ciężka. Daję contropozycję: szybki ryż z kurczakiem i pomidorami. 15 min roboty.",
    respondedAt: "2026-05-22T13:40:00Z",
    createdAt: "2026-05-22T12:48:00Z"
  },
  {
    id: "mp-prop-5",
    clientId: "c-1",
    trainerId: "u-trainer-1",
    dietPlanId: "d-1",
    mealId: "m-2",
    mealName: "Obiad — przepis trenera",
    date: "2026-05-20",
    kind: "trainer_recipe",
    proposedItems: [
      { productId: "prod-1", grams: 180 },
      { productId: "prod-2", grams: 70 },
      { productId: "prod-3", grams: 200 }
    ],
    recipeSteps: [
      "Pokrój pierś na kawałki, marynuj w 1 łyżce sosu sojowego, czosnku, imbiru — 10 min.",
      "Ryż gotuj 12 min w lekko osolonej wodzie z kroplą oleju.",
      "Brokuł blanszuj 3 min, potem podsmaż 2 min na patelni z czosnkiem.",
      "Kurczak smaż 6–7 min na średnim ogniu, podawaj z brokułem i ryżem."
    ],
    prepTimeMinutes: 25,
    note: "Mój sprawdzony obiad redukcyjny — szybki, smaczny, taki sam każdego dnia.",
    status: "approved",
    createdAt: "2026-05-20T09:00:00Z",
    respondedAt: "2026-05-20T09:00:00Z"
  }
];

// ─── Progress photos (sylwetka) ────────────────────────────────────
// Stylized silhouette SVGs as data URLs — no external assets, deterministic.
const silhouetteSvg = (hueA: number, hueB: number, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>` +
      `<stop offset='0%' stop-color='hsl(${hueA},70%,75%)'/>` +
      `<stop offset='100%' stop-color='hsl(${hueB},70%,55%)'/>` +
      `</linearGradient></defs>` +
      `<rect width='400' height='600' fill='url(%23g)'/>` +
      `<g fill='white' opacity='0.85'>` +
      `<circle cx='200' cy='110' r='45'/>` +
      `<rect x='150' y='160' width='100' height='180' rx='40'/>` +
      `<rect x='115' y='180' width='30' height='130' rx='14'/>` +
      `<rect x='255' y='180' width='30' height='130' rx='14'/>` +
      `<rect x='160' y='345' width='35' height='200' rx='14'/>` +
      `<rect x='205' y='345' width='35' height='200' rx='14'/>` +
      `</g>` +
      `<text x='50%' y='95%' text-anchor='middle' font-family='system-ui' font-size='22' fill='white' opacity='0.9'>${label}</text>` +
      `</svg>`
  )}`;

export const seedProgressPhotos: ProgressPhoto[] = [
  // Marta — przed (styczeń 2026)
  {
    id: "pp-1",
    clientId: "c-1",
    date: "2026-01-10",
    pose: "front",
    dataUrl: silhouetteSvg(20, 30, "PRZÓD · 72.0 kg"),
    weight: 72.0,
    note: "Start programu — czuję motywację.",
    uploadedAt: "2026-01-10T09:00:00Z"
  },
  {
    id: "pp-2",
    clientId: "c-1",
    date: "2026-01-10",
    pose: "side",
    dataUrl: silhouetteSvg(40, 20, "BOK · 72.0 kg"),
    weight: 72.0,
    uploadedAt: "2026-01-10T09:00:30Z"
  },
  // Marta — po 4 miesiącach (maj 2026)
  {
    id: "pp-3",
    clientId: "c-1",
    date: "2026-05-10",
    pose: "front",
    dataUrl: silhouetteSvg(160, 200, "PRZÓD · 66.1 kg"),
    weight: 66.1,
    note: "Po 4 miesiącach — -5.9 kg, czuję się świetnie!",
    uploadedAt: "2026-05-10T08:30:00Z"
  },
  {
    id: "pp-4",
    clientId: "c-1",
    date: "2026-05-10",
    pose: "side",
    dataUrl: silhouetteSvg(180, 220, "BOK · 66.1 kg"),
    weight: 66.1,
    uploadedAt: "2026-05-10T08:30:30Z"
  },
  // Kuba — masa, jedno zdjęcie
  {
    id: "pp-5",
    clientId: "c-2",
    date: "2026-05-02",
    pose: "front",
    dataUrl: silhouetteSvg(200, 230, "PRZÓD · 82.4 kg"),
    weight: 82.4,
    note: "Progres masy — widać szerokość w plecach.",
    uploadedAt: "2026-05-02T07:15:00Z"
  }
];

// ─── Calendar events ──────────────────────────────────────────────
// Generates a week of events for one client given training days, meal slots
// and ad-hoc one-offs. Status is derived from whether the day is past/today/future.
const REF_TODAY = "2026-05-26"; // anchor for past/future logic; matches demo seed era

const dateForDow = (mondayIso: string, dow: number): string => {
  const [y, m, d] = mondayIso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + dow));
  return dt.toISOString().slice(0, 10);
};

const inferStatus = (
  date: string,
  override?: CalendarEventStatus
): CalendarEventStatus => {
  if (override) return override;
  if (date < REF_TODAY) return "done";
  return "planned";
};

interface WeekSpec {
  clientId: string;
  trainerId: string;
  mondayIso: string;
  workouts: { dow: number; title: string; time?: string; durationMinutes?: number; workoutDayId?: string; statusOverride?: CalendarEventStatus }[];
  meals: { dow?: number; time: string; title: string; mealId?: string; dietPlanId?: string; statusOverride?: CalendarEventStatus }[]; // dow absent = every day
  extras?: { dow: number; kind: CalendarEventKind; title: string; time?: string; durationMinutes?: number; statusOverride?: CalendarEventStatus; notes?: string }[];
}

function generateWeek(spec: WeekSpec): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const cAt = `${spec.mondayIso}T06:00:00Z`;
  let counter = 0;
  const nid = (k: string) =>
    `cal-${k}-${spec.clientId}-${spec.mondayIso.slice(5)}-${counter++}`;

  for (const w of spec.workouts) {
    const date = dateForDow(spec.mondayIso, w.dow);
    events.push({
      id: nid("w"),
      clientId: spec.clientId,
      trainerId: spec.trainerId,
      kind: "workout",
      title: w.title,
      date,
      startTime: w.time,
      durationMinutes: w.durationMinutes,
      workoutDayId: w.workoutDayId,
      status: inferStatus(date, w.statusOverride),
      createdAt: cAt
    });
  }

  for (const m of spec.meals) {
    const dows = m.dow !== undefined ? [m.dow] : [0, 1, 2, 3, 4, 5, 6];
    for (const dow of dows) {
      const date = dateForDow(spec.mondayIso, dow);
      events.push({
        id: nid("m"),
        clientId: spec.clientId,
        trainerId: spec.trainerId,
        kind: "meal",
        title: m.title,
        date,
        startTime: m.time,
        mealId: m.mealId,
        dietPlanId: m.dietPlanId,
        status: inferStatus(date, m.statusOverride),
        createdAt: cAt
      });
    }
  }

  for (const x of spec.extras ?? []) {
    const date = dateForDow(spec.mondayIso, x.dow);
    events.push({
      id: nid("x"),
      clientId: spec.clientId,
      trainerId: spec.trainerId,
      kind: x.kind,
      title: x.title,
      date,
      startTime: x.time,
      durationMinutes: x.durationMinutes,
      notes: x.notes,
      status: inferStatus(date, x.statusOverride),
      createdAt: cAt
    });
  }

  return events;
}

// Marta (c-1) — redukcja, train Mon/Wed/Fri, 3 meals/day. 2 tygodnie.
const martaMeals = [
  { time: "08:00", title: "Śniadanie · owsianka", mealId: "m-1", dietPlanId: "d-1" },
  { time: "14:00", title: "Obiad · kurczak z ryżem", mealId: "m-2", dietPlanId: "d-1" },
  { time: "19:30", title: "Kolacja · łosoś z batatami", mealId: "m-3", dietPlanId: "d-1" }
];

// Kuba (c-2) — masa, train Tue/Thu/Sat, 5 meals/day.
const kubaMeals = [
  { time: "07:30", title: "Śniadanie · owsianka XL", mealId: "m-4", dietPlanId: "d-2" },
  { time: "10:30", title: "II śniadanie", dietPlanId: "d-2" },
  { time: "13:30", title: "Obiad · wołowina + ryż", mealId: "m-5", dietPlanId: "d-2" },
  { time: "16:30", title: "Posiłek po treningu", mealId: "m-6", dietPlanId: "d-2" },
  { time: "20:00", title: "Kolacja", dietPlanId: "d-2" }
];

export const seedCalendarEvents: CalendarEvent[] = [
  // ── Marta — ostatni tydzień (2026-05-18) ──
  ...generateWeek({
    clientId: "c-1",
    trainerId: "u-trainer-1",
    mondayIso: "2026-05-18",
    workouts: [
      { dow: 0, title: "Push A · klatka", time: "18:00", durationMinutes: 60, statusOverride: "done" },
      { dow: 2, title: "Pull A · plecy", time: "18:00", durationMinutes: 60, statusOverride: "done" },
      { dow: 4, title: "Legs A · nogi", time: "18:00", durationMinutes: 70, statusOverride: "missed" }
    ],
    meals: martaMeals,
    extras: [
      { dow: 4, kind: "checkin", title: "Cotygodniowy check-in", time: "20:00", statusOverride: "done" },
      { dow: 6, kind: "measurement", title: "Pomiary (waga + obwody)", time: "09:00", statusOverride: "done" }
    ]
  }),

  // ── Marta — bieżący tydzień (2026-05-25), część done, część planned ──
  ...generateWeek({
    clientId: "c-1",
    trainerId: "u-trainer-1",
    mondayIso: "2026-05-25",
    workouts: [
      { dow: 0, title: "Push A · klatka", time: "18:00", durationMinutes: 60, statusOverride: "done" },
      { dow: 2, title: "Pull A · plecy", time: "18:00", durationMinutes: 60 },
      { dow: 4, title: "Legs A · nogi", time: "18:00", durationMinutes: 70 }
    ],
    meals: martaMeals,
    extras: [
      { dow: 1, kind: "consultation", title: "Konsultacja online z trenerem", time: "09:00", durationMinutes: 30, notes: "Omówienie progresu z poprzedniego tygodnia." },
      { dow: 4, kind: "checkin", title: "Cotygodniowy check-in", time: "20:00" },
      { dow: 6, kind: "measurement", title: "Pomiary (waga + obwody)", time: "09:00" }
    ]
  }),

  // ── Kuba (c-2) — bieżący tydzień ──
  ...generateWeek({
    clientId: "c-2",
    trainerId: "u-trainer-1",
    mondayIso: "2026-05-25",
    workouts: [
      { dow: 1, title: "Push B · siłowo", time: "19:00", durationMinutes: 90, statusOverride: "done" },
      { dow: 3, title: "Pull B · siłowo", time: "19:00", durationMinutes: 90 },
      { dow: 5, title: "Legs B · ciężki", time: "10:00", durationMinutes: 100 }
    ],
    meals: kubaMeals,
    extras: [
      { dow: 4, kind: "checkin", title: "Check-in (wideo)", time: "20:30" }
    ]
  }),

  // ── Ola (c-3) — krótszy program, bieżący tydzień ──
  ...generateWeek({
    clientId: "c-3",
    trainerId: "u-trainer-1",
    mondayIso: "2026-05-25",
    workouts: [
      { dow: 2, title: "Full body A", time: "17:30", durationMinutes: 55 },
      { dow: 5, title: "Full body B", time: "10:30", durationMinutes: 55 }
    ],
    meals: [
      { time: "08:30", title: "Śniadanie", dietPlanId: "d-2" },
      { time: "13:00", title: "Obiad", dietPlanId: "d-2" },
      { time: "19:00", title: "Kolacja", dietPlanId: "d-2" }
    ],
    extras: [{ dow: 3, kind: "checkin", title: "Check-in", time: "19:30" }]
  }),

  // ── Marta — przyszły tydzień (2026-06-01), only planned skeleton ──
  ...generateWeek({
    clientId: "c-1",
    trainerId: "u-trainer-1",
    mondayIso: "2026-06-01",
    workouts: [
      { dow: 0, title: "Push A · klatka", time: "18:00", durationMinutes: 60 },
      { dow: 2, title: "Pull A · plecy", time: "18:00", durationMinutes: 60 },
      { dow: 4, title: "Legs A · nogi", time: "18:00", durationMinutes: 70 }
    ],
    meals: martaMeals.slice(0, 3),
    extras: [
      { dow: 4, kind: "checkin", title: "Cotygodniowy check-in", time: "20:00" },
      { dow: 6, kind: "measurement", title: "Pomiary (waga + obwody + zdjęcia sylwetki)", time: "09:00" }
    ]
  })
];

// ─── Subscriptions ────────────────────────────────────────────────
export const seedSubscriptions: Subscription[] = [
  {
    trainerId: "u-trainer-1",
    tier: "starter",
    renewsAt: "2026-06-22",
    aiUsedThisMonth: 87,
    photoAnalysesThisMonth: 22,
    extraSeats: 0
  },
  {
    trainerId: "u-trainer-2",
    tier: "starter",
    renewsAt: "2026-06-15",
    aiUsedThisMonth: 14,
    photoAnalysesThisMonth: 4,
    extraSeats: 0
  }
];
