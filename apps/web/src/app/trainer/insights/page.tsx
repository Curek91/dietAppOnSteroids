"use client";

import { useApp } from "@/lib/store";
import { macrosForPlan, round } from "@/lib/macros";
import { ProgressChart } from "@/components/ProgressChart";

export default function InsightsPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const clients = useApp((s) => s.clients);
  const dietPlans = useApp((s) => s.dietPlans);
  const workoutPlans = useApp((s) => s.workoutPlans);
  const products = useApp((s) => s.products);
  const progress = useApp((s) => s.progress);

  const myClients = clients.filter((c) => c.trainerId === currentUserId);
  const allProgress = progress.filter((p) => myClients.some((c) => c.id === p.clientId));

  const trainerKcalAvg =
    dietPlans
      .filter((d) => myClients.some((c) => c.id === d.clientId))
      .map((d) => macrosForPlan(d, products).kcal)
      .reduce((a, b) => a + b, 0) /
    Math.max(1, dietPlans.filter((d) => myClients.some((c) => c.id === d.clientId)).length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Analiza</h1>
        <p className="text-ink-500 mt-1">Twoje studio w liczbach</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Klientów" value={String(myClients.length)} />
        <Kpi label="Plany diety" value={String(dietPlans.filter((d) => myClients.some((c) => c.id === d.clientId)).length)} />
        <Kpi label="Plany treningu" value={String(workoutPlans.filter((w) => myClients.some((c) => c.id === w.clientId)).length)} />
        <Kpi label="Średnio kcal" value={String(round(trainerKcalAvg))} />
      </div>

      <div className="card">
        <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">Zbiorcze pomiary</h3>
        <p className="text-sm text-ink-500 mb-4">Wszyscy podopieczni — waga w czasie</p>
        {allProgress.length > 0 ? (
          <ProgressChart data={allProgress} metrics={["weight"]} />
        ) : (
          <div className="text-center py-12 text-ink-500">Brak danych.</div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-value mt-1">{value}</div>
    </div>
  );
}
