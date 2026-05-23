"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";
import type { ProgressEntry } from "@/lib/types";
import { ProgressChart } from "@/components/ProgressChart";

export function ProgressTab({ clientId, entries }: { clientId: string; entries: ProgressEntry[] }) {
  const addProgress = useApp((s) => s.addProgress);
  const removeProgress = useApp((s) => s.removeProgress);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: ""
  });

  const num = (v: string) => (v.trim() === "" ? undefined : parseFloat(v.replace(",", ".")));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgress({
      clientId,
      date: form.date,
      weight: num(form.weight),
      bodyFat: num(form.bodyFat),
      waist: num(form.waist),
      chest: num(form.chest),
      arm: num(form.arm),
      thigh: num(form.thigh)
    });
    setForm({ ...form, weight: "", bodyFat: "", waist: "", chest: "", arm: "", thigh: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={submit} className="card lg:col-span-1">
        <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">Nowy pomiar</h3>
        <p className="text-sm text-ink-500 mb-4">Wprowadź antropometrię</p>
        <div className="space-y-3">
          <div><label className="label">Data</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Waga (kg)</label><input className="input" inputMode="decimal" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
            <div><label className="label">BF (%)</label><input className="input" inputMode="decimal" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} /></div>
            <div><label className="label">Pas (cm)</label><input className="input" inputMode="decimal" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></div>
            <div><label className="label">Klatka (cm)</label><input className="input" inputMode="decimal" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} /></div>
            <div><label className="label">Biceps (cm)</label><input className="input" inputMode="decimal" value={form.arm} onChange={(e) => setForm({ ...form, arm: e.target.value })} /></div>
            <div><label className="label">Udo (cm)</label><input className="input" inputMode="decimal" value={form.thigh} onChange={(e) => setForm({ ...form, thigh: e.target.value })} /></div>
          </div>
          <button className="btn-primary w-full mt-2" type="submit"><Plus className="h-4 w-4" /> Dodaj pomiar</button>
        </div>
      </form>

      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">Waga & BF</h3>
          <p className="text-sm text-ink-500 mb-4">{entries.length} pomiarów</p>
          {entries.length > 0 ? (
            <ProgressChart data={entries} metrics={["weight", "bodyFat"]} />
          ) : (
            <div className="text-center py-12 text-ink-500">Brak danych. Dodaj pierwszy pomiar.</div>
          )}
        </div>

        <div className="card overflow-hidden p-0">
          <div className="p-5 pb-3">
            <h3 className="font-display text-lg font-semibold text-ink-900">Historia</h3>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
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
                  <th className="px-5 py-2"></th>
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
                      <button onClick={() => removeProgress(e.id)} className="text-rose-500 hover:text-rose-700 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-8 text-ink-500">Brak pomiarów.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
