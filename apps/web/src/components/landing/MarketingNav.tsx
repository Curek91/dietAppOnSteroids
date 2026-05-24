"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { MarketingCopy } from "@/lib/i18n/copy";

export function MarketingNav({ nav }: { nav: MarketingCopy["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" aria-label="DietApp">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-700">
          <a href="#features" className="hover:text-ink-900 transition">
            {nav.features}
          </a>
          <a href="#pricing" className="hover:text-ink-900 transition">
            {nav.pricing}
          </a>
          <a href="#faq" className="hover:text-ink-900 transition">
            {nav.faq}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            {nav.login}
          </Link>
          <Link href="/login" className="btn-primary">
            {nav.cta}
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden h-10 w-10 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/60 bg-white/90 backdrop-blur-xl">
          <nav className="px-5 py-4 flex flex-col gap-3 text-ink-800">
            <a href="#features" onClick={() => setOpen(false)}>
              {nav.features}
            </a>
            <a href="#pricing" onClick={() => setOpen(false)}>
              {nav.pricing}
            </a>
            <a href="#faq" onClick={() => setOpen(false)}>
              {nav.faq}
            </a>
            <Link href="/login" className="btn-ghost mt-2" onClick={() => setOpen(false)}>
              {nav.login}
            </Link>
            <Link href="/login" className="btn-primary" onClick={() => setOpen(false)}>
              {nav.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
