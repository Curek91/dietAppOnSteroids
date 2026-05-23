"use client";

import { useApp } from "@/lib/store";
import { ProgressChart } from "@/components/ProgressChart";

export default function ClientProgressPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const progress = useApp((s) => s.progress);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);
  const entries = profile ? progress.filter((p) => p.clientId === profile.id).sort((a, b) => a.date.localeCompare(b.date)) : [];

  const first = entries[0];
  const last = entries[entries.length - 1];
  const weightChange = first?.weight && last?.weight ? (last.weight - first.weight).toFixed(1) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Twoje postępy</h1>
        <p className="text-ink-500 mt-1">{entries.length} pomiarów</p>
      </div>

      {entries.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label="Start" value={first?.weight ? `${first.weight} kg` : "—"} sub={first?.date ?? ""} />
            <Card label="Aktualna" value={last?.weight ? `${last.weight} kg` : "—"} sub={last?.date ?? ""} />
            <Card
              label="Zmiana"
              value={weightChange ? `${Number(weightChange) > 0 ? "+" : ""}${weightChange} kg` : "—"}
              accent={weightChange ? (Number(weightChange) < 0 ? "good" : "neutral") : undefined}
            />
            <Card label="BF" value={last?.bodyFat ? `${last.bodyFat}%` : "—"} />
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-1">Waga & BF w czasie</h2>
            <p className="text-sm text-ink-500 mb-4">Twoja podróż</p>
            <ProgressChart data={entries} metrics={["weight", "bodyFat"]} />
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-1">Obwody</h2>
            <p className="text-sm text-ink-500 mb-4">Pas, klatka, biceps, udo</p>
            <ProgressChart data={entries} metrics={["waist", "chest", "arm", "thigh"]} />
          </div>
        </>
      ) : (
        <div className="card text-center py-16">
          <p className="text-ink-500">Brak pomiarów. Twój trener doda je w karcie podopiecznego.</p>
        </div>
      )}
    </div>
  );
}

function Card({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: "good" | "neutral" }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value mt-1 ${accent === "good" ? "text-emerald-600" : ""}`}>{value}</div>
      {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
    </div>
  );
}
