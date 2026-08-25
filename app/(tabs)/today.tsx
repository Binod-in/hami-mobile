import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { Avatar, IconButton, PrimaryButton, ScreenTitle, SectionHeading, Surface } from "@/components/hami-primitives";
import { moodOptions, useHami, type Mood, type DailyUpdate } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

function TimelineItem({ item, isLast }: { item: DailyUpdate; isLast: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, { backgroundColor: item.mood.tone, borderColor: colors.background }]} />
        {!isLast ? <View style={[styles.timelineLine, { backgroundColor: colors.border }]} /> : null}
      </View>
      <Surface style={styles.timelineCard}>
        <View style={styles.timelineTop}><Text style={[styles.time, { color: colors.primary }]}>{item.time}</Text><View style={[styles.moodTag, { backgroundColor: `${item.mood.tone}24` }]}><Text style={[styles.moodTagText, { color: item.mood.tone }]}>{item.mood.emoji} {item.mood.label}</Text></View></View>
        <Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title}</Text>
        <Text style={[styles.itemDetail, { color: colors.muted }]}>{item.detail}</Text>
        <Text style={[styles.visibility, { color: colors.muted }]}>Private to Binod & Indreni</Text>
      </Surface>
    </View>
  );
}

export default function TodayScreen() {
  const colors = useColors();
  const { updates, addUpdate } = useHami();
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>(moodOptions[0]);
  const today = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()), []);

  const saveUpdate = () => {
    if (!title.trim()) return;
    addUpdate(title.trim(), detail.trim() || "A little moment from today.", selectedMood);
    setTitle("");
    setDetail("");
    setComposerOpen(false);
  };

  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right"]}>
      <FlatList
        data={updates}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<>
          <ScreenTitle eyebrow="PRIVATE DAILY TIMELINE" title="Today" subtitle={today} right={<IconButton name="ellipsis" accessibilityLabel="Today options" onPress={() => {}} />} />
          <View style={[styles.statusCard, { backgroundColor: "#F2E6E6" }]}>
            <View style={styles.statusLeft}><Avatar initials="IN" size={44} online /><View style={styles.statusCopy}><Text style={[styles.statusName, { color: colors.foreground }]}>Indreni is feeling loved</Text><Text style={[styles.statusNote, { color: colors.muted }]}>Her last update was 18 minutes ago</Text></View></View><Text style={styles.statusEmoji}>♥</Text>
          </View>
          <View style={styles.sectionTop}><SectionHeading title="Your moments" action="How it works" onAction={() => {}} /><Pressable onPress={() => setComposerOpen(true)} style={({ pressed }) => [styles.addButton, { borderColor: colors.primary }, pressed && styles.pressed]}><Text style={[styles.addButtonText, { color: colors.primary }]}>＋ Add moment</Text></Pressable></View>
        </>}
        renderItem={({ item, index }) => <TimelineItem item={item} isLast={index === updates.length - 1} />}
        ListFooterComponent={<View style={[styles.footerNote, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.footerTitle, { color: colors.foreground }]}>A gentle reminder</Text><Text style={[styles.footerText, { color: colors.muted }]}>Small moments are worth keeping. Share one whenever it feels right.</Text></View>}
      />

      <Modal visible={composerOpen} animationType="slide" transparent onRequestClose={() => setComposerOpen(false)}>
        <View style={styles.modalBackdrop}><View style={[styles.sheet, { backgroundColor: colors.background }]}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={[styles.sheetEyebrow, { color: colors.primary }]}>ADD TO TODAY</Text><Text style={[styles.sheetTitle, { color: colors.foreground }]}>A small moment</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={() => setComposerOpen(false)} /></View>
          <TextInput value={title} onChangeText={setTitle} placeholder="What happened?" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} returnKeyType="next" />
          <TextInput value={detail} onChangeText={setDetail} placeholder="Add a little detail (optional)" placeholderTextColor={colors.muted} multiline style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} />
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Your mood</Text><View style={styles.moodGrid}>{moodOptions.map((mood) => <Pressable key={mood.label} onPress={() => setSelectedMood(mood)} style={[styles.moodOption, { backgroundColor: selectedMood.label === mood.label ? "#F5E1E5" : colors.surface, borderColor: selectedMood.label === mood.label ? colors.primary : colors.border }]}><Text style={styles.moodEmoji}>{mood.emoji}</Text><Text style={[styles.moodText, { color: colors.foreground }]}>{mood.label}</Text></Pressable>)}</View>
          <PrimaryButton label="Save moment" icon="checkmark" onPress={saveUpdate} />
        </View></View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  statusCard: { borderRadius: 22, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 25 },
  statusLeft: { flexDirection: "row", alignItems: "center" },
  statusCopy: { marginLeft: 11 },
  statusName: { fontSize: 14, fontWeight: "800" },
  statusNote: { fontSize: 11, marginTop: 3 },
  statusEmoji: { fontSize: 26, color: "#B94A63", marginRight: 4 },
  sectionTop: { marginBottom: 11 },
  addButton: { borderWidth: 1, borderRadius: 14, paddingVertical: 11, alignItems: "center", marginTop: -4, marginBottom: 8 },
  addButtonText: { fontSize: 13, fontWeight: "800" },
  timelineRow: { flexDirection: "row", minHeight: 144 },
  timelineRail: { width: 24, alignItems: "center" },
  timelineDot: { width: 12, height: 12, borderWidth: 3, borderRadius: 6, zIndex: 2, marginTop: 18 },
  timelineLine: { width: 1, flex: 1, marginTop: -1 },
  timelineCard: { flex: 1, marginLeft: 8, marginBottom: 12, padding: 16, borderRadius: 19 },
  timelineTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 9 },
  time: { fontSize: 12, fontWeight: "800" },
  moodTag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  moodTagText: { fontSize: 10, fontWeight: "800" },
  itemTitle: { fontSize: 15, fontWeight: "800" },
  itemDetail: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  visibility: { fontSize: 10, marginTop: 13 },
  footerNote: { borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 10 },
  footerTitle: { fontSize: 13, fontWeight: "800" },
  footerText: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36, 23, 29, 0.36)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: "#D8C4C7", alignSelf: "center", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 17 },
  sheetEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800", marginBottom: 5 },
  sheetTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, fontSize: 15, marginBottom: 10 },
  textArea: { minHeight: 90, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingTop: 14, fontSize: 15, textAlignVertical: "top", marginBottom: 15 },
  fieldLabel: { fontSize: 12, fontWeight: "700", marginBottom: 10 },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 19 },
  moodOption: { width: "31.5%", minHeight: 58, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  moodEmoji: { fontSize: 19, marginBottom: 3 },
  moodText: { fontSize: 10, fontWeight: "700" },
});
