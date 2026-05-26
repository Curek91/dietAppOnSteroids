import { Flame, Activity, TrendingUp, Users, Sparkles, Camera, ArrowUpRight } from "lucide-react";

/**
 * Server-rendered browser-frame preview of the trainer dashboard.
 * No images, no JS — keeps LCP fast and avoids CLS.
 */
export function DashboardMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-8 bg-mesh-warm rounded-[40px] blur-2xl opacity-70 -z-10" />

      <div className="relative rounded-[20px] bg-white border border-ink-200/50 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 bg-ink-50/60">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 mx-3">
            <div className="mx-auto max-w-[260px] rounded-md bg-white border border-ink-200 text-[11px] text-ink-500 px-3 py-1 text-center font-mono">
              dietapp.pl/trainer
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-5 md:p-6 bg-gradient-to-br from-white via-brand-50/30 to-amber-50/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-brand-600 font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Pulpit
              </div>
              <div className="font-display text-xl font-semibold text-ink-900 mt-0.5">
                Cześć, Anna
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[11px] text-ink-500">
              <span className="chip">Nowy klient</span>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <KpiTile icon={<Users className="h-3.5 w-3.5" />} label="Klienci" value="8/15" />
            <KpiTile icon={<Flame className="h-3.5 w-3.5" />} label="Avg kcal" value="2240" />
            <KpiTile icon={<TrendingUp className="h-3.5 w-3.5" />} label="Pomiary" value="34" />
            <KpiTile icon={<Camera className="h-3.5 w-3.5" />} label="Foto" value="6" />
          </div>

          {/* Client list */}
          <div className="mt-4 rounded-xl bg-white shadow-soft border border-white/80 p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-2">
              Twoi podopieczni
            </div>
            <ul className="space-y-1.5">
              <ClientRow name="Marta Nowak" goal="Redukcja · 2100 kcal" hue={20} />
              <ClientRow name="Kuba Wiśniewski" goal="Masa · 3200 kcal" hue={150} />
              <ClientRow name="Ola Kamińska" goal="Forma · 1800 kcal" hue={290} />
            </ul>
          </div>

          {/* Today timeline */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white shadow-soft border border-white/80 p-3">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Dziś</span>
              </div>
              <div className="text-sm font-semibold text-ink-900 mt-1 leading-snug">
                Trening Marty — 13:30
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 text-white p-3 shadow-glow">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-medium mt-1 leading-snug">
                4 nowe sugestie do planów
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-white/80 shadow-soft p-2">
      <div className="text-brand-600">{icon}</div>
      <div className="text-[9px] uppercase tracking-wider text-ink-500 mt-1">{label}</div>
      <div className="text-sm font-semibold text-ink-900 leading-tight">{value}</div>
    </div>
  );
}

function ClientRow({ name, goal, hue }: { name: string; goal: string; hue: number }) {
  return (
    <li className="flex items-center gap-2.5 px-1 py-1">
      <div
        className="h-7 w-7 rounded-lg shadow-soft shrink-0"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 85% 65%), hsl(${(hue + 25) % 360} 85% 55%))`
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-ink-900 truncate">{name}</div>
        <div className="text-[10px] text-ink-500 truncate">{goal}</div>
      </div>
      <ArrowUpRight className="h-3 w-3 text-ink-300" />
    </li>
  );
}
