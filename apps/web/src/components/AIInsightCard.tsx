import { Sparkles, AlertTriangle, CheckCircle2, Info, Trophy } from "lucide-react";
import type { AIInsight } from "@/lib/types";
import { cn } from "@/lib/cn";

const styles = {
  positive: { ring: "ring-emerald-200", icon: "text-emerald-600 bg-emerald-100", Icon: Trophy, chip: "Sukces" },
  info: { ring: "ring-sky-200", icon: "text-sky-600 bg-sky-100", Icon: Info, chip: "Info" },
  warning: { ring: "ring-amber-200", icon: "text-amber-600 bg-amber-100", Icon: AlertTriangle, chip: "Uwaga" },
  critical: { ring: "ring-rose-200", icon: "text-rose-600 bg-rose-100", Icon: AlertTriangle, chip: "Pilne" }
} as const;

export function AIInsightCard({ insight, compact }: { insight: AIInsight; compact?: boolean }) {
  const st = styles[insight.severity];
  const Icon = st.Icon;
  return (
    <div className={cn("rounded-2xl bg-white/70 border border-white/80 backdrop-blur p-4 ring-1", st.ring)}>
      <div className="flex items-start gap-3">
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", st.icon)}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display font-semibold text-ink-900">{insight.title}</h4>
            <span className="chip-brand !text-[9px] !py-0.5 !px-2">
              <Sparkles className="h-2.5 w-2.5" /> AI · {st.chip}
            </span>
          </div>
          <p className={cn("text-ink-700 mt-1 leading-relaxed", compact ? "text-xs" : "text-sm")}>{insight.body}</p>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider mt-1.5">
            {new Date(insight.generatedAt).toLocaleString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIBadge({ label = "AI", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white shadow-glow", className)}>
      <Sparkles className="h-2.5 w-2.5" /> {label}
    </span>
  );
}
