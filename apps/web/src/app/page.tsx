import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Heart,
  Apple,
  Smartphone,
  ShieldCheck,
  Camera,
  Activity,
  Salad,
  Watch,
  Paintbrush,
  LineChart
} from "lucide-react";
import { copy, DEFAULT_LOCALE } from "@/lib/i18n/copy";
import { PLANS } from "@/lib/plans";
import { MarketingNav } from "@/components/landing/MarketingNav";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

const t = copy[DEFAULT_LOCALE];

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  keywords: t.meta.keywords,
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
      "en-US": "/?lang=en"
    }
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_US"],
    title: t.meta.title,
    description: t.meta.description,
    siteName: "DietApp",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: t.meta.description
  },
  robots: { index: true, follow: true }
};

const featureIcons = [Salad, Activity, Camera, Watch, LineChart, Paintbrush];

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      <MarketingNav nav={t.nav} />

      <main className="overflow-hidden">
        <Hero />
        <DeviceLogos />
        <Outcomes />
        <Features />
        <FlowSteps />
        <Pricing />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    </>
  );
}

// ---------- Sections ----------

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-mesh-warm opacity-90" />
      <div className="absolute inset-0 -z-10 bg-grid-light [background-size:24px_24px] opacity-50" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-12 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
          <span className="inline-flex items-center gap-1.5 chip-brand">
            <Sparkles className="h-3.5 w-3.5" /> {t.hero.badge}
          </span>
          <h1 className="mt-5 font-display text-[44px] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-ink-900 leading-[1.02]">
            {t.hero.h1Top}
            <br />
            <span className="text-gradient">{t.hero.h1Accent}</span>
            {t.hero.h1Bottom && (
              <>
                <br />
                {t.hero.h1Bottom}
              </>
            )}
          </h1>
          <p className="mt-6 text-lg text-ink-600 max-w-xl leading-relaxed">{t.hero.sub}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="btn-primary text-base px-6 py-3.5">
              {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="btn-ghost text-base px-6 py-3.5">
              {t.hero.ctaSecondary}
            </a>
          </div>

          <ul className="mt-8 grid sm:grid-cols-3 gap-3 text-sm text-ink-700">
            <Check>14 dni bez karty</Check>
            <Check>iOS · Android · web</Check>
            <Check>Faktura VAT, anuluj kiedy chcesz</Check>
          </ul>

          <p className="mt-7 text-sm text-ink-500 italic">{t.hero.proof}</p>
        </div>

        <div className="relative">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function DeviceLogos() {
  return (
    <section className="border-y border-ink-100/70 bg-white/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 lg:py-10">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-ink-500 font-semibold">
          {t.logos.label}
        </p>
        <div className="mt-5 flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-ink-500">
          {t.logos.items.map((name) => (
            <span
              key={name}
              className="font-display text-sm md:text-base font-semibold tracking-tight text-ink-600/80 hover:text-ink-900 transition"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
            {t.outcomes.title}
          </h2>
          <p className="mt-3 text-ink-600 leading-relaxed">{t.outcomes.sub}</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {t.outcomes.cards.map((c) => (
            <div
              key={c.label}
              className="card flex flex-col"
            >
              <div className="font-display text-5xl lg:text-6xl font-semibold text-gradient leading-none">
                {c.kpi}
              </div>
              <div className="mt-3 font-semibold text-ink-900">{c.label}</div>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-600">
            {t.features.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
            {t.features.title}
          </h2>
          <p className="mt-3 text-ink-600">{t.features.sub}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.features.items.map((f, i) => {
            const Icon = featureIcons[i] ?? Sparkles;
            return (
              <div key={f.title} className="card group">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 ring-1 ring-white/80">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FlowSteps() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-600">
            {t.flow.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
            {t.flow.title}
          </h2>
          <p className="mt-3 text-ink-600">{t.flow.sub}</p>
        </div>

        <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.flow.steps.map((step) => (
            <li key={step.n} className="card relative">
              <div className="font-display text-sm font-semibold text-brand-600 tracking-wider">
                {step.n}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 -z-10 bg-mesh-warm opacity-60" />
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-600">
            {t.pricing.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-ink-600">{t.pricing.sub}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 items-stretch">
          {PLANS.map((p) => {
            const featured = p.tier === "studio";
            return (
              <div
                key={p.tier}
                className={`relative rounded-3xl p-7 lg:p-8 flex flex-col ${
                  featured
                    ? "bg-gradient-to-br from-brand-500 to-amber-500 text-white shadow-glow ring-1 ring-white/40"
                    : "glass-strong text-ink-900"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-brand-600 text-[11px] font-semibold tracking-wider uppercase shadow-soft">
                    {p.badge ?? "Najpopularniejszy"}
                  </span>
                )}
                <div className={`text-xs uppercase tracking-[0.16em] font-semibold ${featured ? "text-white/85" : "text-brand-600"}`}>
                  {p.name}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={`font-display text-5xl font-semibold tracking-tight ${featured ? "text-white" : "text-ink-900"}`}>
                    {p.priceMonthly}
                  </span>
                  <span className={featured ? "text-white/85 text-sm" : "text-ink-500 text-sm"}>
                    {t.pricing.perMonth}
                  </span>
                </div>
                <div className={`mt-1 text-sm ${featured ? "text-white/80" : "text-ink-500"}`}>
                  do {p.clientSlots} podopiecznych
                </div>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${featured ? "text-white" : "text-emerald-600"}`}
                      />
                      <span className={featured ? "text-white/95" : "text-ink-700"}>{line}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`mt-auto pt-8 ${
                    featured
                      ? "[&>span]:bg-white [&>span]:text-brand-700 [&>span]:shadow-soft"
                      : ""
                  }`}
                >
                  <span
                    className={`inline-flex w-full justify-center items-center gap-2 rounded-xl px-5 py-3 font-medium transition-all ${
                      featured
                        ? "bg-white text-brand-700 hover:-translate-y-0.5"
                        : "btn-primary"
                    }`}
                  >
                    {t.pricing.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-ink-600">{t.pricing.note}</p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
            {t.faq.title}
          </h2>
          <p className="mt-3 text-ink-600">{t.faq.sub}</p>
        </div>
        <div className="mt-10">
          <FaqAccordion items={t.faq.items} />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-amber-600 p-10 lg:p-16 text-white shadow-glow">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0px, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,200,150,0.4) 0px, transparent 40%)"
          }} />
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl lg:text-5xl font-semibold tracking-tight">
              {t.finalCta.title}
            </h2>
            <p className="mt-4 text-white/90 text-lg">{t.finalCta.sub}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-700 px-6 py-3.5 font-medium shadow-soft hover:-translate-y-0.5 transition"
              >
                {t.finalCta.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:hello@dietapp.pl"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 border border-white/30 px-6 py-3.5 font-medium text-white hover:bg-white/25 transition"
              >
                {t.finalCta.secondary}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" /> iOS · Android
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Dane w UE, RODO
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4" /> Made in PL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-100/70 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14 grid md:grid-cols-4 gap-8">
        <div>
          <Link href="/" aria-label="DietApp">
            {/* Reuse Logo via inline import would couple this to client; cheap render below */}
            <div className="font-display text-xl font-semibold tracking-tight text-ink-900">
              Diet<span className="text-gradient">App</span>
            </div>
          </Link>
          <p className="mt-3 text-sm text-ink-600 max-w-xs">{t.footer.tagline}</p>
        </div>
        {t.footer.columns.map((col) => (
          <div key={col.title}>
            <div className="text-xs uppercase tracking-[0.16em] font-semibold text-ink-500 mb-3">
              {col.title}
            </div>
            <ul className="space-y-2 text-sm text-ink-700">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-ink-900 transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100/70">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5 text-xs text-ink-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t.footer.legal}</span>
          <span className="inline-flex items-center gap-1.5">
            <Apple className="h-3.5 w-3.5" /> Aplikacja na iOS i Android
          </span>
        </div>
      </div>
    </footer>
  );
}

// ---------- SEO: structured data ----------

function JsonLd() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dietapp.pl";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DietApp",
    url: site,
    logo: `${site}/icon.svg`,
    sameAs: [] as string[]
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DietApp",
    operatingSystem: "Web, iOS, Android",
    applicationCategory: "HealthApplication",
    description: t.meta.description,
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.priceMonthly,
      priceCurrency: "PLN",
      url: `${site}/login`
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "42"
    }
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
