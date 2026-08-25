import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { PrimaryButton } from "@/components/hami-primitives";
import { useAccount } from "@/lib/account-context";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const modes = ["Partner", "Family", "Friends", "Private group"] as const;

export default function ProfileSetupScreen() {
  const colors = useColors();
  const router = useRouter();
  const account = useAccount();
  const auth = useAuth();
  const [displayName, setDisplayName] = useState(account.profile?.displayName ?? auth.user?.name ?? "");
  const [username, setUsername] = useState(account.profile?.username ?? "");
  const [mode, setMode] = useState<(typeof modes)[number]>("Partner");
  const [error, setError] = useState("");
  const saveProfile = trpc.profile.save.useMutation();

  const finish = async () => {
    if (!displayName.trim() || !username.trim()) {
      setError("Add your display name and a username to continue.");
      return;
    }
    account.createAccount({
      displayName: displayName.trim(),
      username: username.trim().replace(/^@/, ""),
      email: account.profile?.email ?? auth.user?.email ?? "",
      phone: account.profile?.phone ?? "",
      authMethod: account.profile?.authMethod ?? "email",
      passwordSet: account.profile?.passwordSet ?? false,
    });
    if (auth.isAuthenticated) {
      try { await saveProfile.mutateAsync({ username: username.trim().replace(/^@/, ""), displayName: displayName.trim(), connectionMode: mode }); } catch { setError("Your profile is saved on this device. Sync will retry when the server session is available."); }
    }
    router.replace("/(tabs)");
  };

  return <ScreenContainer className="px-6 pt-6" edges={["top", "bottom", "left", "right"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><Text style={[styles.brand, { color: colors.foreground }]}>HAMI</Text><Text style={[styles.eyebrow, { color: colors.primary }]}>MAKE IT YOURS</Text><Text style={[styles.title, { color: colors.foreground }]}>A few details before you begin.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Your profile stays private. You can change these details any time.</Text><View style={styles.avatar}><Text style={[styles.avatarText, { color: colors.primary }]}>{displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "YOU"}</Text></View><Text style={[styles.label, { color: colors.muted }]}>Display name</Text><TextInput value={displayName} onChangeText={setDisplayName} placeholder="What should people call you?" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.label, { color: colors.muted }]}>Username</Text><TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="yourname" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.label, { color: colors.muted }]}>Who are you connecting with?</Text><View style={styles.modeGrid}>{modes.map((item) => <Pressable key={item} onPress={() => setMode(item)} style={[styles.mode, { backgroundColor: mode === item ? "#F4E1E4" : colors.surface, borderColor: mode === item ? colors.primary : colors.border }]}><Text style={[styles.modeText, { color: mode === item ? colors.primary : colors.foreground }]}>{item}</Text></Pressable>)}</View>{error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}<PrimaryButton label="Create my private home" icon="heart.fill" onPress={finish} /><Text style={[styles.note, { color: colors.muted }]}>You can invite people later using your private KURA code.</Text></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  brand: { fontSize: 18, fontWeight: "900", letterSpacing: 3, marginBottom: 45 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 9 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.6 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 10, marginBottom: 22 },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: "#F4E1E4", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 22 },
  avatarText: { fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },
  label: { fontSize: 11, fontWeight: "800", marginBottom: 7, marginTop: 6 },
  input: { minHeight: 49, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, fontSize: 14, marginBottom: 8 },
  modeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  mode: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 },
  modeText: { fontSize: 11, fontWeight: "800" },
  error: { fontSize: 12, marginBottom: 12 },
  note: { textAlign: "center", fontSize: 11, lineHeight: 17, marginTop: 13 },
});
