import { View } from "react-native";
import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View
      className={`bg-white rounded-2xl p-5 border border-ink-100 ${className}`}
      style={{
        shadowColor: "#0f172a",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 2
      }}
    >
      {children}
    </View>
  );
}
