"use client";

import { useState } from "react";
import { Camera, CheckCircle2, XCircle, AlertCircle, Send, Sparkles, Trash2, MessageCircle, Flame } from "lucide-react";
import { useApp } from "@/lib/store";
import { PhotoUpload } from "@/components/PhotoUpload";
import { AIBadge } from "@/components/AIInsightCard";
import { aiAnalyzeMealPhoto } from "@/lib/ai";
import type { MealPhoto } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  clientId: string;
  asTrainer?: boolean;
}

export function MealProofFeed({ clientId, asTrainer = false }: Props) {
  const mealPhotos = useApp((s) => s.mealPhotos);
  const addMealPhoto = useApp((s) => s.addMealPhoto);
  const setMealPhotoStatus = useApp((s) => s.setMealPhotoStatus);
  const removeMealPhoto = useApp((s) => s.removeMealPhoto);
  const dietPlans = useApp((s) => s.dietPlans);
  const subscriptions = useApp((s) => s.subscriptions);
  const trackAIUsage = useApp((s) => s.trackAIUsage);
  const clients = useApp((s) => s.clients);

  const client = clients.find((c) => c.id === clientId);
  const photos = mealPhotos.filter((m) => m.clientId === clientId).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const activeDiet = dietPlans.find((d) => d.clientId === clientId);

  const [mealName, setMealName] = useState(activeDiet?.meals[0]?.name ?? "Posiłek");
  const [note, setNote] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = async (dataUrl: string) => {
    setAnalyzing(true);
    const photo = addMealPhoto({
      clientId,
      dietPlanId: activeDiet?.id,
      mealName,
      dataUrl,
      note
    });
    setNote("");
    try {
      const analysis = await aiAnalyzeMealPhoto();
      // re-set with analysis
      useApp.setState((s) => ({
        mealPhotos: s.mealPhotos.map((m) => (m.id === photo.id ? { ...m, aiAnalysis: analysis } : m))
      }));
      const sub = subscriptions[0];
      if (sub) trackAIUsage(sub.trainerId, "photo");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5">
      {!asTrainer && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
                <Camera className="h-5 w-5 text-brand-600" /> Wyślij zdjęcie posiłku
              </h3>
              <p className="text-sm text-ink-500">AI rozpozna składniki i oszacuje kalorie</p>
            </div>
            <AIBadge label="AI Vision" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhotoUpload onUpload={handleUpload} />
            <div className="space-y-3">
              <div>
                <label className="label">Posiłek</label>
                {activeDiet?.meals.length ? (
                  <select className="input" value={mealName} onChange={(e) => setMealName(e.target.value)}>
                    {activeDiet.meals.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                ) : (
                  <input className="input" value={mealName} onChange={(e) => setMealName(e.target.value)} />
                )}
              </div>
              <div>
                <label className="label">Notatka dla trenera</label>
                <textarea className="input resize-none" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="np. lekko zmodyfikowałam porcję ryżu" />
              </div>
              {analyzing && (
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-brand-50 border border-purple-100 px-4 py-3 text-sm text-purple-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-pulse" /> AI analizuje zdjęcie...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
          {asTrainer ? `Posiłki — ${client?.firstName} ${client?.lastName}` : "Twoje zdjęcia"}
          <span className="chip-brand">{photos.length}</span>
        </h3>
        {photos.length === 0 && (
          <div className="card text-center py-12 text-ink-500">Brak zdjęć. {asTrainer ? "Klient jeszcze nie wysłał." : "Wyślij pierwsze!"}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos.map((p) => (
            <PhotoCard
              key={p.id}
              photo={p}
              asTrainer={asTrainer}
              onApprove={(comment) => setMealPhotoStatus(p.id, "approved", comment)}
              onFlag={(comment) => setMealPhotoStatus(p.id, "flagged", comment)}
              onDelete={() => removeMealPhoto(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const statusMap = {
  pending: { label: "Oczekuje", icon: AlertCircle, color: "text-amber-600 bg-amber-50 ring-amber-200" },
  approved: { label: "Zatwierdzone", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 ring-emerald-200" },
  flagged: { label: "Do poprawy", icon: XCircle, color: "text-rose-600 bg-rose-50 ring-rose-200" }
} as const;

function PhotoCard({
  photo,
  asTrainer,
  onApprove,
  onFlag,
  onDelete
}: {
  photo: MealPhoto;
  asTrainer: boolean;
  onApprove: (c: string) => void;
  onFlag: (c: string) => void;
  onDelete: () => void;
}) {
  const [comment, setComment] = useState(photo.trainerComment ?? "");
  const [showActions, setShowActions] = useState(false);
  const StatusIcon = statusMap[photo.status].icon;
  return (
    <div className="card overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-ink-100">
        <img src={photo.dataUrl} alt={photo.mealName} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="chip bg-white/90">{photo.mealName}</span>
          <span className={cn("chip ring-1", statusMap[photo.status].color)}>
            <StatusIcon className="h-3 w-3" /> {statusMap[photo.status].label}
          </span>
        </div>
        {photo.aiAnalysis && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white text-[10px] font-semibold px-2.5 py-1 shadow-glow">
              <Sparkles className="h-3 w-3" /> {photo.aiAnalysis.estimatedKcal} kcal · {Math.round(photo.aiAnalysis.confidence * 100)}%
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        {photo.note && <p className="text-sm text-ink-700 italic">"{photo.note}"</p>}
        {photo.aiAnalysis && (
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-brand-50 border border-purple-100 p-3">
            <div className="text-[10px] uppercase tracking-wider text-purple-700 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI Vision · rozpoznano
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {photo.aiAnalysis.detectedItems.map((i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700">{i}</span>
              ))}
            </div>
            <div className="text-xs text-ink-700 flex items-center gap-3">
              <span><Flame className="inline h-3 w-3 text-rose-500" /> {photo.aiAnalysis.macros.kcal} kcal</span>
              <span>B {photo.aiAnalysis.macros.protein}g</span>
              <span>W {photo.aiAnalysis.macros.carbs}g</span>
              <span>T {photo.aiAnalysis.macros.fat}g</span>
            </div>
          </div>
        )}

        {photo.trainerComment && (
          <div className="rounded-xl bg-white border border-ink-100 p-3 text-sm text-ink-800">
            <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium flex items-center gap-1 mb-1">
              <MessageCircle className="h-3 w-3" /> Komentarz trenera
            </div>
            {photo.trainerComment}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>{new Date(photo.uploadedAt).toLocaleString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
          {asTrainer && (
            <button onClick={() => setShowActions(!showActions)} className="text-brand-600 hover:underline">
              {showActions ? "Schowaj" : "Zrecenzuj"}
            </button>
          )}
          {!asTrainer && (
            <button onClick={onDelete} className="text-rose-500 hover:underline inline-flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Usuń
            </button>
          )}
        </div>

        {asTrainer && showActions && (
          <div className="space-y-2 pt-2 border-t border-ink-100">
            <textarea className="input resize-none" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Twoja recenzja..." />
            <div className="flex gap-2">
              <button onClick={() => onApprove(comment)} className="btn-primary flex-1 text-sm">
                <CheckCircle2 className="h-4 w-4" /> Zatwierdź
              </button>
              <button onClick={() => onFlag(comment)} className="btn-ghost flex-1 text-sm text-rose-600 hover:bg-rose-50">
                <XCircle className="h-4 w-4" /> Do poprawy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
