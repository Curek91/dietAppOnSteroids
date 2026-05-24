# DietApp Mobile (Expo)

iOS + Android wersja klienta DietApp. Współdzieli typy domenowe z webem przez
`@dietapp/core` (`packages/core`).

## Zakres tej iteracji

Mobile = aplikacja **klienta** (nie trenera). Klient w terenie, trener przy biurku.

- Auth: ekran logowania (demo: `klient` / `klient`).
- Tab "Dziś": podsumowanie kalorii, trening, CTA na zdjęcie posiłku.
- Tab "Dieta": plan dnia rozbity na posiłki.
- Tab "Trening": kafelki serii — klient odhacza, co zrobił.

Brak warstwy sieciowej — wszystko jest na zaszytych danych demo, identycznie jak
web. To celowy MVP: ekrany działają, design system jest spięty, integrację
z API podpinamy w następnej iteracji (zob. `docs/ROADMAP.md`).

## Uruchomienie

```bash
cd apps/mobile
npm install     # albo: pnpm install / yarn — w monorepo
npx expo start
```

Wybierz `i` (iOS Simulator), `a` (Android Emulator) albo zeskanuj kod QR
w Expo Go.

## Struktura

```
apps/mobile/
├── app/                # expo-router file-based routing
│   ├── _layout.tsx     # root stack + SafeAreaProvider + global.css
│   ├── index.tsx       # entry redirect (auth check)
│   ├── (auth)/login    # ekran logowania
│   └── (client)/       # bottom tabs: dziś / dieta / trening
├── src/
│   ├── components/     # Screen, Card — design-system primitives
│   └── lib/auth.ts     # zustand store dla sesji
├── global.css          # tailwind directives
├── tailwind.config.js  # nativewind + brand tokens z packages/core
├── app.json            # ikona, splash, permissions iOS/Android
└── metro.config.js     # monorepo paths + nativewind
```

## Współdzielenie z webem

Wszystko, co dotyczy danych domenowych (typy, makra, taglines), żyje
w `packages/core` i jest importowane jako `@dietapp/core`. Nie duplikuj typów
pomiędzy `apps/web/src/lib/types.ts` a tym pakietem — `apps/web` ma stopniowo
migrować do importu z `@dietapp/core` (zob. `docs/ARCHITECTURE.md`).

## Co zostało celowo poza zakresem MVP

- Trener mobile (work-from-desk persona zostaje na webie).
- Real backend (login wciąż demo).
- Push, deep linking, OTA.
- Apple Health / Health Connect (po podpięciu API).

Powyższe to świadomy split: shippable MVP teraz, integracje w roadmapie.
