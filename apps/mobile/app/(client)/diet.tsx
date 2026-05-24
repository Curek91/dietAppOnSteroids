import { View, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";

const meals = [
  { name: "Śniadanie", time: "08:00", kcal: 540, items: ["Owsianka z owocami", "Jajka × 2"] },
  { name: "Drugie śniadanie", time: "11:00", kcal: 320, items: ["Skyr · 200g", "Borówki"] },
  { name: "Obiad", time: "14:00", kcal: 720, items: ["Kurczak · 200g", "Ryż brązowy · 120g", "Brokuł"] },
  { name: "Kolacja", time: "19:30", kcal: 480, items: ["Łosoś · 150g", "Sałatka", "Awokado"] }
];

export default function DietScreen() {
  const total = meals.reduce((a, m) => a + m.kcal, 0);
  return (
    <Screen>
      <Text className="text-xs uppercase tracking-widest text-ink-500 font-semibold">
        Plan diety
      </Text>
      <Text className="text-3xl font-bold text-ink-900 mt-1">Redukcja · 2100 kcal</Text>
      <Text className="text-ink-500 mt-1">Dziś masz {meals.length} posiłki w planie ({total} kcal).</Text>

      <View className="mt-6 gap-3">
        {meals.map((m) => (
          <Card key={m.name}>
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-ink-900">{m.name}</Text>
              <Text className="text-xs text-ink-500 font-mono">{m.time}</Text>
            </View>
            <Text className="text-xs text-brand-600 font-semibold mt-0.5">{m.kcal} kcal</Text>
            <View className="mt-3 gap-1">
              {m.items.map((item) => (
                <Text key={item} className="text-sm text-ink-700">• {item}</Text>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
