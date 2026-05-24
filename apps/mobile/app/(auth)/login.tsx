import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useAuth } from "@/lib/auth";
import { taglines } from "@dietapp/core";

export default function LoginScreen() {
  const login = useAuth((s) => s.login);
  const [username, setUsername] = useState("klient");
  const [password, setPassword] = useState("klient");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const ok = login(username, password);
    setLoading(false);
    if (!ok) {
      setError("Nieprawidłowy login lub hasło.");
      return;
    }
    router.replace("/(client)");
  };

  return (
    <SafeAreaView className="flex-1 bg-ink-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-10 pb-8 justify-between">
          <View>
            <View className="h-12 w-12 rounded-2xl bg-brand-500 items-center justify-center">
              <Text className="text-white font-bold text-2xl">D</Text>
            </View>
            <Text className="mt-8 text-4xl font-bold text-ink-900 leading-tight">
              {taglines.primary}
            </Text>
            <Text className="mt-3 text-ink-500 text-base leading-relaxed">
              Zaloguj się, żeby zobaczyć dzisiejszy plan, trening i pomiary.
            </Text>
          </View>

          <View className="gap-3">
            <View>
              <Text className="text-xs text-ink-500 uppercase tracking-widest mb-1.5">Login</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                placeholder="klient"
                className="bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-xs text-ink-500 uppercase tracking-widest mb-1.5">Hasło</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {error && (
              <Text className="text-rose-600 text-sm">{error}</Text>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="bg-brand-500 rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-90"
              style={{
                shadowColor: "#f97316",
                shadowOpacity: 0.35,
                shadowOffset: { width: 0, height: 8 },
                shadowRadius: 24
              }}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? "Logowanie…" : "Zaloguj się"}
              </Text>
              {!loading && <ArrowRight color="white" size={18} />}
            </Pressable>

            <Text className="text-center text-xs text-ink-400 mt-2">
              Demo: <Text className="font-semibold text-ink-600">klient / klient</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
