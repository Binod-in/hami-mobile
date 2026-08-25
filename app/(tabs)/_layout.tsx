import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAccount } from "@/lib/account-context";

export default function TabLayout() {
  const colors = useColors();
  const { profile } = useAccount();
  const insets = useSafeAreaInsets();
  if (!profile) return <Redirect href="/auth" />;
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: -2 },
        tabBarStyle: {
          paddingTop: 7,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <IconSymbol size={23} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="today" options={{ title: "Today", tabBarIcon: ({ color }) => <IconSymbol size={23} name="calendar" color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: "Chat", tabBarIcon: ({ color }) => <IconSymbol size={23} name="message.fill" color={color} /> }} />
      <Tabs.Screen name="memories" options={{ title: "Memories", tabBarIcon: ({ color }) => <IconSymbol size={23} name="photo.fill" color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color }) => <IconSymbol size={23} name="ellipsis" color={color} /> }} />
    </Tabs>
  );
}
