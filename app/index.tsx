import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/use-auth";
import { useAccount } from "@/lib/account-context";
import { useColors } from "@/hooks/use-colors";

export default function EntryScreen() {
  const colors = useColors();
  const account = useAccount();
  const auth = useAuth();

  if (!account.isReady || auth.loading) {
    return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  }

  if (account.isSignedIn) return <Redirect href="/(tabs)" />;
  if (auth.isAuthenticated) return <Redirect href="/profile-setup" />;
  return <Redirect href="/auth" />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
