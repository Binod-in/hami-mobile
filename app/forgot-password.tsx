import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useColors } from "@/hooks/use-colors";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const requestReset = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setError(""); setSent(true);
  };

  return <ScreenContainer className="px-6 pt-5" edges={["top", "bottom", "left", "right"]}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={styles.content}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>ACCOUNT RECOVERY</Text><Text style={[styles.title, { color: colors.foreground }]}>Forgot your password?</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Enter the email linked to your HAMI account and we’ll send a reset link.</Text></View>{sent ? <View style={[styles.successCard, { backgroundColor: "#EAF4EF", borderColor: colors.success }]}><Text style={[styles.successTitle, { color: colors.foreground }]}>Check your inbox</Text><Text style={[styles.successBody, { color: colors.muted }]}>If an account exists for {email.trim()}, a password reset link will be sent when the production email service is connected.</Text><PrimaryButton label="Return to login" icon="chevron.left" onPress={() => router.replace("/auth")} /></View> : <View><Text style={[styles.label, { color: colors.muted }]}>Email address</Text><TextInput value={email} onChangeText={(value) => { setEmail(value); setError(""); }} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} returnKeyType="send" onSubmitEditing={requestReset} />{error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}<PrimaryButton label="Request reset link" icon="paperplane.fill" onPress={requestReset} /><Pressable onPress={() => router.replace("/auth")} style={styles.cancel}><Text style={[styles.cancelText, { color: colors.muted }]}>Back to login</Text></Pressable></View>}</ScrollView></KeyboardAvoidingView></ScreenContainer>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingTop: 4, paddingBottom: 30 }, heading: { marginTop: 42, marginBottom: 28 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 9 }, title: { fontSize: 31, lineHeight: 37, fontWeight: "800", letterSpacing: -0.7 }, subtitle: { fontSize: 14, lineHeight: 20, marginTop: 10 }, label: { fontSize: 11, fontWeight: "800", marginBottom: 7 }, input: { minHeight: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 14, marginBottom: 10 }, error: { fontSize: 12, marginBottom: 12 }, successCard: { borderWidth: 1, borderRadius: 22, padding: 18 }, successTitle: { fontSize: 17, fontWeight: "800" }, successBody: { fontSize: 13, lineHeight: 20, marginVertical: 10 }, cancel: { alignItems: "center", paddingVertical: 15 }, cancelText: { fontSize: 13, fontWeight: "700" },
});
