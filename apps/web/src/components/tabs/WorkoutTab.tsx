"use client";

import { useState } from "react";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import { useApp } from "@/lib/store";
import type { WorkoutPlan } from "@/lib/types";

export function WorkoutTab({ clientId }: { clientId: string }) {
  const workoutPlans = useApp((s) => s.workoutPlans);
  const upsertWorkoutPlan = useApp((s) => s.upsertWorkoutPlan);
  const removeWorkoutPlan = useApp((s) => s.removeWorkoutPlan);
  const addWorkoutDay = useApp((s) => s.addWorkoutDay);
  const addExercise = useApp((s) => s.addExercise);
  const updateExercise = useApp((s) => s.updateExercise);
  const removeExercise = useApp((s) => s.removeExercise);

  const plans = workoutPlans.filter((w) => w.clientId === clientId);
  const [activeId, setActiveId] = useState<string | null>(plans[0]?.id ?? null);
  const active = plans.find((p) => p.id === activeId) ?? plans[0] ?? null;

  const createPlan = () => {
    const plan: WorkoutPlan = {
      id: `w-${Math.random().toString(36).slice(2, 8)}`,
      clientId,
      name: `Trening ${plans.length + 1}`,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      days: [{ id: `wd-${Math.random().toString(36).slice(2, 6)}`, name: "Dzień A", exercises: [] }]
    };
    upsertWorkoutPlan(plan);
    setActiveId(plan.id);
  };

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                active?.id === p.id ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "bg-white/60 text-ink-700 border border-ink-200/60 hover:bg-white"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button onClick={createPlan} className="btn-ghost"><Plus className="h-4 w-4" /> Nowy plan</button>
        </div>

        {active && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2"><label className="label">Nazwa</label><input className="input" value={active.name} onChange={(e) => upsertWorkoutPlan({ ...active, name: e.target.value })} /></div>
            <div><label className="label">Od</label><input type="date" className="input" value={active.startDate} onChange={(e) => upsertWorkoutPlan({ ...active, startDate: e.target.value })} /></div>
            <div><label className="label">Do</label><input type="date" className="input" value={active.endDate} onChange={(e) => upsertWorkoutPlan({ ...active, endDate: e.target.value })} /></div>
          </div>
        )}
      </div>

      {!active && (
        <div className="card text-center py-16">
          <Dumbbell className="h-12 w-12 mx-auto text-ink-300 mb-3" />
          <h3 className="font-display text-xl font-semibold text-ink-900">Brak planów treningowych</h3>
          <p className="text-ink-500 mt-1 mb-5">Stwórz pierwszy plan.</p>
          <button className="btn-primary" onClick={createPlan}><Plus className="h-4 w-4" /> Stwórz plan</button>
        </div>
      )}

      {active && (
        <div className="space-y-4">
          {active.days.map((day) => (
            <div key={day.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <input
                  className="font-display text-lg font-semibold text-ink-900 bg-transparent outline-none focus:bg-white/60 rounded-md px-1 -mx-1"
                  value={day.name}
                  onChange={(e) =>
                    upsertWorkoutPlan({
                      ...active,
                      days: active.days.map((d) => (d.id === day.id ? { ...d, name: e.target.value } : d))
                    })
                  }
                />
                <button onClick={() => addExercise(active.id, day.id)} className="btn-ghost text-sm">
                  <Plus className="h-4 w-4" /> Ćwiczenie
                </button>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                      <th className="py-2 pl-1 font-medium w-2/5">Ćwiczenie</th>
                      <th className="py-2 font-medium">Serie</th>
                      <th className="py-2 font-medium">Powt.</th>
                      <th className="py-2 font-medium">Ciężar</th>
                      <th className="py-2 font-medium">Notatka</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((e) => (
                      <tr key={e.id} className="border-t border-ink-100">
                        <td className="py-1.5 pl-1"><input className="input py-1.5" value={e.name} onChange={(ev) => updateExercise(active.id, day.id, e.id, { name: ev.target.value })} /></td>
                        <td className="py-1.5 pr-2"><input type="number" min={1} className="input py-1.5 w-16" value={e.sets} onChange={(ev) => updateExercise(active.id, day.id, e.id, { sets: parseInt(ev.target.value, 10) || 1 })} /></td>
                        <td className="py-1.5 pr-2"><input className="input py-1.5 w-20" value={e.reps} onChange={(ev) => updateExercise(active.id, day.id, e.id, { reps: ev.target.value })} /></td>
                        <td className="py-1.5 pr-2"><input className="input py-1.5 w-24" value={e.weight} onChange={(ev) => updateExercise(active.id, day.id, e.id, { weight: ev.target.value })} /></td>
                        <td className="py-1.5 pr-2"><input className="input py-1.5" value={e.notes ?? ""} onChange={(ev) => updateExercise(active.id, day.id, e.id, { notes: ev.target.value })} placeholder="—" /></td>
                        <td className="py-1.5 text-right">
                          <button onClick={() => removeExercise(active.id, day.id, e.id)} className="text-ink-400 hover:text-rose-500 p-1.5">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {day.exercises.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-4 text-ink-500 text-sm">Dodaj ćwiczenie</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const name = prompt("Nazwa dnia (np. Dzień B — Pull)");
                if (name) addWorkoutDay(active.id, name);
              }}
              className="btn-ghost"
            >
              <Plus className="h-4 w-4" /> Dodaj dzień
            </button>
            <button onClick={() => { removeWorkoutPlan(active.id); setActiveId(plans.find((p) => p.id !== active.id)?.id ?? null); }} className="text-rose-500 text-sm hover:underline inline-flex items-center gap-1">
              <Trash2 className="h-4 w-4" /> Usuń plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
