# Architecture

Stan na 2026-05-23.

## Cel architektury

- Jedna baza kodu, trzy surfaces: web (publiczna strona + aplikacja), iOS, Android.
- Współdzielenie modelu domenowego i tokenów marki, nie współdzielenie UI runtime'u.
- Możliwość pracy równoległej między agentami: web i mobile w osobnych folderach,
  spojone przez `packages/core`.
- Brak overengineeringu: zaczynamy od client-side state (zustand), backend
  prawdziwy podpinamy później bez przepisywania ekranów.

## Struktura repo (monorepo, npm workspaces)

```
dietAppOnSteroids/
├── apps/
│   ├── web/        # Next.js 15 (App Router) — landing + aplikacja
│   └── mobile/     # Expo + React Native + expo-router — iOS + Android (klient)
├── packages/
│   └── core/       # współdzielone typy domenowe, brand tokens, makra
├── backend/        # Spring Boot — istniejący backend (legacy, w trakcie migracji)
├── frontend/       # Angular — LEGACY, tylko jako referencja (zob. frontend/LEGACY.md)
└── docs/           # dokumentacja produktowa
```

### apps/web

Next.js 15, React 18, TypeScript, Tailwind. App Router.

Trasy:
- `/` — publiczny landing (server-rendered, SEO + JSON-LD)
- `/login` — logowanie
- `/app` — redirect po sesji (klient → `/client`, trener → `/trainer`)
- `/trainer/*` — panel trenera
- `/client/*` — panel klienta

Stan po stronie klienta: `zustand` persyst (`apps/web/src/lib/store.ts`).
Dane domenowe: `apps/web/src/lib/types.ts` (re-eksport z `@dietapp/core` w toku).
Kopia marketingowa: `apps/web/src/lib/i18n/copy.ts` (PL/EN).

SEO foundations:
- `apps/web/src/app/sitemap.ts` — sitemap.xml
- `apps/web/src/app/robots.ts` — robots.txt
- `apps/web/src/app/opengraph-image.tsx` — dynamiczny OG (edge runtime)
- `apps/web/src/app/manifest.ts` — PWA manifest
- `apps/web/src/app/page.tsx` — Organization + SoftwareApplication + FAQPage JSON-LD
- `apps/web/src/app/layout.tsx` — metadataBase, hreflang, robots, twitter:summary_large_image

### apps/mobile

Expo SDK 51, React Native, expo-router (file-based routing).
NativeWind 4 dla stylów (te same tokeny co web).

Zakres MVP: aplikacja **klienta** (iOS + Android). Trener pozostaje na webie.
- `app/(auth)/login.tsx` — logowanie (demo store)
- `app/(client)/index.tsx` — Dziś (kalorie, trening, CTA na zdjęcie)
- `app/(client)/diet.tsx` — plan diety na dziś
- `app/(client)/workout.tsx` — trening, odhaczanie serii

Po podpięciu API: `apps/mobile/src/lib/api.ts` zastąpi store demo i zostanie
współdzielony z webem przez `@dietapp/core` (warstwa `services`).

### packages/core

- `src/types.ts` — typy domenowe (User, ClientProfile, DietPlan, WorkoutPlan, …).
  **Jedyne źródło prawdy.** Web ma żyjący duplikat w `apps/web/src/lib/types.ts`,
  którego będziemy stopniowo wycinać na rzecz importu z `@dietapp/core`.
- `src/brand.ts` — tokeny kolorów i taglines, używane przez Tailwind (web i mobile).
- `src/macros.ts` — kalkulacje kalorii/makro, identyczne dla wszystkich surfaces.

### backend/

Spring Boot, REST API. Pozostaje bez zmian w tej iteracji — front (web i mobile)
działa nadal na seed data. Migracja do prawdziwego API jest osobnym etapem w
roadmapie.

### frontend/ (LEGACY)

Stary frontend w Angular. **Nie buildujemy go w CI, nie rozwijamy.** Trzymamy
jako referencję do póki nie skończymy migracji wszystkich ekranów do Next.js.
Zob. `frontend/LEGACY.md`.

## Decyzje architektoniczne (ADR-light)

### Dlaczego monorepo a nie osobne repo na mobile

Mobile potrzebuje tych samych typów, walidacji, kalkulacji makr i tokenów
marki co web. Osobne repo wymusiłoby publikację pakietu npm — niepotrzebny
narzut na 2-osobowy zespół. Monorepo z npm workspaces załatwia sprawę zerem
infrastruktury.

### Dlaczego Expo a nie bare React Native

Expo Router daje file-based routing (jak Next.js), prebuilt natywne moduły
(camera, secure-store, health) bez dotykania Xcode/Android Studio. Dla MVP
to oszczędność tygodnia. Możemy zrobić eject, jeśli pojawi się natywna
zależność spoza ekosystemu Expo.

### Dlaczego `/` to landing, a `/app` to redirect aplikacji

Wcześniejszy układ używał `/` jako redirectu do panelu, co czyniło wejście
niewidocznym dla wyszukiwarek. Nowy układ:
- `/` to publiczna, server-rendered strona z pełnym SEO.
- `/app` przejmuje rolę "weź mnie do mojego panelu".

Zysk: każde wejście z Google ląduje na stronie z propozycją wartości, nie na
spinnerze.

### Dlaczego PL primary, EN jako i18n

Polski rynek trenerów ma niższą konkurencję organiczną i wyższy CAC payback
przy małym budżecie. EN trzymamy gotowe (copy.ts) i włączamy, gdy dojdziemy
do limitu wzrostu w PL. Hreflang już jest na miejscu.

## Konwencje

- **Nie duplikuj typów.** Jeśli model domenowy żyje w `packages/core`, importuj
  z `@dietapp/core`. Dodaj go tam, nie w `apps/web/src/lib/types.ts`.
- **Kopia marketingowa zawsze przez `lib/i18n/copy.ts`.** Nie hardkoduj
  nagłówków i CTA w komponentach landing.
- **Komponenty landingowe = server components.** FaqAccordion to wyjątek
  (interaktywny). MarketingNav też (scroll listener) — mark `"use client"`.
- **SEO assertions:** każda publiczna strona musi mieć `<title>`, `<meta name="description">`,
  canonical, hreflang. JSON-LD tam, gdzie ma to sens.

## Czego unikamy

- Współdzielonego pakietu komponentów UI między web i mobile (różne primitives,
  różne style runtime). Współdzielimy tokeny, nie komponenty.
- Backendu jako "infrastruktury platformy" zanim mamy paying users. API
  budujemy pod realne potrzeby.
- Storybook / Chromatic / Nx — overengineering na obecnej skali.
