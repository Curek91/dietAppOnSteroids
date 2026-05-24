// Brand tokens shared by web (Tailwind) and mobile (NativeWind).
// Keep this list in sync with apps/web/tailwind.config.ts and apps/mobile/tailwind.config.js.

export const brand = {
  50: "#fff7ed",
  100: "#ffedd5",
  200: "#fed7aa",
  300: "#fdba74",
  400: "#fb923c",
  500: "#f97316",
  600: "#ea580c",
  700: "#c2410c",
  800: "#9a3412",
  900: "#7c2d12"
} as const;

export const ink = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617"
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24
} as const;

// Plain-string slogan tokens reused by both surfaces (auth screen, etc.).
export const taglines = {
  primary: "Prowadź klientów. Nie tabelki.",
  short: "Jedna aplikacja zamiast pięciu."
} as const;
