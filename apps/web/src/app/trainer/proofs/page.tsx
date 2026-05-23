"use client";

import { useState } from "react";
import { Camera, CheckCircle2, AlertCircle, XCircle, Sparkles, Filter } from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import type { MealPhotoStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function TrainerProofsPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const mealPhotos = useApp((s) => s.mealPhotos);
  const clients = useApp((s) => s.clients);
  const setMealPhotoStatus = useApp((s) => s.setMealPhotoStatus);

  const myClients = clients.filter((c) => c.trainerId === currentUserId);
  const myClientIds = myClients.map((c) => c.id);
  const allPhotos = mealPhotos.filter((m) => myClientIds.includes(m.clientId)).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  const [filter, setFilter] = useState<"all" | MealPhotoStatus>("pending");
  const filtered = filter === "all" ? allPhotos : allPhotos.filter((p) => p.status === filter);

  const counts = {
    pending: allPhotos.filter((p) => p.status === "pending").length,
    approved: allPhotos.filter((p) => p.status === "approved").length,
    flagged: allPhotos.filter((p) => p.status === "flagged").length
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold">AI Vision Feed</span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
            Zdjęcia posiłków
          </h1>
          <p className="text-ink-500 mt-1">{counts.pending} oczekuje na recenzję</p>
        </div>
        <div className="glass rounded-xl p-1 flex">
          {([
            { id: "pending", label: "Oczekuje", icon: AlertCircle, count: counts.pending },
            { id: "approved", label: "Zatwierdzone", icon: CheckCircle2, count: counts.approved },
            { id: "flagged", label: "Do poprawy", icon: XCircle, count: counts.flagged },
            { id: "all", label: "Wszystkie", icon: Filter, count: allPhotos.length }
          ] as const).map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition",
                  filter === f.id ? "bg-white shadow-soft text-brand-600" : "text-ink-600 hover:bg-white/60"
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {f.label}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-ink-100 text-ink-600 font-semibold">{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Camera className="h-12 w-12 mx-auto text-ink-300 mb-3" />
          <p className="text-ink-500">Brak zdjęć w tej kategorii.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return (
              <div key={p.id} className="card overflow-hidden p-0 group">
                <div className="relative aspect-[4/3] bg-ink-100">
                  <img src={p.dataUrl} alt={p.mealName} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="chip bg-white/95">{p.mealName}</span>
                  </div>
                  {p.aiAnalysis && (
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white text-[10px] font-semibold px-2.5 py-1 shadow-glow">
                        <Sparkles className="h-3 w-3" /> {p.aiAnalysis.estimatedKcal} kcal
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {client && <Avatar name={`${client.firstName} ${client.lastName}`} hue={client.avatarHue} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink-900 truncate">{client?.firstName} {client?.lastName}</div>
                      <div className="text-[10px] text-ink-500">{new Date(p.uploadedAt).toLocaleString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                  {p.note && <p className="text-xs text-ink-600 italic line-clamp-2 mb-2">"{p.note}"</p>}
                  {p.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setMealPhotoStatus(p.id, "approved", "Dobre!")} className="btn-primary text-xs flex-1 py-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Zatwierdź
                      </button>
                      <button onClick={() => setMealPhotoStatus(p.id, "flagged", "Wymaga korekty.")} className="btn-ghost text-xs flex-1 py-1.5 text-rose-600 hover:bg-rose-50">
                        <XCircle className="h-3.5 w-3.5" /> Do poprawy
                      </button>
                    </div>
                  )}
                  {p.status !== "pending" && p.trainerComment && (
                    <div className="text-xs text-ink-700 rounded-lg bg-white border border-ink-100 px-3 py-1.5">
                      "{p.trainerComment}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
