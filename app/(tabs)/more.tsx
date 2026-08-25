import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { Avatar, IconButton, Pill, PrimaryButton, ScreenTitle, SectionHeading, Surface } from "@/components/hami-primitives";
import { giftOptions, useHami, getDaysUntilNextDate, type Gift } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";
import { useAccount } from "@/lib/account-context";

type Panel = "connect" | "dates" | "letters" | "gifts" | "privacy" | "password" | "goals" | null;

function FeatureRow({ icon, title, detail, onPress }: { icon: string; title: string; detail: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.featureRow, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.featureIcon, { backgroundColor: "#F5E4E5" }]}><Text style={[styles.featureIconText, { color: colors.primary }]}>{icon}</Text></View><View style={styles.featureCopy}><Text style={[styles.featureTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.featureDetail, { color: colors.muted }]}>{detail}</Text></View><Text style={[styles.chevron, { color: colors.muted }]}>›</Text></Pressable>;
}

export default function MoreScreen() {
  const colors = useColors();
  const router = useRouter();
  const { profile, updateProfile, signOut, deleteAccount, deletedAt } = useAccount();
  const { connectionRequested, requestConnection, letters, sendLetter, lastGift, sendGift } = useHami();
  const initials = profile?.displayName ? profile.displayName.slice(0, 2).toUpperCase() : "YOU";
  const [panel, setPanel] = useState<Panel>(null);
  const [letterTitle, setLetterTitle] = useState("");
  const [letterBody, setLetterBody] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [notifications, setNotifications] = useState(true);

  const closePanel = () => setPanel(null);
  const handleSignOut = () => { signOut(); closePanel(); router.replace("/auth"); };
  const handleDeleteAccount = () => Alert.alert("Delete your account?", "Your account will be hidden immediately. You can restore it from the login screen during the recovery window.", [{ text: "Cancel", style: "cancel" }, { text: "Delete account", style: "destructive", onPress: () => { deleteAccount(); closePanel(); router.replace("/auth"); } }]);
  const changePassword = () => {
    if (newPassword.length < 6 || newPassword !== confirmPassword) return;
    updateProfile({ passwordSet: true });
    setNewPassword(""); setConfirmPassword(""); setPanel(null);
  };
  const createLetter = () => {
    if (!letterTitle.trim() || !letterBody.trim()) return;
    sendLetter(letterTitle.trim(), letterBody.trim(), "Open anytime", false);
    setLetterTitle(""); setLetterBody(""); setPanel(null);
  };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><ScreenTitle eyebrow="YOUR PRIVATE HOME" title="More" subtitle="The little things that keep you close" right={<IconButton name="ellipsis" accessibilityLabel="More options" onPress={() => {}} />} /><View style={[styles.profileCard, { backgroundColor: "#2C1B21" }]}><View style={styles.profileTop}><Avatar initials={initials} size={56} /><View style={styles.profileCopy}><Text style={styles.profileName}>{profile?.displayName || "Your shared home"}</Text><Text style={styles.profileHandle}>Your shared home · Private</Text></View><Pill label={connectionRequested ? "PENDING" : "PRIVATE"} color="#4A9276" /></View><Text style={styles.profileQuote}>“Far apart. Still together.”</Text></View>

      <View style={styles.section}><SectionHeading title="Stay connected" /><FeatureRow icon="⌁" title="Connect with someone" detail={connectionRequested ? "Request sent · waiting for them" : "Share your KURA code or invite link"} onPress={() => setPanel("connect")} /><FeatureRow icon="♡" title="Important dates" detail={`${getDaysUntilNextDate(8, 8)} days until your anniversary`} onPress={() => setPanel("dates")} /><FeatureRow icon="✉" title="Letters" detail={`${letters.length} private notes · write for later`} onPress={() => setPanel("letters")} /><FeatureRow icon="✦" title="Virtual gifts" detail={lastGift ? `Last sent: ${lastGift.name}` : "Send a free little surprise"} onPress={() => setPanel("gifts")} /></View>
      <View style={styles.section}><SectionHeading title="Build a life together" /><FeatureRow icon="☑" title="Shared bucket list" detail="3 of 8 dreams checked off" onPress={() => setPanel("goals")} /><FeatureRow icon="◌" title="Shared goals" detail="Save, study, travel, grow" onPress={() => setPanel("goals")} /><FeatureRow icon="⌾" title="Shared calendar" detail="Birthdays, trips, and reminders" onPress={() => setPanel("dates")} /><FeatureRow icon="＋" title="Coming next" detail="Groups, realtime sync, notifications, and more" onPress={() => setPanel("goals")} /></View>
      <View style={styles.section}><SectionHeading title="Your space" /><FeatureRow icon="◎" title="Profile & privacy" detail="Visibility, location, and notifications" onPress={() => setPanel("privacy")} /><FeatureRow icon="♥" title="Replay welcome" detail="Remember what HAMI is for" onPress={() => router.push("/onboarding")} /></View>
      <Text style={[styles.version, { color: colors.muted }]}>HAMI · A private digital home for people you love</Text>
    </ScrollView>

    <Modal visible={Boolean(panel)} animationType="slide" transparent onRequestClose={closePanel}><View style={styles.modalBackdrop}><View style={[styles.sheet, { backgroundColor: colors.background }]}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={[styles.sheetEyebrow, { color: colors.primary }]}>{panel === "connect" ? "PRIVATE CONNECTION" : panel === "dates" ? "YOUR SHARED CALENDAR" : panel === "letters" ? "WRITE FOR LATER" : panel === "gifts" ? "SEND A LITTLE LOVE" : panel === "privacy" || panel === "password" ? "YOUR ACCOUNT" : "KEEP GROWING TOGETHER"}</Text><Text style={[styles.sheetTitle, { color: colors.foreground }]}>{panel === "connect" ? "Connect" : panel === "dates" ? "Important dates" : panel === "letters" ? "A new letter" : panel === "gifts" ? "Virtual gifts" : panel === "privacy" ? "Profile & privacy" : panel === "password" ? "Change password" : "Together, on purpose"}</Text></View><IconButton name="xmark" accessibilityLabel="Close" onPress={closePanel} /></View>

      {panel === "connect" ? <View><View style={[styles.codeCard, { backgroundColor: "#F5E5E6" }]}><Text style={[styles.codeLabel, { color: colors.primary }]}>YOUR KURA CODE</Text><Text style={[styles.code, { color: colors.foreground }]}>KURA–7X92AB</Text><Text style={[styles.codeHint, { color: colors.muted }]}>Share this only with someone you trust.</Text></View><TextInput placeholder="Enter someone’s KURA code" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><PrimaryButton label={connectionRequested ? "Request sent" : "Send connection request"} icon={connectionRequested ? "checkmark" : "paperplane.fill"} onPress={requestConnection} /></View> : null}
      {panel === "dates" ? <View><Surface style={styles.dateCard}><View style={[styles.dateIcon, { backgroundColor: "#F5E5E6" }]}><Text style={styles.dateEmoji}>♥</Text></View><View style={styles.dateCopy}><Text style={[styles.dateTitle, { color: colors.foreground }]}>Our anniversary</Text><Text style={[styles.dateMeta, { color: colors.muted }]}>August 08 · every year</Text></View><Text style={[styles.dateCountdown, { color: colors.primary }]}>{getDaysUntilNextDate(8, 8)}d</Text></Surface><Surface style={styles.dateCard}><View style={[styles.dateIcon, { backgroundColor: "#F4EBD8" }]}><Text style={styles.dateEmoji}>✦</Text></View><View style={styles.dateCopy}><Text style={[styles.dateTitle, { color: colors.foreground }]}>Their birthday</Text><Text style={[styles.dateMeta, { color: colors.muted }]}>November 17 · every year</Text></View><Text style={[styles.dateCountdown, { color: colors.warning }]}>{getDaysUntilNextDate(11, 17)}d</Text></Surface><PrimaryButton label="Add an important date" icon="plus" onPress={() => {}} /></View> : null}
      {panel === "letters" ? <View><TextInput value={letterTitle} onChangeText={setLetterTitle} placeholder="Give your letter a title" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><TextInput value={letterBody} onChangeText={setLetterBody} placeholder="Write something they can keep..." placeholderTextColor={colors.muted} multiline style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><Text style={[styles.helper, { color: colors.muted }]}>You can send it now or save it for a future date.</Text><PrimaryButton label="Keep this letter" icon="bookmark.fill" onPress={createLetter} /></View> : null}
      {panel === "gifts" ? <View><Text style={[styles.helper, { color: colors.muted }]}>Free gifts for the moments words can’t quite hold.</Text><View style={styles.giftGrid}>{giftOptions.map((gift) => <Pressable key={gift.id} onPress={() => setSelectedGift(gift)} style={[styles.giftCard, { backgroundColor: selectedGift?.id === gift.id ? "#F5E1E5" : colors.surface, borderColor: selectedGift?.id === gift.id ? colors.primary : colors.border }]}><Text style={styles.giftEmoji}>{gift.emoji}</Text><Text style={[styles.giftName, { color: colors.foreground }]}>{gift.name}</Text></Pressable>)}</View><PrimaryButton label={selectedGift ? `Send ${selectedGift.name.toLowerCase()}` : "Choose a gift"} icon="gift.fill" onPress={() => { if (selectedGift) { sendGift(selectedGift); setSelectedGift(null); setPanel(null); } }} /></View> : null}
      {panel === "goals" ? <View><View style={[styles.progressCard, { backgroundColor: "#EEE9F3" }]}><Text style={[styles.progressLabel, { color: colors.primary }]}>THIS MONTH’S SHARED INTENTION</Text><Text style={[styles.progressTitle, { color: colors.foreground }]}>Plan your next date</Text><View style={[styles.progressTrack, { backgroundColor: "#D8D0E0" }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: "68%" }]} /></View><Text style={[styles.progressMeta, { color: colors.muted }]}>4 of 6 steps completed</Text></View><FeatureRow icon="＋" title="Add a dream" detail="Something to look forward to" onPress={() => {}} /><FeatureRow icon="✓" title="Mark a moment complete" detail="Celebrate the small wins" onPress={() => {}} /></View> : null}
      {panel === "password" ? <View><Text style={[styles.helper, { color: colors.muted }]}>Choose a new password for your HAMI account. Your password is never shown in your profile.</Text><TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="New password" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm new password" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} /><PrimaryButton label="Save new password" icon="lock.fill" onPress={changePassword} /></View> : null}
      {panel === "privacy" ? <View><Surface style={styles.settingRow}><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>Profile visible to connections</Text><Text style={[styles.settingText, { color: colors.muted }]}>Only accepted connections can see it.</Text></View><Switch value={true} onValueChange={() => {}} trackColor={{ false: colors.border, true: colors.primary }} /></Surface><Surface style={styles.settingRow}><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>Location sharing</Text><Text style={[styles.settingText, { color: colors.muted }]}>Off by default. No one is tracking you.</Text></View><Switch value={false} onValueChange={() => {}} trackColor={{ false: colors.border, true: colors.primary }} /></Surface><Surface style={styles.settingRow}><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>Notifications</Text><Text style={[styles.settingText, { color: colors.muted }]}>Messages, dates, and letters.</Text></View><Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.primary }} /></Surface><Pressable onPress={() => { closePanel(); router.push("/profile-setup"); }} style={[styles.accountAction, { borderColor: colors.border, backgroundColor: colors.surface }]}><Text style={[styles.accountActionText, { color: colors.foreground }]}>Edit profile</Text><Text style={[styles.accountActionHint, { color: colors.muted }]}>Name, username, and connection type</Text></Pressable><Pressable onPress={() => setPanel("password")} style={[styles.accountAction, { borderColor: colors.border, backgroundColor: colors.surface }]}><Text style={[styles.accountActionText, { color: colors.foreground }]}>Change password</Text><Text style={[styles.accountActionHint, { color: colors.muted }]}>Keep your account secure</Text></Pressable><PrimaryButton label="Log out" icon="rectangle.portrait.and.arrow.right" onPress={handleSignOut} /><Pressable onPress={handleDeleteAccount} style={styles.deleteAction}><Text style={[styles.deleteText, { color: colors.error }]}>Delete account</Text></Pressable>{deletedAt ? <Text style={[styles.privacyFooter, { color: colors.warning }]}>Account deletion is pending. Restore it from the login screen.</Text> : <Text style={[styles.privacyFooter, { color: colors.muted }]}>You can export or delete your data from account settings.</Text>}</View> : null}
    </View></View></Modal>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 34 },
  profileCard: { borderRadius: 25, padding: 18, minHeight: 143 },
  profileTop: { flexDirection: "row", alignItems: "center" },
  profileCopy: { flex: 1, marginLeft: 12 },
  profileName: { color: "#FFF9F7", fontSize: 17, fontWeight: "800" },
  profileHandle: { color: "#C7AAB0", fontSize: 11, marginTop: 5 },
  profileQuote: { color: "#D5BBC0", fontSize: 13, fontStyle: "italic", marginTop: 25 },
  section: { marginTop: 26 },
  featureRow: { minHeight: 69, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", marginBottom: 9 },
  featureIcon: { width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  featureIconText: { fontSize: 20, fontWeight: "700" },
  featureCopy: { flex: 1, marginLeft: 11 },
  featureTitle: { fontSize: 13, fontWeight: "800" },
  featureDetail: { fontSize: 11, marginTop: 3 },
  chevron: { fontSize: 25, marginRight: 3 },
  version: { textAlign: "center", fontSize: 10, marginTop: 18, letterSpacing: 0.3 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.985 }] },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36, 23, 29, 0.36)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34, maxHeight: "92%" },
  sheetHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: "#D8C4C7", alignSelf: "center", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  sheetEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800", marginBottom: 5 },
  sheetTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  codeCard: { borderRadius: 20, padding: 18, marginBottom: 12 },
  codeLabel: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800" },
  code: { fontSize: 25, letterSpacing: 2.5, fontWeight: "800", marginTop: 9 },
  codeHint: { fontSize: 11, marginTop: 8 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, fontSize: 15, marginBottom: 10 },
  textArea: { minHeight: 125, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingTop: 14, fontSize: 15, textAlignVertical: "top", marginBottom: 10 },
  helper: { fontSize: 12, lineHeight: 18, marginBottom: 16 },
  dateCard: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 10 },
  dateIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dateEmoji: { fontSize: 20, color: "#B94A63" },
  dateCopy: { flex: 1, marginLeft: 11 },
  dateTitle: { fontSize: 14, fontWeight: "800" },
  dateMeta: { fontSize: 11, marginTop: 3 },
  dateCountdown: { fontSize: 16, fontWeight: "800" },
  giftGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 17 },
  giftCard: { width: "31.5%", minHeight: 84, borderWidth: 1, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  giftEmoji: { fontSize: 28, marginBottom: 5 },
  giftName: { fontSize: 11, fontWeight: "800" },
  progressCard: { borderRadius: 20, padding: 17, marginBottom: 12 },
  progressLabel: { fontSize: 9, letterSpacing: 1.3, fontWeight: "800" },
  progressTitle: { fontSize: 17, fontWeight: "800", marginTop: 9 },
  progressTrack: { height: 7, borderRadius: 4, marginTop: 18, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressMeta: { fontSize: 11, marginTop: 8 },
  settingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, padding: 15 },
  settingCopy: { flex: 1, paddingRight: 8 },
  settingTitle: { fontSize: 13, fontWeight: "800" },
  settingText: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  accountAction: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10 },
  accountActionText: { fontSize: 13, fontWeight: "800" },
  accountActionHint: { fontSize: 11, marginTop: 4 },
  deleteAction: { alignItems: "center", paddingVertical: 13 },
  deleteText: { fontSize: 12, fontWeight: "800" },
  privacyFooter: { fontSize: 11, lineHeight: 17, marginTop: 8 },
});
