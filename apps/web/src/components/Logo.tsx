import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-amber-500 shadow-glow" />
        <div className="absolute inset-[3px] rounded-[10px] bg-white/95 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4" />
            <path d="M8 6c0-2 2-3 4-3s4 1 4 3" />
            <path d="M5 11c0-3.5 3-5 7-5s7 1.5 7 5c0 6-3 11-7 11S5 17 5 11Z" />
            <path d="M9 12c1.5 1 4.5 1 6 0" />
          </svg>
        </div>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display text-lg font-semibold tracking-tight text-ink-900">
            Diet<span className="text-gradient">App</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500 -mt-0.5">
            Coach OS
          </div>
        </div>
      )}
    </div>
  );
}
