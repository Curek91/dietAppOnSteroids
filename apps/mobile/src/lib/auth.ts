import { create } from "zustand";

interface Session {
  userId: string;
  fullName: string;
  role: "trainer" | "client";
}

interface AuthState {
  session: Session | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Demo credentials mirror the web app's seed store.
const DEMO_USERS: Record<string, Session & { password: string }> = {
  trener: {
    userId: "u-trainer",
    fullName: "Anna Trener",
    role: "trainer",
    password: "trener"
  },
  klient: {
    userId: "u-client",
    fullName: "Marta Klient",
    role: "client",
    password: "klient"
  }
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  login: (username, password) => {
    const u = DEMO_USERS[username.trim().toLowerCase()];
    if (!u || u.password !== password) return false;
    set({ session: { userId: u.userId, fullName: u.fullName, role: u.role } });
    return true;
  },
  logout: () => set({ session: null })
}));
