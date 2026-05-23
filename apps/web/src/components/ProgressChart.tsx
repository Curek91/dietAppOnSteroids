"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ProgressEntry } from "@/lib/types";

interface Props {
  data: ProgressEntry[];
  metrics?: Array<keyof Pick<ProgressEntry, "weight" | "bodyFat" | "waist" | "chest" | "arm" | "thigh">>;
}

const metricMeta = {
  weight: { label: "Waga (kg)", color: "#f97316" },
  bodyFat: { label: "BF (%)", color: "#ec4899" },
  waist: { label: "Pas (cm)", color: "#8b5cf6" },
  chest: { label: "Klatka (cm)", color: "#3b82f6" },
  arm: { label: "Biceps (cm)", color: "#10b981" },
  thigh: { label: "Udo (cm)", color: "#f59e0b" }
} as const;

export function ProgressChart({ data, metrics = ["weight", "bodyFat"] }: Props) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sorted.map((d) => ({
    date: new Date(d.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
    weight: d.weight,
    bodyFat: d.bodyFat,
    waist: d.waist,
    chest: d.chest,
    arm: d.arm,
    thigh: d.thigh
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
              fontSize: 12
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
          {metrics.map((m) => (
            <Line
              key={m}
              type="monotone"
              dataKey={m}
              name={metricMeta[m].label}
              stroke={metricMeta[m].color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
