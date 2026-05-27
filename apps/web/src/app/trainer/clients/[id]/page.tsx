"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Mail, Phone, Calendar, Target, Trash2, User as UserIcon,
  Activity, Salad, Dumbbell, Save, Watch, Camera, Sparkles, Image as ImageIcon
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { ProgressChart } from "@/components/ProgressChart";
import { ProgressTab } from "@/components/tabs/ProgressTab";
import { DietTab } from "@/components/tabs/DietTab";
import { WorkoutTab } from "@/components/tabs/WorkoutTab";
import { WearablesPanel } from "@/components/WearablesPanel";
import { MealProofFeed } from "@/components/MealProofFeed";
import { AIInsightCard } from "@/components/AIInsightCard";
import { aiGenerateWeeklyInsight } from "@/lib/ai";

type Tab = "profile" | "progress" | "diet" | "workout" | "wearable" | "proofs";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clients = useApp((s) => s.clients);
  const updateClient = useApp((s) => s.updateClient);
  const removeClient = useApp((s) => s.removeClient);
  const progress = useApp((s) => s.progress);
  const progressPhotos = useApp((s) => s.progressPhotos);
  const wearables = useApp((s) => s.wearables);
  const currentUserId = useApp((s) => s.currentUserId);
  const aiInsights = useApp((s) => s.aiInsights);
  const pushAIInsight = useApp((s) => s.pushAIInsight);

  const client = clients.find((c) => c.id === params.id);
  const [tab, setTab] = useState<Tab>("profile");
  const [generating, setGenerating] = useState(false);

  const myProgress = useMemo(
    () => progress.filter((p) => p.clientId === params.id).sort((a, b) => a.date.localeCompare(b.date)),
    [progress, params.id]
  );
  const myPhotos = useMemo(
    () =>
      progressPhotos
        .filter((p) => p.clientId === params.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [progressPhotos, params.id]
  );
  const myWearables = useMemo(
    () => wearables.filter((w) => w.clientId === params.id).sort((a, b) => a.date.localeCompare(b.date)),
    [wearables, params.id]
  );
  const insightsForClient = aiInsights.filter((i) => i.subjectId === params.id || (i.scope === "trainer" && i.body.toLowerCase().includes(client?.firstName.toLowerCase() ?? "")));

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500">Nie znaleziono klienta.</p>
        <Link href="/trainer/clients" className="btn-primary mt-4">Wróć do listy</Link>
      </div>
    );
  }

  if (client.trainerId !== currentUserId) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-rose-600 font-semibold">Brak dostępu</p>
        <p className="text-ink-500 mt-2">Ten podopieczny należy do innego trenera.</p>
        <Link href="/trainer/clients" className="btn-primary mt-4">Wróć</Link>
      </div>
    );
  }

  const age = (() => {
    if (!client.birthDate) return null;
    const b = new Date(client.birthDate);
    const diff = Date.now() - b.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  })();

  const handleGenerateInsight = async () => {
    setGenerating(true);
    try {
      const insight = await aiGenerateWeeklyInsight(client, myProgress, myWearables);
      pushAIInsight(insight);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Link href="/trainer/clients" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-600 transition">
        <ArrowLeft className="h-4 w-4" /> Wszyscy podopieczni
      </Link>

      <div className="card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, hsl(${client.avatarHue} 85% 60%) 0%, transparent 70%)` }} />
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <Avatar name={`${client.firstName} ${client.lastName}`} hue={client.avatarHue} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
                  {client.firstName} {client.lastName}
                </h1>
                <p className="text-ink-500 mt-0.5">{client.notes || "—"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleGenerateInsight} disabled={generating} className="btn-ghost bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 text-purple-700">
                  <Sparkles className={`h-4 w-4 ${generating ? "animate-pulse" : ""}`} /> {generating ? "Analizuję..." : "AI Insight"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Usunąć ${client.firstName}? Operacja nieodwracalna.`)) {
                      removeClient(client.id);
                      router.push("/trainer/clients");
                    }
                  }}
                  className="btn-ghost text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" /> Usuń
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoTile icon={<Target className="h-4 w-4" />} label="Cel" value={client.goal} />
              <InfoTile icon={<Calendar className="h-4 w-4" />} label="Wiek" value={age ? `${age} lat` : "—"} />
              <InfoTile icon={<Mail className="h-4 w-4" />} label="Email" value={client.email} />
              <InfoTile icon={<Phone className="h-4 w-4" />} label="Telefon" value={client.phone} />
            </div>
          </div>
        </div>
      </div>

      {insightsForClient.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-purple-600 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Insights dla tego klienta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insightsForClient.slice(0, 4).map((i) => (
              <AIInsightCard key={i.id} insight={i} compact />
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 overflow-x-auto scrollbar-thin">
        <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} icon={<UserIcon className="h-4 w-4" />} label="Profil" />
        <TabBtn active={tab === "progress"} onClick={() => setTab("progress")} icon={<Activity className="h-4 w-4" />} label="Postępy" />
        <TabBtn active={tab === "diet"} onClick={() => setTab("diet")} icon={<Salad className="h-4 w-4" />} label="Dieta" />
        <TabBtn active={tab === "workout"} onClick={() => setTab("workout")} icon={<Dumbbell className="h-4 w-4" />} label="Trening" />
        <TabBtn active={tab === "wearable"} onClick={() => setTab("wearable")} icon={<Watch className="h-4 w-4" />} label="Zegarek" />
        <TabBtn active={tab === "proofs"} onClick={() => setTab("proofs")} icon={<Camera className="h-4 w-4" />} label="Zdjęcia posiłków" />
      </div>

      <div className="animate-fade-in">
        {tab === "profile" && (
          <ProfileForm
            client={client}
            onSave={(patch) => updateClient(client.id, patch)}
          />
        )}
        {tab === "progress" && <ProgressTab clientId={client.id} entries={myProgress} />}
        {tab === "diet" && <DietTab clientId={client.id} />}
        {tab === "workout" && <WorkoutTab clientId={client.id} />}
        {tab === "wearable" && <WearablesPanel clientId={client.id} />}
        {tab === "proofs" && <MealProofFeed clientId={client.id} asTrainer />}
      </div>

      {tab === "progress" && myProgress.length > 1 && (
        <div className="card">
          <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">Wykres trendów</h3>
          <p className="text-sm text-ink-500 mb-4">Wszystkie wymiary, wizualnie.</p>
          <ProgressChart data={myProgress} metrics={["weight", "waist", "chest", "arm", "thigh"]} />
        </div>
      )}

      {tab === "progress" && (
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-4 w-4 text-brand-600" />
            <h3 className="font-display text-lg font-semibold text-ink-900">
              Zdjęcia sylwetki klienta
            </h3>
          </div>
          <p className="text-sm text-ink-500 mb-4">
            {myPhotos.length === 0
              ? "Klient nie wrzucił jeszcze żadnych zdjęć."
              : `${myPhotos.length} zdjęć w timeline.`}
          </p>
          {myPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {myPhotos.map((p) => (
                <a
                  key={p.id}
                  href={p.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative rounded-xl overflow-hidden border border-ink-100 bg-ink-50/60 group"
                >
                  <img
                    src={p.dataUrl}
                    alt={`${p.pose} ${p.date}`}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink-900/80 to-transparent">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-white/85">
                      {p.pose === "front"
                        ? "Przód"
                        : p.pose === "side"
                        ? "Bok"
                        : p.pose === "back"
                        ? "Tył"
                        : "Inne"}
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {p.date}
                      {p.weight ? ` · ${p.weight} kg` : ""}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/60 border border-white/80 p-3">
      <div className="flex items-center gap-1.5 text-ink-500 text-[11px] uppercase tracking-wider font-medium">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold text-ink-900 mt-1 truncate">{value || "—"}</div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
        active ? "bg-white shadow-soft text-brand-600" : "text-ink-600 hover:bg-white/60"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ProfileForm({ client, onSave }: { client: ReturnType<typeof useApp.getState>["clients"][number]; onSave: (p: Partial<typeof client>) => void }) {
  const [form, setForm] = useState({ ...client });
  const dirty = JSON.stringify(form) !== JSON.stringify(client);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-900">Dane kontaktowe</h3>
          <p className="text-sm text-ink-500">Edytuj profil podopiecznego</p>
        </div>
        <button
          disabled={!dirty}
          onClick={() => onSave(form)}
          className="btn-primary"
        >
          <Save className="h-4 w-4" /> Zapisz
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="label">Imię</label><input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div><label className="label">Nazwisko</label><input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
        <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Telefon</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Data urodzenia</label><input type="date" className="input" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></div>
        <div><label className="label">Cel</label><input className="input" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></div>
        <div className="md:col-span-2">
          <label className="label">Urządzenie wearable</label>
          <select className="input" value={form.wearableDevice ?? ""} onChange={(e) => setForm({ ...form, wearableDevice: (e.target.value || undefined) as typeof form.wearableDevice })}>
            <option value="">Brak</option>
            <option value="apple_watch">Apple Watch</option>
            <option value="samsung_health">Samsung Galaxy Watch</option>
            <option value="garmin">Garmin</option>
            <option value="whoop">Whoop</option>
            <option value="oura">Oura Ring</option>
            <option value="fitbit">Fitbit</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Notatki trenera</label>
          <textarea rows={4} className="input resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
