"use client";

import { useMemo } from "react";
import {
  Dumbbell,
  Utensils,
  ClipboardCheck,
  Ruler,
  Video,
  Sparkles,
  Clock
} from "lucide-react";
import type { CalendarEvent, CalendarEventKind } from "@/lib/types";
import {
  eventKindMeta,
  formatDayFull,
  formatDayShort,
  parseIso,
  todayIso,
  weekDates
} from "@/lib/calendar";

const kindIcon: Record<CalendarEventKind, typeof Dumbbell> = {
  workout: Dumbbell,
  meal: Utensils,
  checkin: ClipboardCheck,
  measurement: Ruler,
  consultation: Video,
  custom: Sparkles
};

interface Props {
  mondayIso: string;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  /** Optional per-event accent (e.g. client color) shown on the left edge of the tile. */
  accentFor?: (event: CalendarEvent) => string | undefined;
  /** Optional small badge rendered on each event (e.g. client initials). */
  badgeFor?: (event: CalendarEvent) => string | undefined;
}

export function CalendarWeek({ mondayIso, events, onEventClick, accentFor, badgeFor }: Props) {
  const days = useMemo(() => weekDates(mondayIso), [mondayIso]);
  const todayId = todayIso();

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    days.forEach((d) => map.set(d, []));
    for (const e of events) {
      if (map.has(e.date)) map.get(e.date)!.push(e);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const ta = a.startTime ?? "00:00";
        const tb = b.startTime ?? "00:00";
        return ta.localeCompare(tb);
      });
    }
    return map;
  }, [days, events]);

  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-glass overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-ink-100">
        {days.map((iso, dow) => {
          const d = parseIso(iso);
          const isToday = iso === todayId;
          const list = byDay.get(iso) ?? [];
          return (
            <div
              key={iso}
              className={`min-h-[420px] flex flex-col ${
                isToday ? "bg-brand-50/40" : "bg-white/40"
              }`}
            >
              <div
                className={`px-3 py-2.5 border-b ${
                  isToday ? "border-brand-200 bg-brand-50/60" : "border-ink-100"
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
                    isToday ? "text-brand-700" : "text-ink-500"
                  }`}
                >
                  {formatDayShort(dow)}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-display text-xl font-semibold tracking-tight ${
                      isToday ? "text-brand-700" : "text-ink-900"
                    }`}
                  >
                    {d.getUTCDate()}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                      dziś
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto scrollbar-thin">
                {list.length === 0 ? (
                  <div className="text-[11px] text-ink-400 italic px-1 py-2">—</div>
                ) : (
                  list.map((event) => (
                    <EventTile
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      accent={accentFor?.(event)}
                      badge={badgeFor?.(event)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile fallback: vertical day list. */}
      <div className="hidden">{/* future: stack on small screens */}</div>
    </div>
  );
}

// Mobile-friendly stacked variant (used when grid is too cramped on narrow screens).
export function CalendarWeekStacked({
  mondayIso,
  events,
  onEventClick,
  accentFor,
  badgeFor
}: Props) {
  const days = useMemo(() => weekDates(mondayIso), [mondayIso]);
  const todayId = todayIso();

  return (
    <div className="space-y-3">
      {days.map((iso, dow) => {
        const list = events
          .filter((e) => e.date === iso)
          .sort((a, b) => (a.startTime ?? "00:00").localeCompare(b.startTime ?? "00:00"));
        const isToday = iso === todayId;
        const d = parseIso(iso);
        return (
          <div
            key={iso}
            className={`rounded-2xl border ${
              isToday ? "border-brand-300 bg-brand-50/40" : "border-ink-100 bg-white/60"
            } overflow-hidden`}
          >
            <div
              className={`px-4 py-2.5 flex items-center justify-between ${
                isToday ? "bg-brand-50" : "bg-ink-50/60"
              }`}
            >
              <div>
                <div
                  className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
                    isToday ? "text-brand-700" : "text-ink-500"
                  }`}
                >
                  {formatDayFull(dow)}
                </div>
                <div className="text-sm font-semibold text-ink-900">
                  {d.getUTCDate()}.{String(d.getUTCMonth() + 1).padStart(2, "0")}
                  {isToday && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                      dziś
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-ink-500">{list.length} wydarzeń</span>
            </div>
            <div className="px-3 py-2 space-y-1.5">
              {list.length === 0 ? (
                <div className="text-[11px] text-ink-400 italic px-1 py-2">
                  Nic zaplanowanego.
                </div>
              ) : (
                list.map((event) => (
                  <EventTile
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    accent={accentFor?.(event)}
                    badge={badgeFor?.(event)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventTile({
  event,
  onClick,
  accent,
  badge
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  accent?: string;
  badge?: string;
}) {
  const meta = eventKindMeta[event.kind];
  const Icon = kindIcon[event.kind];
  const done = event.status === "done";
  const missed = event.status === "missed";

  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(event) : undefined}
      className={`group w-full text-left rounded-lg border px-2 py-1.5 transition shadow-soft/0 hover:shadow-soft ${
        meta.tile
      } ${done ? "opacity-70" : ""} ${missed ? "border-rose-300 bg-rose-50/70" : ""}`}
      style={accent ? { boxShadow: `inset 3px 0 0 ${accent}` } : undefined}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0 opacity-80" />
        {event.startTime && (
          <span className="text-[10px] font-mono font-semibold text-ink-700">
            {event.startTime}
          </span>
        )}
        {done && (
          <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-700 ml-auto">
            ✓ done
          </span>
        )}
        {missed && (
          <span className="text-[9px] uppercase tracking-wider font-semibold text-rose-700 ml-auto">
            missed
          </span>
        )}
        {badge && (
          <span className="ml-auto text-[9px] font-semibold text-ink-500 truncate">
            {badge}
          </span>
        )}
      </div>
      <div
        className={`text-[11px] font-medium leading-snug mt-0.5 line-clamp-2 ${
          done ? "text-ink-500 line-through" : "text-ink-900"
        }`}
      >
        {event.title}
      </div>
      {event.durationMinutes && !done && (
        <div className="text-[9px] text-ink-500 mt-0.5 inline-flex items-center gap-0.5">
          <Clock className="h-2.5 w-2.5" /> {event.durationMinutes} min
        </div>
      )}
    </button>
  );
}
