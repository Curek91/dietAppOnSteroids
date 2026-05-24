import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-ink-50" edges={["top"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 p-5">{children}</View>
      )}
    </SafeAreaView>
  );
}
