"use client";

import { useMemo, useState } from "react";
import {
  Repeat,
  Check,
  X,
  Clock,
  ChefHat,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Send
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { macrosForItem, round } from "@/lib/macros";
import { suggestSubstitute } from "@/lib/mealAI";
import type {
  ClientProfile,
  MealItem,
  MealProposal,
  MealProposalKind,
  MealProposalStatus,
  Product
} from "@/lib/types";

type FilterKey = "pending" | "all" | "swap" | "preapproval" | "responded";

const matchesFilter = (p: MealProposal, key: FilterKey) => {
  if (key === "all") return true;
  if (key === "pending") return p.status === "pending";
  if (key === "responded") return p.status !== "pending" && p.kind !== "trainer_recipe";
  if (key === "swap") return p.kind === "swap_request";
  if (key === "preapproval") return p.kind === "pre_approval";
  return true;
};

export default function TrainerExchangesPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);
  const products = useApp((s) => s.products);
  const proposals = useApp((s) => s.mealProposals);
  const respond = useApp((s) => s.respondToProposal);

  const me = users.find((u) => u.id === currentUserId);
  const myClients = useMemo(
    () => (me ? clients.filter((c) => c.trainerId === me.id) : []),
    [clients, me]
  );
  const myClientIds = useMemo(() => new Set(myClients.map((c) => c.id)), [myClients]);

  const myProposals = useMemo(
    () =>
      proposals
        .filter((p) => myClientIds.has(p.clientId) && p.kind !== "trainer_recipe")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [proposals, myClientIds]
  );

  const [filter, setFilter] = useState<FilterKey>("pending");
  const filtered = myProposals.filter((p) => matchesFilter(p, filter));

  const counts: Record<FilterKey, number> = {
    pending: myProposals.filter((p) => p.status === "pending").length,
    swap: myProposals.filter((p) => p.kind === "swap_request").length,
    preapproval: myProposals.filter((p) => p.kind === "pre_approval").length,
    responded: myProposals.filter((p) => p.status !== "pending").length,
    all: myProposals.length
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-brand-600 mb-2">
            <Repeat className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold">
              Wymiany posiłków
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            Inbox propozycji
          </h1>
          <p className="text-ink-500 mt-1 max-w-xl">
            Klienci proponują zamiany i zatwierdzają posiłki na dziś. Odpowiadasz jednym kliknięciem,
            zamiast pisać 30 wiadomości w WhatsAppie.
          </p>
        </div>
        <span className="chip-brand text-xs">
          <Sparkles className="h-3 w-3" /> {counts.pending} do akcji
        </span>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            { key: "pending", label: "Do akcji", icon: Clock },
            { key: "swap", label: "Zamiany", icon: Repeat },
            { key: "preapproval", label: "Zatwierdzenia", icon: Check },
            { key: "responded", label: "Załatwione", icon: CheckCircle2 },
            { key: "all", label: "Wszystkie", icon: Filter }
          ] as const
        ).map(({ key, label, icon: Icon }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow"
                  : "bg-white/60 border border-ink-200/60 text-ink-700 hover:bg-white"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
              <span
                className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-ink-100 text-ink-600"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <Sparkles className="h-10 w-10 mx-auto text-ink-300 mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink-900">
            Tu jest pusto.
          </h3>
          <p className="text-ink-500 text-sm mt-1">
            Klienci nie wysłali jeszcze nic w tej kategorii. Spokojny dzień.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const client = myClients.find((c) => c.id === p.clientId);
            if (!client) return null;
            return (
              <ProposalRow
                key={p.id}
                proposal={p}
                client={client}
                products={products}
                onApprove={(comment) => respond(p.id, "approved", { comment })}
                onReject={(comment) => respond(p.id, "rejected", { comment })}
                onCounter={(counterItems, comment) =>
                  respond(p.id, "counter", { counterItems, comment })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function ProposalRow({
  proposal,
  client,
  products,
  onApprove,
  onReject,
  onCounter
}: {
  proposal: MealProposal;
  client: ClientProfile;
  products: Product[];
  onApprove: (comment?: string) => void;
  onReject: (comment?: string) => void;
  onCounter: (counterItems: MealItem[], comment?: string) => void;
}) {
  const [counterOpen, setCounterOpen] = useState(false);

  const proposedMacros = proposal.proposedItems.reduce(
    (acc, it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return acc;
      const m = macrosForItem(p, it.grams);
      return {
        kcal: acc.kcal + m.kcal,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="card">
      <div className="flex items-start gap-4 flex-wrap">
        <Avatar
          name={`${client.firstName} ${client.lastName}`}
          hue={client.avatarHue}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-ink-900">
              {client.firstName} {client.lastName}
            </span>
            <KindLabel kind={proposal.kind} />
            <span className="text-xs text-ink-500">· {proposal.mealName} · {proposal.date}</span>
          </div>
          {proposal.note && (
            <p className="mt-2 text-sm text-ink-700 italic">"{proposal.note}"</p>
          )}
        </div>
        <StatusPill status={proposal.status} />
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <ItemList title="Propozycja klienta" items={proposal.proposedItems} products={products} />
        <div className="rounded-xl bg-ink-50 border border-ink-100 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
            Makro propozycji
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <span className="text-ink-600">Kcal</span>
            <span className="text-right font-semibold text-ink-900">{round(proposedMacros.kcal)}</span>
            <span className="text-ink-600">Białko</span>
            <span className="text-right font-semibold text-ink-900">{round(proposedMacros.protein, 1)}g</span>
            <span className="text-ink-600">Węgle</span>
            <span className="text-right font-semibold text-ink-900">{round(proposedMacros.carbs, 1)}g</span>
            <span className="text-ink-600">Tłuszcz</span>
            <span className="text-right font-semibold text-ink-900">{round(proposedMacros.fat, 1)}g</span>
          </div>
        </div>
      </div>

      {proposal.counterItems && (
        <div className="mt-3">
          <ItemList
            title="Twoja kontrpropozycja"
            items={proposal.counterItems}
            products={products}
            highlight
          />
        </div>
      )}

      {proposal.trainerComment && (
        <div className="mt-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 px-4 py-3 text-sm">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-1">
            Twoja odpowiedź
          </div>
          <p className="text-ink-700">{proposal.trainerComment}</p>
        </div>
      )}

      {proposal.status === "pending" && !counterOpen && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onApprove("OK, zatwierdzone.")} className="btn-primary">
            <Check className="h-4 w-4" /> Zatwierdź
          </button>
          <button onClick={() => setCounterOpen(true)} className="btn-outline">
            <RotateCcw className="h-4 w-4" /> Kontrpropozycja
          </button>
          <button
            onClick={() => {
              const reason = window.prompt("Powód odrzucenia (opcjonalnie):") ?? undefined;
              onReject(reason || "Odrzucone.");
            }}
            className="btn-ghost text-rose-700"
          >
            <X className="h-4 w-4" /> Odrzuć
          </button>
        </div>
      )}

      {counterOpen && (
        <CounterEditor
          baseItems={proposal.proposedItems}
          products={products}
          onCancel={() => setCounterOpen(false)}
          onSubmit={(items, comment) => {
            onCounter(items, comment);
            setCounterOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CounterEditor({
  baseItems,
  products,
  onSubmit,
  onCancel
}: {
  baseItems: MealItem[];
  products: Product[];
  onSubmit: (items: MealItem[], comment?: string) => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<MealItem[]>(() => baseItems.map((i) => ({ ...i })));
  const [comment, setComment] = useState("");
  const [aiUsed, setAiUsed] = useState(false);

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
    setItems(suggestSubstitute(baseItems, products));
    setAiUsed(true);
    if (!comment) {
      setComment("AI dobrało zamienniki o zbliżonej kaloryczności i tym samym profilu makro.");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-brand-600">
            Kontrpropozycja
          </div>
          <div className="font-display text-base font-semibold text-ink-900 mt-0.5">
            Co klient ma zjeść zamiast?
          </div>
        </div>
        <button
          type="button"
          onClick={runAI}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 shadow-glow hover:-translate-y-0.5 transition"
        >
          <Sparkles className="h-4 w-4" />
          {aiUsed ? "Wygeneruj ponownie" : "Zaproponuj z AI"}
        </button>
      </div>

      {aiUsed && (
        <div className="mb-3 flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
          <Sparkles className="h-3.5 w-3.5" />
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
                <div className="text-[10px] text-ink-500">
                  {p.kcal} kcal/100g
                </div>
              </div>
              <input
                type="number"
                value={it.grams}
                onChange={(e) =>
                  setItems((arr) =>
                    arr.map((x, i) =>
                      i === idx ? { ...x, grams: Math.max(0, Number(e.target.value) || 0) } : x
                    )
                  )
                }
                className="input w-20 text-right py-1.5"
                aria-label={`Gramatura: ${p.name}`}
              />
              <span className="text-xs text-ink-500 w-3">g</span>
              <button
                type="button"
                onClick={() => setItems((arr) => arr.filter((_, i) => i !== idx))}
                className="p-1.5 text-ink-400 hover:text-rose-600 transition"
                aria-label="Usuń produkt"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>

      <ProductDropdown
        products={products}
        exclude={items.map((i) => i.productId)}
        onAdd={(productId) => setItems((arr) => [...arr, { productId, grams: 100 }])}
      />

      <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50/50 border border-ink-100 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500">
          Razem
        </div>
        <div className="text-xs text-ink-700">
          <span className="font-semibold text-ink-900">{round(macros.kcal)} kcal</span>
          {" · "}B {round(macros.p, 1)}g · W {round(macros.c, 1)}g · T {round(macros.f, 1)}g
        </div>
      </div>

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Krótka notka dla klienta…"
        className="input mt-4"
      />

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost">
          Anuluj
        </button>
        <button
          onClick={() => onSubmit(items, comment || undefined)}
          className="btn-primary"
        >
          <Send className="h-4 w-4" /> Wyślij kontrpropozycję
        </button>
      </div>
    </div>
  );
}

function ProductDropdown({
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
        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 text-sm text-ink-600 hover:border-brand-400 hover:text-brand-600 transition py-2.5"
      >
        <Plus className="h-4 w-4" /> Dodaj produkt
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
      className="input mt-2"
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
              <span className="flex-1 truncate">{p.name}</span>
              <span className="text-[11px] text-ink-500 font-mono">{it.grams}g</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function KindLabel({ kind }: { kind: MealProposalKind }) {
  const m = {
    swap_request: { label: "Zamiana", Icon: Repeat, cls: "text-brand-700 bg-brand-50 border-brand-200" },
    pre_approval: { label: "Zatwierdzenie", Icon: Check, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    trainer_recipe: { label: "Przepis", Icon: ChefHat, cls: "text-indigo-700 bg-indigo-50 border-indigo-200" }
  } as const;
  const { label, Icon, cls } = m[kind];
  return (
    <span className={`chip ${cls} border text-[10px]`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function StatusPill({ status }: { status: MealProposalStatus }) {
  const map: Record<MealProposalStatus, { label: string; cls: string; Icon: typeof Check }> = {
    pending: {
      label: "Czeka",
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
      label: "Kontrpropozycja",
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Icon: RotateCcw
    }
  };
  const { label, cls, Icon } = map[status];
  return (
    <span className={`chip ${cls} border text-[10px]`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
