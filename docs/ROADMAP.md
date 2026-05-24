# Roadmap

Stan na 2026-05-23. Krótkie odcinki, "shippable" co tydzień.

## Wykonane w tej iteracji (refaktor + mobile scaffold)

- **Publiczna strona `/` w Next.js**: server-rendered, buyer-first PL, EN-ready,
  z JSON-LD (Organization, SoftwareApplication, FAQPage).
- **SEO foundations**: `sitemap.ts`, `robots.ts`, `manifest.ts`,
  dynamiczny OG (`opengraph-image.tsx`), metadataBase, hreflang.
- **Aplikacja przeniesiona pod `/app`**: `/` to teraz strona produktu, nie
  spinner.
- **Wycięcie "investor pitch" kopii**: "Coach OS", "90% marża", "AI Vision Coach"
  → buyer-first ("Prowadź klientów. Nie tabelki.").
- **Monorepo (npm workspaces)**: `apps/web`, `apps/mobile`, `packages/core`.
- **`packages/core`**: typy domenowe + brand tokens + makra, wspólne dla web i mobile.
- **`apps/mobile` (Expo + NativeWind + expo-router)**: auth + 3 ekrany klienta
  (Dziś / Dieta / Trening). Buildowalne na iOS i Android, jeszcze nie w storach.
- **Dokumenty zaktualizowane**: `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`,
  `ROADMAP.md`.

## Następne 1–2 tygodnie

1. **Web build + Lighthouse audit** — uruchomić `npm run web:build`, sprawdzić
   Core Web Vitals i odpalić Lighthouse 4× na `/`. Cel: 95+ Performance, 100 SEO.
2. **`apps/web` migracja typów** — przepiąć `apps/web/src/lib/types.ts` na
   re-eksport z `@dietapp/core`, usunąć duplikację.
3. **Mobile install run** — `npm install` w root, `npx expo start` z apps/mobile,
   sprawdzić iOS i Android w Expo Go.
4. **Domena + Vercel** — kupić `dietapp.pl`, postawić na Vercelu, ustawić
   `NEXT_PUBLIC_SITE_URL`.

## Kolejny miesiąc

5. **Realny backend** — wybór: zostać przy Spring Boot vs migracja do Supabase /
   Node API (decyzja w osobnym ADR).
6. **Onboarding trenera** — 4-krokowy kreator po pierwszym logowaniu.
7. **EN release** — przełącznik PL/EN w nawigacji + dedykowane URL `/en`.
8. **Marketing**: blog (MDX, `app/blog/[slug]`), case studies, programatic SEO
   (strony pod konkretne intencje wyszukiwań trenerów).
9. **Stripe** — checkout dla planów Starter/Studio/Agency, Stripe Customer Portal.
10. **Apple Health / Health Connect** — w mobile (klient).

## Świadomy out-of-scope (na teraz)

- Trener mobile — work-from-desk persona, web wystarczy.
- White-label "własna domena" — Plan Agency, ale wdrażamy po Stripe.
- Native build farm / EAS Build — po pierwszej testowej wersji w storach.
- Storybook / Chromatic — zbyt mała powierzchnia kodu na obecnej skali.

## Decyzje do podjęcia (open)

- Domena: `dietapp.pl` vs `dietapp.app` (EN-friendly).
- Hosting: Vercel vs Cloudflare Pages vs własny Docker.
- Analityka: Plausible (privacy-first) vs Google Analytics 4.
- Crash reporting w mobile: Sentry (na razie tak).
