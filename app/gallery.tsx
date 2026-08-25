import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, PrimaryButton } from "@/components/hami-primitives";
import { useHami } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

export default function GalleryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { partner, gallery, addGalleryPhoto } = useHami();
  const [caption, setCaption] = useState("");
  const [pendingUri, setPendingUri] = useState("");

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.82 });
    if (!result.canceled && result.assets[0]?.uri) setPendingUri(result.assets[0].uri);
  };

  const savePhoto = () => { if (!pendingUri) return; addGalleryPhoto({ uri: pendingUri, caption: caption.trim(), uploadedBy: "you" }); setPendingUri(""); setCaption(""); };

  if (!partner) return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><View style={styles.empty}><Text style={[styles.eyebrow, { color: colors.primary }]}>SHARED MEMORIES</Text><Text style={[styles.title, { color: colors.foreground }]}>Your gallery begins after connection.</Text><Text style={[styles.body, { color: colors.muted }]}>Add a person first, then you can keep photos and captions together in one private space.</Text><PrimaryButton label="Add your person" icon="heart.fill" onPress={() => router.push("/partner-setup")} /></View></ScreenContainer>;

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><View style={styles.header}><IconButton name="chevron.left" accessibilityLabel="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>WITH {partner.name.toUpperCase()}</Text><Text style={[styles.title, { color: colors.foreground }]}>Our gallery</Text><Text style={[styles.body, { color: colors.muted }]}>A private shelf for the moments you keep together.</Text></View><View style={{ width: 42 }} /></View><Pressable onPress={choosePhoto} style={[styles.addCard, { borderColor: colors.border, backgroundColor: colors.surface }]}><Text style={[styles.addIcon, { color: colors.primary }]}>＋</Text><Text style={[styles.addTitle, { color: colors.foreground }]}>Add a shared photo</Text><Text style={[styles.addBody, { color: colors.muted }]}>Choose from your library</Text></Pressable>{pendingUri ? <View style={[styles.composer, { backgroundColor: "#F7EEE8", borderColor: "#EED7D4" }]}><Image source={{ uri: pendingUri }} style={styles.preview} /><View style={styles.composerCopy}><TextInput value={caption} onChangeText={setCaption} placeholder="Add a caption" placeholderTextColor={colors.muted} style={[styles.captionInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><PrimaryButton label="Save to gallery" icon="checkmark" onPress={savePhoto} /></View></View> : null}<FlatList data={gallery} keyExtractor={(item) => item.id} numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.grid} ListEmptyComponent={<Text style={[styles.emptyGallery, { color: colors.muted }]}>Your first shared photo is waiting here.</Text>} renderItem={({ item }) => <View style={[styles.photoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><Image source={{ uri: item.uri }} style={styles.photo} /><Text style={[styles.photoCaption, { color: colors.foreground }]}>{item.caption || "A moment worth keeping"}</Text><Text style={[styles.photoMeta, { color: colors.muted }]}>{item.uploadedBy === "you" ? "Added by you" : `Added by ${partner.name}`}</Text></View>} /></ScreenContainer>;
}

const styles = StyleSheet.create({ empty: { flex: 1, justifyContent: "center", paddingBottom: 100 }, header: { flexDirection: "row", alignItems: "flex-start" }, headerCopy: { flex: 1, marginHorizontal: 10 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 }, title: { fontSize: 29, lineHeight: 34, fontWeight: "800" }, body: { fontSize: 13, lineHeight: 19, marginTop: 8 }, addCard: { borderWidth: 1, borderStyle: "dashed", borderRadius: 20, padding: 17, marginTop: 24 }, addIcon: { fontSize: 25, fontWeight: "800" }, addTitle: { fontSize: 15, fontWeight: "800", marginTop: 5 }, addBody: { fontSize: 11, marginTop: 3 }, composer: { borderWidth: 1, borderRadius: 19, padding: 12, marginTop: 13, flexDirection: "row" }, preview: { width: 92, height: 92, borderRadius: 13 }, composerCopy: { flex: 1, marginLeft: 12, justifyContent: "space-between" }, captionInput: { height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, fontSize: 12 }, row: { gap: 10 }, grid: { paddingVertical: 18, paddingBottom: 30 }, photoCard: { flex: 1, borderRadius: 17, borderWidth: 1, overflow: "hidden", marginBottom: 10 }, photo: { width: "100%", aspectRatio: 1, backgroundColor: "#EED8DC" }, photoCaption: { fontSize: 12, lineHeight: 16, fontWeight: "800", paddingHorizontal: 10, paddingTop: 9 }, photoMeta: { fontSize: 10, paddingHorizontal: 10, paddingBottom: 11, paddingTop: 4 }, emptyGallery: { textAlign: "center", paddingVertical: 30 },
});
