"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, RotateCcw, Wand2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { aiChatReply } from "@/lib/ai";
import { cn } from "@/lib/cn";

export function AICoach() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const progress = useApp((s) => s.progress);
  const wearables = useApp((s) => s.wearables);
  const dietPlans = useApp((s) => s.dietPlans);
  const chat = useApp((s) => s.aiChat);
  const pushChat = useApp((s) => s.pushChat);
  const clearChat = useApp((s) => s.clearChat);
  const subscriptions = useApp((s) => s.subscriptions);
  const trackAIUsage = useApp((s) => s.trackAIUsage);

  const me = users.find((u) => u.id === currentUserId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, loading, open]);

  if (!me) return null;

  const myClient = me.role === "client" ? clients.find((c) => c.email === me.email) : null;
  const myProgress = myClient ? progress.filter((p) => p.clientId === myClient.id) : [];
  const myWearables = myClient ? wearables.filter((w) => w.clientId === myClient.id) : [];
  const myDiet = myClient ? dietPlans.find((d) => d.clientId === myClient.id) : null;

  const sub = subscriptions.find((s) => s.trainerId === (me.role === "trainer" ? me.id : me.trainerId));

  const ask = async (text: string) => {
    if (!text.trim()) return;
    pushChat({ role: "user", text: text.trim() });
    setInput("");
    setLoading(true);
    try {
      const reply = await aiChatReply(text, {
        client: myClient,
        progress: myProgress,
        wearables: myWearables,
        diet: myDiet,
        isTrainer: me.role === "trainer",
        userName: me.fullName
      });
      pushChat({ role: "assistant", text: reply });
      if (sub) trackAIUsage(sub.trainerId, "request");
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = me.role === "trainer"
    ? ["Podsumuj tydzień klientów", "Kto ma niskie recovery?", "Wygeneruj insighty", "Co dziś warto zmienić?"]
    : ["Jak mój sen?", "Pokaż dzisiejsze makro", "Czy mogę dziś mocno trenować?", "Postępy z tygodnia"];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 shadow-glow text-white flex items-center justify-center hover:scale-110 transition-transform group",
          open && "hidden"
        )}
        aria-label="AI Coach"
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-60 blur-xl group-hover:opacity-90 transition" />
        <Sparkles className="h-6 w-6 relative" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] glass-strong rounded-3xl flex flex-col overflow-hidden animate-slide-up">
          <header className="flex items-center justify-between px-5 py-4 border-b border-white/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-brand-500/10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 flex items-center justify-center text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display font-semibold text-ink-900 text-sm">AI Coach</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-500">
                  {sub ? `${sub.aiUsedThisMonth} / ${sub.tier === "starter" ? 200 : sub.tier === "studio" ? 800 : 3000} zapytań` : "online"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/60 text-ink-500" title="Wyczyść">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/60 text-ink-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3">
            {chat.length === 0 && (
              <div className="text-center py-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 mx-auto flex items-center justify-center text-white shadow-glow">
                  <Wand2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-900 mt-3">
                  Czeszczę! Jestem AI Coach.
                </h3>
                <p className="text-sm text-ink-500 mt-1 max-w-[280px] mx-auto">
                  Twój asystent oparty na danych z zegarka, postępów i diety.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {quickPrompts.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      className="text-left rounded-xl bg-white/70 border border-ink-100 px-3 py-2 text-xs text-ink-700 hover:bg-white hover:border-brand-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chat.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 flex items-center justify-center text-white shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white"
                      : "bg-white/80 border border-white/80 text-ink-800"
                  )}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white/80 border border-white/80">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="p-3 border-t border-white/40 bg-white/30"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Zapytaj o cokolwiek..."
                className="input"
                disabled={loading}
              />
              <button type="submit" className="btn-primary p-2.5" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
