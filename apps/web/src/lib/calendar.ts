import type { CalendarEventKind } from "@/lib/types";

const DAY_LABELS_PL = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
const DAY_LABELS_FULL_PL = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela"
];
const MONTH_LABELS_PL = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia"
];

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const parseIso = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatIso = (date: Date): string => date.toISOString().slice(0, 10);

/** Returns the Monday (UTC) of the week containing dateIso, in YYYY-MM-DD. */
export const startOfWeek = (dateIso: string): string => {
  const d = parseIso(dateIso);
  const dow = (d.getUTCDay() + 6) % 7; // 0=Mon..6=Sun
  d.setUTCDate(d.getUTCDate() - dow);
  return formatIso(d);
};

export const addDays = (dateIso: string, days: number): string => {
  const d = parseIso(dateIso);
  d.setUTCDate(d.getUTCDate() + days);
  return formatIso(d);
};

/** Inclusive list of 7 ISO dates Mon..Sun starting from mondayIso. */
export const weekDates = (mondayIso: string): string[] =>
  Array.from({ length: 7 }, (_, i) => addDays(mondayIso, i));

export const formatDayLabel = (iso: string): string => {
  const d = parseIso(iso);
  return `${d.getUTCDate()} ${MONTH_LABELS_PL[d.getUTCMonth()]}`;
};

export const formatDayShort = (dow: number): string => DAY_LABELS_PL[dow];
export const formatDayFull = (dow: number): string => DAY_LABELS_FULL_PL[dow];

export const formatWeekRange = (mondayIso: string): string => {
  const a = parseIso(mondayIso);
  const b = parseIso(addDays(mondayIso, 6));
  const aMonth = MONTH_LABELS_PL[a.getUTCMonth()];
  const bMonth = MONTH_LABELS_PL[b.getUTCMonth()];
  if (a.getUTCMonth() === b.getUTCMonth()) {
    return `${a.getUTCDate()}–${b.getUTCDate()} ${aMonth} ${b.getUTCFullYear()}`;
  }
  return `${a.getUTCDate()} ${aMonth} – ${b.getUTCDate()} ${bMonth} ${b.getUTCFullYear()}`;
};

// Kind → label + color tokens. Keep palette additive on top of brand/ink.
export const eventKindMeta: Record<
  CalendarEventKind,
  { label: string; chip: string; dot: string; tile: string }
> = {
  workout: {
    label: "Trening",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    tile: "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-50"
  },
  meal: {
    label: "Posiłek",
    chip: "bg-brand-50 text-brand-700 border-brand-200",
    dot: "bg-brand-500",
    tile: "bg-brand-50/70 border-brand-200 hover:bg-brand-50"
  },
  checkin: {
    label: "Check-in",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    tile: "bg-indigo-50/70 border-indigo-200 hover:bg-indigo-50"
  },
  measurement: {
    label: "Pomiary",
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    tile: "bg-rose-50/70 border-rose-200 hover:bg-rose-50"
  },
  consultation: {
    label: "Konsultacja",
    chip: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    tile: "bg-purple-50/70 border-purple-200 hover:bg-purple-50"
  },
  custom: {
    label: "Inne",
    chip: "bg-ink-100 text-ink-700 border-ink-200",
    dot: "bg-ink-500",
    tile: "bg-ink-50 border-ink-200 hover:bg-white"
  }
};
