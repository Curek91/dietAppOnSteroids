"use client";

import { useApp } from "@/lib/store";
import { MealProofFeed } from "@/components/MealProofFeed";

export default function ClientProofsPage() {
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);
  const clients = useApp((s) => s.clients);

  const me = users.find((u) => u.id === currentUserId);
  const profile = clients.find((c) => c.email === me?.email);

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Twoje posiłki</h1>
        <p className="text-ink-500 mt-1">Wrzuć zdjęcie. AI rozpozna składniki, trener zweryfikuje.</p>
      </div>
      <MealProofFeed clientId={profile.id} />
    </div>
  );
}
