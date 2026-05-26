"use client";

import { useMemo, useState } from "react";
import {
  Repeat,
  Check,
  Clock,
  ChefHat,
  Plus,
  X,
  Send,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { useApp } from "@/lib/store";
import { macrosForItem, macrosForMeal, round } from "@/lib/macros";
import { suggestSubstitute } from "@/lib/mealAI";
import type {
  DietPlan,
  Meal,
  MealItem,
  MealProposal,
  MealProposalKind,
  MealProposalStatus,
  Product
} from "@/lib/types";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function ClientMealsPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const dietPlans = useApp((s) => s.dietPlans);
  const products = useApp((s) => s.products);
  const proposals = useApp((s) => s.mealProposals);
  const proposeMealChange = useApp((s) => s.proposeMealChange);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);
  const activePlan: DietPlan | undefined = profile
    ? dietPlans.find((d) => d.clientId === profile.id)
    : undefined;

  const myProposals = useMemo(() => {
    if (!profile) return [] as MealProposal[];
    return proposals
      .filter((p) => p.clientId === profile.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [proposals, profile]);

  const todaysRecipes = useMemo(() => {
    if (!profile) return [] as MealProposal[];
    return proposals.filter(
      (p) => p.clientId === profile.id && p.kind === "trainer_recipe"
    );
  }, [proposals, profile]);

  const [activeMeal, setActiveMeal] = useState<{ meal: Meal; kind: MealProposalKind } | null>(
    null
  );

  if (!profile || !activePlan) {
    return (
      <div className="card text-center py-16 max-w-2xl mx-auto">
        <Repeat className="h-12 w-12 mx-auto text-ink-300 mb-3" />
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Brak aktywnego planu
        </h2>
        <p className="text-ink-500 mt-1">
          Wymiany pojawią się tu, kiedy trener wyśle Ci pierwszą rozpiskę.
        </p>
      </div>
    );
  }

  const submit = (
    meal: Meal,
    kind: MealProposalKind,
    proposedItems: MealItem[],
    note: string
  ) => {
    proposeMealChange({
      clientId: profile.id,
      trainerId: profile.trainerId,
      dietPlanId: activePlan.id,
      mealId: meal.id,
      mealName: meal.name,
      date: todayIso(),
      kind,
      proposedItems,
      note: note || undefined
    });
    setActiveMeal(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <div className="flex items-center gap-2 text-brand-600 mb-2">
          <Repeat className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.18em] font-semibold">
            Wymiany posiłków
          </span>
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
          Plan na dziś — co z nim zrobisz?
        </h1>
        <p className="text-ink-500 mt-1 max-w-2xl">
          Zaproponuj zamiennik, zatwierdź wykonanie zawczasu albo otwórz przepis od trenera.
          Wszystko wraca do niego jako jedno zgłoszenie.
        </p>
      </header>

      <section className="space-y-3">
        {activePlan.meals.map((meal) => {
          const macros = macrosForMeal(meal, products);
          const recipe = todaysRecipes.find((r) => r.mealId === meal.id);
          return (
            <div key={meal.id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-display text-lg font-semibold text-ink-900">
                      {meal.name}
                    </h2>
                    {recipe && (
                      <span className="chip-brand text-[10px]">
                        <ChefHat className="h-3 w-3" /> Przepis trenera
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-500">
                    {round(macros.kcal)} kcal · B {round(macros.protein, 1)}g · W{" "}
                    {round(macros.carbs, 1)}g · T {round(macros.fat, 1)}g
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveMeal({ meal, kind: "pre_approval" })}
                    className="btn-ghost text-sm"
                  >
                    <Check className="h-4 w-4" /> Zrobię ten
                  </button>
                  <button
                    onClick={() => setActiveMeal({ meal, kind: "swap_request" })}
                    className="btn-primary text-sm"
                  >
                    <Repeat className="h-4 w-4" /> Zaproponuj zamiennik
                  </button>
                </div>
              </div>

              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {meal.items.map((item) => {
                  const p = products.find((x) => x.id === item.productId);
                  if (!p) return null;
                  const m = macrosForItem(p, item.grams);
                  return (
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-xl bg-white/60 border border-ink-100 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{p.emoji ?? "🍽️"}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink-900 truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-ink-500">
                            {round(m.kcal)} kcal · {item.grams}g
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {recipe && (
                <details className="mt-4 rounded-xl bg-brand-50/60 border border-brand-200/70 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-brand-700 flex items-center gap-2">
                    <ChefHat className="h-4 w-4" /> Przepis trenera ·{" "}
                    {recipe.prepTimeMinutes ? `${recipe.prepTimeMinutes} min` : "szybki"}
                  </summary>
                  {recipe.note && (
                    <p className="mt-2 text-sm text-ink-700 italic">"{recipe.note}"</p>
                  )}
                  {recipe.recipeSteps && (
                    <ol className="mt-3 space-y-1.5 text-sm text-ink-700 list-decimal list-inside">
                      {recipe.recipeSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  )}
                </details>
              )}
            </div>
          );
        })}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Moje propozycje
          </h2>
          <span className="chip">{myProposals.length}</span>
        </div>

        {myProposals.length === 0 ? (
          <div className="card text-center py-10">
            <Sparkles className="h-8 w-8 mx-auto text-ink-300 mb-2" />
            <p className="text-ink-500 text-sm">
              Brak propozycji. Zaproponuj coś trenerowi powyżej.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myProposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} products={products} />
            ))}
          </div>
        )}
      </section>

      {activeMeal && (
        <ProposalModal
          meal={activeMeal.meal}
          kind={activeMeal.kind}
          products={products}
          onCancel={() => setActiveMeal(null)}
          onSubmit={(items, note) => submit(activeMeal.meal, activeMeal.kind, items, note)}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: MealProposalStatus }) {
  const map: Record<MealProposalStatus, { label: string; cls: string; Icon: typeof Check }> = {
    pending: {
      label: "Czeka na trenera",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: Clock
    },
    approved: {
      label: "Zatwierdzone",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Icon: CheckCircle2
    },
    rejected: {
      label: "Odrzucone",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      Icon: AlertCircle
    },
    counter: {
      label: "Trener proponuje inaczej",
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Icon: RotateCcw
    }
  };
  const { label, cls, Icon } = map[status];
  return (
    <span className={`chip ${cls} border`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function KindLabel({ kind }: { kind: MealProposalKind }) {
  const m = {
    swap_request: { label: "Zamiana", Icon: Repeat },
    pre_approval: { label: "Zatwierdzenie", Icon: Check },
    trainer_recipe: { label: "Przepis", Icon: ChefHat }
  } as const;
  const { label, Icon } = m[kind];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-brand-600">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function ProposalCard({
  proposal,
  products
}: {
  proposal: MealProposal;
  products: Product[];
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <KindLabel kind={proposal.kind} />
          <div className="font-display text-base font-semibold text-ink-900 mt-1">
            {proposal.mealName} · {proposal.date}
          </div>
        </div>
        <StatusPill status={proposal.status} />
      </div>

      {proposal.note && (
        <p className="mt-3 text-sm text-ink-700 italic">"{proposal.note}"</p>
      )}

      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <ItemList title="Twoja propozycja" items={proposal.proposedItems} products={products} />
        {proposal.counterItems && (
          <ItemList
            title="Kontrpropozycja trenera"
            items={proposal.counterItems}
            products={products}
            highlight
          />
        )}
      </div>

      {proposal.trainerComment && (
        <div className="mt-3 rounded-xl bg-brand-50/60 border border-brand-200/70 px-4 py-3 text-sm">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-brand-700 mb-1">
            Trener
          </div>
          <p className="text-ink-700">{proposal.trainerComment}</p>
        </div>
      )}
    </div>
  );
}

function ItemList({
  title,
  items,
  products,
  highlight
}: {
  title: string;
  items: MealItem[];
  products: Product[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        highlight ? "bg-indigo-50/60 border-indigo-200" : "bg-white/70 border-ink-100"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => {
          const p = products.find((x) => x.id === it.productId);
          if (!p) return null;
          return (
            <li key={i} className="text-sm text-ink-700 flex items-center gap-2">
              <span>{p.emoji ?? "🍽️"}</span>
              <span className="flex-1">{p.name}</span>
              <span className="text-[11px] text-ink-500 font-mono">{it.grams}g</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────

function ProposalModal({
  meal,
  kind,
  products,
  onCancel,
  onSubmit
}: {
  meal: Meal;
  kind: MealProposalKind;
  products: Product[];
  onCancel: () => void;
  onSubmit: (items: MealItem[], note: string) => void;
}) {
  const [items, setItems] = useState<MealItem[]>(() => meal.items.map((i) => ({ ...i })));
  const [note, setNote] = useState("");
  const [aiUsed, setAiUsed] = useState(false);

  const isSwap = kind === "swap_request";
  const title = isSwap ? "Zaproponuj zamiennik" : "Potwierdź dzisiejszy posiłek";
  const subtitle = isSwap
    ? "Nie wiesz co zamiast? Pozwól AI dobrać produkty o takiej samej kaloryczności."
    : "Trener zatwierdzi przed zjedzeniem. Pewność, że nie złamiesz makro.";

  const macros = items.reduce(
    (acc, it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return acc;
      const m = macrosForItem(p, it.grams);
      return { kcal: acc.kcal + m.kcal, p: acc.p + m.protein, c: acc.c + m.carbs, f: acc.f + m.fat };
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  const runAI = () => {
    setItems(suggestSubstitute(meal.items, products));
    setAiUsed(true);
    if (!note) {
      setNote("Mam pod ręką inne produkty — AI dobrało zamienniki o tej samej kaloryczności.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-glass border border-white/80 max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-100 flex items-start justify-between gap-4">
          <div>
            <KindLabel kind={kind} />
            <h2 className="font-display text-xl font-semibold text-ink-900 mt-1">{title}</h2>
            <p className="text-sm text-ink-500 mt-1">{subtitle}</p>
            <p className="text-[11px] text-ink-400 mt-2">
              Posiłek: <span className="font-semibold text-ink-700">{meal.name}</span>
            </p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-ink-50" aria-label="Zamknij">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isSwap && (
            <button
              type="button"
              onClick={runAI}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-white font-semibold bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 shadow-glow hover:-translate-y-0.5 transition"
            >
              <Sparkles className="h-5 w-5" />
              {aiUsed ? "Wygeneruj inną propozycję AI" : "Pozwól AI dobrać zamienniki"}
            </button>
          )}

          {isSwap && aiUsed && (
            <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              AI dobrało produkty o tej samej kaloryczności i profilu makro. Możesz dalej edytować ręcznie.
            </div>
          )}

          <ul className="space-y-2">
            {items.map((it, idx) => {
              const p = products.find((x) => x.id === it.productId);
              if (!p) return null;
              return (
                <li
                  key={idx}
                  className="flex items-center gap-3 bg-ink-50/60 border border-ink-100 rounded-xl px-3 py-2.5"
                >
                  <span className="text-xl">{p.emoji ?? "🍽️"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-ink-500">{p.kcal} kcal/100g</div>
                  </div>
                  <input
                    type="number"
                    value={it.grams}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x, i) =>
                          i === idx
                            ? { ...x, grams: Math.max(0, Number(e.target.value) || 0) }
                            : x
                        )
                      )
                    }
                    className="input w-20 text-right py-1.5"
                    aria-label={`Gramatura: ${p.name}`}
                  />
                  <span className="text-xs text-ink-500 w-3">g</span>
                  {isSwap && (
                    <button
                      type="button"
                      onClick={() => setItems((arr) => arr.filter((_, i) => i !== idx))}
                      className="p-1.5 text-ink-400 hover:text-rose-600 transition"
                      aria-label="Usuń produkt"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {isSwap && (
            <ClientProductPicker
              products={products}
              exclude={items.map((i) => i.productId)}
              onAdd={(productId) => setItems((arr) => [...arr, { productId, grams: 100 }])}
            />
          )}

          <div className="flex items-center justify-between rounded-xl bg-ink-50/50 border border-ink-100 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500">
              Razem
            </div>
            <div className="text-xs text-ink-700">
              <span className="font-semibold text-ink-900">{round(macros.kcal)} kcal</span>
              {" · "}B {round(macros.p, 1)}g · W {round(macros.c, 1)}g · T {round(macros.f, 1)}g
            </div>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={
              isSwap
                ? "Notatka dla trenera (opcjonalnie)…"
                : "Np. zrobię dokładnie jak w planie, chcę się upewnić."
            }
            className="input"
          />
        </div>

        <div className="p-6 border-t border-ink-100 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Anuluj
          </button>
          <button onClick={() => onSubmit(items, note)} className="btn-primary">
            <Send className="h-4 w-4" /> Wyślij do trenera <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientProductPicker({
  products,
  exclude,
  onAdd
}: {
  products: Product[];
  exclude: string[];
  onAdd: (productId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 text-sm text-ink-600 hover:border-brand-400 hover:text-brand-600 transition py-2.5"
      >
        <Plus className="h-4 w-4" /> Dodaj produkt ręcznie
      </button>
    );
  }
  return (
    <select
      autoFocus
      onChange={(e) => {
        if (!e.target.value) return;
        onAdd(e.target.value);
        setOpen(false);
      }}
      onBlur={() => setOpen(false)}
      className="input"
      defaultValue=""
    >
      <option value="" disabled>
        Wybierz produkt…
      </option>
      {products
        .filter((p) => !exclude.includes(p.id))
        .map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.kcal} kcal/100g)
          </option>
        ))}
    </select>
  );
}

