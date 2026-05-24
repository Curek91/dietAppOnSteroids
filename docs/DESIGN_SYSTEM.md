# Design System

Stan na 2026-05-23.

## Marka

- **Nazwa:** DietApp
- **Sublabel:** "Dla trenerów" (zastąpił "Coach OS" — buyer-first)
- **Tagline:** _Prowadź klientów. Nie tabelki._
- **Persona:** spokój i kompetencja. Apple-level polish bez ostentacji.

## Kolory (single source of truth: `packages/core/src/brand.ts`)

| Token       | Hex       | Użycie                              |
| ----------- | --------- | ----------------------------------- |
| `brand.500` | `#f97316` | główny CTA, akcent                  |
| `brand.600` | `#ea580c` | hover / pressed                     |
| `brand.400` | `#fb923c` | gradient stops                      |
| `ink.900`   | `#0f172a` | nagłówki                            |
| `ink.700`   | `#334155` | tekst właściwy                      |
| `ink.500`   | `#64748b` | tekst pomocniczy                    |
| `ink.100`   | `#f1f5f9` | dividers, tła wewnątrz kart         |
| `ink.50`    | `#f8fafc` | tło aplikacji                       |

Sekundarne tony używamy oszczędnie:
- emerald (success / progres), rose (alert / kalorie), amber (energia, food)

## Typografia

- **Display:** Sora (600/700) — nagłówki, KPI
- **Sans:** Inter (400/500/600/700) — UI, paragrafy
- **Mono:** systemowy — czasy, kody, demo dane

Skala (web):
- H1: 48–72 px (`font-display`, tracking-tight)
- H2: 32–40 px
- H3: 18–20 px
- Body: 16 px, line-height 1.5–1.6
- Caption: 11–12 px, uppercase + tracking-widest dla labelek

## Layout

- Kontener marketing/aplikacja: `max-w-6xl` (1152 px), padding 20/32 (mobile/desktop).
- Sekcje landingowe: `py-20 lg:py-28`.
- Karty: `rounded-2xl`, glass: `bg-white/65 backdrop-blur-xl`.
- Promień buttonów: `rounded-xl` (12 px).

## Komponenty (web)

Źródło: `apps/web/src/app/globals.css` + `apps/web/src/components/*`.

- `Logo` — orange tile + sublabel "Dla trenerów"
- `MarketingNav` — sticky, blur on scroll, hamburger ≤ md
- `PhoneMockup` — pure SVG/CSS, server-render safe, używamy w hero
- `FaqAccordion` — pojedynczy otwarty wpis, smooth max-height transition
- `AppShell` — boczna nawigacja + topbar aplikacji
- `MacrosBar` — pasek białko/węgle/tłuszcz z animacją

## Komponenty (mobile)

Źródło: `apps/mobile/src/components/*`.

- `Screen` — SafeArea + ScrollView, padding 20.
- `Card` — `rounded-2xl`, `bg-white`, soft shadow.
- Tabs: bottom tabs z lucide-react-native ikonami w kolorze `brand.500` aktywnym.

## Voice & tone (BUYER-FIRST)

**Tak:**
- "Prowadź klientów. Nie tabelki."
- "Zaproś klienta linkiem. On instaluje aplikację i widzi swój plan."
- "AI sprawdzi zgodność z planem i poinformuje Twojego trenera."

**Nie:**
- "Enterprise-grade platform" → po polsku: "platforma klasy enterprise"
- "Coach OS" / "Platform" / "System"
- "90% marża" — to copy pod inwestorów, nie pod trenera
- "Elite" / "Revolutionary"
- "AI-powered next-gen ecosystem"

Każda sekcja kończy się **jasnym CTA**. Każdy ekran w aplikacji mówi
użytkownikowi, **co ma zrobić jako następne**.

## i18n

Wszystkie teksty publicznej strony żyją w `apps/web/src/lib/i18n/copy.ts`
jako PL i EN obok siebie. PL jest primary (hreflang, OG locale). EN jest
gotowe do włączenia bez zmian struktury.

Reguły:
- Polski idzie pierwszy, EN to parytetowe tłumaczenie.
- Liczby konkretne ("6 h tygodniowo"), nie "X%".
- Nazwy urządzeń (Apple Watch, Whoop, Garmin) zostają w obu locales.

## SEO

- `<title>` ≤ 60 znaków, lead: "DietApp — aplikacja dla trenerów…"
- `<meta description>` ≤ 160 znaków, kończy się CTA ("Wypróbuj za darmo").
- Każda publiczna strona: canonical + hreflang pl-PL/en-US.
- JSON-LD: Organization, SoftwareApplication, FAQPage (już na `/`).
- OG: dynamiczny obraz 1200×630 (`opengraph-image.tsx`, edge runtime).
