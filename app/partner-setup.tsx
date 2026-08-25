import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useHami, type PartnerProfile } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

const types: PartnerProfile["relationshipType"][] = ["Partner", "Family", "Friends", "Private group"];

export default function PartnerSetupScreen() {
  const colors = useColors();
  const router = useRouter();
  const { partner, savePartner } = useHami();
  const [name, setName] = useState(partner?.name ?? "");
  const [bio, setBio] = useState(partner?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(partner?.avatarUrl ?? "");
  const [relationshipType, setRelationshipType] = useState<PartnerProfile["relationshipType"]>(partner?.relationshipType ?? "Partner");
  const [startDate, setStartDate] = useState(partner?.relationshipStartDate ?? "");
  const initials = name.trim() ? name.trim().slice(0, 2).toUpperCase() : "THEM";

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]?.uri) setAvatarUrl(result.assets[0].uri);
  };

  const save = () => {
    if (!name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(startDate.trim()) || Number.isNaN(new Date(startDate).getTime())) {
      Alert.alert("Add the missing details", "Enter their name and a valid start date in YYYY-MM-DD format.");
      return;
    }
    savePartner({ name: name.trim(), bio: bio.trim(), avatarUrl, relationshipType, relationshipStartDate: startDate.trim() });
    router.replace("/");
  };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.header}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR SHARED STORY</Text><Text style={[styles.title, { color: colors.foreground }]}>{partner ? "Edit their profile" : "Add your person"}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Only connect someone when you’re ready. These details stay private.</Text></View><View style={{ width: 42 }} /></View><View style={styles.avatarWrap}>{avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: "#F4E1E4" }]}><Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text></View>}<Pressable onPress={choosePhoto} style={({ pressed }) => [styles.photoButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.photoText}>Add photo</Text></Pressable></View><Text style={[styles.label, { color: colors.muted }]}>Their name</Text><TextInput value={name} onChangeText={setName} placeholder="Partner, family member, or friend" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.label, { color: colors.muted }]}>A little about them</Text><TextInput value={bio} onChangeText={setBio} placeholder="What makes them special?" placeholderTextColor={colors.muted} multiline maxLength={160} style={[styles.input, styles.bio, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.label, { color: colors.muted }]}>What are they to you?</Text><View style={styles.chips}>{types.map((type) => <Pressable key={type} onPress={() => setRelationshipType(type)} style={[styles.chip, { borderColor: relationshipType === type ? colors.primary : colors.border, backgroundColor: relationshipType === type ? "#F4E1E4" : colors.surface }]}><Text style={[styles.chipText, { color: relationshipType === type ? colors.primary : colors.muted }]}>{type}</Text></Pressable>)}</View><Text style={[styles.label, { color: colors.muted }]}>When did your story begin?</Text><TextInput value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} /><Text style={[styles.helper, { color: colors.muted }]}>HAMI will show the exact years, months, and days together after you save.</Text><PrimaryButton label={partner ? "Save partner details" : "Start our story"} icon="heart.fill" onPress={save} /></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { paddingBottom: 32 }, header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }, headerCopy: { flex: 1, marginHorizontal: 10 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 5 }, title: { fontSize: 27, lineHeight: 32, fontWeight: "800" }, subtitle: { fontSize: 13, lineHeight: 19, marginTop: 8 }, avatarWrap: { alignItems: "center", marginVertical: 26 }, avatar: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" }, avatarText: { fontSize: 27, fontWeight: "900" }, photoButton: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, marginTop: 11 }, photoText: { color: "#FFF9F7", fontSize: 12, fontWeight: "800" }, label: { fontSize: 11, fontWeight: "800", marginTop: 14, marginBottom: 7 }, input: { minHeight: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 }, bio: { minHeight: 90, paddingTop: 14, textAlignVertical: "top" }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, chip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 }, chipText: { fontSize: 11, fontWeight: "800" }, helper: { fontSize: 11, lineHeight: 16, marginVertical: 17 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
