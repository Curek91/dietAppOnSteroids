"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, User as UserIcon, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useApp((s) => s.login);
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);

  const [username, setUsername] = useState("trener");
  const [password, setPassword] = useState("trener");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = users.find((x) => x.id === currentUserId);
    if (u) router.replace(u.role === "trainer" ? "/trainer" : "/client");
  }, [currentUserId, users, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const user = login(username.trim(), password);
    setLoading(false);
    if (!user) {
      setError("Nieprawidłowy login lub hasło.");
      return;
    }
    router.replace(user.role === "trainer" ? "/trainer" : "/client");
  };

  const quickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-amber-600" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0px, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,200,150,0.4) 0px, transparent 40%)"
        }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 text-white">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold tracking-tight">DietApp</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/70 -mt-0.5">Coach OS</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold tracking-wider uppercase mb-5 border border-white/20">
            <Sparkles className="h-3 w-3" /> AI Coach · Wearables · Vision
          </span>
          <h1 className="font-display text-5xl font-semibold text-white tracking-tight leading-[1.05]">
            Trening, dieta<br/>i regeneracja.<br/>
            <span className="text-amber-200">Z AI w tle.</span>
          </h1>
          <p className="mt-6 text-white/85 text-lg leading-relaxed">
            Trener prowadzi do 5 podopiecznych. AI analizuje zdjęcia posiłków, łączy z Apple Watch / Whoop / Garmin
            i podpowiada zmiany w czasie rzeczywistym. 100 PLN/mc.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-white/90">
            <Feature icon={<Sparkles className="h-4 w-4" />} label="AI Vision Coach" />
            <Feature icon={<Zap className="h-4 w-4" />} label="Wearables sync" />
            <Feature icon={<ShieldCheck className="h-4 w-4" />} label="90% marża" />
          </div>
        </div>
        <div className="relative z-10 text-white/70 text-xs">
          © 2026 DietApp · v0.1.0
        </div>
      </aside>

      {/* Right — form */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
          <div className="glass-strong rounded-3xl p-8 lg:p-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Witaj z powrotem
            </h2>
            <p className="text-ink-500 mt-1">Zaloguj się, aby kontynuować.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="label">Login</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    autoFocus
                    autoComplete="username"
                    className="input pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="np. trener"
                  />
                </div>
              </div>
              <div>
                <label className="label">Hasło</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    className="input pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2.5">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>Zaloguj się <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-ink-100">
              <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-medium mb-3">
                Demo dostępy
              </div>
              <div className="grid grid-cols-2 gap-2">
                <QuickAccess
                  label="Trener"
                  sub="trener / trener"
                  hue={24}
                  onClick={() => quickLogin("trener", "trener")}
                />
                <QuickAccess
                  label="Podopieczny"
                  sub="klient / klient"
                  hue={320}
                  onClick={() => quickLogin("klient", "klient")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-white/15 backdrop-blur border border-white/20 p-3">
      <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-xs font-medium leading-tight">{label}</div>
    </div>
  );
}

function QuickAccess({
  label,
  sub,
  hue,
  onClick
}: {
  label: string;
  sub: string;
  hue: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-ink-100 bg-white/60 hover:bg-white p-3 text-left transition-all hover:shadow-soft hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-8 w-8 rounded-lg shadow-soft"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 85% 65%), hsl(${(hue + 25) % 360} 85% 55%))`
          }}
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-ink-900">{label}</div>
          <div className="text-[11px] text-ink-500 truncate">{sub}</div>
        </div>
      </div>
    </button>
  );
}
