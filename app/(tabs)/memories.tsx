import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconButton, Pill, PrimaryButton, ScreenTitle, SectionHeading } from "@/components/hami-primitives";
import { useHami, type Memory } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

function MemoryCard({ item, onPress }: { item: Memory; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.memoryCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.memoryVisual, { backgroundColor: item.tone }]}><Text style={styles.visualGlyph}>{item.emoji}</Text><View style={styles.visualOrbit} /></View><View style={styles.memoryCopy}><View style={styles.memoryMetaRow}><Text style={[styles.memoryDate, { color: colors.primary }]}>{item.date}</Text><Text style={[styles.memoryLocation, { color: colors.muted }]}>⌖ {item.location}</Text></View><Text style={[styles.memoryTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.memoryDescription, { color: colors.muted }]} numberOfLines={2}>{item.description}</Text><Text style={[styles.openText, { color: colors.primary }]}>Open memory  →</Text></View></Pressable>;
}

export default function MemoriesScreen() {
  const colors = useColors();
  const { memories, addMemory } = useHami();
  const [composerOpen, setComposerOpen] = useState(false);
  const [detail, setDetail] = useState<Memory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const saveMemory = () => {
    if (!title.trim()) return;
    addMemory({ title: title.trim(), date: new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date()), location: location.trim() || "Somewhere special", description: description.trim() || "A moment worth keeping close.", emoji: "✦", tone: "#EEE3ED" });
    setTitle(""); setDescription(""); setLocation(""); setComposerOpen(false);
  };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right"]}><FlatList data={memories} keyExtractor={(item) => item.id} renderItem={({ item }) => <MemoryCard item={item} onPress={() => setDetail(item)} />} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} ListHeaderComponent={<><ScreenTitle eyebrow="YOUR MEMORY VAULT" title="Memories" subtitle="The days worth keeping close" right={<IconButton name="plus" accessibilityLabel="Add memory" onPress={() => setComposerOpen(true)} />} /><Pressable onPress={() => memories[0] && setDetail(memories[0])} style={({ pressed }) => [styles.onThisDay, pressed && styles.pressed]}><View style={styles.onThisDayArt}><Text style={styles.onThisDayGlyph}>✦</Text><View style={styles.onThisDayRing} /></View><View style={styles.onThisDayCopy}><Text style={[styles.onThisDayLabel, { color: colors.primary }]}>ON THIS DAY</Text><Text style={[styles.onThisDayTitle, { color: colors.foreground }]}>A favorite day, revisited</Text><Text style={[styles.onThisDayText, { color: colors.muted }]}>Two years ago, you made a memory that still feels warm.</Text></View><Text style={[styles.onThisDayArrow, { color: colors.primary }]}>↗</Text></Pressable><View style={styles.section}><SectionHeading title={`${memories.length} memories`} action="Albums" onAction={() => {}} /></View></>} ListFooterComponent={<Pressable onPress={() => setComposerOpen(true)} style={({ pressed }) => [styles.addMemoryRow, { borderColor: colors.border }, pressed && styles.pressed]}><Text style={[styles.addMemoryPlus, { color: colors.primary }]}>＋</Text><View><Text style={[styles.addMemoryTitle, { color: colors.foreground }]}>Keep a new memory</Text><Text style={[styles.addMemoryText, { color: colors.muted }]}>A title, a date, and a feeling is enough.</Text></View></Pressable>} />

    <Modal visible={Boolean(detail)} animationType="slide" transparent onRequestClose={() => setDetail(null)}><View style={styles.modalBackdrop}><View style={[styles.detailSheet, { backgroundColor: colors.background }]}><View style={styles.sheetHandle} /><View style={styles.detailVisual}><Text style={styles.detailGlyph}>{detail?.emoji}</Text></View><View style={styles.detailHeader}><View style={{ flex: 1 }}><Text style={[styles.detailTitle, { color: colors.foreground }]}>{detail?.title}</Text><Text style={[styles.detailMeta, { color: colors.muted }]}>{detail?.date} · {detail?.location}</Text></View><IconButton name="xmark" accessibilityLabel="Close memory" onPress={() => setDetail(null)} /></View><Pill label="Private memory" /><Text style={[styles.detailBody, { color: colors.foreground }]}>{detail?.description}</Text><Text style={[styles.detailFooter, { color: colors.muted }]}>Only you and Indreni can see this memory.</Text></View></View></Modal>

    <Modal visible={composerOpen} animationType="slide" transparent onRequestClose={() => setComposerOpen(false)}><View style={styles.modalBackdrop}><View style={[styles.sheet, { backgroundColor: colors.background }]}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={[styles.sheetEyebrow, { color: colors.primary }]}>PRESERVE A MOMENT</Text><Text style={[styles.sheetTitle, { color: colors.foreground }]}>New memory</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={() => setComposerOpen(false)} /></View><TextInput value={title} onChangeText={setTitle} placeholder="Give it a title" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><TextInput value={location} onChangeText={setLocation} placeholder="Where was it? (optional)" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><TextInput value={description} onChangeText={setDescription} placeholder="What do you want to remember?" placeholderTextColor={colors.muted} multiline style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><PrimaryButton label="Save memory" icon="bookmark.fill" onPress={saveMemory} /></View></View></Modal>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  onThisDay: { borderRadius: 23, backgroundColor: "#2C1B21", minHeight: 138, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 24 },
  onThisDayArt: { width: 101, height: 106, borderRadius: 17, backgroundColor: "#4B3038", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" },
  onThisDayGlyph: { color: "#F4C1CB", fontSize: 42 },
  onThisDayRing: { position: "absolute", width: 80, height: 80, borderWidth: 1, borderColor: "#90616B", borderRadius: 40, transform: [{ rotate: "35deg" }] },
  onThisDayCopy: { flex: 1, paddingLeft: 14, paddingRight: 6 },
  onThisDayLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.4, marginBottom: 7 },
  onThisDayTitle: { color: "#FFF9F7", fontSize: 16, fontWeight: "800" },
  onThisDayText: { color: "#D8BFC3", fontSize: 11, lineHeight: 16, marginTop: 6 },
  onThisDayArrow: { fontSize: 20 },
  section: { marginBottom: 2 },
  memoryCard: { borderWidth: 1, borderRadius: 22, padding: 12, flexDirection: "row", marginBottom: 11 },
  memoryVisual: { width: 93, height: 112, borderRadius: 15, alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" },
  visualGlyph: { fontSize: 38, color: "#7B5F6D" },
  visualOrbit: { position: "absolute", width: 70, height: 40, borderRadius: 40, borderWidth: 1, borderColor: "#B79DB2", transform: [{ rotate: "-28deg" }] },
  memoryCopy: { flex: 1, paddingLeft: 13, paddingVertical: 3 },
  memoryMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  memoryDate: { fontSize: 10, fontWeight: "800" },
  memoryLocation: { fontSize: 10 },
  memoryTitle: { fontSize: 16, fontWeight: "800", marginTop: 10 },
  memoryDescription: { fontSize: 11, lineHeight: 17, marginTop: 5 },
  openText: { fontSize: 11, fontWeight: "800", marginTop: 10 },
  addMemoryRow: { borderWidth: 1, borderStyle: "dashed", borderRadius: 19, padding: 15, flexDirection: "row", alignItems: "center", marginTop: 7 },
  addMemoryPlus: { fontSize: 26, marginRight: 12 },
  addMemoryTitle: { fontSize: 13, fontWeight: "800" },
  addMemoryText: { fontSize: 11, marginTop: 3 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36, 23, 29, 0.36)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34 },
  detailSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 37 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: "#D8C4C7", alignSelf: "center", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 17 },
  sheetEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800", marginBottom: 5 },
  sheetTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, fontSize: 15, marginBottom: 10 },
  textArea: { minHeight: 96, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingTop: 14, fontSize: 15, textAlignVertical: "top", marginBottom: 17 },
  detailVisual: { height: 160, borderRadius: 22, backgroundColor: "#E9E0E1", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  detailGlyph: { fontSize: 69, color: "#8A606C" },
  detailHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  detailTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  detailMeta: { fontSize: 12, marginTop: 5 },
  detailBody: { fontSize: 15, lineHeight: 23, marginTop: 20 },
  detailFooter: { fontSize: 11, marginTop: 23 },
});
