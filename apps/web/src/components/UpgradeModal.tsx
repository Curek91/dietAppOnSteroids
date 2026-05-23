"use client";

import Link from "next/link";
import { Check, X, Crown, Sparkles } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { useApp } from "@/lib/store";

export function UpgradeModal({ onClose, currentTier }: { onClose: () => void; currentTier: string }) {
  const changePlan = useApp((s) => s.changePlan);
  const currentUserId = useApp((s) => s.currentUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-8 w-full max-w-4xl animate-slide-up relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/80 text-ink-500">
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 via-brand-500 to-purple-500 items-center justify-center text-white shadow-glow mb-3">
            <Crown className="h-5 w-5" />
          </div>
          <h3 className="font-display text-3xl font-semibold text-ink-900">Skaluj swoje studio</h3>
          <p className="text-ink-500 mt-1">Więcej klientów. Więcej AI. Większy revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((p) => {
            const isCurrent = p.tier === currentTier;
            const featured = p.tier === "studio";
            return (
              <div
                key={p.tier}
                className={`relative rounded-2xl p-6 ${
                  featured
                    ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white shadow-glow ring-2 ring-purple-400"
                    : "bg-white/80 border border-ink-100"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-purple-600 text-[10px] font-semibold uppercase tracking-wider shadow-soft">
                    <Sparkles className="inline h-3 w-3 mr-1" />{p.badge}
                  </span>
                )}
                <h4 className={`font-display text-xl font-semibold ${featured ? "text-white" : "text-ink-900"}`}>{p.name}</h4>
                <div className={`mt-2 ${featured ? "text-white" : "text-ink-900"}`}>
                  <span className="font-display text-4xl font-bold">{p.priceMonthly}</span>
                  <span className="text-sm opacity-70 ml-1">PLN/mc</span>
                </div>
                <p className={`text-sm mt-1 mb-4 ${featured ? "text-white/80" : "text-ink-500"}`}>
                  Do {p.clientSlots} podopiecznych
                </p>
                <ul className="space-y-1.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className={`flex gap-2 ${featured ? "text-white/95" : "text-ink-700"}`}>
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${featured ? "text-amber-200" : "text-emerald-500"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    if (currentUserId) {
                      changePlan(currentUserId, p.tier);
                      onClose();
                    }
                  }}
                  className={`w-full mt-6 py-2.5 rounded-xl font-medium transition ${
                    isCurrent
                      ? "bg-ink-100 text-ink-500 cursor-default"
                      : featured
                      ? "bg-white text-purple-600 hover:bg-amber-50 shadow-soft"
                      : "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow hover:from-brand-600 hover:to-brand-700"
                  }`}
                >
                  {isCurrent ? "Twój aktualny plan" : `Przejdź na ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link href="/trainer/billing" onClick={onClose} className="text-sm text-brand-600 hover:underline">
            Zobacz pełne porównanie i unit economics →
          </Link>
        </div>
      </div>
    </div>
  );
}
