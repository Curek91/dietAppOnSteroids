"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Salad, Wand2 } from "lucide-react";
import { useApp } from "@/lib/store";
import type { DietPlan } from "@/lib/types";
import { MacrosBar } from "@/components/MacrosBar";
import { AIDietGeneratorModal } from "@/components/AIDietGeneratorModal";
import { AIBadge } from "@/components/AIInsightCard";
import { macrosForItem, macrosForMeal, macrosForPlan, round } from "@/lib/macros";

export function DietTab({ clientId }: { clientId: string }) {
  const products = useApp((s) => s.products);
  const dietPlans = useApp((s) => s.dietPlans);
  const upsertDietPlan = useApp((s) => s.upsertDietPlan);
  const removeDietPlan = useApp((s) => s.removeDietPlan);
  const addMeal = useApp((s) => s.addMeal);
  const addMealItem = useApp((s) => s.addMealItem);
  const updateMealItem = useApp((s) => s.updateMealItem);
  const removeMealItem = useApp((s) => s.removeMealItem);

  const plans = dietPlans.filter((d) => d.clientId === clientId);
  const [activeId, setActiveId] = useState<string | null>(plans[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [activeMealId, setActiveMealId] = useState<string | null>(plans[0]?.meals[0]?.id ?? null);
  const [aiOpen, setAiOpen] = useState(false);

  const active = plans.find((p) => p.id === activeId) ?? plans[0] ?? null;

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  const createPlan = () => {
    const plan: DietPlan = {
      id: `d-${Math.random().toString(36).slice(2, 8)}`,
      clientId,
      name: `Plan ${plans.length + 1}`,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      meals: [
        { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Śniadanie", items: [] },
        { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Obiad", items: [] },
        { id: `m-${Math.random().toString(36).slice(2, 6)}`, name: "Kolacja", items: [] }
      ],
      targetKcal: 2000
    };
    upsertDietPlan(plan);
    setActiveId(plan.id);
    setActiveMealId(plan.meals[0].id);
  };

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveId(p.id);
                  setActiveMealId(p.meals[0]?.id ?? null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                  active?.id === p.id ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "bg-white/60 text-ink-700 border border-ink-200/60 hover:bg-white"
                }`}
              >
                {p.name}
              </button>
            ))}
            <button onClick={createPlan} className="btn-ghost"><Plus className="h-4 w-4" /> Nowy plan</button>
            <button onClick={() => setAiOpen(true)} className="btn-ghost bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 text-purple-700"><Wand2 className="h-4 w-4" /> AI Generator</button>
          </div>
        </div>

        {active && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="label">Nazwa</label>
              <input className="input" value={active.name} onChange={(e) => upsertDietPlan({ ...active, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Od</label>
              <input type="date" className="input" value={active.startDate} onChange={(e) => upsertDietPlan({ ...active, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Do</label>
              <input type="date" className="input" value={active.endDate} onChange={(e) => upsertDietPlan({ ...active, endDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Cel kcal</label>
              <input
                className="input"
                inputMode="numeric"
                value={active.targetKcal ?? ""}
                onChange={(e) => upsertDietPlan({ ...active, targetKcal: parseInt(e.target.value, 10) || undefined })}
              />
            </div>
          </div>
        )}
      </div>

      {!active && (
        <div className="card text-center py-16">
          <Salad className="h-12 w-12 mx-auto text-ink-300 mb-3" />
          <h3 className="font-display text-xl font-semibold text-ink-900">Brak planów żywieniowych</h3>
          <p className="text-ink-500 mt-1 mb-5">Stwórz pierwszy plan lub wygeneruj AI.</p>
          <div className="flex justify-center gap-2">
            <button className="btn-ghost" onClick={createPlan}><Plus className="h-4 w-4" /> Pusty plan</button>
            <button className="btn-primary bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500" onClick={() => setAiOpen(true)}><Wand2 className="h-4 w-4" /> AI Generator</button>
          </div>
        </div>
      )}

      {active?.aiGenerated && (
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-brand-50 border border-purple-200 px-4 py-2.5 text-sm text-purple-700 flex items-center gap-2">
          <AIBadge /> Ten plan został wygenerowany przez AI · zweryfikuj i dopasuj makra.
        </div>
      )}

      {aiOpen && (
        <AIDietGeneratorModal
          clientId={clientId}
          onClose={() => setAiOpen(false)}
          onCreated={(planId) => {
            setActiveId(planId);
            setAiOpen(false);
          }}
        />
      )}

      {active && (
        <>
          <MacrosBar macros={macrosForPlan(active, products)} target={active.targetKcal} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products library */}
            <div className="card lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg font-semibold text-ink-900">Baza produktów</h3>
                <span className="chip">{filteredProducts.length}</span>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input className="input pl-10" placeholder="Szukaj..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="rounded-xl border border-ink-100 bg-white/60 p-3 hover:bg-white hover:border-brand-200 transition group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-ink-500">
                          {p.kcal} kcal · B {p.protein}g · W {p.carbs}g · T {p.fat}g <span className="opacity-50">/100g</span>
                        </div>
                      </div>
                      <button
                        disabled={!activeMealId}
                        onClick={() => activeMealId && addMealItem(active.id, activeMealId, p.id, 100)}
                        className="opacity-0 group-hover:opacity-100 transition btn-primary px-2.5 py-1.5 text-xs"
                      >
                        Dodaj
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink-900">Posiłki</h3>
                <button
                  onClick={() => {
                    const name = prompt("Nazwa posiłku");
                    if (name) addMeal(active.id, name);
                  }}
                  className="btn-ghost"
                >
                  <Plus className="h-4 w-4" /> Posiłek
                </button>
              </div>

              {active.meals.map((meal) => {
                const macros = macrosForMeal(meal, products);
                const isActive = meal.id === activeMealId;
                return (
                  <div key={meal.id} className={`card transition ${isActive ? "ring-2 ring-brand-300" : ""}`}>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => setActiveMealId(meal.id)}
                        className={`text-left ${isActive ? "" : "hover:opacity-80"}`}
                      >
                        <div className="font-display text-base font-semibold text-ink-900">{meal.name}</div>
                        <div className="text-[11px] text-ink-500">
                          {round(macros.kcal)} kcal · B {round(macros.protein, 1)}g · W {round(macros.carbs, 1)}g · T {round(macros.fat, 1)}g
                        </div>
                      </button>
                      <span className={`chip ${isActive ? "chip-brand" : ""}`}>{isActive ? "aktywny" : "kliknij by aktywować"}</span>
                    </div>
                    <div className="space-y-2">
                      {meal.items.length === 0 && (
                        <div className="text-center text-sm text-ink-500 py-6 border border-dashed border-ink-200 rounded-xl">
                          Wybierz produkt z bazy ➜
                        </div>
                      )}
                      {meal.items.map((it) => {
                        const product = products.find((p) => p.id === it.productId);
                        if (!product) return null;
                        const m = macrosForItem(product, it.grams);
                        return (
                          <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white/60 border border-ink-100 px-3 py-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-ink-900 truncate">{product.name}</div>
                              <div className="text-[11px] text-ink-500">
                                {round(m.kcal)} kcal · B {round(m.protein, 1)}g · W {round(m.carbs, 1)}g · T {round(m.fat, 1)}g
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                value={it.grams}
                                onChange={(e) => updateMealItem(active.id, meal.id, product.id, parseInt(e.target.value, 10) || 0)}
                                className="input w-20 text-right py-1.5 px-2"
                              />
                              <span className="text-xs text-ink-500">g</span>
                            </div>
                            <button
                              onClick={() => removeMealItem(active.id, meal.id, product.id)}
                              className="text-ink-400 hover:text-rose-500 p-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button onClick={() => { removeDietPlan(active.id); setActiveId(plans.find(p => p.id !== active.id)?.id ?? null); }} className="text-rose-500 text-sm hover:underline inline-flex items-center gap-1">
                  <Trash2 className="h-4 w-4" /> Usuń ten plan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
