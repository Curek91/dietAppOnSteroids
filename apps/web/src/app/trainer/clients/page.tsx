"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, LayoutGrid, List, ArrowUpRight, X, Crown, Lock } from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { getPlan } from "@/lib/plans";

export default function TrainerClientsPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const clients = useApp((s) => s.clients);
  const addClient = useApp((s) => s.addClient);
  const progress = useApp((s) => s.progress);
  const canAddClient = useApp((s) => s.canAddClient);
  const subscriptions = useApp((s) => s.subscriptions);

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const sub = subscriptions.find((s) => s.trainerId === currentUserId);
  const plan = getPlan(sub?.tier ?? "starter");
  const slotsAvail = canAddClient();

  const myClients = useMemo(
    () =>
      clients
        .filter((c) => c.trainerId === currentUserId)
        .filter((c) => {
          const q = query.toLowerCase().trim();
          if (!q) return true;
          return (
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q)
          );
        }),
    [clients, currentUserId, query]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
            Podopieczni
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-ink-500">{slotsAvail.current} / {slotsAvail.limit} slotów · plan {plan.name}</p>
            {!slotsAvail.ok && (
              <button onClick={() => setUpgradeOpen(true)} className="text-xs text-purple-600 hover:underline inline-flex items-center gap-1 font-semibold">
                <Crown className="h-3 w-3" /> Upgrade
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass rounded-xl p-1 flex">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg ${view === "grid" ? "bg-white shadow-soft text-brand-600" : "text-ink-500"}`}
              aria-label="Widok kafelków"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg ${view === "list" ? "bg-white shadow-soft text-brand-600" : "text-ink-500"}`}
              aria-label="Widok listy"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => (slotsAvail.ok ? setOpen(true) : setUpgradeOpen(true))}
            className={`btn-primary ${!slotsAvail.ok ? "bg-gradient-to-br from-amber-500 via-brand-500 to-purple-500" : ""}`}
          >
            {slotsAvail.ok ? <><Plus className="h-4 w-4" /> Dodaj</> : <><Lock className="h-4 w-4" /> Limit — Upgrade</>}
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-10"
          placeholder="Szukaj po imieniu, nazwisku, mailu, telefonie..."
        />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myClients.map((c) => {
            const cp = progress.filter((p) => p.clientId === c.id).sort((a, b) => b.date.localeCompare(a.date));
            const latest = cp[0];
            return (
              <Link
                key={c.id}
                href={`/trainer/clients/${c.id}`}
                className="card group hover:-translate-y-0.5 hover:shadow-glow/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={`${c.firstName} ${c.lastName}`} hue={c.avatarHue} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 truncate">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-sm text-ink-500 truncate">{c.email}</div>
                    <span className="chip-brand mt-2">{c.goal}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-brand-500 transition" />
                </div>
                <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Waga</div>
                    <div className="text-sm font-semibold text-ink-800">{latest?.weight ? `${latest.weight} kg` : "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Pomiarów</div>
                    <div className="text-sm font-semibold text-ink-800">{cp.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Od</div>
                    <div className="text-sm font-semibold text-ink-800">
                      {new Date(c.startedAt).toLocaleDateString("pl-PL", { month: "short", year: "2-digit" })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {myClients.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16 glass rounded-2xl">
              <p className="text-ink-500">Brak wyników. Spróbuj innego zapytania lub dodaj nowego podopiecznego.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-white/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                <th className="px-5 py-3 font-medium">Klient</th>
                <th className="px-5 py-3 font-medium">Cel</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Telefon</th>
                <th className="px-5 py-3 font-medium">Start</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {myClients.map((c) => (
                <tr key={c.id} className="border-t border-ink-100 hover:bg-white/60 transition">
                  <td className="px-5 py-3">
                    <Link href={`/trainer/clients/${c.id}`} className="flex items-center gap-3">
                      <Avatar name={`${c.firstName} ${c.lastName}`} hue={c.avatarHue} size="sm" />
                      <span className="font-medium text-ink-900">{c.firstName} {c.lastName}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-600">{c.goal}</td>
                  <td className="px-5 py-3 text-sm text-ink-600">{c.email}</td>
                  <td className="px-5 py-3 text-sm text-ink-600">{c.phone}</td>
                  <td className="px-5 py-3 text-sm text-ink-600">{new Date(c.startedAt).toLocaleDateString("pl-PL")}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/trainer/clients/${c.id}`} className="text-brand-600 text-sm hover:underline inline-flex items-center gap-1">
                      Otwórz <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myClients.length === 0 && (
            <div className="text-center py-16 text-ink-500">Brak wyników.</div>
          )}
        </div>
      )}

      {open && (
        <AddClientModal
          onClose={() => setOpen(false)}
          onCreate={(payload) => {
            const result = addClient({ ...payload, trainerId: currentUserId! });
            if (!result) {
              setOpen(false);
              setUpgradeOpen(true);
            } else {
              setOpen(false);
            }
          }}
        />
      )}

      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} currentTier={plan.tier} />}
    </div>
  );
}

function AddClientModal({
  onClose,
  onCreate
}: {
  onClose: () => void;
  onCreate: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    notes: string;
    goal: string;
    avatarHue: number;
    trainerId: string;
  }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="glass-strong rounded-3xl p-8 w-full max-w-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink-900">Nowy podopieczny</h3>
            <p className="text-sm text-ink-500">Wypełnij dane wstępne. Resztę uzupełnisz w karcie.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/80 text-ink-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Imię</label><input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><label className="label">Nazwisko</label><input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div className="col-span-2"><label className="label">Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label">Telefon</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className="label">Data urodzenia</label><input type="date" className="input" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
          <div className="col-span-2"><label className="label">Cel</label><input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="np. Redukcja −5 kg" /></div>
          <div className="col-span-2">
            <label className="label">Notatki</label>
            <textarea rows={3} className="input resize-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Anuluj</button>
          <button
            className="btn-primary"
            onClick={() => {
              if (!firstName || !lastName) return;
              onCreate({
                firstName,
                lastName,
                email,
                phone,
                birthDate,
                notes,
                goal: goal || "Cel ogólny",
                avatarHue: Math.floor(Math.random() * 360),
                trainerId: ""
              });
            }}
          >
            Dodaj klienta
          </button>
        </div>
      </div>
    </div>
  );
}
