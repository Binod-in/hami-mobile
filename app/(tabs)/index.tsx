import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { Avatar, IconButton, Pill, PrimaryButton, SectionHeading, Surface } from "@/components/hami-primitives";
import { getDaysUntilNextDate, getTogetherDuration, moodOptions, useHami, type Mood } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";
import { useAccount } from "@/lib/account-context";

function QuickAction({ icon, label, detail, onPress, tint }: { icon: string; label: string; detail: string; onPress: () => void; tint: string }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
      <View style={[styles.quickIcon, { backgroundColor: tint }]}><Text style={styles.quickIconText}>{icon}</Text></View>
      <Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.quickDetail, { color: colors.muted }]}>{detail}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { profile } = useAccount();
  const { updates, memories, lastGift, addUpdate, partner } = useHami();
  const displayName = profile?.displayName || "your person";
  const initials = profile?.displayName ? profile.displayName.slice(0, 2).toUpperCase() : "YOU";
  const duration = useMemo(() => partner ? getTogetherDuration(partner.relationshipStartDate) : null, [partner]);
  const anniversaryDays = partner ? getDaysUntilNextDate(Number(partner.relationshipStartDate.slice(5, 7)), Number(partner.relationshipStartDate.slice(8, 10))) : null;
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>(moodOptions[1]);

  const saveUpdate = () => {
    if (!title.trim()) return;
    addUpdate(title.trim(), detail.trim() || "A little moment from today.", selectedMood);
    setTitle("");
    setDetail("");
    setComposerOpen(false);
  };

  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR PRIVATE HOME</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Good morning, {displayName}</Text>
          </View>
          <View style={styles.topActions}>
            <IconButton name="bell.fill" accessibilityLabel="Notifications" onPress={() => {}} />
            <Avatar initials={initials} size={40} online />
          </View>
        </View>

        <View style={[styles.hero, { backgroundColor: "#2C1B21" }]}>
          <View style={styles.heroTop}>
            <View style={styles.partnerCluster}>
              <Avatar initials={initials} size={50} avatarUrl={profile?.avatarUrl} />
              {partner ? <View style={[styles.avatarOverlap, { borderColor: "#2C1B21" }]}><Avatar initials={partner.name.slice(0, 2).toUpperCase()} size={50} avatarUrl={partner.avatarUrl} online /></View> : null}
            </View>
            <Pill label={partner ? "CONNECTED" : "YOUR SPACE"} color={partner ? "#4A9276" : "#775060"} />
          </View>
          <Text style={styles.heroKicker}>{partner ? `${profile?.displayName ?? "YOU"} & ${partner.name.toUpperCase()}` : "A PRIVATE HOME FOR YOU"}</Text>
          <Text style={styles.heroTitle}>{partner ? <>Still choosing{"\n"}each other.</> : <>Your space,{
            "\n"}your story.</>}</Text>
          <Text style={styles.heroBody}>{partner ? `${partner.bio || "A shared story worth keeping."} Together for ${duration?.years ?? 0} years, ${duration?.months ?? 0} months, and ${duration?.days ?? 0} days.` : "Add your partner’s name, photo, details, and start date when you’re ready."}</Text>
          <View style={styles.heroFooter}>
            {partner && duration && anniversaryDays !== null ? <><View><Text style={styles.heroStat}>{duration.totalDays.toLocaleString()}</Text><Text style={styles.heroStatLabel}>days together</Text></View><View style={styles.heroDivider} /><View><Text style={styles.heroStat}>{anniversaryDays}</Text><Text style={styles.heroStatLabel}>days to anniversary</Text></View></> : <View><Text style={styles.heroStat}>—</Text><Text style={styles.heroStatLabel}>not connected yet</Text></View>}
            <Pressable onPress={() => router.push(partner ? "/more" : "/partner-setup")} style={({ pressed }) => [styles.heroArrow, pressed && styles.pressed]}><Text style={styles.heroArrowText}>{partner ? "↗" : "+"}</Text></Pressable>
          </View>
        </View>

        <View style={styles.sectionGap}>
          <SectionHeading title="A little closer today" action="Add update" onAction={() => setComposerOpen(true)} />
          <Surface style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <View style={[styles.moodBubble, { backgroundColor: "#F5E3E6" }]}><Text style={styles.moodEmoji}>{updates[0]?.mood.emoji ?? "♥"}</Text></View>
              <View style={styles.todayCopy}><Text style={[styles.todayTitle, { color: colors.foreground }]}>{updates[0]?.title ?? "Share a little moment"}</Text><Text style={[styles.todayDetail, { color: colors.muted }]}>{updates[0]?.detail ?? "What made today feel like yours?"}</Text></View>
              <Text style={[styles.todayTime, { color: colors.muted }]}>{updates[0]?.time ?? "NOW"}</Text>
            </View>
            <Pressable onPress={() => router.push("/today")} style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}><Text style={[styles.textLinkText, { color: colors.primary }]}>Open today’s timeline  →</Text></Pressable>
          </Surface>
        </View>

        <View style={styles.sectionGap}>
          <SectionHeading title="Make a moment" />
          <View style={styles.quickGrid}>
            <QuickAction icon="+" label="Today" detail="Share your day" tint="#F7E2E2" onPress={() => setComposerOpen(true)} />
            <QuickAction icon="✦" label="Memory" detail="Keep it forever" tint="#EAE5F4" onPress={() => router.push("/memories")} />
            <QuickAction icon="✉" label="Letter" detail="Write for later" tint="#F5E8D7" onPress={() => router.push("/more")} />
            <QuickAction icon="♥" label="Gift" detail={lastGift ? `Sent a ${lastGift.name.toLowerCase()}` : "Send a little love"} tint="#F6DFE7" onPress={() => router.push("/more")} />
          </View>
        </View>

        <View style={styles.sectionGap}>
          <SectionHeading title="Remember this" action="See all" onAction={() => router.push("/memories")} />
          <Pressable onPress={() => router.push("/memories")} style={({ pressed }) => [styles.memoryCard, { backgroundColor: "#E9E0E1" }, pressed && styles.pressed]}>
            <View style={styles.memoryArt}><Text style={styles.memoryArtGlyph}>{memories[0]?.emoji ?? "✦"}</Text><View style={styles.memoryArtLine} /><View style={[styles.memoryArtDot, { backgroundColor: colors.primary }]} /></View>
            <View style={styles.memoryCopy}><Text style={[styles.memoryOverline, { color: colors.primary }]}>ON THIS DAY · 2 YEARS AGO</Text><Text style={[styles.memoryTitle, { color: colors.foreground }]}>{memories[0]?.title ?? "A favorite day"}</Text><Text style={[styles.memoryDesc, { color: colors.muted }]}>{memories[0]?.description ?? "Keep the moments that still feel warm."}</Text><Text style={[styles.memoryMeta, { color: colors.muted }]}>⌖ {memories[0]?.location ?? "Somewhere special"}</Text></View>
          </Pressable>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: "#F2E8F2" }]}><Text style={[styles.quoteMark, { color: colors.primary }]}>“</Text><Text style={[styles.quote, { color: colors.foreground }]}>The ordinary days are the ones we’ll miss the most.</Text><Text style={[styles.quoteBy, { color: colors.muted }]}>— a note from your shared home</Text></View>
      </ScrollView>

      <Modal visible={composerOpen} animationType="slide" transparent onRequestClose={() => setComposerOpen(false)}>
        <View style={styles.modalBackdrop}><View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}><View><Text style={[styles.sheetEyebrow, { color: colors.primary }]}>A MOMENT FROM TODAY</Text><Text style={[styles.sheetTitle, { color: colors.foreground }]}>What’s happening?</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={() => setComposerOpen(false)} /></View>
          <TextInput value={title} onChangeText={setTitle} placeholder="Give it a name" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} returnKeyType="next" />
          <TextInput value={detail} onChangeText={setDetail} placeholder="Add a little detail..." placeholderTextColor={colors.muted} multiline style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} />
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>{moodOptions.map((mood) => <Pressable key={mood.label} onPress={() => setSelectedMood(mood)} style={[styles.moodOption, { backgroundColor: selectedMood.label === mood.label ? "#F5E1E5" : colors.surface, borderColor: selectedMood.label === mood.label ? colors.primary : colors.border }]}><Text style={styles.moodOptionEmoji}>{mood.emoji}</Text><Text style={[styles.moodOptionText, { color: colors.foreground }]}>{mood.label}</Text></Pressable>)}</ScrollView>
          <PrimaryButton label="Save today’s moment" icon="checkmark" onPress={saveUpdate} />
        </View></View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 28 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.8, marginBottom: 6 },
  greeting: { fontSize: 25, lineHeight: 30, fontWeight: "800", letterSpacing: -0.5 },
  hero: { borderRadius: 28, padding: 22, minHeight: 258, marginBottom: 2 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 26 },
  partnerCluster: { flexDirection: "row", alignItems: "center" },
  avatarOverlap: { marginLeft: -17, borderWidth: 3, borderRadius: 30 },
  heroKicker: { color: "#D2A7B0", fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 10 },
  heroTitle: { color: "#FFF9F7", fontSize: 32, lineHeight: 34, fontWeight: "800", letterSpacing: -1 },
  heroBody: { color: "#DABEC3", fontSize: 13, marginTop: 12 },
  heroFooter: { flexDirection: "row", alignItems: "flex-end", marginTop: 22 },
  heroStat: { color: "#FFF9F7", fontSize: 20, fontWeight: "800" },
  heroStatLabel: { color: "#B9959D", fontSize: 10, marginTop: 2 },
  heroDivider: { height: 30, width: 1, backgroundColor: "#5F414A", marginHorizontal: 18, marginBottom: 1 },
  heroArrow: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#50313A", alignItems: "center", justifyContent: "center", marginLeft: "auto" },
  heroArrowText: { color: "#FFF9F7", fontSize: 21 },
  sectionGap: { marginTop: 24 },
  todayCard: { padding: 15 },
  todayHeader: { flexDirection: "row", alignItems: "center" },
  moodBubble: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  moodEmoji: { fontSize: 21, color: "#B94A63" },
  todayCopy: { flex: 1, marginLeft: 12, paddingRight: 8 },
  todayTitle: { fontSize: 15, fontWeight: "800" },
  todayDetail: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  todayTime: { fontSize: 10, fontWeight: "800" },
  textLink: { alignSelf: "flex-start", marginTop: 14 },
  textLinkText: { fontSize: 12, fontWeight: "800" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickAction: { width: "48.3%", minHeight: 110, padding: 14, borderRadius: 19, borderWidth: 1 },
  quickIcon: { width: 31, height: 31, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 11 },
  quickIconText: { color: "#5D343F", fontSize: 17, fontWeight: "800" },
  quickLabel: { fontSize: 14, fontWeight: "800" },
  quickDetail: { fontSize: 11, marginTop: 3 },
  memoryCard: { borderRadius: 24, padding: 16, flexDirection: "row", minHeight: 150 },
  memoryArt: { width: 104, borderRadius: 17, backgroundColor: "#DCCACD", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" },
  memoryArtGlyph: { fontSize: 42, color: "#825460", marginBottom: 4 },
  memoryArtLine: { width: 53, height: 2, backgroundColor: "#B9979F", transform: [{ rotate: "-18deg" }] },
  memoryArtDot: { width: 7, height: 7, borderRadius: 4, position: "absolute", bottom: 23, right: 26 },
  memoryCopy: { flex: 1, paddingLeft: 15, justifyContent: "center" },
  memoryOverline: { fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginBottom: 7 },
  memoryTitle: { fontSize: 17, fontWeight: "800", marginBottom: 5 },
  memoryDesc: { fontSize: 12, lineHeight: 17 },
  memoryMeta: { fontSize: 11, marginTop: 10 },
  quoteCard: { borderRadius: 22, paddingHorizontal: 20, paddingVertical: 18, marginTop: 24 },
  quoteMark: { fontSize: 36, lineHeight: 28, fontWeight: "800" },
  quote: { fontSize: 15, lineHeight: 22, fontWeight: "700", maxWidth: 280 },
  quoteBy: { fontSize: 11, marginTop: 9 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36, 23, 29, 0.36)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34 },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: "#D8C4C7", alignSelf: "center", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 17 },
  sheetEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800", marginBottom: 5 },
  sheetTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, fontSize: 15, marginBottom: 10 },
  textArea: { minHeight: 90, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingTop: 14, fontSize: 15, textAlignVertical: "top", marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "700", marginBottom: 10 },
  moodRow: { gap: 8, paddingBottom: 18 },
  moodOption: { minWidth: 72, minHeight: 62, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 7 },
  moodOptionEmoji: { fontSize: 20, marginBottom: 4 },
  moodOptionText: { fontSize: 10, fontWeight: "700" },
});
