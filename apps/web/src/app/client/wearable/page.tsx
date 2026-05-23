"use client";

import { useApp } from "@/lib/store";
import { WearablesPanel } from "@/components/WearablesPanel";

export default function ClientWearablePage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Zegarek & zdrowie</h1>
        <p className="text-ink-500 mt-1">Twoje urządzenie synchronizuje się w tle. Trener widzi te same dane.</p>
      </div>
      <WearablesPanel clientId={profile.id} />
    </div>
  );
}
