import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useAccount } from "@/lib/account-context";
import { useColors } from "@/hooks/use-colors";

export default function ProfileSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { profile, updateProfile } = useAccount();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const initials = displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "YOU";

  const chooseAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]?.uri) setAvatarUrl(result.assets[0].uri);
  };

  const save = () => {
    if (!displayName.trim()) { Alert.alert("Add your name", "Your display name cannot be empty."); return; }
    updateProfile({ displayName: displayName.trim(), bio: bio.trim(), avatarUrl });
    router.back();
  };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.header}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR PROFILE</Text><Text style={[styles.title, { color: colors.foreground }]}>Profile settings</Text></View><View style={{ width: 42 }} /></View><View style={styles.avatarWrap}>{avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: "#F4E1E4" }]}><Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text></View>}<Pressable onPress={chooseAvatar} style={({ pressed }) => [styles.avatarButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.avatarButtonText}>Change photo</Text></Pressable></View><Text style={[styles.label, { color: colors.muted }]}>Display name</Text><TextInput value={displayName} onChangeText={setDisplayName} placeholder="Your name" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.label, { color: colors.muted }]}>Bio</Text><TextInput value={bio} onChangeText={setBio} placeholder="A short line about you" placeholderTextColor={colors.muted} multiline maxLength={160} style={[styles.input, styles.bio, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.counter, { color: colors.muted }]}>{bio.length}/160</Text><View style={[styles.privacyCard, { backgroundColor: "#F7EEE8", borderColor: "#EED7D4" }]}><Text style={[styles.privacyTitle, { color: colors.foreground }]}>Private by default</Text><Text style={[styles.privacyBody, { color: colors.muted }]}>Your profile details are only shared with people you choose to connect with.</Text></View><PrimaryButton label="Save changes" icon="checkmark" onPress={save} /><Pressable onPress={() => router.back()} style={styles.cancel}><Text style={[styles.cancelText, { color: colors.muted }]}>Cancel</Text></Pressable></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { paddingBottom: 30 }, header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }, headerCopy: { flex: 1, marginHorizontal: 10 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 5 }, title: { fontSize: 27, lineHeight: 32, fontWeight: "800" }, avatarWrap: { alignItems: "center", marginVertical: 28 }, avatar: { width: 104, height: 104, borderRadius: 52, alignItems: "center", justifyContent: "center" }, avatarText: { fontSize: 29, fontWeight: "900", letterSpacing: 1 }, avatarButton: { marginTop: 12, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 }, avatarButtonText: { color: "#FFF9F7", fontSize: 12, fontWeight: "800" }, label: { fontSize: 11, fontWeight: "800", marginBottom: 7, marginTop: 14 }, input: { minHeight: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 }, bio: { minHeight: 105, paddingTop: 14, textAlignVertical: "top" }, counter: { alignSelf: "flex-end", fontSize: 10, marginTop: 5 }, privacyCard: { borderWidth: 1, borderRadius: 18, padding: 15, marginVertical: 23 }, privacyTitle: { fontSize: 13, fontWeight: "800" }, privacyBody: { fontSize: 12, lineHeight: 18, marginTop: 5 }, cancel: { alignItems: "center", paddingVertical: 15 }, cancelText: { fontSize: 13, fontWeight: "700" }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
