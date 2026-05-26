// Single source of truth for marketing + UI copy.
// PL = primary locale, EN = parity translation (used by hreflang + future locale switch).
//
// Buyer-first principles:
//  - Lead with outcome ("prowadź klientów, nie tabelki"), not architecture ("Coach OS").
//  - Concrete proof (numbers, names of integrations), no "enterprise-grade".
//  - Every block ends in a next action.

export type Locale = "pl" | "en";

export interface MarketingCopy {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    keywords: string[];
  };
  nav: {
    features: string;
    pricing: string;
    faq: string;
    login: string;
    cta: string;
  };
  hero: {
    badge: string;
    h1Top: string;
    h1Accent: string;
    h1Bottom: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proof: string;
  };
  logos: { label: string; items: string[] };
  outcomes: {
    title: string;
    sub: string;
    cards: { kpi: string; label: string; note: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { title: string; body: string }[];
  };
  flow: {
    eyebrow: string;
    title: string;
    sub: string;
    steps: { n: string; title: string; body: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    sub: string;
    perMonth: string;
    cta: string;
    ctaSecondary: string;
    note: string;
  };
  faq: {
    title: string;
    sub: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    title: string;
    sub: string;
    cta: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    columns: { title: string; links: { label: string; href: string }[] }[];
    legal: string;
  };
}

const pl: MarketingCopy = {
  meta: {
    title: "DietApp — aplikacja dla trenerów personalnych i ich klientów",
    description:
      "Obsłuż 2× więcej klientów bez chaosu. Zamień WhatsApp, Excel i PDF-y w jeden system. Plany, check-iny, zdjęcia, AI-asystent. 99 PLN/mc, 14 dni za darmo.",
    ogAlt: "DietApp — aplikacja dla trenerów personalnych",
    keywords: [
      "aplikacja dla trenera personalnego",
      "panel trenera",
      "dieta online",
      "plan treningowy online",
      "trener personalny aplikacja",
      "aplikacja dla klientów trenera",
      "plan diety online",
      "trener dietetyk app",
      "fitness CRM",
      "aplikacja do prowadzenia podopiecznych",
      "system dla trenera",
      "online coaching software",
      "import klientów z excela"
    ]
  },
  nav: {
    features: "Funkcje",
    pricing: "Cennik",
    faq: "FAQ",
    login: "Zaloguj się",
    cta: "Wypróbuj za darmo"
  },
  hero: {
    badge: "Aplikacja webowa",
    h1Top: "Prowadź klientów.",
    h1Accent: "Nie tabelki.",
    h1Bottom: "",
    sub:
      "Zamień WhatsApp, Excel i PDF-y w jeden system. Onboarding klientów, plany, check-iny, zdjęcia postępu i AI-asystent — w jednym miejscu. 99 PLN/mc, pierwszy zatrzymany klient pokrywa rok subskrypcji.",
    ctaPrimary: "Wypróbuj za darmo · 14 dni",
    ctaSecondary: "Zobacz, jak to działa",
    proof: "Trenerzy odzyskują 5–10h tygodniowo, które wcześniej szły na administrację."
  },
  logos: {
    label: "Łączymy się z urządzeniami, których używają Twoi klienci",
    items: ["Apple Watch", "Garmin", "Whoop", "Oura", "Samsung Health", "Polar"]
  },
  outcomes: {
    title: "Co realnie zmienia się po przejściu na DietApp",
    sub: "Nie obiecujemy „rewolucji w branży”. Pokazujemy konkretne liczby od trenerów, którzy z nami pracują.",
    cards: [
      {
        kpi: "+1 klient",
        label: "pokrywa rok subskrypcji",
        note: "99 PLN/mc to nic, jeśli zatrzymasz choć jednego klienta więcej."
      },
      {
        kpi: "5–10 h",
        label: "tygodniowo z powrotem",
        note: "Mniej kopiowania planów i odpisywania ręcznie, więcej sesji."
      },
      {
        kpi: "2×",
        label: "więcej klientów bez zatrudniania",
        note: "Skalujesz, bo aplikacja robi onboarding, check-iny i przypomnienia za Ciebie."
      }
    ]
  },
  features: {
    eyebrow: "Co jest w środku",
    title: "To, co naprawdę zabija Excel",
    sub: "Onboarding, check-iny, progres, zdjęcia, płatności — przestają być Twoją robotą.",
    items: [
      {
        title: "Onboarding klienta w 5 minut",
        body:
          "Wyślij link, klient wypełnia ankietę, plan diety i treningu generuje się automatycznie. Import istniejących klientów z Excela albo Google Sheets."
      },
      {
        title: "Check-iny i przypomnienia automatycznie",
        body:
          "Cotygodniowe check-iny same się wysyłają. Klient odpowiada, AI streszcza, Ty widzisz jedno podsumowanie zamiast trzydziestu wiadomości."
      },
      {
        title: "AI admin assistant",
        body:
          "Wykrywa klientów at-risk, generuje weekly summary, sugeruje zmiany w planach, pisze pierwsze drafty odpowiedzi. Realnie odzyskujesz wieczory."
      },
      {
        title: "Plany diet i treningów (z AI lub ręcznie)",
        body:
          "Twórz w 5 min z bazą produktów albo pozwól AI rozpisać. Klient widzi listę zakupów, makra i wideo do ćwiczeń bez instrukcji obsługi."
      },
      {
        title: "Wymiany posiłków — koniec WhatsAppowych pytań",
        body:
          "Klient prosi o zamiennik, zatwierdza posiłek zawczasu albo otwiera Twój przepis. Wszystko w jednym inboxie. Akceptujesz, odrzucasz albo proponujesz inaczej — jednym kliknięciem."
      },
      {
        title: "Zdjęcia postępu + AI-weryfikacja posiłków",
        body:
          "Klient robi zdjęcie talerza, AI rozpoznaje produkty i sprawdza zgodność z planem. Zdjęcia sylwetki układają się w timeline porównawczy."
      },
      {
        title: "Twoja marka, Twoja aplikacja",
        body:
          "Logo, kolory, własna nazwa, własna domena w planie Agencja. Klient widzi Twoją markę — wygląda jak premium produkt, nie kolejny SaaS."
      }
    ]
  },
  flow: {
    eyebrow: "Jak zaczynasz",
    title: "Od rejestracji do pierwszego klienta w 10 minut",
    sub: "Nie potrzebujesz wdrożeniowca ani szkolenia. Wystarczy konto.",
    steps: [
      {
        n: "01",
        title: "Załóż konto",
        body: "Email, nazwa, plan. Bez karty na start, bez prowizji za klienta."
      },
      {
        n: "02",
        title: "Zaproś klienta linkiem",
        body: "Klient otwiera link w przeglądarce i loguje się przez magic link. Nic nie instaluje."
      },
      {
        n: "03",
        title: "Ułóż pierwszy plan",
        body: "Sam lub z pomocą AI. Klient od razu widzi dietę, trening i terminarz."
      },
      {
        n: "04",
        title: "Prowadź, nie pisz",
        body: "Komunikaty, sprawdzanie postępu, korekty — wszystko w jednym widoku."
      }
    ]
  },
  pricing: {
    eyebrow: "Cennik",
    title: "Trzy plany. Bez ukrytych dopłat. Bez prowizji od klienta.",
    sub: "Każdy plan ma 14 dni za darmo bez karty. Anulujesz w jednym kliknięciu, dane masz do eksportu przez 90 dni.",
    perMonth: "PLN / miesiąc",
    cta: "Zacznij za darmo",
    ctaSecondary: "Porozmawiaj z nami",
    note: "Faktura VAT na firmę. Płatność kartą lub przelewem. Roczna płatność = 2 miesiące gratis."
  },
  faq: {
    title: "Pytania, które dostajemy najczęściej",
    sub: "Jeśli nie ma tu Twojego — napisz, odpisujemy w ciągu doby.",
    items: [
      {
        q: "Czy klient musi coś instalować?",
        a: "Nie. Aplikacja działa w przeglądarce — na komputerze, tablecie i w telefonie. Klient klika link i wchodzi."
      },
      {
        q: "Mam już klientów w Excelu / Sheets / WhatsAppie. Przenoszenie to koszmar.",
        a: "Importujemy listę klientów jednym plikiem CSV. Plany diet i treningów wklejasz z Excela. Pierwsze 5 klientów przenosimy razem z Tobą na 30-minutowym calu — w pakiecie."
      },
      {
        q: "Co dokładnie robi AI admin assistant?",
        a: "Streszcza weekly check-iny w 3 zdania, wykrywa klientów którzy przestali odpisywać (at-risk), sugeruje korekty planów na podstawie pomiarów i pisze pierwsze drafty Twoich odpowiedzi. Włączasz go opcjonalnie."
      },
      {
        q: "Czy muszę umieć korzystać z AI?",
        a: "Nie. Wszystko działa też ręcznie. AI to dodatkowy tryb, nie wymóg."
      },
      {
        q: "Czy moi klienci widzą moją markę, nie waszą?",
        a: "W planie Studio i Agencja — Twoje logo, kolory i nazwa. W Agencji dodatkowo własna domena (np. app.tojetstwojadomena.pl). Klient nie wie, że stoi za tym DietApp."
      },
      {
        q: "Ile realnie kosztuje mnie aplikacja?",
        a: "99 PLN miesięcznie to mniej niż 1 sesja PT. Jeśli zatrzymasz dzięki niej choć jednego klienta więcej (300–800 PLN/mc), pokrywasz nią rok subskrypcji."
      },
      {
        q: "Co z RODO?",
        a: "Dane trzymamy w UE. Klient zatwierdza zgody przy rejestracji. Jako trener masz wgląd tylko w dane swoich klientów. Eksport i usunięcie konta — jedno kliknięcie."
      },
      {
        q: "Czy mogę zrezygnować w trakcie miesiąca?",
        a: "Tak. Subskrypcja działa do końca opłaconego okresu, dane pozostają dostępne do eksportu przez 90 dni. Bez prowizji, bez umów na rok."
      }
    ]
  },
  finalCta: {
    title: "Twoi klienci są gotowi na coś prostszego niż WhatsApp.",
    sub: "14 dni za darmo, bez karty. Pierwsi klienci przenoszeni razem z Tobą.",
    cta: "Zacznij za darmo",
    secondary: "Umów 15-min demo"
  },
  footer: {
    tagline: "Jedna aplikacja dla Ciebie i Twoich klientów.",
    columns: [
      {
        title: "Produkt",
        links: [
          { label: "Funkcje", href: "#features" },
          { label: "Cennik", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
          { label: "Zaloguj się", href: "/login" }
        ]
      },
      {
        title: "Dla kogo",
        links: [
          { label: "Trenerzy personalni", href: "#features" },
          { label: "Dietetycy", href: "#features" },
          { label: "Studia treningowe", href: "#pricing" }
        ]
      },
      {
        title: "Firma",
        links: [
          { label: "Kontakt", href: "mailto:hello@dietapp.pl" },
          { label: "Regulamin", href: "/legal/terms" },
          { label: "Polityka prywatności", href: "/legal/privacy" }
        ]
      }
    ],
    legal: "© 2026 DietApp. Wszystkie prawa zastrzeżone."
  }
};

const en: MarketingCopy = {
  meta: {
    title: "DietApp — the app for personal trainers and their clients",
    description:
      "Run clients, not spreadsheets. Diets, workouts, progress and an AI coach in one web app. Try it free.",
    ogAlt: "DietApp — app for personal trainers",
    keywords: [
      "personal trainer app",
      "online coaching software",
      "fitness CRM",
      "personal training software",
      "online diet plan app",
      "online workout planner",
      "trainer client app",
      "white label fitness app"
    ]
  },
  nav: {
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    login: "Log in",
    cta: "Try it free"
  },
  hero: {
    badge: "Web app",
    h1Top: "Run clients.",
    h1Accent: "Not spreadsheets.",
    h1Bottom: "",
    sub:
      "Replace WhatsApp, Excel and PDFs with one system. Client onboarding, plans, check-ins, progress photos and an AI assistant — in one place. From 99 PLN/mo, your first kept client pays for the year.",
    ctaPrimary: "Try it free · 14 days",
    ctaSecondary: "See how it works",
    proof: "Trainers get back 5–10h every week — hours that used to go on admin."
  },
  logos: {
    label: "We sync with the devices your clients already wear",
    items: ["Apple Watch", "Garmin", "Whoop", "Oura", "Samsung Health", "Polar"]
  },
  outcomes: {
    title: "What actually changes after switching to DietApp",
    sub: "We don't promise a revolution. We share concrete numbers from trainers who run their business with us.",
    cards: [
      { kpi: "+1 client", label: "pays for the year", note: "99 PLN/mo is nothing if you retain one extra client." },
      { kpi: "5–10 h", label: "back to you weekly", note: "Less plan copy-paste, less manual replies, more sessions." },
      { kpi: "2×", label: "more clients, same hours", note: "Onboarding, check-ins and reminders happen without you." }
    ]
  },
  features: {
    eyebrow: "What's inside",
    title: "What actually kills the spreadsheet",
    sub: "Onboarding, check-ins, progress, photos, payments — they stop being your job.",
    items: [
      { title: "5-minute client onboarding", body: "Send a link, client fills a form, diet and workout plans generate automatically. Import existing clients from Excel or Google Sheets." },
      { title: "Auto check-ins and reminders", body: "Weekly check-ins send themselves. Client replies, AI summarises, you see one summary instead of thirty messages." },
      { title: "AI admin assistant", body: "Detects at-risk clients, writes weekly summaries, suggests plan tweaks, drafts your replies. Real evenings back." },
      { title: "Diet and workout plans (AI or manual)", body: "Build in 5 minutes with the product database or let AI draft. Clients see a shopping list, macros and exercise videos — no instructions needed." },
      { title: "Meal exchanges — kill WhatsApp questions", body: "Client requests a swap, pre-approves a meal, or opens your recipe. All in one inbox. Approve, reject, or counter — one click." },
      { title: "Progress photos + AI meal check", body: "Client snaps a plate, AI recognises items and matches the plan. Body shots stack into a comparison timeline." },
      { title: "Your brand, your app", body: "Logo, colours, custom name. Custom domain on Agency. Clients see your brand — looks like a premium product, not another SaaS." }
    ]
  },
  flow: {
    eyebrow: "How you start",
    title: "From sign-up to first client in 10 minutes",
    sub: "No onboarding consultant, no training. Just an account.",
    steps: [
      { n: "01", title: "Create an account", body: "Email, name, plan. No card required, no per-client fees." },
      { n: "02", title: "Invite your client", body: "Client opens the link in their browser and logs in via magic link. Nothing to install." },
      { n: "03", title: "Build the first plan", body: "Manually or with AI. Client immediately sees diet, workout and calendar." },
      { n: "04", title: "Coach, don't type", body: "Updates, progress checks, tweaks — all in one view." }
    ]
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Three plans. No hidden fees. No per-client commission.",
    sub: "Every plan has 14 days free, no card. Cancel in one click, data stays exportable for 90 days.",
    perMonth: "PLN / month",
    cta: "Start free",
    ctaSecondary: "Talk to us",
    note: "VAT invoice. Card or transfer. Annual plan = 2 months free."
  },
  faq: {
    title: "Questions we get most",
    sub: "Don't see yours? Drop us a line — we reply within a day.",
    items: [
      { q: "Does my client need to install anything?", a: "No. The app runs in the browser — desktop, tablet, phone. Client clicks a link and is in." },
      { q: "My clients are in Excel / Sheets / WhatsApp. Moving is a nightmare.", a: "CSV import for the client list. Plans paste straight from Excel. We migrate your first 5 clients with you on a 30-min call — included." },
      { q: "What exactly does the AI admin assistant do?", a: "Summarises weekly check-ins in 3 sentences, flags clients who stopped replying (at-risk), suggests plan tweaks from measurements, and drafts your first replies. Optional." },
      { q: "Do I need to learn AI?", a: "No. Everything works manually too. AI is a mode, not a requirement." },
      { q: "Will my clients see my brand, not yours?", a: "On Studio and Agency — your logo, colours, name. Agency adds a custom domain. Your client doesn't know DietApp powers it." },
      { q: "What does it really cost me?", a: "99 PLN/mo is less than one PT session. Keep one extra client (300–800 PLN/mo) and you've paid for the year." },
      { q: "GDPR?", a: "EU hosting. Client consents at sign-up. As a trainer you only see your own clients' data. Export and account delete — one click." },
      { q: "Can I cancel mid-month?", a: "Yes. Active until the paid period ends. Data exportable for 90 days. No fees, no annual lock-in." }
    ]
  },
  finalCta: {
    title: "Your clients are ready for something simpler than WhatsApp.",
    sub: "14 days free, no card. We migrate your first clients with you.",
    cta: "Start free",
    secondary: "Book a 15-min demo"
  },
  footer: {
    tagline: "One app for you and your clients.",
    columns: [
      { title: "Product", links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
        { label: "Log in", href: "/login" }
      ]},
      { title: "For", links: [
        { label: "Personal trainers", href: "#features" },
        { label: "Nutritionists", href: "#features" },
        { label: "Training studios", href: "#pricing" }
      ]},
      { title: "Company", links: [
        { label: "Contact", href: "mailto:hello@dietapp.pl" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Privacy", href: "/legal/privacy" }
      ]}
    ],
    legal: "© 2026 DietApp. All rights reserved."
  }
};

export const copy: Record<Locale, MarketingCopy> = { pl, en };

export const DEFAULT_LOCALE: Locale = "pl";
