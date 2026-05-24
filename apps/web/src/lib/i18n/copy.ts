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
      "Prowadź klientów, nie tabelki. Diety, treningi, postępy i AI-coach w jednej aplikacji. Web, iOS i Android. Wypróbuj za darmo.",
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
      "aplikacja do prowadzenia podopiecznych"
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
    badge: "Web · iOS · Android",
    h1Top: "Prowadź klientów.",
    h1Accent: "Nie tabelki.",
    h1Bottom: "",
    sub:
      "Diety, treningi, pomiary, zdjęcia posiłków i AI-coach — w jednym miejscu, na każdym urządzeniu. Twoi podopieczni dostają aplikację z Twoim logo. Ty odzyskujesz wieczory.",
    ctaPrimary: "Wypróbuj za darmo",
    ctaSecondary: "Zobacz, jak to działa",
    proof: "Dziesiątki trenerów w Polsce pracują już w jednym narzędziu zamiast pięciu."
  },
  logos: {
    label: "Łączymy się z urządzeniami, których używają Twoi klienci",
    items: ["Apple Watch", "Garmin", "Whoop", "Oura", "Samsung Health", "Polar"]
  },
  outcomes: {
    title: "To, co naprawdę zmienia się po przejściu na DietApp",
    sub: "Nie obiecujemy „rewolucji w branży”. Pokazujemy, co policzyliśmy u trenerów, którzy z nami pracują.",
    cards: [
      {
        kpi: "6 h",
        label: "tygodniowo dla Ciebie",
        note: "Mniej kopiowania planów, więcej sesji."
      },
      {
        kpi: "3×",
        label: "więcej kontaktu z klientem",
        note: "Bo dzieje się to w jednej aplikacji, a nie w pięciu czatach."
      },
      {
        kpi: "92%",
        label: "klientów wraca w drugim miesiącu",
        note: "Aplikacja pokazuje im progres — sami widzą sens."
      }
    ]
  },
  features: {
    eyebrow: "Co jest w środku",
    title: "Wszystko, co dotąd robiłeś w pięciu zakładkach",
    sub: "Excel, WhatsApp, FitNotes, Trello, Notion — zostaje tylko jedna karta.",
    items: [
      {
        title: "Plany diety, które klient otwiera w sekundę",
        body:
          "Twórz plan w 5 minut z bazą produktów lub pozwól AI ułożyć propozycję. Klient widzi listę zakupów, makro i przepisy bez instrukcji obsługi."
      },
      {
        title: "Treningi z wideo i historią serii",
        body:
          "Każde ćwiczenie ma demonstrację, klient zaznacza wykonane serie, Ty widzisz postęp w czasie rzeczywistym."
      },
      {
        title: "Zdjęcia posiłków + AI-weryfikacja",
        body:
          "Klient robi zdjęcie talerza, AI rozpoznaje produkty i sprawdza zgodność z planem. Ty potwierdzasz jednym kliknięciem."
      },
      {
        title: "Smartwatch i opaski — automatycznie",
        body:
          "Sen, regeneracja i kroki z Apple Watch, Whoop, Garmin, Oura, Polar i Samsung Health spinają się do panelu klienta same."
      },
      {
        title: "Pomiary i wykresy bez Excela",
        body:
          "Waga, obwody, zdjęcia sylwetki, samopoczucie — wszystko na jednej osi czasu, którą widzi też klient."
      },
      {
        title: "Twoja marka, nie nasza",
        body:
          "Logo, kolory, własna nazwa w wyższych planach. Klient widzi Twoją aplikację, nie naszą."
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
        body: "Klient instaluje aplikację na iOS lub Android, loguje się przez magic link."
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
    title: "Płacisz tyle, ilu masz klientów. Bez ukrytych dopłat.",
    sub: "Wszystkie plany działają na web, iOS i Android. Anulujesz, kiedy chcesz.",
    perMonth: "PLN / miesiąc",
    cta: "Wybierz plan",
    ctaSecondary: "Porozmawiaj z nami",
    note: "Faktura VAT na firmę. Płatność kartą lub przelewem."
  },
  faq: {
    title: "Pytania, które dostajemy najczęściej",
    sub: "Jeśli nie ma tu Twojego — napisz, odpisujemy w ciągu doby.",
    items: [
      {
        q: "Czy klient musi instalować aplikację?",
        a: "Może, ale nie musi. Aplikacja działa w przeglądarce tak samo dobrze jak na iOS i Androidzie. Klient sam wybiera."
      },
      {
        q: "Co się dzieje, jeśli mam już bazę klientów gdzie indziej?",
        a: "Importujemy dane z arkusza CSV. Plany diet i treningów możesz przekleić — z Excela też."
      },
      {
        q: "Czy muszę umieć korzystać z AI?",
        a: "Nie. AI jest opcjonalna i działa w tle. Możesz układać plany całkowicie ręcznie."
      },
      {
        q: "Czy moi klienci widzą moją markę?",
        a: "Tak. W planie Studio i wyżej dodajesz logo, kolory i nazwę. Klient widzi Twoją aplikację, nie naszą."
      },
      {
        q: "Co z RODO?",
        a: "Dane trzymamy w UE. Klient zatwierdza zgody przy rejestracji. Jako trener masz wgląd tylko w dane swoich klientów."
      },
      {
        q: "Czy mogę zrezygnować w trakcie miesiąca?",
        a: "Tak. Subskrypcja działa do końca opłaconego okresu, dane pozostają dostępne do eksportu przez 90 dni."
      }
    ]
  },
  finalCta: {
    title: "Twoi klienci czekają na coś prostszego.",
    sub: "Przetestuj za darmo przez 14 dni. Nie pytamy o kartę.",
    cta: "Wypróbuj za darmo",
    secondary: "Umów demo"
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
      "Run clients, not spreadsheets. Diets, workouts, progress and an AI coach in one app — web, iOS and Android. Try it free.",
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
    badge: "Web · iOS · Android",
    h1Top: "Run clients.",
    h1Accent: "Not spreadsheets.",
    h1Bottom: "",
    sub:
      "Diets, workouts, measurements, meal photos and an AI coach — in one app, on every device. Your clients get an app with your logo. You get your evenings back.",
    ctaPrimary: "Try it free",
    ctaSecondary: "See how it works",
    proof: "Dozens of trainers already work in one tool instead of five."
  },
  logos: {
    label: "We sync with the devices your clients already wear",
    items: ["Apple Watch", "Garmin", "Whoop", "Oura", "Samsung Health", "Polar"]
  },
  outcomes: {
    title: "What actually changes after switching to DietApp",
    sub: "We don't promise a revolution. We share what we measure with trainers who run their business with us.",
    cards: [
      { kpi: "6 h", label: "back to you weekly", note: "Less plan copy-paste, more sessions." },
      { kpi: "3×", label: "more client touchpoints", note: "Because it happens in one app, not five chats." },
      { kpi: "92%", label: "retention into month two", note: "Clients see their own progress and stay." }
    ]
  },
  features: {
    eyebrow: "What's inside",
    title: "Everything you've been doing in five tabs",
    sub: "Excel, WhatsApp, Notion, Trello, FitNotes — one tab is enough.",
    items: [
      { title: "Diet plans clients open in a second", body: "Build a plan in five minutes with the product database or let AI draft it. Clients see a shopping list, macros and recipes — no instructions needed." },
      { title: "Workouts with video and set history", body: "Every exercise has a demo. Clients tick sets, you see progress live." },
      { title: "Meal photos with AI check", body: "Client snaps a plate, AI recognises products and matches it to the plan. You confirm with one tap." },
      { title: "Wearables — automatic", body: "Sleep, recovery and steps from Apple Watch, Whoop, Garmin, Oura, Polar and Samsung Health show up in the panel by themselves." },
      { title: "Measurements without Excel", body: "Weight, circumference, body shots, mood — on one timeline both of you can see." },
      { title: "Your brand, not ours", body: "Logo, colours, custom name on higher plans. Clients see your app, not ours." }
    ]
  },
  flow: {
    eyebrow: "How you start",
    title: "From sign-up to first client in 10 minutes",
    sub: "No onboarding consultant, no training. Just an account.",
    steps: [
      { n: "01", title: "Create an account", body: "Email, name, plan. No card required, no per-client fees." },
      { n: "02", title: "Invite your client", body: "Client installs iOS or Android, logs in via magic link." },
      { n: "03", title: "Build the first plan", body: "Manually or with AI. Client immediately sees diet, workout and calendar." },
      { n: "04", title: "Coach, don't type", body: "Updates, progress checks, tweaks — all in one view." }
    ]
  },
  pricing: {
    eyebrow: "Pricing",
    title: "You pay per the clients you have. No hidden fees.",
    sub: "Every plan works on web, iOS and Android. Cancel anytime.",
    perMonth: "PLN / month",
    cta: "Choose plan",
    ctaSecondary: "Talk to us",
    note: "VAT invoice. Card or transfer."
  },
  faq: {
    title: "Questions we get most",
    sub: "Don't see yours? Drop us a line — we reply within a day.",
    items: [
      { q: "Does my client have to install an app?", a: "Optional. The web version works as well as iOS and Android. Client picks." },
      { q: "I have clients elsewhere — can I move?", a: "Import via CSV. Plans paste from Excel." },
      { q: "Do I need to learn AI?", a: "No. AI is optional. You can plan everything by hand." },
      { q: "Will my clients see my brand?", a: "On Studio and above — your logo, colours and name. They see your app." },
      { q: "GDPR?", a: "EU hosting. Client consents at sign-up. As a trainer you only see your own clients' data." },
      { q: "Can I cancel mid-month?", a: "Yes. Active until the paid period ends. Data stays exportable for 90 days." }
    ]
  },
  finalCta: {
    title: "Your clients are waiting for something simpler.",
    sub: "Test free for 14 days. No card required.",
    cta: "Try it free",
    secondary: "Book a demo"
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
