"use client";

import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Plus,
  Trash2,
  Upload,
  X,
  ChevronDown,
  ImagePlus,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ProgressChart } from "@/components/ProgressChart";
import type { ProgressPhoto, ProgressPhotoPose } from "@/lib/types";

const POSES: { value: ProgressPhotoPose; label: string }[] = [
  { value: "front", label: "Przód" },
  { value: "side", label: "Bok" },
  { value: "back", label: "Tył" },
  { value: "custom", label: "Inne" }
];

const POSE_LABEL: Record<ProgressPhotoPose, string> = {
  front: "Przód",
  side: "Bok",
  back: "Tył",
  custom: "Inne"
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function ClientProgressPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const progress = useApp((s) => s.progress);
  const addProgress = useApp((s) => s.addProgress);
  const removeProgress = useApp((s) => s.removeProgress);
  const progressPhotos = useApp((s) => s.progressPhotos);
  const addProgressPhoto = useApp((s) => s.addProgressPhoto);
  const removeProgressPhoto = useApp((s) => s.removeProgressPhoto);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);

  const entries = useMemo(
    () =>
      profile
        ? progress
            .filter((p) => p.clientId === profile.id)
            .sort((a, b) => a.date.localeCompare(b.date))
        : [],
    [progress, profile]
  );

  const myPhotos = useMemo(
    () =>
      profile
        ? progressPhotos
            .filter((p) => p.clientId === profile.id)
            .sort((a, b) => b.date.localeCompare(a.date))
        : [],
    [progressPhotos, profile]
  );

  const first = entries[0];
  const last = entries[entries.length - 1];
  const weightChange =
    first?.weight && last?.weight ? Number((last.weight - first.weight).toFixed(1)) : null;

  const [formOpen, setFormOpen] = useState(false);
  const [viewerPhoto, setViewerPhoto] = useState<ProgressPhoto | null>(null);

  if (!profile) {
    return (
      <div className="card text-center py-16 max-w-2xl mx-auto">
        <p className="text-ink-500">Brak profilu klienta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
            Twoje postępy
          </h1>
          <p className="text-ink-500 mt-1">
            {entries.length} pomiarów · {myPhotos.length} zdjęć sylwetki
          </p>
        </div>
        <button
          onClick={() => setFormOpen((o) => !o)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          {formOpen ? "Schowaj formularz" : "Nowy pomiar"}
        </button>
      </header>

      {formOpen && (
        <MeasurementForm
          onCancel={() => setFormOpen(false)}
          onSubmit={(entry) => {
            addProgress({ ...entry, clientId: profile.id });
            setFormOpen(false);
          }}
        />
      )}

      {entries.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card
              label="Start"
              value={first?.weight ? `${first.weight} kg` : "—"}
              sub={first?.date ?? ""}
            />
            <Card
              label="Aktualna"
              value={last?.weight ? `${last.weight} kg` : "—"}
              sub={last?.date ?? ""}
            />
            <Card
              label="Zmiana"
              value={
                weightChange !== null
                  ? `${weightChange > 0 ? "+" : ""}${weightChange} kg`
                  : "—"
              }
              accent={
                weightChange !== null
                  ? weightChange < 0
                    ? "good"
                    : "neutral"
                  : undefined
              }
            />
            <Card label="BF" value={last?.bodyFat ? `${last.bodyFat}%` : "—"} />
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-1">
              Waga & BF w czasie
            </h2>
            <p className="text-sm text-ink-500 mb-4">Twoja podróż</p>
            <ProgressChart data={entries} metrics={["weight", "bodyFat"]} />
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-1">
              Obwody
            </h2>
            <p className="text-sm text-ink-500 mb-4">Pas, klatka, biceps, udo</p>
            <ProgressChart data={entries} metrics={["waist", "chest", "arm", "thigh"]} />
          </div>

          <MeasurementHistory entries={entries} onRemove={removeProgress} />
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-ink-500">
            Brak pomiarów. Dodaj pierwszy — klik "Nowy pomiar" u góry.
          </p>
        </div>
      )}

      <PhotosSection
        photos={myPhotos}
        onUpload={(payload) => addProgressPhoto({ ...payload, clientId: profile.id })}
        onRemove={removeProgressPhoto}
        onOpen={setViewerPhoto}
      />

      {viewerPhoto && (
        <PhotoViewer photo={viewerPhoto} onClose={() => setViewerPhoto(null)} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function Card({
  label,
  value,
  sub,
  accent
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "good" | "neutral";
}) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div
        className={`stat-value mt-1 ${accent === "good" ? "text-emerald-600" : ""}`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function MeasurementForm({
  onCancel,
  onSubmit
}: {
  onCancel: () => void;
  onSubmit: (entry: {
    date: string;
    weight?: number;
    bodyFat?: number;
    waist?: number;
    chest?: number;
    arm?: number;
    thigh?: number;
  }) => void;
}) {
  const [form, setForm] = useState({
    date: todayIso(),
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: ""
  });

  const num = (v: string) =>
    v.trim() === "" ? undefined : parseFloat(v.replace(",", "."));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          date: form.date,
          weight: num(form.weight),
          bodyFat: num(form.bodyFat),
          waist: num(form.waist),
          chest: num(form.chest),
          arm: num(form.arm),
          thigh: num(form.thigh)
        });
      }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900">Nowy pomiar</h2>
          <p className="text-sm text-ink-500">
            Wypełnij to, co masz — pozostałe pola możesz pominąć.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-ink-50"
          aria-label="Zamknij"
        >
          <X className="h-5 w-5 text-ink-500" />
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Data</label>
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Waga (kg)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="np. 66.4"
          />
        </div>
        <div>
          <label className="label">BF (%)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.bodyFat}
            onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
            placeholder="opcjonalnie"
          />
        </div>
        <div>
          <label className="label">Pas (cm)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.waist}
            onChange={(e) => setForm({ ...form, waist: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Klatka (cm)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.chest}
            onChange={(e) => setForm({ ...form, chest: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Biceps (cm)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.arm}
            onChange={(e) => setForm({ ...form, arm: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Udo (cm)</label>
          <input
            className="input"
            inputMode="decimal"
            value={form.thigh}
            onChange={(e) => setForm({ ...form, thigh: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Anuluj
        </button>
        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4" /> Zapisz pomiar
        </button>
      </div>
    </form>
  );
}

function MeasurementHistory({
  entries,
  onRemove
}: {
  entries: ReturnType<typeof useApp> extends never ? never : { id: string; date: string; weight?: number; bodyFat?: number; waist?: number; chest?: number; arm?: number; thigh?: number }[];
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden p-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="text-left">
          <h3 className="font-display text-lg font-semibold text-ink-900">
            Historia pomiarów
          </h3>
          <p className="text-sm text-ink-500">{entries.length} wpisów</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-ink-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="overflow-x-auto scrollbar-thin border-t border-ink-100">
          <table className="w-full text-sm">
            <thead className="bg-white/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                <th className="px-5 py-2 font-medium">Data</th>
                <th className="px-5 py-2 font-medium">Waga</th>
                <th className="px-5 py-2 font-medium">BF%</th>
                <th className="px-5 py-2 font-medium">Pas</th>
                <th className="px-5 py-2 font-medium">Klatka</th>
                <th className="px-5 py-2 font-medium">Biceps</th>
                <th className="px-5 py-2 font-medium">Udo</th>
                <th className="px-5 py-2" />
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e) => (
                <tr key={e.id} className="border-t border-ink-100 hover:bg-white/60">
                  <td className="px-5 py-2 font-medium text-ink-900">{e.date}</td>
                  <td className="px-5 py-2">{e.weight ?? "—"}</td>
                  <td className="px-5 py-2">{e.bodyFat ?? "—"}</td>
                  <td className="px-5 py-2">{e.waist ?? "—"}</td>
                  <td className="px-5 py-2">{e.chest ?? "—"}</td>
                  <td className="px-5 py-2">{e.arm ?? "—"}</td>
                  <td className="px-5 py-2">{e.thigh ?? "—"}</td>
                  <td className="px-5 py-2 text-right">
                    <button
                      onClick={() => onRemove(e.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      aria-label="Usuń pomiar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Photos section ─────────────────────────────────────────────────

function PhotosSection({
  photos,
  onUpload,
  onRemove,
  onOpen
}: {
  photos: ProgressPhoto[];
  onUpload: (p: Omit<ProgressPhoto, "id" | "uploadedAt" | "clientId">) => void;
  onRemove: (id: string) => void;
  onOpen: (photo: ProgressPhoto) => void;
}) {
  const [uploadOpen, setUploadOpen] = useState(false);

  // Group photos by date for the timeline
  const grouped = useMemo(() => {
    const map = new Map<string, ProgressPhoto[]>();
    for (const p of photos) {
      const list = map.get(p.date) ?? [];
      list.push(p);
      map.set(p.date, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [photos]);

  const start = photos[photos.length - 1];
  const current = photos[0];
  const hasCompare = start && current && start.id !== current.id;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Zdjęcia sylwetki
          </h2>
          <p className="text-ink-500 mt-0.5 text-sm">
            Trener widzi je razem z Twoimi pomiarami. Zdjęcia mówią więcej niż waga.
          </p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="btn-primary">
          <ImagePlus className="h-4 w-4" /> Dodaj zdjęcie
        </button>
      </div>

      {hasCompare && (
        <div className="card">
          <div className="flex items-center gap-2 text-brand-600 mb-3">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.16em] font-semibold">
              Porównanie
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ComparePane label="Start" photo={start!} onOpen={onOpen} />
            <ComparePane label="Aktualnie" photo={current!} onOpen={onOpen} highlight />
          </div>
        </div>
      )}

      {grouped.length === 0 ? (
        <div className="card text-center py-12">
          <Camera className="h-10 w-10 mx-auto text-ink-300 mb-3" />
          <p className="text-ink-500 text-sm max-w-md mx-auto">
            Jeszcze nie ma zdjęć. Wrzuć pierwsze (przód + bok), żeby zobaczyć później
            jak się zmieniłeś.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, list]) => (
            <div key={date} className="card">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="font-display text-base font-semibold text-ink-900">
                  {date}
                </h3>
                {list[0].weight && (
                  <span className="text-xs text-ink-500">· {list[0].weight} kg</span>
                )}
              </div>
              {list[0].note && (
                <p className="text-sm text-ink-700 italic mb-3">"{list[0].note}"</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {list.map((p) => (
                  <PhotoCard key={p.id} photo={p} onOpen={onOpen} onRemove={onRemove} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onSubmit={(payload) => {
            onUpload(payload);
            setUploadOpen(false);
          }}
        />
      )}
    </section>
  );
}

function ComparePane({
  label,
  photo,
  onOpen,
  highlight
}: {
  label: string;
  photo: ProgressPhoto;
  onOpen: (p: ProgressPhoto) => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={() => onOpen(photo)}
      className={`relative rounded-2xl overflow-hidden border ${
        highlight ? "border-brand-300 ring-2 ring-brand-200" : "border-ink-100"
      } bg-ink-50/60 group`}
    >
      <img
        src={photo.dataUrl}
        alt={`${label} · ${photo.date}`}
        className="w-full aspect-[2/3] object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink-900/80 to-transparent text-left">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-white/80">
          {label}
        </div>
        <div className="text-sm font-semibold text-white">
          {photo.date}
          {photo.weight ? ` · ${photo.weight} kg` : ""}
        </div>
      </div>
    </button>
  );
}

function PhotoCard({
  photo,
  onOpen,
  onRemove
}: {
  photo: ProgressPhoto;
  onOpen: (p: ProgressPhoto) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-ink-100 bg-ink-50/60">
      <button
        onClick={() => onOpen(photo)}
        className="block w-full"
        aria-label={`Otwórz: ${POSE_LABEL[photo.pose]} ${photo.date}`}
      >
        <img
          src={photo.dataUrl}
          alt={`${POSE_LABEL[photo.pose]} ${photo.date}`}
          className="w-full aspect-[2/3] object-cover"
        />
      </button>
      <div className="absolute top-2 left-2">
        <span className="chip text-[10px] bg-white/85 backdrop-blur border-white/60">
          {POSE_LABEL[photo.pose]}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Usunąć zdjęcie?")) onRemove(photo.id);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/85 backdrop-blur border border-white/60 opacity-0 group-hover:opacity-100 transition text-rose-600"
        aria-label="Usuń zdjęcie"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function UploadModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (p: Omit<ProgressPhoto, "id" | "uploadedAt" | "clientId">) => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [pose, setPose] = useState<ProgressPhotoPose>("front");
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Wybierz plik graficzny (JPG / PNG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Plik za duży (max 8 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.onerror = () => setError("Nie udało się wczytać pliku.");
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!dataUrl) {
      setError("Wybierz zdjęcie.");
      return;
    }
    onSubmit({
      date,
      pose,
      dataUrl,
      weight: weight.trim() ? parseFloat(weight.replace(",", ".")) : undefined,
      note: note.trim() || undefined
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-glass border border-white/80 max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-100 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Nowe zdjęcie sylwetki
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              Najlepiej rano, na pusty żołądek, w tym samym oświetleniu.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-ink-50"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />

          {dataUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-ink-200">
              <img src={dataUrl} alt="Podgląd" className="w-full aspect-[2/3] object-cover" />
              <button
                onClick={() => setDataUrl(null)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur text-rose-600"
                aria-label="Usuń"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-ink-200 hover:border-brand-400 hover:bg-brand-50/30 transition flex flex-col items-center justify-center py-12 text-ink-600"
            >
              <Upload className="h-8 w-8 mb-2 text-brand-500" />
              <span className="font-medium">Dotknij, żeby wybrać zdjęcie</span>
              <span className="text-xs text-ink-500 mt-1">JPG / PNG · do 8 MB</span>
            </button>
          )}

          {error && (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="label">Poza</label>
            <div className="grid grid-cols-4 gap-2">
              {POSES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPose(p.value)}
                  className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                    pose === p.value
                      ? "bg-brand-500 text-white border-brand-500 shadow-glow"
                      : "bg-white border-ink-200 text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Data</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Waga (kg) · opcjonalnie</label>
              <input
                inputMode="decimal"
                className="input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="np. 66.4"
              />
            </div>
          </div>

          <div>
            <label className="label">Notatka</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input"
              placeholder="Co czujesz? Jak Ci poszło w tym tygodniu?"
            />
          </div>
        </div>

        <div className="p-6 border-t border-ink-100 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">
            Anuluj
          </button>
          <button onClick={submit} className="btn-primary" disabled={!dataUrl}>
            <ImagePlus className="h-4 w-4" /> Wyślij do trenera
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoViewer({
  photo,
  onClose
}: {
  photo: ProgressPhoto;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-xl bg-white/15 hover:bg-white/30 text-white"
        aria-label="Zamknij"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.dataUrl}
          alt={`${POSE_LABEL[photo.pose]} · ${photo.date}`}
          className="w-full max-h-[80vh] object-contain bg-ink-950"
        />
        <div className="bg-white p-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-ink-500">
              {POSE_LABEL[photo.pose]}
            </div>
            <div className="text-lg font-semibold text-ink-900">
              {photo.date}
              {photo.weight ? ` · ${photo.weight} kg` : ""}
            </div>
          </div>
          {photo.note && (
            <p className="text-sm text-ink-700 italic max-w-xs text-right">
              "{photo.note}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
