import { Redirect, Tabs } from "expo-router";
import { Home, Utensils, Dumbbell } from "lucide-react-native";
import { useAuth } from "@/lib/auth";

export default function ClientTabsLayout() {
  const session = useAuth((s) => s.session);
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#e2e8f0",
          paddingTop: 6,
          height: 64
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dziś",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Dieta",
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Trening",
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
