import { Flame, Activity, Camera, CheckCircle2 } from "lucide-react";

/**
 * Pure-SVG/CSS phone preview. Renders entirely server-side — no JS,
 * no external image needed — so it stays fast and CLS-free for the LCP block.
 */
export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-8 bg-mesh-warm rounded-[40px] blur-2xl opacity-70 -z-10" />
      <div className="relative mx-auto w-[280px] md:w-[320px] aspect-[9/19.5] rounded-[44px] border border-ink-200/50 bg-gradient-to-b from-white to-ink-50 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] p-3">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-28 rounded-full bg-ink-900" />
        <div className="h-full w-full rounded-[34px] bg-gradient-to-br from-white via-brand-50/30 to-amber-50/40 p-5 pt-10 overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-medium">
            Dziś, środa
          </div>
          <div className="font-display text-xl font-semibold text-ink-900 mt-1">
            Cześć, Marta
          </div>

          <div className="mt-4 rounded-2xl bg-white shadow-soft p-4 border border-white/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-600">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Dziś</span>
              </div>
              <span className="text-[10px] text-ink-500">1840 / 2100 kcal</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-brand-400 to-amber-500" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Macro label="B" v="142g" />
              <Macro label="T" v="68g" />
              <Macro label="W" v="190g" />
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white shadow-soft p-4 border border-white/80">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Trening</span>
            </div>
            <div className="text-sm font-semibold text-ink-900 mt-1">Push A · klatka</div>
            <div className="text-[11px] text-ink-500">5 ćwiczeń · 42 min</div>
          </div>

          <div className="mt-3 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-500 text-white p-4 shadow-glow">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Posiłek</span>
            </div>
            <div className="text-sm font-medium mt-1">Zrób zdjęcie obiadu</div>
            <div className="text-[11px] text-white/85">AI sprawdzi zgodność z planem</div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Apple Watch zsynchronizowany
          </div>
        </div>
      </div>
    </div>
  );
}

function Macro({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg bg-ink-50 py-1.5">
      <div className="text-[9px] text-ink-500 uppercase tracking-wider">{label}</div>
      <div className="text-xs font-semibold text-ink-900">{v}</div>
    </div>
  );
}
