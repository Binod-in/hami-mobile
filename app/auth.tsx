import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useAccount, type AccountProfile } from "@/lib/account-context";
import { startOAuthLogin } from "@/constants/oauth";
import { useColors } from "@/hooks/use-colors";

const providers = [
  { id: "google", label: "Continue with Google", glyph: "G", color: "#4285F4" },
  { id: "facebook", label: "Continue with Facebook", glyph: "f", color: "#1877F2" },
  { id: "apple", label: "Continue with Apple", glyph: "●", color: "#171316" },
] as const;

type AuthMethod = AccountProfile["authMethod"];

export default function AuthScreen() {
  const colors = useColors();
  const router = useRouter();
  const { createAccount, deletedAt, restoreAccount } = useAccount();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [providerNotice, setProviderNotice] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  const continueWithProvider = async (provider: AuthMethod) => {
    setError("");
    setProviderNotice(`Opening secure ${provider} sign-in…`);
    await startOAuthLogin();
  };

  const submit = () => {
    if (!identifier.trim() || password.length < 6) {
      setError("Enter your email or phone number and a password with at least 6 characters.");
      return;
    }
    if (mode === "login") {
      setProviderNotice("Your account details are ready. Connect the production auth API to complete sign-in.");
      return;
    }
    createAccount({ displayName: "", email: method === "email" ? identifier.trim() : "", phone: method === "phone" ? identifier.trim() : "", username: "", authMethod: method, passwordSet: true });
    router.replace("/profile-setup");
  };

  return <ScreenContainer className="px-6 pt-5" edges={["top", "bottom", "left", "right"]}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.brandRow}><View><Text style={[styles.brand, { color: colors.foreground }]}>HAMI</Text><Text style={[styles.brandSub, { color: colors.muted }]}>Your people. Your moments. Private.</Text></View><IconButton name="lock.fill" accessibilityLabel="Privacy information" onPress={() => {}} /></View>{deletedAt ? <View style={[styles.restoreBanner, { backgroundColor: "#F4EBD8", borderColor: colors.warning }]}><Text style={[styles.restoreTitle, { color: colors.foreground }]}>Your account is scheduled for deletion</Text><Text style={[styles.restoreBody, { color: colors.muted }]}>Restore it now to keep your profile and private spaces.</Text><Pressable onPress={() => { restoreAccount(); router.replace("/(tabs)"); }}><Text style={[styles.restoreLink, { color: colors.primary }]}>Restore account</Text></Pressable></View> : null}<View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>{mode === "login" ? "WELCOME BACK" : "START YOUR SHARED HOME"}</Text><Text style={[styles.title, { color: colors.foreground }]}>{mode === "login" ? "Come back to what matters." : "Make space for your people."}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{mode === "login" ? "Sign in to your private spaces and memories." : "Create a HAMI account. You can connect with a partner, family, or friends after setup."}</Text></View><View style={[styles.modeSwitch, { backgroundColor: colors.surface, borderColor: colors.border }]}><Pressable onPress={() => { setMode("login"); setError(""); }} style={[styles.modeItem, mode === "login" && { backgroundColor: "#F4E1E4" }]}><Text style={[styles.modeText, { color: mode === "login" ? colors.primary : colors.muted }]}>Log in</Text></Pressable><Pressable onPress={() => { setMode("register"); setError(""); }} style={[styles.modeItem, mode === "register" && { backgroundColor: "#F4E1E4" }]}><Text style={[styles.modeText, { color: mode === "register" ? colors.primary : colors.muted }]}>Create account</Text></Pressable></View><View style={styles.providerStack}>{providers.map((provider) => <Pressable key={provider.id} onPress={() => continueWithProvider(provider.id)} style={({ pressed }) => [styles.providerButton, { borderColor: colors.border, backgroundColor: colors.surface }, pressed && styles.pressed]}><Text style={[styles.providerGlyph, { color: provider.color }]}>{provider.glyph}</Text><Text style={[styles.providerText, { color: colors.foreground }]}>{provider.label}</Text></Pressable>)}</View><View style={styles.orRow}><View style={[styles.orLine, { backgroundColor: colors.border }]} /><Text style={[styles.orText, { color: colors.muted }]}>or use {method === "email" ? "email" : "phone"}</Text><View style={[styles.orLine, { backgroundColor: colors.border }]} /></View><View style={styles.methodRow}><Pressable onPress={() => setMethod("email")} style={[styles.methodChip, { borderColor: method === "email" ? colors.primary : colors.border, backgroundColor: method === "email" ? "#F4E1E4" : colors.surface }]}><Text style={[styles.methodText, { color: method === "email" ? colors.primary : colors.muted }]}>Email</Text></Pressable><Pressable onPress={() => setMethod("phone")} style={[styles.methodChip, { borderColor: method === "phone" ? colors.primary : colors.border, backgroundColor: method === "phone" ? "#F4E1E4" : colors.surface }]}><Text style={[styles.methodText, { color: method === "phone" ? colors.primary : colors.muted }]}>Phone number</Text></Pressable></View><TextInput value={identifier} onChangeText={setIdentifier} keyboardType={method === "email" ? "email-address" : "phone-pad"} autoCapitalize="none" placeholder={method === "email" ? "you@example.com" : "+977 98XXXXXXXX"} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><View><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={mode === "register" ? "Create a password" : "Password"} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><Pressable onPress={() => setForgotOpen(true)} style={styles.forgot}><Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text></Pressable></View>{error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}{providerNotice ? <Text style={[styles.notice, { color: colors.primary }]}>{providerNotice}</Text> : null}<PrimaryButton label={mode === "login" ? "Log in securely" : "Create my account"} icon="lock.fill" onPress={submit} /><Text style={[styles.legal, { color: colors.muted }]}>By continuing, you agree to keep HAMI private and respectful.</Text></ScrollView></KeyboardAvoidingView><Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={() => setForgotOpen(false)}><View style={styles.modalBackdrop}><View style={[styles.forgotCard, { backgroundColor: colors.background }]}><View style={styles.forgotHeader}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ACCOUNT RECOVERY</Text><Text style={[styles.forgotTitle, { color: colors.foreground }]}>Reset your password</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={() => setForgotOpen(false)} /></View><Text style={[styles.forgotBody, { color: colors.muted }]}>Enter your email or phone number and we’ll send a recovery link or code when the production authentication provider is connected.</Text><TextInput placeholder="Email or phone number" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><PrimaryButton label="Send recovery instructions" icon="paperplane.fill" onPress={() => setForgotOpen(false)} /></View></View></Modal></ScreenContainer>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 32 },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brand: { fontSize: 18, fontWeight: "900", letterSpacing: 3 },
  brandSub: { fontSize: 11, marginTop: 4 },
  heading: { marginTop: 43, marginBottom: 22 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 9 },
  title: { fontSize: 31, lineHeight: 36, fontWeight: "800", letterSpacing: -0.7 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 10 },
  modeSwitch: { flexDirection: "row", padding: 4, borderRadius: 16, borderWidth: 1, marginBottom: 15 },
  modeItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12 },
  modeText: { fontSize: 12, fontWeight: "800" },
  providerStack: { gap: 9 },
  providerButton: { minHeight: 48, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  providerGlyph: { width: 24, fontSize: 18, fontWeight: "900", textAlign: "center", marginRight: 6 },
  providerText: { fontSize: 13, fontWeight: "700" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 9, marginVertical: 19 },
  orLine: { height: 1, flex: 1 },
  orText: { fontSize: 10 },
  methodRow: { flexDirection: "row", gap: 8, marginBottom: 9 },
  methodChip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  methodText: { fontSize: 11, fontWeight: "800" },
  input: { minHeight: 49, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 14, marginBottom: 10 },
  forgot: { alignSelf: "flex-end", marginTop: -2, marginBottom: 14 },
  forgotText: { fontSize: 11, fontWeight: "800" },
  error: { fontSize: 12, lineHeight: 17, marginBottom: 12 },
  notice: { fontSize: 12, lineHeight: 17, marginBottom: 12 },
  legal: { textAlign: "center", fontSize: 10, lineHeight: 15, marginTop: 14 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.985 }] },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22, backgroundColor: "rgba(36, 23, 29, 0.42)" },
  forgotCard: { width: "100%", borderRadius: 24, padding: 20 },
  forgotHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  forgotTitle: { fontSize: 23, lineHeight: 28, fontWeight: "800" },
  forgotBody: { fontSize: 13, lineHeight: 20, marginBottom: 17 },
  restoreBanner: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 },
  restoreTitle: { fontSize: 13, fontWeight: "800" },
  restoreBody: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  restoreLink: { fontSize: 12, fontWeight: "800", marginTop: 9 },
});
