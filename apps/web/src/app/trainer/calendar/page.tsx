"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Save,
  Users,
  Filter
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
import type {
  CalendarEvent,
  CalendarEventKind,
  ClientProfile
} from "@/lib/types";

const KINDS: { value: CalendarEventKind; label: string }[] = [
  { value: "workout", label: "Trening" },
  { value: "meal", label: "Posiłek" },
  { value: "checkin", label: "Check-in" },
  { value: "measurement", label: "Pomiary" },
  { value: "consultation", label: "Konsultacja" },
  { value: "custom", label: "Inne" }
];

export default function TrainerCalendarPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const events = useApp((s) => s.calendarEvents);
  const addEvent = useApp((s) => s.addCalendarEvent);
  const updateEvent = useApp((s) => s.updateCalendarEvent);
  const removeEvent = useApp((s) => s.removeCalendarEvent);

  const me = users.find((u) => u.id === currentUserId);
  const myClients = useMemo(
    () => (me ? clients.filter((c) => c.trainerId === me.id) : []),
    [clients, me]
  );

  const [mondayIso, setMondayIso] = useState(() => startOfWeek(todayIso()));
  const [filterClientId, setFilterClientId] = useState<string | "all">("all");
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [creating, setCreating] = useState<{ date?: string } | null>(null);

  const visibleClients = useMemo(
    () =>
      filterClientId === "all"
        ? new Set(myClients.map((c) => c.id))
        : new Set([filterClientId]),
    [filterClientId, myClients]
  );

  const weekEvents = useMemo(() => {
    const start = mondayIso;
    const end = addDays(mondayIso, 6);
    return events.filter(
      (e) => visibleClients.has(e.clientId) && e.date >= start && e.date <= end
    );
  }, [events, mondayIso, visibleClients]);

  const accentFor = (event: CalendarEvent) => {
    const client = myClients.find((c) => c.id === event.clientId);
    if (!client) return undefined;
    return `hsl(${client.avatarHue} 80% 55%)`;
  };
  const badgeFor = (event: CalendarEvent) => {
    const client = myClients.find((c) => c.id === event.clientId);
    if (!client) return undefined;
    return `${client.firstName[0]}${client.lastName[0]}`;
  };

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
            Cały harmonogram Twoich klientów w jednym widoku. Kliknij wydarzenie żeby edytować
            albo dodaj nowe.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
          <button onClick={() => setCreating({})} className="btn-primary text-sm">
            <Plus className="h-4 w-4" /> Nowe wydarzenie
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-ink-500">
          <Filter className="h-3.5 w-3.5" /> Klient
        </span>
        <button
          onClick={() => setFilterClientId("all")}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            filterClientId === "all"
              ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow"
              : "bg-white/70 border border-ink-200/60 text-ink-700 hover:bg-white"
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Wszyscy
        </button>
        {myClients.map((c) => {
          const active = filterClientId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilterClientId(c.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                active
                  ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow"
                  : "bg-white/70 border border-ink-200/60 text-ink-700 hover:bg-white"
              }`}
              style={
                active
                  ? undefined
                  : { boxShadow: `inset 3px 0 0 hsl(${c.avatarHue} 80% 55%)` }
              }
            >
              {c.firstName} {c.lastName[0]}.
            </button>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <CalendarWeek
          mondayIso={mondayIso}
          events={weekEvents}
          onEventClick={setSelected}
          accentFor={accentFor}
          badgeFor={filterClientId === "all" ? badgeFor : undefined}
        />
      </div>
      <div className="lg:hidden">
        <CalendarWeekStacked
          mondayIso={mondayIso}
          events={weekEvents}
          onEventClick={setSelected}
          accentFor={accentFor}
          badgeFor={filterClientId === "all" ? badgeFor : undefined}
        />
      </div>

      {selected && (
        <EventEditor
          event={selected}
          clients={myClients}
          onClose={() => setSelected(null)}
          onSave={(patch) => {
            updateEvent(selected.id, patch);
            setSelected(null);
          }}
          onDelete={() => {
            removeEvent(selected.id);
            setSelected(null);
          }}
        />
      )}

      {creating && me && (
        <EventEditor
          clients={myClients}
          defaultDate={creating.date ?? todayIso()}
          defaultClientId={filterClientId !== "all" ? filterClientId : myClients[0]?.id}
          onClose={() => setCreating(null)}
          onSave={(data) => {
            if (!data.clientId || !data.title || !data.date) return;
            addEvent({
              clientId: data.clientId,
              trainerId: me.id,
              kind: data.kind ?? "custom",
              title: data.title,
              date: data.date,
              startTime: data.startTime,
              durationMinutes: data.durationMinutes,
              status: "planned",
              notes: data.notes
            });
            setCreating(null);
          }}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function EventEditor({
  event,
  clients,
  defaultDate,
  defaultClientId,
  onSave,
  onDelete,
  onClose
}: {
  event?: CalendarEvent;
  clients: ClientProfile[];
  defaultDate?: string;
  defaultClientId?: string;
  onSave: (patch: Partial<CalendarEvent>) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [clientId, setClientId] = useState(event?.clientId ?? defaultClientId ?? clients[0]?.id ?? "");
  const [kind, setKind] = useState<CalendarEventKind>(event?.kind ?? "workout");
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? defaultDate ?? todayIso());
  const [startTime, setStartTime] = useState(event?.startTime ?? "");
  const [duration, setDuration] = useState(event?.durationMinutes?.toString() ?? "");
  const [notes, setNotes] = useState(event?.notes ?? "");

  const isNew = !event;
  const meta = eventKindMeta[kind];

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-glass border border-white/80 overflow-hidden animate-slide-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-100 flex items-start justify-between">
          <div>
            <span className={`chip border ${meta.chip} text-[10px]`}>{meta.label}</span>
            <h2 className="font-display text-xl font-semibold text-ink-900 mt-2">
              {isNew ? "Nowe wydarzenie" : "Edytuj wydarzenie"}
            </h2>
            {event && (
              <p className="text-[11px] text-ink-500 mt-1">
                {formatDayLabel(event.date)}
                {event.startTime ? ` · ${event.startTime}` : ""}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ink-50" aria-label="Zamknij">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="label">Klient</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Rodzaj</label>
            <div className="grid grid-cols-3 gap-2">
              {KINDS.map((k) => {
                const active = kind === k.value;
                const m = eventKindMeta[k.value];
                return (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => setKind(k.value)}
                    className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                      active ? `${m.chip} border` : "bg-white/70 border-ink-200/60 text-ink-700"
                    }`}
                  >
                    {k.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Tytuł</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Push A · klatka"
              className="input"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="label">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Godzina</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Czas (min)</label>
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="np. 60"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Notatka</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Opcjonalna notka dla klienta…"
              className="input"
            />
          </div>
        </div>

        <div className="p-6 border-t border-ink-100 flex flex-wrap justify-between gap-2">
          {!isNew && onDelete ? (
            <button
              onClick={onDelete}
              className="text-rose-500 text-sm hover:underline inline-flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" /> Usuń wydarzenie
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">
              Anuluj
            </button>
            <button
              onClick={() =>
                onSave({
                  clientId,
                  kind,
                  title: title.trim(),
                  date,
                  startTime: startTime || undefined,
                  durationMinutes: duration ? parseInt(duration, 10) : undefined,
                  notes: notes.trim() || undefined
                })
              }
              disabled={!title.trim() || !clientId || !date}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {isNew ? "Dodaj wydarzenie" : "Zapisz zmiany"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
