# i18n Guide

Pierwsza warstwa internacjonalizacji żyje już w produkcie: **PL primary, EN ready**.

## Gdzie są teksty publiczne

Wszystkie nagłówki, sekcje i mikrokopia landingu mieszkają w:

```
apps/web/src/lib/i18n/copy.ts
```

Eksport `copy` jest typowany (`Record<Locale, MarketingCopy>`). Komponent landingu
pobiera `t = copy[DEFAULT_LOCALE]` i renderuje server-side. Wymiana locale dla
publicznej strony = zmiana `DEFAULT_LOCALE` lub przekazanie locale z route'a.

## Dodawanie nowej sekcji

1. Dodaj pole w `MarketingCopy` (typ TypeScript).
2. Wypełnij `pl` **i** `en` (TS wymusi parytet — nie da się dorzucić tylko PL).
3. Korzystaj w komponencie przez `t.<sekcja>.<klucz>`.

## Mobile

Mobile w MVP używa kopii hardkodowanej w ekranach (po polsku). Po dodaniu
przełącznika locale do `@dietapp/core` przeniesiemy mobile w to samo źródło.
Wspólny tagline (`taglines.primary`) jest już w `packages/core/src/brand.ts`.

## Konwencje pisarskie

- **PL:** "ty", nie "Pan/Pani". Krótkie zdania. Liczby zamiast superlatywów.
- **EN:** US English, sentence case w nagłówkach (nie Title Case).
- **Liczby/jednostki:** PLN zostaje (nie tłumaczymy waluty). "kcal" w obu.
- **Nazwy własne:** Apple Watch, Whoop, Garmin, Oura — bez tłumaczenia.

## SEO i locale

- `hreflang` ustawione w `layout.tsx` (`alternates.languages`).
- OG locale: `pl_PL`, `alternateLocale: ["en_US"]`.
- Każda EN strona MUSI mieć własny URL (np. `/en/...`) zanim włączymy locale
  switch. Dopóki działamy tylko na PL, EN trzymamy gotowe w copy.ts.

## Roadmapa locale

- **Teraz:** PL primary, EN gotowe w pliku copy (off-the-shelf, nie pokazane).
- **Po pierwszych klientach PL:** włączyć EN na `/en/...`, dodać switcher w nav.
- **Później:** DE, FR — dopiero po validation, że EN konwertuje.

## Czego nie robimy

- Nie ładujemy `next-intl` / `i18next` dla 2 locales i jednej strony. Plain
  TypeScript object załatwia sprawę i daje pełną typową kontrolę.
- Nie tłumaczymy nazw produktów ani CTA na siłę — jeśli "magic link" jest
  jasne w PL, zostaje.
- Nie wspieramy RTL, dopóki nie celujemy w rynki arabskie (nie ma w planach).
