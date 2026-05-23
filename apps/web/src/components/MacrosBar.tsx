import { Flame } from "lucide-react";
import type { Macros } from "@/lib/types";
import { round } from "@/lib/macros";

export function MacrosBar({ macros, target, compact }: { macros: Macros; target?: number; compact?: boolean }) {
  const total = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  const pP = total ? (macros.protein * 4) / total : 0;
  const pC = total ? (macros.carbs * 4) / total : 0;
  const pF = total ? (macros.fat * 9) / total : 0;

  return (
    <div className={`glass rounded-2xl ${compact ? "p-4" : "p-6"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-brand-500" />
          <span className="text-xs uppercase tracking-wider text-ink-500 font-medium">Łącznie</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display font-semibold text-ink-900">
            {round(macros.kcal)} <span className="text-sm text-ink-500 font-normal">kcal</span>
          </div>
          {target && (
            <div className="text-[11px] text-ink-500">
              Cel: {target} kcal · <span className={macros.kcal > target ? "text-rose-600" : "text-emerald-600"}>
                {macros.kcal > target ? "+" : ""}{round(macros.kcal - target)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="h-2.5 rounded-full overflow-hidden bg-ink-100 flex">
        <div className="bg-gradient-to-r from-rose-400 to-rose-500" style={{ width: `${pP * 100}%` }} />
        <div className="bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: `${pC * 100}%` }} />
        <div className="bg-gradient-to-r from-violet-400 to-violet-500" style={{ width: `${pF * 100}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <MacroPill label="Białko" value={round(macros.protein, 1)} unit="g" color="rose" pct={round(pP * 100)} />
        <MacroPill label="Węgle" value={round(macros.carbs, 1)} unit="g" color="amber" pct={round(pC * 100)} />
        <MacroPill label="Tłuszcze" value={round(macros.fat, 1)} unit="g" color="violet" pct={round(pF * 100)} />
      </div>
    </div>
  );
}

function MacroPill({
  label,
  value,
  unit,
  color,
  pct
}: {
  label: string;
  value: number;
  unit: string;
  color: "rose" | "amber" | "violet";
  pct: number;
}) {
  const colors = {
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500"
  } as const;
  return (
    <div className="flex items-center gap-2.5">
      <div className={`h-2.5 w-2.5 rounded-full ${colors[color]}`} />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-ink-900">
          {value}<span className="text-ink-500 font-normal">{unit}</span>
          <span className="text-[10px] text-ink-400 ml-1">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
