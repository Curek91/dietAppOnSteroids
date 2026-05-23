"use client";

import { useState } from "react";
import { Check, Crown, Sparkles, TrendingUp, DollarSign, ArrowUpRight, Calculator, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { PLANS, ADDON_CLIENT_PRICE, ADDON_AI_PACK_PRICE, unitEconomics, getPlan } from "@/lib/plans";
import type { PlanTier } from "@/lib/types";

export default function BillingPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const subscriptions = useApp((s) => s.subscriptions);
  const clients = useApp((s) => s.clients);
  const changePlan = useApp((s) => s.changePlan);

  const sub = subscriptions.find((s) => s.trainerId === currentUserId);
  const plan = getPlan(sub?.tier ?? "starter");
  const myClients = clients.filter((c) => c.trainerId === currentUserId);

  const [simTier, setSimTier] = useState<PlanTier>(plan.tier);
  const [simExtras, setSimExtras] = useState(sub?.extraSeats ?? 0);
  const [simTrainerCount, setSimTrainerCount] = useState(100);

  const simPlan = getPlan(simTier);
  const eco = unitEconomics(simPlan, simExtras);
  const totalMRR = eco.revenue * simTrainerCount;
  const totalARR = totalMRR * 12;
  const totalGM = eco.grossMargin * simTrainerCount;

  if (!sub) return null;

  const aiPct = (sub.aiUsedThisMonth / plan.aiRequestsMonthly) * 100;
  const photoPct = (sub.photoAnalysesThisMonth / plan.photoAnalysesMonthly) * 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold">Plan & Billing</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            Twój plan: <span className="text-gradient">{plan.name}</span>
          </h1>
          <p className="text-ink-500 mt-1">Skaluj studio — od freelancera do agencji.</p>
        </div>
      </div>

      <div className="card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-indigo-400 via-purple-400 to-brand-400" />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
          <UsageMeter label="Klienci" used={myClients.length} max={plan.clientSlots + sub.extraSeats} unit="" color="brand" />
          <UsageMeter label="Zapytania AI" used={sub.aiUsedThisMonth} max={plan.aiRequestsMonthly} unit="" color="purple" />
          <UsageMeter label="Analizy zdjęć" used={sub.photoAnalysesThisMonth} max={plan.photoAnalysesMonthly} unit="" color="amber" />
          <UsageMeter label="Wearables" used={myClients.length} max={plan.wearableSeats} unit="" color="emerald" />
        </div>
        <div className="relative mt-5 pt-5 border-t border-ink-100 flex items-center justify-between flex-wrap gap-3 text-sm">
          <span className="text-ink-600">
            Następne odnowienie: <strong>{sub.renewsAt}</strong> · {plan.priceMonthly} PLN/mc
          </span>
          <span className="chip-success"><ShieldCheck className="h-3 w-3" /> Płatność bezpieczna · Stripe</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const isCurrent = p.tier === sub.tier;
          const featured = p.tier === "studio";
          return (
            <div
              key={p.tier}
              className={`relative rounded-3xl p-6 ${
                featured
                  ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white shadow-glow ring-2 ring-purple-400 scale-[1.02]"
                  : "bg-white/80 border border-ink-100"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-white text-purple-600 text-[10px] font-semibold uppercase tracking-wider shadow-soft">
                  <Sparkles className="inline h-3 w-3 mr-1" />{p.badge}
                </span>
              )}
              <h3 className={`font-display text-2xl font-semibold ${featured ? "text-white" : "text-ink-900"}`}>{p.name}</h3>
              <div className={`mt-3 ${featured ? "text-white" : "text-ink-900"}`}>
                <span className="font-display text-5xl font-bold">{p.priceMonthly}</span>
                <span className="text-sm opacity-70 ml-1">PLN/mc</span>
              </div>
              <p className={`text-sm mt-1 mb-5 ${featured ? "text-white/80" : "text-ink-500"}`}>
                Do {p.clientSlots} podopiecznych · {p.aiRequestsMonthly} zapytań AI
              </p>
              <ul className="space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className={`flex gap-2 ${featured ? "text-white/95" : "text-ink-700"}`}>
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${featured ? "text-amber-200" : "text-emerald-500"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => currentUserId && changePlan(currentUserId, p.tier)}
                className={`w-full mt-6 py-3 rounded-xl font-medium transition ${
                  isCurrent
                    ? "bg-ink-100 text-ink-500 cursor-default"
                    : featured
                    ? "bg-white text-purple-600 hover:bg-amber-50 shadow-soft"
                    : "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow hover:from-brand-600 hover:to-brand-700"
                }`}
              >
                {isCurrent ? "Twój aktualny plan" : "Wybierz"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Unit economics simulator */}
      <div className="card">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" /> Unit Economics — kalkulator
            </h2>
            <p className="text-sm text-ink-500">Symuluj revenue, koszty AI/obsługi i marżę przy skali.</p>
          </div>
          <span className="chip-brand"><Sparkles className="h-3 w-3" /> 20% cap na koszty</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="label">Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((p) => (
                  <button
                    key={p.tier}
                    onClick={() => setSimTier(p.tier)}
                    className={`rounded-xl px-3 py-2 text-xs font-medium ${
                      simTier === p.tier ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "bg-white border border-ink-200 text-ink-700"
                    }`}
                  >
                    {p.name.replace("Coach ", "")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Dodatkowi klienci ({ADDON_CLIENT_PRICE} PLN/szt)</label>
              <input
                type="range"
                min={0}
                max={20}
                value={simExtras}
                onChange={(e) => setSimExtras(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="text-xs text-ink-600 mt-1">{simExtras} extra · +{simExtras * ADDON_CLIENT_PRICE} PLN</div>
            </div>
            <div>
              <label className="label">Liczba trenerów na platformie</label>
              <input
                type="range"
                min={10}
                max={5000}
                step={10}
                value={simTrainerCount}
                onChange={(e) => setSimTrainerCount(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="text-xs text-ink-600 mt-1">{simTrainerCount.toLocaleString("pl-PL")} aktywnych trenerów</div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <BigStat label="MRR (Twoja firma)" value={`${(totalMRR / 1000).toFixed(1)}k`} unit="PLN/mc" color="brand" />
              <BigStat label="ARR" value={`${(totalARR / 1000).toFixed(0)}k`} unit="PLN/rok" color="purple" />
              <BigStat label="Marża brutto" value={`${eco.marginPct.toFixed(0)}%`} unit={`${totalGM.toFixed(0)} PLN/mc/trenera`} color="emerald" />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-ink-50 to-white border border-ink-100 p-5">
              <h4 className="font-display font-semibold text-ink-900 mb-3">Struktura kosztów / trener / miesiąc</h4>
              <div className="space-y-2.5 text-sm">
                <CostRow label="Revenue (od trenera)" value={eco.revenue} kind="rev" />
                <CostRow label="AI (OpenAI + Vision)" value={eco.aiCost} pct={(eco.aiCost / eco.revenue) * 100} />
                <CostRow label="Storage (zdjęcia, dane)" value={eco.storageCost} pct={(eco.storageCost / eco.revenue) * 100} />
                <CostRow label="Hosting / infra" value={eco.hostingCost} pct={(eco.hostingCost / eco.revenue) * 100} />
                <CostRow label="Opłaty Stripe" value={eco.paymentFees} pct={(eco.paymentFees / eco.revenue) * 100} />
                <div className="border-t border-ink-200 pt-2.5 mt-2 flex items-center justify-between font-semibold">
                  <span className="text-ink-700">Łączny COGS</span>
                  <span className="text-ink-900">{eco.totalCogs.toFixed(2)} PLN <span className="text-xs text-rose-600 font-normal ml-1">{eco.cogsPct.toFixed(1)}%</span></span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-ink-700">Marża brutto</span>
                  <span className="font-display font-bold text-emerald-600">
                    {eco.grossMargin.toFixed(2)} PLN <span className="text-xs ml-1">({eco.marginPct.toFixed(0)}%)</span>
                  </span>
                </div>
              </div>
              <div className={`mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
                eco.cogsPct < 20 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}>
                {eco.cogsPct < 20 ? (
                  <><ShieldCheck className="h-4 w-4" /> Cap 20% COGS spełniony · zostaje {(20 - eco.cogsPct).toFixed(1)} pp buforu</>
                ) : (
                  <>⚠ Cap 20% przekroczony — zredukuj limity AI lub podnieś cenę</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="font-display text-lg font-semibold text-ink-900 mb-2">Add-ony</h4>
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-xl bg-white/60 border border-ink-100 p-3">
              <div>
                <div className="text-sm font-semibold text-ink-900">+1 slot klienta</div>
                <div className="text-xs text-ink-500">{ADDON_CLIENT_PRICE} PLN/mc · payg</div>
              </div>
              <button className="btn-ghost text-sm">Dodaj</button>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/60 border border-ink-100 p-3">
              <div>
                <div className="text-sm font-semibold text-ink-900">AI Pack +200 zapytań</div>
                <div className="text-xs text-ink-500">{ADDON_AI_PACK_PRICE} PLN · jednorazowo</div>
              </div>
              <button className="btn-ghost text-sm">Dodaj</button>
            </li>
          </ul>
        </div>

        <div className="card bg-gradient-to-br from-indigo-50 via-purple-50 to-brand-50">
          <h4 className="font-display text-lg font-semibold text-ink-900 mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" /> Twoje studio rośnie
          </h4>
          <p className="text-sm text-ink-700 mb-4">
            Średnio trenerzy w pierwszym roku zwiększają liczbę podopiecznych z 5 do 12 — przejście na Studio zwiększa Twój zarobek netto o ~83% bez dotykania marży.
          </p>
          <button className="btn-primary"><ArrowUpRight className="h-4 w-4" /> Zaplanuj upgrade</button>
        </div>
      </div>
    </div>
  );
}

function UsageMeter({
  label,
  used,
  max,
  unit,
  color
}: {
  label: string;
  used: number;
  max: number;
  unit: string;
  color: "brand" | "purple" | "amber" | "emerald";
}) {
  const pct = Math.min(100, (used / Math.max(max, 1)) * 100);
  const colors = {
    brand: "from-brand-500 to-brand-600",
    purple: "from-indigo-500 to-purple-500",
    amber: "from-amber-500 to-orange-500",
    emerald: "from-emerald-500 to-emerald-600"
  } as const;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-ink-500 font-medium">{label}</span>
        <span className="text-xs font-semibold text-ink-700">{used} / {max}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BigStat({ label, value, unit, color }: { label: string; value: string; unit: string; color: "brand" | "purple" | "emerald" }) {
  const colors = {
    brand: "from-brand-500 to-brand-600",
    purple: "from-indigo-500 to-purple-500",
    emerald: "from-emerald-500 to-emerald-600"
  } as const;
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-4">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">{label}</div>
      <div className={`font-display text-3xl font-bold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent mt-1`}>{value}</div>
      <div className="text-xs text-ink-500 mt-0.5">{unit}</div>
    </div>
  );
}

function CostRow({ label, value, pct, kind }: { label: string; value: number; pct?: number; kind?: "rev" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={kind === "rev" ? "font-semibold text-ink-900" : "text-ink-600"}>{label}</span>
      <span className={kind === "rev" ? "font-semibold text-emerald-600" : "text-ink-700"}>
        {kind === "rev" ? "+" : "−"}{value.toFixed(2)} PLN
        {pct != null && <span className="text-xs text-ink-400 ml-2">{pct.toFixed(1)}%</span>}
      </span>
    </div>
  );
}
