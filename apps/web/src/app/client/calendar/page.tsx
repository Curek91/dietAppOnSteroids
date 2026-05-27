"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CalendarWeek, CalendarWeekStacked } from "@/components/CalendarWeek";
import {
  addDays,
  eventKindMeta,
  formatDayLabel,
  formatWeekRange,
  startOfWeek,
  todayIso
} from "@/lib/calendar";
import type { CalendarEvent, CalendarEventStatus } from "@/lib/types";

export default function ClientCalendarPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const calendarEvents = useApp((s) => s.calendarEvents);
  const setStatus = useApp((s) => s.setCalendarEventStatus);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);

  const [mondayIso, setMondayIso] = useState(() => startOfWeek(todayIso()));
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const myEvents = useMemo(
    () => (profile ? calendarEvents.filter((e) => e.clientId === profile.id) : []),
    [calendarEvents, profile]
  );

  const weekEvents = useMemo(() => {
    const start = mondayIso;
    const end = addDays(mondayIso, 6);
    return myEvents.filter((e) => e.date >= start && e.date <= end);
  }, [myEvents, mondayIso]);

  const counts = {
    planned: weekEvents.filter((e) => e.status === "planned").length,
    done: weekEvents.filter((e) => e.status === "done").length,
    missed: weekEvents.filter((e) => e.status === "missed").length
  };

  if (!profile) {
    return (
      <div className="card text-center py-16 max-w-2xl mx-auto">
        <CalendarDays className="h-12 w-12 mx-auto text-ink-300 mb-3" />
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Brak harmonogramu
        </h2>
        <p className="text-ink-500 mt-1">
          Twój trener jeszcze nie ułożył kalendarza — wkrótce coś się tu pojawi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-brand-600 mb-2">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold">
              Kalendarz
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            {formatWeekRange(mondayIso)}
          </h1>
          <p className="text-ink-500 mt-1">
            Treningi, posiłki, check-iny i konsultacje na jednej osi. Kliknij wydarzenie,
            żeby je odhaczyć.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMondayIso(addDays(mondayIso, -7))}
            className="btn-ghost p-2.5"
            aria-label="Poprzedni tydzień"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMondayIso(startOfWeek(todayIso()))}
            className="btn-ghost text-sm"
          >
            Dziś
          </button>
          <button
            onClick={() => setMondayIso(addDays(mondayIso, 7))}
            className="btn-ghost p-2.5"
            aria-label="Następny tydzień"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 max-w-md">
        <StatPill
          label="Zaplanowane"
          value={counts.planned}
          tone="amber"
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <StatPill
          label="Wykonane"
          value={counts.done}
          tone="emerald"
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
        />
        <StatPill
          label="Opuszczone"
          value={counts.missed}
          tone="rose"
          icon={<AlertCircle className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="hidden lg:block">
        <CalendarWeek
          mondayIso={mondayIso}
          events={weekEvents}
          onEventClick={setSelected}
        />
      </div>
      <div className="lg:hidden">
        <CalendarWeekStacked
          mondayIso={mondayIso}
          events={weekEvents}
          onEventClick={setSelected}
        />
      </div>

      {selected && (
        <EventDetailsModal
          event={selected}
          onClose={() => setSelected(null)}
          onMarkDone={() => {
            setStatus(selected.id, "done");
            setSelected(null);
          }}
          onMarkMissed={() => {
            setStatus(selected.id, "missed");
            setSelected(null);
          }}
          onMarkPlanned={() => {
            setStatus(selected.id, "planned");
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
  icon
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose";
  icon: React.ReactNode;
}) {
  const tones = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700"
  } as const;
  return (
    <div className={`rounded-2xl border px-3 py-2.5 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
        {icon} {label}
      </div>
      <div className="text-2xl font-display font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function EventDetailsModal({
  event,
  onClose,
  onMarkDone,
  onMarkMissed,
  onMarkPlanned
}: {
  event: CalendarEvent;
  onClose: () => void;
  onMarkDone: () => void;
  onMarkMissed: () => void;
  onMarkPlanned: () => void;
}) {
  const meta = eventKindMeta[event.kind];
  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-glass border border-white/80 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-100">
          <div className="flex items-center justify-between">
            <span className={`chip border ${meta.chip} text-[10px]`}>{meta.label}</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-ink-50"
              aria-label="Zamknij"
            >
              <X className="h-5 w-5 text-ink-500" />
            </button>
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-900 mt-3">
            {event.title}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {formatDayLabel(event.date)}
            {event.startTime ? ` · ${event.startTime}` : ""}
            {event.durationMinutes ? ` · ${event.durationMinutes} min` : ""}
          </p>
          {event.notes && (
            <p className="mt-3 text-sm text-ink-700 italic">"{event.notes}"</p>
          )}
        </div>
        <div className="p-6 grid grid-cols-3 gap-2">
          <button
            onClick={onMarkDone}
            disabled={event.status === "done"}
            className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2.5 text-sm font-medium hover:bg-emerald-100 transition disabled:opacity-50"
          >
            <Check className="h-4 w-4 inline-block mr-1" /> Zrobione
          </button>
          <button
            onClick={onMarkMissed}
            disabled={event.status === "missed"}
            className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2.5 text-sm font-medium hover:bg-rose-100 transition disabled:opacity-50"
          >
            <AlertCircle className="h-4 w-4 inline-block mr-1" /> Pominięte
          </button>
          <button
            onClick={onMarkPlanned}
            disabled={event.status === "planned"}
            className="rounded-xl border border-ink-200 bg-ink-50 text-ink-700 px-3 py-2.5 text-sm font-medium hover:bg-white transition disabled:opacity-50"
          >
            <Clock className="h-4 w-4 inline-block mr-1" /> Cofnij
          </button>
        </div>
      </div>
    </div>
  );
}
