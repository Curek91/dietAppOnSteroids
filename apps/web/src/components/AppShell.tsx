"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutGrid,
  Users,
  Salad,
  Dumbbell,
  LineChart,
  Settings,
  LogOut,
  Bell,
  Search,
  CreditCard,
  Sparkles,
  Watch,
  Camera,
  Repeat,
  CalendarDays
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { AICoach } from "@/components/AICoach";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  badge?: string;
}

const trainerNav: NavItem[] = [
  { href: "/trainer", label: "Pulpit", icon: LayoutGrid },
  { href: "/trainer/calendar", label: "Kalendarz", icon: CalendarDays, badge: "NEW" },
  { href: "/trainer/clients", label: "Podopieczni", icon: Users },
  { href: "/trainer/exchanges", label: "Wymiany posiłków", icon: Repeat },
  { href: "/trainer/proofs", label: "Zdjęcia posiłków", icon: Camera, badge: "AI" },
  { href: "/trainer/library", label: "Baza produktów", icon: Salad },
  { href: "/trainer/insights", label: "Analiza", icon: LineChart },
  { href: "/trainer/billing", label: "Plan & Billing", icon: CreditCard }
];

const clientNav: NavItem[] = [
  { href: "/client", label: "Dziś", icon: LayoutGrid },
  { href: "/client/calendar", label: "Kalendarz", icon: CalendarDays, badge: "NEW" },
  { href: "/client/diet", label: "Dieta", icon: Salad },
  { href: "/client/meals", label: "Wymiany posiłków", icon: Repeat },
  { href: "/client/workout", label: "Trening", icon: Dumbbell },
  { href: "/client/wearable", label: "Zegarek", icon: Watch },
  { href: "/client/proofs", label: "Moje posiłki", icon: Camera, badge: "AI" },
  { href: "/client/progress", label: "Postępy", icon: LineChart }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const logout = useApp((s) => s.logout);
  const aiInsights = useApp((s) => s.aiInsights);

  const user = users.find((u) => u.id === currentUserId) ?? null;

  useEffect(() => {
    if (!currentUserId) router.replace("/login");
  }, [currentUserId, router]);

  if (!user) return null;

  const nav = user.role === "trainer" ? trainerNav : clientNav;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const unread = aiInsights.filter((i) => !i.read && i.scope === user.role).length;

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col p-5 sticky top-0 h-screen">
        <div className="glass rounded-3xl flex flex-col h-full p-5">
          <Link href={user.role === "trainer" ? "/trainer" : "/client"} className="mb-7">
            <Logo />
          </Link>
          <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400 font-medium px-3 mb-2">
              {user.role === "trainer" ? "Trener" : "Podopieczny"}
            </div>
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/trainer" && item.href !== "/client" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow"
                      : "text-ink-600 hover:bg-white/70 hover:text-ink-900"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full",
                      active ? "bg-white/20 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-100/80 flex items-center gap-3">
            <Avatar name={user.fullName} hue={user.avatarHue} size="md" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink-900 truncate">{user.fullName}</div>
              <div className="text-xs text-ink-500 truncate">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/80 text-ink-500 hover:text-brand-600 transition"
              aria-label="Wyloguj"
              title="Wyloguj"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/40 border-b border-white/60">
          <div className="px-6 lg:px-10 py-4 flex items-center gap-4">
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  className="input pl-10"
                  placeholder={user.role === "trainer" ? "Szukaj podopiecznych, planów, produktów..." : "Szukaj posiłków, ćwiczeń..."}
                />
              </div>
            </div>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-brand-500 text-white shadow-glow">
              <Sparkles className="h-3 w-3" /> AI Coach
            </span>
            <button className="btn-ghost relative p-2.5" aria-label="Powiadomienia">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unread}
                </span>
              )}
            </button>
            <button className="btn-ghost p-2.5" aria-label="Ustawienia">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-10 animate-fade-in">{children}</div>
      </main>

      <AICoach />
    </div>
  );
}
