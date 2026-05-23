"use client";

import Link from "next/link";
import { Salad, Dumbbell, LineChart as LineIcon, ArrowUpRight, Flame, Activity, Target, Watch, Camera, Sparkles, Heart, Moon, Footprints } from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { AIInsightCard } from "@/components/AIInsightCard";
import { macrosForPlan } from "@/lib/macros";
import { MacrosBar } from "@/components/MacrosBar";

export default function ClientDashboardPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const dietPlans = useApp((s) => s.dietPlans);
  const workoutPlans = useApp((s) => s.workoutPlans);
  const products = useApp((s) => s.products);
  const progress = useApp((s) => s.progress);
  const wearables = useApp((s) => s.wearables);
  const mealPhotos = useApp((s) => s.mealPhotos);
  const aiInsights = useApp((s) => s.aiInsights);

  const me = users.find((u) => u.id === currentUserId);
  if (!me) return null;

  const myProfile = clients.find((c) => c.email === me.email);
  const trainer = users.find((u) => u.id === me.trainerId);

  const myDiet = dietPlans.find((d) => myProfile && d.clientId === myProfile.id);
  const myWorkout = workoutPlans.find((w) => myProfile && w.clientId === myProfile.id);
  const myProgress = progress.filter((p) => myProfile && p.clientId === myProfile.id).sort((a, b) => b.date.localeCompare(a.date));
  const myWear = myProfile ? wearables.filter((w) => w.clientId === myProfile.id).sort((a, b) => b.date.localeCompare(a.date)) : [];
  const latestW = myWear[0];
  const latest = myProgress[0];
  const myPhotos = myProfile ? mealPhotos.filter((m) => m.clientId === myProfile.id).slice(0, 4) : [];
  const myInsights = myProfile ? aiInsights.filter((i) => i.scope === "client" && i.subjectId === myProfile.id) : [];

  const macros = myDiet ? macrosForPlan(myDiet, products) : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="card relative overflow-hidden">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl bg-gradient-to-br from-brand-400 to-amber-400" />
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <Avatar name={me.fullName} hue={me.avatarHue} size="xl" />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.18em] text-brand-600 font-semibold mb-1">Twój dzisiejszy plan</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
              Cześć, {me.fullName.split(" ")[0]} <span className="text-gradient">🚀</span>
            </h1>
            <p className="text-ink-500 mt-1">
              {trainer ? `Trening prowadzi ${trainer.fullName}` : "Brak przypisanego trenera"}
              {myProfile?.goal ? ` · Cel: ${myProfile.goal}` : ""}
            </p>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Tile icon={<Activity className="h-4 w-4" />} label="Waga" value={latest?.weight ? `${latest.weight} kg` : "—"} />
              <Tile icon={<Flame className="h-4 w-4" />} label="Cel kcal" value={myDiet?.targetKcal ? `${myDiet.targetKcal}` : "—"} />
              <Tile icon={<Heart className="h-4 w-4" />} label="HRV" value={latestW ? `${latestW.hrv} ms` : "—"} />
              <Tile icon={<Moon className="h-4 w-4" />} label="Sen" value={latestW ? `${latestW.sleepHours}h` : "—"} />
            </div>
          </div>
        </div>
      </div>

      {myInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" /> AI insights dla Ciebie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myInsights.slice(0, 2).map((i) => (
              <AIInsightCard key={i.id} insight={i} />
            ))}
          </div>
        </div>
      )}

      {macros && myDiet && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink-900">Dzisiejsze makro</h2>
            <Link href="/client/diet" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
              Otwórz dietę <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <MacrosBar macros={macros} target={myDiet.targetKcal} />
        </div>
      )}

      {latestW && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <RingStat label="Recovery" value={`${latestW.recovery ?? 0}%`} pct={latestW.recovery ?? 0} hue="emerald" icon={<Activity className="h-4 w-4" />} />
          <RingStat label="Sleep Score" value={`${latestW.sleepScore}`} pct={latestW.sleepScore} hue="violet" icon={<Moon className="h-4 w-4" />} />
          <RingStat label="Resting HR" value={`${latestW.restingHr}`} pct={Math.min(100, (latestW.restingHr / 90) * 100)} hue="rose" icon={<Heart className="h-4 w-4" />} />
          <RingStat label="Steps" value={`${(latestW.steps / 1000).toFixed(1)}k`} pct={Math.min(100, (latestW.steps / 12000) * 100)} hue="amber" icon={<Footprints className="h-4 w-4" />} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <QuickLink href="/client/diet" icon={<Salad className="h-5 w-5" />} title="Dieta" sub={myDiet?.name ?? "Brak"} count={`${myDiet?.meals.length ?? 0} posiłków`} />
        <QuickLink href="/client/workout" icon={<Dumbbell className="h-5 w-5" />} title="Trening" sub={myWorkout?.name ?? "Brak"} count={`${myWorkout?.days.length ?? 0} dni`} />
        <QuickLink href="/client/wearable" icon={<Watch className="h-5 w-5" />} title="Zegarek" sub={myProfile?.wearableDevice ?? "—"} count="Live sync" />
        <QuickLink href="/client/proofs" icon={<Camera className="h-5 w-5" />} title="Zdjęcia" sub="AI Vision" count={`${myPhotos.length} ostatnich`} />
      </div>

      {myPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink-900 flex items-center gap-2">
              <Camera className="h-5 w-5 text-brand-600" /> Ostatnie posiłki
            </h2>
            <Link href="/client/proofs" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
              Wszystkie <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {myPhotos.map((p) => (
              <div key={p.id} className="rounded-2xl overflow-hidden bg-white border border-ink-100 shadow-soft">
                <div className="aspect-square bg-ink-100">
                  <img src={p.dataUrl} alt={p.mealName} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-ink-900 truncate">{p.mealName}</div>
                  <div className="text-[10px] text-ink-500">
                    {p.aiAnalysis ? `${p.aiAnalysis.estimatedKcal} kcal` : "..."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/60 border border-white/80 p-3">
      <div className="flex items-center gap-1.5 text-ink-500 text-[11px] uppercase tracking-wider font-medium">{icon} {label}</div>
      <div className="text-sm font-semibold text-ink-900 mt-1 truncate">{value}</div>
    </div>
  );
}

function QuickLink({ href, icon, title, sub, count }: { href: string; icon: React.ReactNode; title: string; sub: string; count: string }) {
  return (
    <Link href={href} className="card group hover:-translate-y-0.5 transition">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 flex items-center justify-center ring-1 ring-white/80">
          {icon}
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-brand-500 transition" />
      </div>
      <div className="mt-4">
        <div className="font-display text-lg font-semibold text-ink-900">{title}</div>
        <div className="text-sm text-ink-500 mt-0.5 truncate">{sub}</div>
        <div className="chip-brand mt-2">{count}</div>
      </div>
    </Link>
  );
}

function RingStat({ label, value, pct, hue, icon }: { label: string; value: string; pct: number; hue: "emerald" | "violet" | "rose" | "amber"; icon: React.ReactNode }) {
  const colors = {
    emerald: "#10b981",
    violet: "#8b5cf6",
    rose: "#f43f5e",
    amber: "#f59e0b"
  } as const;
  const R = 32;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  return (
    <div className="card flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="40" cy="40" r={R} fill="none" stroke={colors[hue]} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${C}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: colors[hue] }}>{icon}</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">{label}</div>
        <div className="font-display text-2xl font-semibold text-ink-900">{value}</div>
      </div>
    </div>
  );
}
