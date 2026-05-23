"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { useApp } from "@/lib/store";

export default function ClientWorkoutPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const workoutPlans = useApp((s) => s.workoutPlans);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);
  const plans = profile ? workoutPlans.filter((w) => w.clientId === profile.id) : [];
  const [activeId, setActiveId] = useState<string | null>(plans[0]?.id ?? null);
  const active = plans.find((p) => p.id === activeId) ?? plans[0] ?? null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Twój trening</h1>
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
          <Dumbbell className="h-12 w-12 mx-auto text-ink-300 mb-3" />
          <h3 className="font-display text-xl font-semibold text-ink-900">Brak planu treningowego</h3>
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
              <span className="chip-brand">{active.days.length} dni</span>
            </div>
          </div>

          <div className="space-y-4">
            {active.days.map((day) => (
              <div key={day.id} className="card">
                <h3 className="font-display text-lg font-semibold text-ink-900 mb-3">{day.name}</h3>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500 border-b border-ink-100">
                        <th className="py-2 font-medium">Ćwiczenie</th>
                        <th className="py-2 font-medium">Serie</th>
                        <th className="py-2 font-medium">Powt.</th>
                        <th className="py-2 font-medium">Ciężar</th>
                        <th className="py-2 font-medium">Notatka</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((e) => (
                        <tr key={e.id} className="border-b border-ink-100 last:border-0">
                          <td className="py-2.5 font-medium text-ink-900">{e.name}</td>
                          <td className="py-2.5">{e.sets}</td>
                          <td className="py-2.5">{e.reps}</td>
                          <td className="py-2.5">{e.weight}</td>
                          <td className="py-2.5 text-ink-600">{e.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
