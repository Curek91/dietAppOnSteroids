# DietApp — Coach OS

Premium platforma dla trenerów personalnych i ich podopiecznych. Web app napisany w **Next.js 15 + React 18 + TypeScript + Tailwind CSS**, z warstwą AI (mockowaną), integracjami wearables (Apple Watch / Samsung / Garmin / Whoop / Oura / Fitbit), photo proofs posiłków oraz modelem SaaS (100 PLN/mc za trenera + 5 podopiecznych).

> Część monorepo `DietAppOnSteroids`. Stara wersja (Angular + Spring Boot + Oracle) leży w `../../backend` i `../../frontend`. **Ten katalog (`apps/web`) to nowa, niezależna aplikacja v2.**

---

## Wymagania

- **Node.js 18+** (testowane na v25)
- **npm 9+**
- Nowoczesna przeglądarka (Chrome / Edge / Safari / Firefox)

Aplikacja działa **całkowicie po stronie klienta** — dane trzymane w `localStorage` (klucz `dietapp-store-v2`). Nie wymaga backendu, bazy danych, Dockera ani kluczy API.

---

## Szybki start

```bash
# 1. Wejdź do katalogu aplikacji
cd apps/web

# 2. Zainstaluj zależności
npm install

# 3. Uruchom dev server
npm run dev

# 4. Otwórz w przeglądarce
# http://localhost:3000
```

To wszystko. Strona logowania pokaże się od razu z gotowymi przyciskami **Demo dostępy**.

---

## Konta testowe (gotowe od strzału)

| Rola | Login | Hasło | Co zobaczysz |
|---|---|---|---|
| 🟧 **Trener** | `trener` | `trener` | Pulpit + 4 podopiecznych + AI Insights + Billing |
| 🟧 Trener (drugi) | `zdzisiek` | `123456` | Drugi trener — izolowane dane |
| 🟪 **Podopieczny** | `klient` | `klient` | Pulpit Marty Nowak + jej dieta/trening/zegarek |
| 🟪 Podopieczny (drugi) | `kuba` | `kuba` | Konto Kuby — masa, Garmin |

Klikalne shortcuty są też na ekranie logowania (sekcja **Demo dostępy**).

---

## Skrypty npm

| Komenda | Co robi |
|---|---|
| `npm run dev` | Uruchamia dev server na porcie 3000 z HMR |
| `npm run build` | Buduje wersję produkcyjną (`.next/`) |
| `npm run start` | Uruchamia zbudowaną apkę produkcyjną na 3000 |
| `npm run typecheck` | Sprawdza poprawność TypeScript bez emitu |
| `npm run lint` | Lint (Next.js ESLint) |

---

## Struktura katalogu

```
apps/web/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── login/               # Ekran logowania (split-screen marketing + form)
│   │   ├── trainer/             # Strefa trenera
│   │   │   ├── page.tsx         # Pulpit z AI Insights + wearables + photo queue
│   │   │   ├── clients/         # Lista + szczegóły klienta (6 tabów)
│   │   │   ├── proofs/          # Feed zdjęć posiłków do recenzji
│   │   │   ├── library/         # Baza produktów ze zdjęciami
│   │   │   ├── insights/        # Analiza zbiorcza
│   │   │   └── billing/         # Plan, unit economics, kalkulator
│   │   └── client/              # Strefa podopiecznego
│   │       ├── page.tsx         # Pulpit z ring stats + AI insights
│   │       ├── diet/            # Dieta read-only
│   │       ├── workout/         # Trening read-only
│   │       ├── wearable/        # Dane z zegarka
│   │       ├── proofs/          # Wysyłanie zdjęć posiłków
│   │       └── progress/        # Wykresy postępów
│   ├── components/              # AppShell, AICoach, WearablesPanel, MealProofFeed,
│   │                            # AIDietGeneratorModal, UpgradeModal, ProgressChart, ...
│   ├── lib/
│   │   ├── store.ts             # Zustand store + persist (klucz: dietapp-store-v2)
│   │   ├── types.ts             # Wszystkie typy domenowe
│   │   ├── ai.ts                # Mockowany silnik AI (chat, generator diety, vision)
│   │   ├── plans.ts             # Plany SaaS + unit economics
│   │   ├── macros.ts            # Liczenie kcal/białka/tłuszczu/węgli
│   │   └── cn.ts                # Helper className (clsx + tailwind-merge)
│   └── data/seed.ts             # Seed: użytkownicy, klienci, diety, treningi,
│                                # postępy, produkty, wearables, photo proofs, insights
├── tailwind.config.ts           # Design tokens (brand HSL, glass shadows, animations)
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Funkcjonalności

### Trener (`/trainer`)
- **Pulpit** — KPI (podopieczni/diety/avg kcal/recovery/foto queue) + AI insights + lista klientów z micro-stats + wykorzystanie AI
- **Podopieczni** — widok kafelków/tabela, wyszukiwarka, modal dodawania, gating limitu (>5 → upgrade modal)
- **Szczegóły klienta** (6 tabów):
  - Profil (edycja danych + wybór urządzenia wearable)
  - Postępy (formularz pomiarów + wykres + historia)
  - Dieta (kreator, AI generator, baza produktów, real-time makro)
  - Trening (kreator dni i ćwiczeń)
  - Zegarek (Apple/Samsung/Garmin/Whoop/Oura + 4 wykresy)
  - Zdjęcia posiłków (feed klienta + approve/flag z komentarzem)
- **Zdjęcia posiłków** — globalny feed wszystkich podopiecznych z filtrami `pending/approved/flagged/all`
- **Baza produktów** — CRUD z drag&drop zdjęć + emoji fallback
- **Plan & Billing** — 3 plany, kalkulator unit economics z suwakami, add-ony

### Podopieczny (`/client`)
- **Pulpit** — hero card, AI insights, ring stats (Recovery/Sleep/RHR/Steps), quicklinki, ostatnie zdjęcia
- **Dieta** — read-only widok planu od trenera z makro
- **Trening** — read-only widok planu od trenera
- **Zegarek** — synchronizacja z Apple Watch / Whoop / Garmin / Samsung / Oura / Fitbit
- **Moje posiłki** — drag&drop zdjęć, AI Vision rozpoznaje składniki + estymuje makro
- **Postępy** — wykresy wagi/BF/obwodów

### AI Coach (globalnie)
- **Floating button** w prawym dolnym rogu → otwiera chat panel
- Realistyczne odpowiedzi z kontekstu (waga klienta, recovery z zegarka, plan diety)
- Quick prompts różne dla trenera i podopiecznego
- Wlicza się do limitu zapytań planu

---

## Model biznesowy (zaszyty w aplikacji)

### Plany SaaS

| Plan | Cena | Klienci | AI zapytania | Analizy zdjęć |
|---|---|---|---|---|
| Coach Starter | **100 PLN/mc** | 5 | 200 | 60 |
| Coach Studio | 249 PLN/mc | 15 | 800 | 250 |
| Coach Agency | 599 PLN/mc | 50 | 3000 | 1000 |

**Add-ony**: +slot klienta 20 PLN/mc · AI Pack +200 zapytań 50 PLN

### Unit Economics (cap COGS ≤ 20%)
Strona `/trainer/billing` ma interaktywny kalkulator — pokazuje strukturę kosztów per trener per miesiąc (AI / storage / hosting / Stripe), MRR/ARR i marżę przy zadanej skali (10–5000 trenerów).

---

## Tech stack

- **Framework**: Next.js 15 (App Router, RSC, Turbopack-ready)
- **UI**: React 18 + TypeScript 5.6
- **Styl**: Tailwind CSS 3.4 (custom design tokens, glassmorphism, custom animations)
- **State**: Zustand 5 + `persist` middleware (localStorage)
- **Wykresy**: Recharts 2.13
- **Ikony**: lucide-react
- **Fonts**: Sora (display) + Inter (body) — Google Fonts CDN

---

## Persistencja danych

Wszystkie dane (użytkownicy, klienci, diety, treningi, zdjęcia, AI chat, subskrypcje) są zapisywane w `localStorage` pod kluczem `dietapp-store-v2`.

**Reset stanu** (powrót do seed):
```js
// DevTools → Console
localStorage.removeItem("dietapp-store-v2");
location.reload();
```

Lub: DevTools → Application → Local Storage → kliknij prawym na klucz → Delete.

---

## Production build

```bash
cd apps/web
npm run build
npm run start
# → http://localhost:3000
```

Hostuj na **Vercel** (one-click), **Cloudflare Pages**, **Netlify** lub dowolnym Node host. Apka jest 100% statyczna po stronie klienta — brak wymaganego runtime'u poza Node do SSR.

---

## Roadmap (poza scope MVP)

- Real OpenAI integration (gpt-4o-mini chat + gpt-4o vision) z prawdziwym wallet/cost tracking
- Backend API (Node/Fastify lub Supabase) zamiast localStorage
- Apple HealthKit / Google Fit / Garmin Connect REST integration (zamiast mockowanych snapshots)
- Stripe Billing integration (subskrypcje + add-ony + invoicing)
- Mobile (Expo + React Native + NativeWind) korzystające z tego samego `lib/` i `data/`
- Desktop (Tauri) wrap dla trenerów pracujących z dużymi tabelami
- White-label / multi-tenant dla planu Agency

---

## Licencja

Proprietary — DietApp Sp. z o.o. (planowane). Kontakt: `tarasmateusz@gmail.com`
