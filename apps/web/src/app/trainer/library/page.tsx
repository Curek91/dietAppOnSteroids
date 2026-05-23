"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Salad, ImagePlus, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { PhotoUpload } from "@/components/PhotoUpload";

export default function LibraryPage() {
  const products = useApp((s) => s.products);
  const addProduct = useApp((s) => s.addProduct);
  const updateProduct = useApp((s) => s.updateProduct);

  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", kcal: "", protein: "", fat: "", carbs: "", emoji: "🍽️", photoUrl: "" });

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addProduct({
      name: form.name.trim(),
      kcal: parseFloat(form.kcal) || 0,
      protein: parseFloat(form.protein) || 0,
      fat: parseFloat(form.fat) || 0,
      carbs: parseFloat(form.carbs) || 0,
      emoji: form.emoji,
      photoUrl: form.photoUrl || undefined
    });
    setForm({ name: "", kcal: "", protein: "", fat: "", carbs: "", emoji: "🍽️", photoUrl: "" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Baza produktów</h1>
        <p className="text-ink-500 mt-1">{products.length} pozycji · ze zdjęciami i emoji</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="card lg:col-span-1">
          <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">Nowy produkt</h3>
          <p className="text-sm text-ink-500 mb-4">Wartości na 100 g</p>
          <div className="space-y-3">
            <PhotoUpload
              label={form.photoUrl ? "Zmień zdjęcie" : "Dodaj zdjęcie produktu"}
              hint="opcjonalne · ułatwia rozpoznanie"
              onUpload={(dataUrl) => setForm({ ...form, photoUrl: dataUrl })}
            />
            {form.photoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-ink-100 h-32">
                <img src={form.photoUrl} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm({ ...form, photoUrl: "" })} className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2"><label className="label">Nazwa</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><label className="label">Emoji</label><input className="input text-center text-xl" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={3} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Kcal</label><input className="input" inputMode="decimal" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: e.target.value })} /></div>
              <div><label className="label">Białko (g)</label><input className="input" inputMode="decimal" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></div>
              <div><label className="label">Węgle (g)</label><input className="input" inputMode="decimal" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} /></div>
              <div><label className="label">Tłuszcz (g)</label><input className="input" inputMode="decimal" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn-primary w-full"><Plus className="h-4 w-4" /> Dodaj produkt</button>
          </div>
        </form>

        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input className="input pl-10" placeholder="Szukaj produktu..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((p) => (
              <div key={p.id} className="card group hover:-translate-y-0.5 transition p-0 overflow-hidden">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl opacity-60">{p.emoji ?? "🍽️"}</span>
                  )}
                  <label className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 text-ink-600 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <ImagePlus className="h-3.5 w-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onloadend = () => updateProduct(p.id, { photoUrl: reader.result as string });
                        reader.readAsDataURL(f);
                      }}
                    />
                  </label>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-ink-900 text-sm flex items-center gap-1.5">
                    <Salad className="h-3.5 w-3.5 text-emerald-500" />
                    {p.name}
                  </div>
                  <div className="text-[11px] text-ink-500 mt-1">
                    {p.kcal} kcal · B {p.protein}g · W {p.carbs}g · T {p.fat}g
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-ink-500">Brak wyników.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
