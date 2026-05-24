import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function Index() {
  const session = useAuth((s) => s.session);
  if (!session) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(client)" />;
}
