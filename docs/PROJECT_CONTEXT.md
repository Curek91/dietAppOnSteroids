# Project Context

DietApp to aplikacja dla **trenerów personalnych i ich klientów**. Trener
prowadzi diety, treningi, pomiary, zdjęcia posiłków i ma AI-coacha. Klient
dostaje aplikację z planem na dzisiaj.

## Persony

### Trener (buyer)

- Prowadzi 5–50 podopiecznych.
- Dzisiaj używa Excela / Notion / WhatsAppa / aplikacji do treningów.
- Boli go: kopiowanie planów, brak widoczności postępu klienta, brak czasu.
- Płaci: 100–599 PLN/miesiąc za naszą aplikację.
- Konsumuje content w PL, podejmuje decyzję sam (brak zakupów grupowych).

### Klient (user, nie buyer)

- Ma plan diety + trening + checki postępu.
- Robi zdjęcia posiłków, odhacza serie, wpisuje wagę.
- Mobile-first (klient w terenie). Web działa, ale rzadko otwierany.
- Nie podejmuje decyzji o subskrypcji — to robi trener.

## Produkt w jednym zdaniu

> Jedna aplikacja dla trenera i jego klientów: diety, treningi, pomiary i
> AI-coach na web, iOS i Android. Klient widzi aplikację z logo trenera.

## Główny model biznesowy

- Subskrypcja SaaS, opłacana przez **trenera** (B2B/B2C).
- Plany: Starter (100 PLN, 5 klientów), Studio (249 PLN, 15), Agency (599 PLN, 50).
- Brak prowizji od trenera — pełna cena trafia do trenera, on płaci nam flat.
- Marża rośnie z planem (Studio i Agency mają tańszych klientów per seat).

## Komunikacja zewnętrzna

- **Język:** PL primary, EN gotowe (i18n od dnia 1).
- **Ton:** buyer-first, konkret, brak słów "enterprise"/"elite"/"platform"/"OS".
- **Dowód:** liczby (czas oszczędzony, retencja), nazwy integracji (Apple Watch,
  Whoop), brak fikcyjnych logo klientów.

## Stack

- Web: Next.js 15, React 18, TypeScript, Tailwind, zustand
- Mobile: Expo SDK 51, React Native, expo-router, NativeWind, zustand
- Wspólne: `@dietapp/core` (typy domenowe, brand tokens, makra)
- Backend: Spring Boot (legacy, w migracji)

## Co już zrobione (snapshot)

Zob. `docs/ROADMAP.md`.

## Czego unikamy

- Słów-wytrychów branżowych ("rewolucja", "AI-powered ecosystem").
- Multi-tenant od dnia 1 — najpierw trener, potem studia.
- Premium tier "Enterprise" dopóki nie mamy 3 paying customers na Agency.
