import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Check, Dumbbell } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

const exercises: Exercise[] = [
  { id: "e1", name: "Wyciskanie sztangą leżąc", sets: 4, reps: "6-8", weight: "70 kg" },
  { id: "e2", name: "Rozpiętki hantlami", sets: 3, reps: "10-12", weight: "16 kg" },
  { id: "e3", name: "Wyciskanie żołnierskie", sets: 4, reps: "6-8", weight: "45 kg" },
  { id: "e4", name: "Triceps wyciąg górny", sets: 3, reps: "10-12", weight: "30 kg" },
  { id: "e5", name: "Pompki na poręczach", sets: 3, reps: "do upadku", weight: "+10 kg" }
];

export default function WorkoutScreen() {
  const [done, setDone] = useState<Record<string, number>>({});

  const total = exercises.reduce((a, e) => a + e.sets, 0);
  const completed = Object.values(done).reduce((a, b) => a + b, 0);

  return (
    <Screen>
      <Text className="text-xs uppercase tracking-widest text-ink-500 font-semibold">
        Trening
      </Text>
      <Text className="text-3xl font-bold text-ink-900 mt-1">Push A · klatka</Text>
      <Text className="text-ink-500 mt-1">
        {completed}/{total} serii · {exercises.length} ćwiczeń
      </Text>

      <View className="mt-4 h-2 bg-ink-100 rounded-full overflow-hidden">
        <View
          className="h-full bg-brand-500 rounded-full"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </View>

      <View className="mt-6 gap-3">
        {exercises.map((e) => {
          const setsDone = done[e.id] ?? 0;
          return (
            <Card key={e.id}>
              <View className="flex-row items-center gap-2">
                <Dumbbell color="#f97316" size={16} />
                <Text className="text-base font-semibold text-ink-900 flex-1">{e.name}</Text>
              </View>
              <Text className="text-sm text-ink-500 mt-1">
                {e.sets} × {e.reps} · {e.weight}
              </Text>
              <View className="flex-row gap-2 mt-3">
                {Array.from({ length: e.sets }).map((_, i) => {
                  const isDone = i < setsDone;
                  return (
                    <Pressable
                      key={i}
                      onPress={() =>
                        setDone((d) => ({
                          ...d,
                          [e.id]: isDone ? i : i + 1
                        }))
                      }
                      className={`h-10 w-10 rounded-xl items-center justify-center ${
                        isDone ? "bg-brand-500" : "bg-ink-100"
                      }`}
                    >
                      {isDone ? (
                        <Check color="white" size={18} />
                      ) : (
                        <Text className="text-ink-500 font-semibold text-xs">{i + 1}</Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
