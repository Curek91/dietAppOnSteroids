"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-ink-100 rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-glass">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 md:py-6 text-left group"
            >
              <span className="font-display text-base md:text-lg font-semibold text-ink-900">
                {item.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-ink-500 transition-transform group-hover:text-brand-500 ${
                  isOpen ? "rotate-180 text-brand-600" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 md:px-8 pb-6 text-ink-600 leading-relaxed max-w-3xl">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
