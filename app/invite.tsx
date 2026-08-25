import { useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useHami } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

export default function InviteScreen() {
  const colors = useColors();
  const router = useRouter();
  const { inviteCode, connectionStatus, createInvite, acceptInvite } = useHami();
  const [enteredCode, setEnteredCode] = useState("");
  const [notice, setNotice] = useState("");
  const [code, setCode] = useState(inviteCode ?? "");

  const generate = () => { const next = createInvite(); setCode(next); setNotice("Your invite is ready to share."); };
  const share = async () => { if (!code) return; await Share.share({ message: `Join my private HAMI space: hami://connect?code=${code}` }); };
  const accept = () => { if (acceptInvite(enteredCode)) { setNotice("Invite accepted. Add their profile details to finish connecting."); router.replace("/partner-setup"); } else setNotice("That invite code is not valid on this account."); };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>PRIVATE INVITE</Text><Text style={[styles.title, { color: colors.foreground }]}>Bring your person in.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Create a private link so someone can make their own account and join your shared home.</Text></View><View style={{ width: 42 }} /></View><View style={[styles.card, { backgroundColor: "#2C1B21" }]}><Text style={styles.cardEyebrow}>YOUR INVITE CODE</Text><Text style={styles.code}>{code || "------"}</Text><Text style={styles.cardBody}>{connectionStatus === "pending" ? "Waiting for your person to accept." : "Generate a one-time code and share it privately."}</Text>{code ? <PrimaryButton label="Share invite link" icon="paperplane.fill" onPress={share} /> : <PrimaryButton label="Create invite link" icon="link" onPress={generate} />}</View><View style={styles.divider}><View style={[styles.line, { backgroundColor: colors.border }]} /><Text style={[styles.or, { color: colors.muted }]}>OR ENTER AN INVITE</Text><View style={[styles.line, { backgroundColor: colors.border }]} /></View><TextInput value={enteredCode} onChangeText={setEnteredCode} autoCapitalize="characters" placeholder="HAMI-ABC123" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><PrimaryButton label="Accept invite" icon="checkmark" onPress={accept} />{notice ? <Text style={[styles.notice, { color: colors.primary }]}>{notice}</Text> : null}<Text style={[styles.helper, { color: colors.muted }]}>In the production version, the link will open account creation and connect both verified accounts after acceptance.</Text><Pressable onPress={() => router.replace("/partner-setup")} style={styles.skip}><Text style={[styles.skipText, { color: colors.muted }]}>Add partner details manually</Text></Pressable></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { paddingBottom: 32 }, header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }, headerCopy: { flex: 1, marginHorizontal: 10 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 }, title: { fontSize: 28, lineHeight: 33, fontWeight: "800" }, subtitle: { fontSize: 13, lineHeight: 19, marginTop: 9 }, card: { borderRadius: 24, padding: 20, marginTop: 30 }, cardEyebrow: { color: "#D2A7B0", fontSize: 10, fontWeight: "800", letterSpacing: 1.6 }, code: { color: "#FFF9F7", fontSize: 31, fontWeight: "900", letterSpacing: 3, marginVertical: 18 }, cardBody: { color: "#DABEC3", fontSize: 13, lineHeight: 19, marginBottom: 18 }, divider: { flexDirection: "row", alignItems: "center", gap: 9, marginVertical: 25 }, line: { height: 1, flex: 1 }, or: { fontSize: 9, fontWeight: "800", letterSpacing: 1 }, input: { minHeight: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, marginBottom: 12 }, notice: { fontSize: 12, lineHeight: 17, marginTop: 14 }, helper: { fontSize: 11, lineHeight: 17, marginTop: 23 }, skip: { alignItems: "center", paddingVertical: 16 }, skipText: { fontSize: 12, fontWeight: "800" },
});
