import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useHami } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

export default function ConnectionSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { partner, removeConnection } = useHami();

  if (!partner) return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><View style={styles.empty}><Text style={[styles.eyebrow, { color: colors.primary }]}>CONNECTION SETTINGS</Text><Text style={[styles.title, { color: colors.foreground }]}>No connected person yet.</Text><Text style={[styles.body, { color: colors.muted }]}>Add someone to manage their shared details here.</Text><PrimaryButton label="Add your person" icon="heart.fill" onPress={() => router.push("/partner-setup")} /></View></ScreenContainer>;

  const remove = () => Alert.alert("Remove this connection?", `This will remove ${partner.name} and restore your solo private home. Your personal account will remain active.`, [{ text: "Keep connection", style: "cancel" }, { text: "Remove", style: "destructive", onPress: () => { removeConnection(); router.replace("/"); } }]);

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><View style={styles.header}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>CONNECTION SETTINGS</Text><Text style={[styles.title, { color: colors.foreground }]}>Your shared space</Text><Text style={[styles.body, { color: colors.muted }]}>Manage who appears in your relationship story.</Text></View><View style={{ width: 42 }} /></View><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{partner.name}</Text><Text style={[styles.cardBody, { color: colors.muted }]}>{partner.relationshipType} · {partner.relationshipStartDate}</Text><Text style={[styles.cardBody, { color: colors.muted }]}>{partner.bio || "No private details added yet."}</Text></View><PrimaryButton label="Edit partner details" icon="pencil" onPress={() => router.push("/partner-setup")} /><Pressable onPress={() => router.push("/gallery")} style={[styles.secondary, { borderColor: colors.border, backgroundColor: colors.surface }]}><Text style={[styles.secondaryTitle, { color: colors.foreground }]}>Open shared gallery</Text><Text style={[styles.secondaryBody, { color: colors.muted }]}>View and add connected memories</Text></Pressable><Pressable onPress={remove} style={styles.remove}><Text style={[styles.removeText, { color: colors.error }]}>Remove connection</Text><Text style={[styles.removeHint, { color: colors.muted }]}>Your account and private profile will stay active.</Text></Pressable></ScreenContainer>;
}

const styles = StyleSheet.create({ empty: { flex: 1, justifyContent: "center", paddingBottom: 100 }, header: { flexDirection: "row", alignItems: "flex-start" }, headerCopy: { flex: 1, marginHorizontal: 10 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 }, title: { fontSize: 29, lineHeight: 34, fontWeight: "800" }, body: { fontSize: 13, lineHeight: 19, marginTop: 8 }, card: { borderWidth: 1, borderRadius: 20, padding: 17, marginVertical: 24 }, cardTitle: { fontSize: 19, fontWeight: "800" }, cardBody: { fontSize: 12, lineHeight: 18, marginTop: 7 }, secondary: { borderWidth: 1, borderRadius: 17, padding: 16, marginTop: 12 }, secondaryTitle: { fontSize: 14, fontWeight: "800" }, secondaryBody: { fontSize: 11, marginTop: 4 }, remove: { alignItems: "center", paddingVertical: 24 }, removeText: { fontSize: 13, fontWeight: "800" }, removeHint: { fontSize: 10, marginTop: 5 },
});
