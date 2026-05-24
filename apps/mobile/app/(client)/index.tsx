import { View, Text, Pressable } from "react-native";
import { Flame, Camera, Activity, LogOut } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { useAuth } from "@/lib/auth";

export default function TodayScreen() {
  const session = useAuth((s) => s.session)!;
  const logout = useAuth((s) => s.logout);

  return (
    <Screen>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-xs uppercase tracking-widest text-ink-500 font-semibold">
            Dziś, środa
          </Text>
          <Text className="text-3xl font-bold text-ink-900 mt-1">
            Cześć, {session.fullName.split(" ")[0]}
          </Text>
          <Text className="text-ink-500 mt-1">Trzymasz plan w 87% — tak trzymaj.</Text>
        </View>
        <Pressable
          onPress={() => {
            logout();
            router.replace("/(auth)/login");
          }}
          className="h-10 w-10 rounded-xl bg-white border border-ink-200 items-center justify-center"
        >
          <LogOut color="#475569" size={18} />
        </Pressable>
      </View>

      <Card className="mt-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Flame color="#ea580c" size={18} />
            <Text className="text-xs uppercase tracking-widest text-brand-600 font-semibold">
              Dziś · kalorie
            </Text>
          </View>
          <Text className="text-xs text-ink-500">1840 / 2100 kcal</Text>
        </View>
        <View className="mt-3 h-2 bg-ink-100 rounded-full overflow-hidden">
          <View className="h-full bg-brand-500 rounded-full" style={{ width: "88%" }} />
        </View>
        <View className="flex-row gap-2 mt-4">
          <Macro label="B" v="142g" />
          <Macro label="T" v="68g" />
          <Macro label="W" v="190g" />
        </View>
      </Card>

      <Pressable onPress={() => router.push("/(client)/workout")}>
        <Card className="mt-3">
          <View className="flex-row items-center gap-2">
            <Activity color="#059669" size={18} />
            <Text className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
              Trening na dziś
            </Text>
          </View>
          <Text className="text-lg font-semibold text-ink-900 mt-1">Push A · klatka</Text>
          <Text className="text-xs text-ink-500">5 ćwiczeń · 42 min</Text>
        </Card>
      </Pressable>

      <Card className="mt-3 bg-brand-500 border-0">
        <View className="flex-row items-center gap-2">
          <Camera color="white" size={18} />
          <Text className="text-xs uppercase tracking-widest text-white font-semibold">
            Posiłek
          </Text>
        </View>
        <Text className="text-lg font-semibold text-white mt-1">Zrób zdjęcie obiadu</Text>
        <Text className="text-white/85 text-xs">
          AI sprawdzi zgodność z planem i poinformuje Twojego trenera.
        </Text>
      </Card>
    </Screen>
  );
}

function Macro({ label, v }: { label: string; v: string }) {
  return (
    <View className="flex-1 bg-ink-50 rounded-lg py-2 items-center">
      <Text className="text-[10px] uppercase tracking-widest text-ink-500">{label}</Text>
      <Text className="text-sm font-semibold text-ink-900">{v}</Text>
    </View>
  );
}
