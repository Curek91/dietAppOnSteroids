"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function RootRedirect() {
  const router = useRouter();
  const currentUserId = useApp((s) => s.currentUserId);
  const users = useApp((s) => s.users);

  useEffect(() => {
    const user = users.find((u) => u.id === currentUserId);
    if (!user) router.replace("/login");
    else router.replace(user.role === "trainer" ? "/trainer" : "/client");
  }, [currentUserId, users, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin" />
    </div>
  );
}
