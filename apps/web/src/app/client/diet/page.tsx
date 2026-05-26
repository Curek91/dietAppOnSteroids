"use client";

import { useState } from "react";
import { Salad, ChefHat, Clock } from "lucide-react";
import { useApp } from "@/lib/store";
import { macrosForMeal, macrosForPlan, macrosForItem, round } from "@/lib/macros";
import { MacrosBar } from "@/components/MacrosBar";

export default function ClientDietPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const dietPlans = useApp((s) => s.dietPlans);
  const products = useApp((s) => s.products);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);
  const plans = profile ? dietPlans.filter((d) => d.clientId === profile.id) : [];
  const [activeId, setActiveId] = useState<string | null>(plans[0]?.id ?? null);
  const active = plans.find((p) => p.id === activeId) ?? plans[0] ?? null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Twoja dieta</h1>
        <p className="text-ink-500 mt-1">Plany przygotowane przez trenera</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              active?.id === p.id ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "bg-white/60 border border-ink-200/60 text-ink-700"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {!active ? (
        <div className="card text-center py-16">
          <Salad className="h-12 w-12 mx-auto text-ink-300 mb-3" />
          <h3 className="font-display text-xl font-semibold text-ink-900">Brak aktywnego planu</h3>
          <p className="text-ink-500 mt-1">Skontaktuj się z trenerem.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink-900">{active.name}</h2>
                <p className="text-sm text-ink-500">{active.startDate} → {active.endDate}</p>
                {active.notes && <p className="text-sm text-ink-600 mt-1.5 italic">"{active.notes}"</p>}
              </div>
              <span className="chip-brand">Aktywny</span>
            </div>
          </div>

          <MacrosBar macros={macrosForPlan(active, products)} target={active.targetKcal} />

          <div className="space-y-4">
            {active.meals.map((meal) => {
              const m = macrosForMeal(meal, products);
              return (
                <div key={meal.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink-900">{meal.name}</h3>
                      <p className="text-[11px] text-ink-500">
                        {round(m.kcal)} kcal · B {round(m.protein, 1)}g · W {round(m.carbs, 1)}g · T {round(m.fat, 1)}g
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {meal.items.map((it) => {
                      const product = products.find((p) => p.id === it.productId);
                      if (!product) return null;
                      const im = macrosForItem(product, it.grams);
                      return (
                        <li key={product.id} className="flex items-center justify-between rounded-xl bg-white/60 border border-ink-100 px-4 py-2.5">
                          <div>
                            <div className="text-sm font-medium text-ink-900">{product.name}</div>
                            <div className="text-[11px] text-ink-500">{round(im.kcal)} kcal · B {round(im.protein, 1)}g · W {round(im.carbs, 1)}g · T {round(im.fat, 1)}g</div>
                          </div>
                          <div className="text-sm font-semibold text-ink-800">{it.grams} g</div>
                        </li>
                      );
                    })}
                    {meal.items.length === 0 && (
                      <li className="text-center text-sm text-ink-500 py-3">Pusty posiłek</li>
                    )}
                  </ul>

                  {meal.recipe && (
                    <details className="mt-4 group rounded-2xl bg-gradient-to-br from-brand-50/80 to-amber-50/60 border border-brand-200/70 open:shadow-soft transition">
                      <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-8 w-8 rounded-xl bg-white shadow-soft flex items-center justify-center">
                            <ChefHat className="h-4 w-4 text-brand-600" />
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-ink-900 leading-tight">
                              Jak to przyrządzić
                            </div>
                            {meal.recipe.prepTimeMinutes && (
                              <div className="text-[11px] text-ink-500 flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" /> {meal.recipe.prepTimeMinutes} min
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-700 group-open:opacity-0 transition">
                          Pokaż
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-1 space-y-3">
                        {meal.recipe.note && (
                          <p className="text-sm text-ink-700 italic">"{meal.recipe.note}"</p>
                        )}
                        <ol className="space-y-2 text-sm text-ink-800">
                          {meal.recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="shrink-0 h-6 w-6 rounded-lg bg-white shadow-soft text-brand-700 text-xs font-bold flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
