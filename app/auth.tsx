import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useAccount } from "@/lib/account-context";
import { useColors } from "@/hooks/use-colors";

type ProviderId = "google" | "facebook" | "apple" | "phone";
const providers: { id: ProviderId; label: string; glyph: string; color: string }[] = [
  { id: "google", label: "Google login", glyph: "G", color: "#4285F4" },
  { id: "facebook", label: "Facebook login", glyph: "f", color: "#1877F2" },
  { id: "phone", label: "Phone number login", glyph: "⌕", color: "#B94A63" },
];

export default function AuthScreen() {
  const colors = useColors();
  const router = useRouter();
  const { createAccount, signIn, deletedAt, restoreAccount } = useAccount();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [providerNotice, setProviderNotice] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const continueWithProvider = (provider: ProviderId) => {
    setProviderNotice(`${provider === "phone" ? "Phone number" : provider[0].toUpperCase() + provider.slice(1)} login is coming soon. For now, use your name and password.`);
  };

  const submit = async () => {
    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || password.length < 6) {
      setError("Enter your name or username and a password with at least 6 characters.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        const ok = await signIn(cleanIdentifier, password);
        if (!ok) { setError("That name or password does not match this device’s account."); return; }
        router.replace("/");
      } else {
        const safeUsername = cleanIdentifier.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 64) || `hamiuser${Date.now()}`;
        await createAccount({ displayName: cleanIdentifier, email: "", phone: "", username: safeUsername, authMethod: "email", passwordSet: true }, password);
        router.replace("/profile-setup");
      }
    } finally { setBusy(false); }
  };

  return <ScreenContainer className="px-6 pt-5" edges={["top", "bottom", "left", "right"]}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.brandRow}><View><Text style={[styles.brand, { color: colors.foreground }]}>HAMI</Text><Text style={[styles.brandSub, { color: colors.muted }]}>Your people. Your moments. Private.</Text></View><IconButton name="lock.fill" accessibilityLabel="Privacy information" onPress={() => {}} /></View>{deletedAt ? <View style={[styles.restoreBanner, { backgroundColor: "#F4EBD8", borderColor: colors.warning }]}><Text style={[styles.restoreTitle, { color: colors.foreground }]}>Your account is scheduled for deletion</Text><Text style={[styles.restoreBody, { color: colors.muted }]}>Restore it now to keep your profile and private spaces.</Text><Pressable onPress={() => { restoreAccount(); router.replace("/"); }}><Text style={[styles.restoreLink, { color: colors.primary }]}>Restore account</Text></Pressable></View> : null}<View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>{mode === "login" ? "WELCOME BACK" : "CREATE YOUR PRIVATE HOME"}</Text><Text style={[styles.title, { color: colors.foreground }]}>{mode === "login" ? "Come back to what matters." : "Make space for your people."}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{mode === "login" ? "Sign in with your name and password." : "Start with your name and password. You can connect with people after setup."}</Text></View><View style={[styles.modeSwitch, { backgroundColor: colors.surface, borderColor: colors.border }]}><Pressable onPress={() => { setMode("login"); setError(""); }} style={[styles.modeItem, mode === "login" && { backgroundColor: "#F4E1E4" }]}><Text style={[styles.modeText, { color: mode === "login" ? colors.primary : colors.muted }]}>Log in</Text></Pressable><Pressable onPress={() => { setMode("register"); setError(""); }} style={[styles.modeItem, mode === "register" && { backgroundColor: "#F4E1E4" }]}><Text style={[styles.modeText, { color: mode === "register" ? colors.primary : colors.muted }]}>Create account</Text></Pressable></View><View style={styles.providerStack}>{providers.map((provider) => <Pressable key={provider.id} onPress={() => continueWithProvider(provider.id)} style={({ pressed }) => [styles.providerButton, { borderColor: colors.border, backgroundColor: colors.surface }, pressed && styles.pressed]}><Text style={[styles.providerGlyph, { color: provider.color }]}>{provider.glyph}</Text><View><Text style={[styles.providerText, { color: colors.foreground }]}>{provider.label}</Text><Text style={[styles.comingSoon, { color: colors.muted }]}>Coming soon</Text></View></Pressable>)}</View><View style={styles.orRow}><View style={[styles.orLine, { backgroundColor: colors.border }]} /><Text style={[styles.orText, { color: colors.muted }]}>use your HAMI account</Text><View style={[styles.orLine, { backgroundColor: colors.border }]} /></View><TextInput value={identifier} onChangeText={setIdentifier} autoCapitalize="none" placeholder="Name or username" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><View><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={mode === "register" ? "Create a password" : "Password"} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} onSubmitEditing={submit} returnKeyType="done" /><Pressable onPress={() => setForgotOpen(true)} style={styles.forgot}><Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text></Pressable></View>{error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}{providerNotice ? <Text style={[styles.notice, { color: colors.primary }]}>{providerNotice}</Text> : null}<PrimaryButton label={busy ? "Please wait…" : mode === "login" ? "Log in securely" : "Create my account"} icon="lock.fill" onPress={submit} /><Text style={[styles.legal, { color: colors.muted }]}>Passwords are hashed locally in this prototype. Production credential storage should remain server-side.</Text></ScrollView></KeyboardAvoidingView><Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={() => setForgotOpen(false)}><View style={styles.modalBackdrop}><View style={[styles.forgotCard, { backgroundColor: colors.background }]}><View style={styles.forgotHeader}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ACCOUNT RECOVERY</Text><Text style={[styles.forgotTitle, { color: colors.foreground }]}>Reset your password</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={() => setForgotOpen(false)} /></View><Text style={[styles.forgotBody, { color: colors.muted }]}>Password recovery will be connected to the production authentication server in a future update.</Text><PrimaryButton label="Close" icon="xmark" onPress={() => setForgotOpen(false)} /></View></View></Modal></ScreenContainer>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, content: { paddingBottom: 32 }, brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, brand: { fontSize: 18, fontWeight: "900", letterSpacing: 3 }, brandSub: { fontSize: 11, marginTop: 4 }, heading: { marginTop: 43, marginBottom: 22 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 9 }, title: { fontSize: 31, lineHeight: 36, fontWeight: "800", letterSpacing: -0.7 }, subtitle: { fontSize: 14, lineHeight: 20, marginTop: 10 }, modeSwitch: { flexDirection: "row", padding: 4, borderRadius: 16, borderWidth: 1, marginBottom: 15 }, modeItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12 }, modeText: { fontSize: 12, fontWeight: "800" }, providerStack: { gap: 9 }, providerButton: { minHeight: 55, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }, providerGlyph: { width: 24, fontSize: 18, fontWeight: "900", textAlign: "center", marginRight: 6 }, providerText: { fontSize: 13, fontWeight: "700" }, comingSoon: { fontSize: 10, marginTop: 2 }, orRow: { flexDirection: "row", alignItems: "center", gap: 9, marginVertical: 19 }, orLine: { height: 1, flex: 1 }, orText: { fontSize: 10 }, input: { minHeight: 49, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 14, marginBottom: 10 }, forgot: { alignSelf: "flex-end", marginTop: -2, marginBottom: 14 }, forgotText: { fontSize: 11, fontWeight: "800" }, error: { fontSize: 12, lineHeight: 17, marginBottom: 12 }, notice: { fontSize: 12, lineHeight: 17, marginBottom: 12 }, legal: { textAlign: "center", fontSize: 10, lineHeight: 15, marginTop: 14 }, pressed: { opacity: 0.7, transform: [{ scale: 0.985 }] }, modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22, backgroundColor: "rgba(36, 23, 29, 0.42)" }, forgotCard: { width: "100%", borderRadius: 24, padding: 20 }, forgotHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }, forgotTitle: { fontSize: 23, lineHeight: 28, fontWeight: "800" }, forgotBody: { fontSize: 13, lineHeight: 20, marginBottom: 17 }, restoreBanner: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 }, restoreTitle: { fontSize: 13, fontWeight: "800" }, restoreBody: { fontSize: 11, lineHeight: 16, marginTop: 4 }, restoreLink: { fontSize: 12, fontWeight: "800", marginTop: 9 },
});
