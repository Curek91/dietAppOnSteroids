"use client";

import { useMemo, useState } from "react";
import { Heart, Moon, Footprints, Flame, Activity, Watch, RefreshCw, Smartphone, Battery } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Area, AreaChart, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useApp } from "@/lib/store";
import type { WearableDevice, WearableSnapshot } from "@/lib/types";

const deviceMeta: Record<WearableDevice, { label: string; brand: string; color: string; svg: React.ReactNode }> = {
  apple_watch: { label: "Apple Watch", brand: "Apple Health", color: "#000000", svg: <AppleLogo /> },
  samsung_health: { label: "Galaxy Watch", brand: "Samsung Health", color: "#1428a0", svg: <SamsungLogo /> },
  garmin: { label: "Garmin", brand: "Garmin Connect", color: "#007cc3", svg: <GarminLogo /> },
  whoop: { label: "Whoop", brand: "Whoop Strap", color: "#000000", svg: <WhoopLogo /> },
  oura: { label: "Oura Ring", brand: "Oura", color: "#222222", svg: <OuraLogo /> },
  fitbit: { label: "Fitbit", brand: "Fitbit", color: "#00b0b9", svg: <FitbitLogo /> }
};

export function WearablesPanel({ clientId }: { clientId: string }) {
  const wearables = useApp((s) => s.wearables);
  const clients = useApp((s) => s.clients);
  const syncWearable = useApp((s) => s.syncWearable);

  const client = clients.find((c) => c.id === clientId);
  const data = useMemo(
    () => wearables.filter((w) => w.clientId === clientId).sort((a, b) => a.date.localeCompare(b.date)),
    [wearables, clientId]
  );

  const [syncing, setSyncing] = useState(false);

  if (!client) return null;
  const device = client.wearableDevice ?? "apple_watch";
  const meta = deviceMeta[device];
  const last = data[data.length - 1];

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    syncWearable(clientId);
    setSyncing(false);
  };

  if (!last) {
    return (
      <div className="card text-center py-12">
        <Watch className="h-12 w-12 mx-auto text-ink-300 mb-3" />
        <h3 className="font-display text-xl font-semibold text-ink-900">Brak danych z urządzenia</h3>
        <p className="text-ink-500 mt-1 mb-5">Połącz {meta.label}, aby zobaczyć tu dane.</p>
        <button onClick={handleSync} className="btn-primary">Połącz {meta.label}</button>
      </div>
    );
  }

  const chartData = data.slice(-14).map((d) => ({
    date: new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
    sleep: d.sleepHours,
    sleepScore: d.sleepScore,
    hrv: d.hrv,
    rhr: d.restingHr,
    steps: d.steps / 1000,
    recovery: d.recovery
  }));

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
             style={{ background: `radial-gradient(circle, ${meta.color}, transparent 70%)` }} />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white shadow-soft flex items-center justify-center">
              {meta.svg}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-semibold text-ink-900">{meta.label}</h3>
                <span className="chip-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Połączono
                </span>
              </div>
              <div className="text-sm text-ink-500 flex items-center gap-3">
                <span>{meta.brand}</span>
                <span className="inline-flex items-center gap-1"><Battery className="h-3.5 w-3.5" /> 78%</span>
                <span className="text-ink-400">· Ostatnia sync: {new Date(last.date).toLocaleDateString("pl-PL")}</span>
              </div>
            </div>
          </div>
          <button onClick={handleSync} disabled={syncing} className="btn-ghost">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Synchronizuję..." : "Sync teraz"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Recovery"
          value={`${last.recovery ?? 0}%`}
          sub={`HRV ${last.hrv} ms`}
          icon={<Activity className="h-4 w-4" />}
          tone={last.recovery && last.recovery > 65 ? "good" : last.recovery && last.recovery < 40 ? "bad" : "ok"}
        />
        <MetricCard
          label="Resting HR"
          value={`${last.restingHr}`}
          sub="bpm"
          icon={<Heart className="h-4 w-4" />}
          tone={last.restingHr < 60 ? "good" : last.restingHr > 75 ? "bad" : "ok"}
        />
        <MetricCard
          label="Sen"
          value={`${last.sleepHours}h`}
          sub={`Score ${last.sleepScore}`}
          icon={<Moon className="h-4 w-4" />}
          tone={last.sleepScore > 80 ? "good" : last.sleepScore < 60 ? "bad" : "ok"}
        />
        <MetricCard
          label="Kroki"
          value={(last.steps / 1000).toFixed(1) + "k"}
          sub={`${last.activeKcal} kcal`}
          icon={<Footprints className="h-4 w-4" />}
          tone={last.steps > 10000 ? "good" : last.steps < 5000 ? "bad" : "ok"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-display font-semibold text-ink-900">Recovery (14 dni)</h4>
          <p className="text-sm text-ink-500 mb-3">Procentowy wynik regeneracji</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="recoverFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="recovery" stroke="#10b981" strokeWidth={2.5} fill="url(#recoverFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 className="font-display font-semibold text-ink-900">Sen — godziny / score</h4>
          <p className="text-sm text-ink-500 mb-3">Jakość snu w ostatnich 2 tygodniach</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sleep" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 className="font-display font-semibold text-ink-900">HRV (ms)</h4>
          <p className="text-sm text-ink-500 mb-3">Wskaźnik wegetatywny — wyższy = lepiej</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="hrv" stroke="#f97316" strokeWidth={2.5} dot={{ r: 2, fill: "white", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 className="font-display font-semibold text-ink-900">Kroki (k)</h4>
          <p className="text-sm text-ink-500 mb-3">Aktywność dzienna</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="steps" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DeviceLibrary />
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  icon,
  tone
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: "good" | "ok" | "bad";
}) {
  const toneClass = tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : "text-ink-700";
  return (
    <div className="card">
      <div className="flex items-center justify-between text-ink-500 text-xs uppercase tracking-wider font-medium">
        <span>{label}</span>
        <span className={toneClass}>{icon}</span>
      </div>
      <div className={`font-display text-3xl font-semibold mt-2 ${toneClass}`}>{value}</div>
      <div className="text-xs text-ink-500 mt-0.5">{sub}</div>
    </div>
  );
}

function DeviceLibrary() {
  return (
    <div className="card">
      <h4 className="font-display font-semibold text-ink-900 mb-1">Obsługiwane urządzenia</h4>
      <p className="text-sm text-ink-500 mb-4">Klient może podłączyć z poziomu aplikacji mobilnej</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {(Object.keys(deviceMeta) as WearableDevice[]).map((d) => (
          <div key={d} className="rounded-xl bg-white/60 border border-ink-100 p-3 text-center hover:border-brand-200 transition">
            <div className="h-10 flex items-center justify-center">{deviceMeta[d].svg}</div>
            <div className="text-[11px] font-medium text-ink-700 mt-1.5">{deviceMeta[d].label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tiny inline logos (stylized, brand-agnostic shapes)
function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
      <path d="M17.05 12.74c-.03-3.06 2.49-4.53 2.6-4.6-1.42-2.07-3.62-2.36-4.4-2.38-1.87-.19-3.65 1.1-4.6 1.1-.96 0-2.41-1.07-3.97-1.04-2.04.03-3.94 1.19-4.99 3.01-2.14 3.71-.54 9.18 1.52 12.18 1.01 1.47 2.21 3.11 3.78 3.05 1.52-.06 2.1-.98 3.93-.98 1.83 0 2.36.98 3.97.95 1.64-.03 2.68-1.49 3.67-2.97 1.18-1.71 1.66-3.37 1.69-3.46-.04-.02-3.24-1.24-3.27-4.93zM14.85 4.36c.83-1.01 1.39-2.41 1.23-3.81-1.2.05-2.64.81-3.5 1.81-.77.89-1.45 2.32-1.26 3.7 1.34.1 2.7-.68 3.53-1.7z"/>
    </svg>
  );
}
function SamsungLogo() {
  return <div className="font-display font-bold text-xs text-[#1428a0]">SAMSUNG</div>;
}
function GarminLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#007cc3" strokeWidth="2.2">
      <path d="M3 12 L9 4 L21 4 L15 12 L21 20 L9 20 Z" />
    </svg>
  );
}
function WhoopLogo() {
  return <div className="font-display font-bold text-sm tracking-tight">WHOOP</div>;
}
function OuraLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#222" strokeWidth="2.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}
function FitbitLogo() {
  return (
    <div className="flex gap-0.5 items-center">
      {[2.5, 4, 5.5, 4, 2.5].map((s, i) => (
        <div key={i} className="rounded-full bg-[#00b0b9]" style={{ height: `${s * 4}px`, width: "5px" }} />
      ))}
    </div>
  );
}
