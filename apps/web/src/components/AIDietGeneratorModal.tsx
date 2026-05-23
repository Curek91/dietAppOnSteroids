"use client";

import { useState } from "react";
import { Sparkles, X, Wand2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { aiGenerateDiet } from "@/lib/ai";

export function AIDietGeneratorModal({
  clientId,
  onClose,
  onCreated
}: {
  clientId: string;
  onClose: () => void;
  onCreated: (planId: string) => void;
}) {
  const products = useApp((s) => s.products);
  const upsertDietPlan = useApp((s) => s.upsertDietPlan);
  const subscriptions = useApp((s) => s.subscriptions);
  const trackAIUsage = useApp((s) => s.trackAIUsage);

  const [goal, setGoal] = useState<"cut" | "maintain" | "bulk">("cut");
  const [kcal, setKcal] = useState(1800);
  const [protein, setProtein] = useState(1.8);
  const [weight, setWeight] = useState(70);
  const [meals, setMeals] = useState(4);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleRestriction = (r: string) =>
    setRestrictions((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));

  const generate = async () => {
    setLoading(true);
    try {
      const plan = await aiGenerateDiet({
        clientId,
        goal,
        targetKcal: kcal,
        proteinPerKg: protein,
        weightKg: weight,
        restrictions,
        mealsCount: meals
      }, products);
      upsertDietPlan(plan);
      const sub = subscriptions[0];
      if (sub) trackAIUsage(sub.trainerId, "request");
      onCreated(plan.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="glass-strong rounded-3xl p-8 w-full max-w-lg animate-slide-up relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-indigo-400 via-purple-400 to-brand-400" />
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 flex items-center justify-center text-white shadow-glow">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink-900">Wygeneruj plan diety</h3>
                <p className="text-sm text-ink-500">AI dobierze posiłki na bazie celu i restrykcji</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/80 text-ink-500">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Cel</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "cut", label: "Redukcja" },
                  { id: "maintain", label: "Utrzymanie" },
                  { id: "bulk", label: "Masa" }
                ] as const).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium ${
                      goal === g.id ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "bg-white/70 border border-ink-200 text-ink-700 hover:bg-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div><label className="label">Cel kcal</label><input className="input" type="number" value={kcal} onChange={(e) => setKcal(parseInt(e.target.value) || 0)} /></div>
              <div><label className="label">Białko g/kg</label><input className="input" type="number" step="0.1" value={protein} onChange={(e) => setProtein(parseFloat(e.target.value) || 0)} /></div>
              <div><label className="label">Posiłki</label><input className="input" type="number" min={3} max={6} value={meals} onChange={(e) => setMeals(parseInt(e.target.value) || 4)} /></div>
            </div>

            <div>
              <label className="label">Restrykcje</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "vege", label: "🌱 Wegetariańska" },
                  { id: "nuts", label: "🥜 Bez orzechów" },
                  { id: "gluten", label: "🌾 Bez glutenu" },
                  { id: "lactose", label: "🥛 Bez laktozy" }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toggleRestriction(r.id)}
                    className={`chip ${restrictions.includes(r.id) ? "chip-brand" : ""}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Waga klienta (kg)</label>
              <input className="input" type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <button onClick={generate} disabled={loading} className="btn-primary w-full mt-6 py-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500">
            {loading ? (
              <><Sparkles className="h-4 w-4 animate-pulse" /> AI komponuje plan...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generuj plan AI</>
            )}
          </button>
          <p className="text-[10px] text-center text-ink-400 mt-2">Użyje 1 zapytania AI z miesięcznego limitu</p>
        </div>
      </div>
    </div>
  );
}
