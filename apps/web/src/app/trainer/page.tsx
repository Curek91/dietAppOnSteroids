"use client";

import Link from "next/link";
import { ArrowUpRight, Users, Flame, TrendingUp, CalendarDays, Plus, Sparkles, Camera, Watch, Crown } from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { AIInsightCard } from "@/components/AIInsightCard";
import { macrosForPlan, round } from "@/lib/macros";
import { getPlan } from "@/lib/plans";

export default function TrainerDashboardPage() {
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
  const subscriptions = useApp((s) => s.subscriptions);

  const me = users.find((u) => u.id === currentUserId);
  if (!me) return null;

  const myClients = clients.filter((c) => c.trainerId === me.id);
  const myDiets = dietPlans.filter((d) => myClients.some((c) => c.id === d.clientId));
  const myWorkouts = workoutPlans.filter((w) => myClients.some((c) => c.id === w.clientId));
  const myProgress = progress.filter((p) => myClients.some((c) => c.id === p.clientId));
  const myWearables = wearables.filter((w) => myClients.some((c) => c.id === w.clientId));
  const myPhotos = mealPhotos.filter((m) => myClients.some((c) => c.id === m.clientId));
  const pendingPhotos = myPhotos.filter((p) => p.status === "pending");
  const trainerInsights = aiInsights.filter((i) => i.scope === "trainer" && i.subjectId === me.id);

  const sub = subscriptions.find((s) => s.trainerId === me.id);
  const plan = getPlan(sub?.tier ?? "starter");

  const avgKcal =
    myDiets.length > 0
      ? round(
          myDiets.reduce((acc, d) => acc + macrosForPlan(d, products).kcal, 0) / myDiets.length
        )
      : 0;

  const avgRecovery = (() => {
    const last = myClients
      .map((c) => myWearables.filter((w) => w.clientId === c.id).sort((a, b) => b.date.localeCompare(a.date))[0])
      .filter(Boolean);
    if (!last.length) return 0;
    return Math.round(last.reduce((a, b) => a + (b!.recovery ?? 0), 0) / last.length);
  })();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold">Pulpit · {plan.name}</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            Cześć, {me.fullName.split(" ")[0]} <span className="text-gradient">👋</span>
          </h1>
          <p className="text-ink-500 mt-1">Oto twoje studio. Zaczynamy dzień produktywnie.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/trainer/billing" className="btn-ghost">
            <Crown className="h-4 w-4" /> Plan
          </Link>
          <Link href="/trainer/clients" className="btn-primary">
            <Plus className="h-4 w-4" /> Nowy podopieczny
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Podopieczni"
          value={`${myClients.length}/${plan.clientSlots}`}
          hue="brand"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Plany diet"
          value={String(myDiets.length)}
          hue="amber"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Avg kcal"
          value={String(avgKcal)}
          hue="rose"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Pomiary"
          value={String(myProgress.length)}
          hue="emerald"
        />
        <StatCard
          icon={<Watch className="h-5 w-5" />}
          label="Avg recovery"
          value={`${avgRecovery}%`}
          hue="purple"
        />
        <StatCard
          icon={<Camera className="h-5 w-5" />}
          label="Foto do recenzji"
          value={String(pendingPhotos.length)}
          hue="indigo"
          link="/trainer/proofs"
        />
      </div>

      {trainerInsights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" /> AI Insights
            </h2>
            <span className="chip-brand"><Sparkles className="h-3 w-3" /> {trainerInsights.length} nowych</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trainerInsights.slice(0, 4).map((i) => (
              <AIInsightCard key={i.id} insight={i} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">Twoi podopieczni</h2>
              <p className="text-sm text-ink-500">Status w jednym rzucie oka</p>
            </div>
            <Link href="/trainer/clients" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
              Wszyscy <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {myClients.slice(0, 5).map((c) => {
              const cProgress = myProgress.filter((p) => p.clientId === c.id).sort((a, b) => b.date.localeCompare(a.date));
              const latestW = myWearables.filter((w) => w.clientId === c.id).sort((a, b) => b.date.localeCompare(a.date))[0];
              const cPhotos = myPhotos.filter((p) => p.clientId === c.id && p.status === "pending");
              return (
                <Link
                  key={c.id}
                  href={`/trainer/clients/${c.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/80 transition group"
                >
                  <Avatar name={`${c.firstName} ${c.lastName}`} hue={c.avatarHue} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 truncate">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-sm text-ink-500 truncate">{c.goal}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <MiniStat label="Waga" value={cProgress[0]?.weight ? `${cProgress[0].weight}kg` : "—"} />
                    <MiniStat
                      label="Recovery"
                      value={latestW?.recovery ? `${latestW.recovery}%` : "—"}
                      tone={latestW?.recovery && latestW.recovery < 45 ? "bad" : latestW?.recovery && latestW.recovery > 65 ? "good" : "default"}
                    />
                    {cPhotos.length > 0 && (
                      <span className="chip-brand text-[10px]">
                        <Camera className="h-3 w-3" /> {cPhotos.length}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-brand-500 transition" />
                </Link>
              );
            })}
            {myClients.length === 0 && (
              <div className="text-center text-ink-500 py-10">Brak podopiecznych. Dodaj pierwszego!</div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-1">Dziś</h2>
          <p className="text-sm text-ink-500 mb-4">Twój timeline</p>
          <ul className="space-y-3">
            <Timeline time="08:30" title="Konsultacja — Marta Nowak" tag="online" hue="brand" />
            <Timeline time="11:00" title="Aktualizacja diety Kuby" tag="dieta" hue="amber" />
            <Timeline time="13:30" title="Trening — Ola Kamińska" tag="gym" hue="emerald" />
            <Timeline time="17:00" title="Pomiary — Piotr" tag="check-in" hue="rose" />
          </ul>
          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-medium mb-2">Wykorzystanie AI</div>
            <div className="text-xs text-ink-600 mb-1.5 flex justify-between">
              <span>{sub?.aiUsedThisMonth ?? 0} / {plan.aiRequestsMonthly} zapytań</span>
            </div>
            <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-brand-500" style={{ width: `${Math.min(100, ((sub?.aiUsedThisMonth ?? 0) / plan.aiRequestsMonthly) * 100)}%` }} />
            </div>
            <div className="text-xs text-ink-600 mt-3 mb-1.5 flex justify-between">
              <span>{sub?.photoAnalysesThisMonth ?? 0} / {plan.photoAnalysesMonthly} analiz zdjęć</span>
            </div>
            <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-brand-500 to-rose-500" style={{ width: `${Math.min(100, ((sub?.photoAnalysesThisMonth ?? 0) / plan.photoAnalysesMonthly) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hue,
  link
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hue: "brand" | "emerald" | "rose" | "amber" | "purple" | "indigo";
  link?: string;
}) {
  const colors = {
    brand: "from-brand-100 to-brand-50 text-brand-600",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600",
    rose: "from-rose-100 to-rose-50 text-rose-600",
    amber: "from-amber-100 to-amber-50 text-amber-600",
    purple: "from-purple-100 to-purple-50 text-purple-600",
    indigo: "from-indigo-100 to-indigo-50 text-indigo-600"
  } as const;
  const Inner = (
    <div className="card group">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${colors[hue]} ring-1 ring-white/80`}>
        {icon}
      </div>
      <div className="mt-3">
        <div className="stat-label text-[10px]">{label}</div>
        <div className="font-display text-2xl font-semibold tracking-tight text-ink-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
  return link ? <Link href={link}>{Inner}</Link> : Inner;
}

function MiniStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" | "bad" }) {
  const toneClass = tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : "text-ink-800";
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`text-sm font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

function Timeline({
  time,
  title,
  tag,
  hue
}: {
  time: string;
  title: string;
  tag: string;
  hue: "brand" | "emerald" | "rose" | "amber";
}) {
  const colors = {
    brand: "bg-brand-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500"
  } as const;
  return (
    <li className="flex items-center gap-3 group">
      <div className="text-xs font-mono text-ink-500 w-12">{time}</div>
      <div className={`h-2 w-2 rounded-full ${colors[hue]}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink-800 truncate">{title}</div>
      </div>
      <span className="chip text-[10px] uppercase tracking-wider">{tag}</span>
    </li>
  );
}
