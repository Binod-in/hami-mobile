import { useMemo, useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { Avatar, IconButton, ScreenTitle } from "@/components/hami-primitives";
import { useHami, type Message } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";
import { useAccount } from "@/lib/account-context";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { getApiBaseUrl } from "@/constants/oauth";

function Bubble({ message }: { message: Message }) {
  const colors = useColors();
  return <View style={[styles.bubbleRow, message.fromMe && styles.bubbleRowMe]}><>{!message.fromMe ? <Avatar initials="SP" size={30} online /> : null}</><View style={[styles.bubble, message.fromMe ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.bubbleText, { color: message.fromMe ? "#FFF9F7" : colors.foreground }]}>{message.text}</Text><View style={styles.bubbleMeta}><Text style={[styles.bubbleTime, { color: message.fromMe ? "#EBC5CD" : colors.muted }]}>{message.time}</Text>{message.fromMe ? <Text style={[styles.read, { color: message.read ? "#F6B5C3" : "#EBC5CD" }]}>✓✓</Text> : null}</View></View></View>;
}

function RemoteBubble({ message, currentUserId }: { message: any; currentUserId?: number }) {
  const colors = useColors();
  const fromMe = message.senderId === currentUserId;
  const imageUrl = message.attachment ? `${getApiBaseUrl()}/manus-storage/${message.attachment.storageKey}` : null;
  return <View style={[styles.bubbleRow, fromMe && styles.bubbleRowMe]}>{!fromMe ? <Avatar initials="SP" size={30} online /> : null}<View style={[styles.bubble, fromMe ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.messageImage} resizeMode="cover" /> : null}{message.body ? <Text style={[styles.bubbleText, { color: fromMe ? "#FFF9F7" : colors.foreground }]}>{message.body}</Text> : null}<View style={styles.bubbleMeta}><Text style={[styles.bubbleTime, { color: fromMe ? "#EBC5CD" : colors.muted }]}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Text>{fromMe ? <Text style={[styles.read, { color: "#F6B5C3" }]}>✓✓</Text> : null}</View></View></View>;
}

export default function ChatScreen() {
  const colors = useColors();
  const { profile } = useAccount();
  const { user, isAuthenticated } = useAuth();
  const { messages, addMessage } = useHami();
  const [draft, setDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sendingImage, setSendingImage] = useState(false);
  const filteredMessages = useMemo(() => query.trim() ? messages.filter((message) => message.text.toLowerCase().includes(query.toLowerCase())) : messages, [messages, query]);
  const remoteQuery = trpc.chat.list.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 4000, refetchOnWindowFocus: true });
  const utils = trpc.useUtils();
  const sendMutation = trpc.chat.send.useMutation({ onSuccess: () => utils.chat.list.invalidate() });
  const sendImageMutation = trpc.chat.sendImage.useMutation({ onSuccess: () => utils.chat.list.invalidate() });
  const partnerName = profile?.displayName ? "Your person" : "Connect someone";

  const send = async () => {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    if (isAuthenticated) {
      try { await sendMutation.mutateAsync({ body }); } catch { setDraft(body); Alert.alert("Message not sent", "Please check your connection and try again."); }
    } else addMessage(body);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.82, base64: true });
    if (result.canceled || !result.assets[0]?.base64) return;
    const asset = result.assets[0];
    const base64 = asset.base64;
    if (!base64) return;
    const mimeType = asset.mimeType === "image/png" ? "image/png" : asset.mimeType === "image/webp" ? "image/webp" : "image/jpeg";
    const byteSize = Math.floor(base64.length * 0.75);
    if (byteSize > 10_000_000) { Alert.alert("Image is too large", "Choose an image smaller than 10 MB."); return; }
    setSendingImage(true);
    try {
      if (isAuthenticated) await sendImageMutation.mutateAsync({ base64, mimeType, byteSize, width: asset.width, height: asset.height, body: draft.trim() || null });
      else { addMessage(draft.trim() || "Shared an image"); }
      setDraft("");
    } catch { Alert.alert("Image not sent", "Please try again when you have a stable connection."); }
    finally { setSendingImage(false); }
  };

  return <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right"]}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}><View style={styles.headerRow}><ScreenTitle eyebrow="PRIVATE CONVERSATION" title="Chat" subtitle="Just the two of you" /><View style={styles.headerActions}><IconButton name="magnifyingglass" accessibilityLabel="Search messages" onPress={() => setSearchOpen((value) => !value)} /><IconButton name="ellipsis" accessibilityLabel="Chat options" onPress={() => {}} /></View></View><View style={[styles.personBar, { borderColor: colors.border, backgroundColor: colors.surface }]}><Avatar initials="SP" size={42} online /><View style={styles.personCopy}><Text style={[styles.personName, { color: colors.foreground }]}>{partnerName}</Text><Text style={[styles.personStatus, { color: colors.success }]}>{isAuthenticated ? "Synced privately" : "Private on this device"}</Text></View><View style={[styles.privatePill, { backgroundColor: "#F5E8E7" }]}><Text style={[styles.privateText, { color: colors.primary }]}>Private</Text></View></View>{searchOpen ? <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}><IconButton name="magnifyingglass" accessibilityLabel="Search" /><TextInput value={query} onChangeText={setQuery} placeholder="Search this conversation" placeholderTextColor={colors.muted} style={[styles.searchInput, { color: colors.foreground }]} autoFocus /></View> : null}<FlatList<any> data={isAuthenticated ? (remoteQuery.data ?? []) : filteredMessages} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => isAuthenticated ? <RemoteBubble message={item} currentUserId={user?.id} /> : <Bubble message={item} />} contentContainerStyle={styles.messageList} showsVerticalScrollIndicator={false} ListHeaderComponent={<View style={styles.dateDivider}><View style={[styles.divider, { backgroundColor: colors.border }]} /><Text style={[styles.dateLabel, { color: colors.muted }]}>TODAY</Text><View style={[styles.divider, { backgroundColor: colors.border }]} /></View>} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyGlyph}>⌕</Text><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No messages yet</Text><Text style={[styles.emptyBody, { color: colors.muted }]}>Send a note or share a photo to start your private conversation.</Text></View>} /><View style={styles.composerRow}><IconButton name="plus" accessibilityLabel="Share an image" onPress={pickImage} /><TextInput value={draft} onChangeText={setDraft} placeholder={sendingImage ? "Sending image…" : "Write something..."} placeholderTextColor={colors.muted} style={[styles.composerInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]} onSubmitEditing={send} returnKeyType="send" editable={!sendingImage} /><Pressable onPress={send} accessibilityRole="button" accessibilityLabel="Send message" style={({ pressed }) => [styles.sendButton, { backgroundColor: draft.trim() && !sendMutation.isPending ? colors.primary : colors.border }, pressed && styles.pressed]}><Text style={styles.sendGlyph}>↑</Text></Pressable></View></KeyboardAvoidingView></ScreenContainer>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }, headerActions: { flexDirection: "row", gap: 8, paddingTop: 5 }, personBar: { borderWidth: 1, borderRadius: 19, padding: 11, flexDirection: "row", alignItems: "center", marginBottom: 10 }, personCopy: { marginLeft: 10, flex: 1 }, personName: { fontSize: 14, fontWeight: "800" }, personStatus: { fontSize: 11, marginTop: 3, fontWeight: "700" }, privatePill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999 }, privateText: { fontSize: 10, fontWeight: "800" }, searchBar: { height: 48, borderRadius: 17, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 4, marginBottom: 8 }, searchInput: { flex: 1, fontSize: 14, paddingHorizontal: 10 }, messageList: { paddingVertical: 15, paddingBottom: 18 }, dateDivider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 13 }, divider: { flex: 1, height: 1 }, dateLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, bubbleRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 13, gap: 8 }, bubbleRowMe: { justifyContent: "flex-end" }, bubble: { maxWidth: "78%", borderRadius: 19, paddingHorizontal: 14, paddingVertical: 11 }, bubbleText: { fontSize: 14, lineHeight: 20 }, bubbleMeta: { flexDirection: "row", justifyContent: "flex-end", gap: 5, marginTop: 6 }, bubbleTime: { fontSize: 9 }, read: { fontSize: 10, fontWeight: "800" }, messageImage: { width: 190, height: 150, borderRadius: 13, marginBottom: 5 }, composerRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 10, paddingBottom: 7 }, composerInput: { flex: 1, minHeight: 46, borderRadius: 17, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 }, sendButton: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" }, sendGlyph: { color: "#FFF9F7", fontSize: 21, fontWeight: "800", marginTop: -3 }, pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] }, empty: { alignItems: "center", paddingTop: 70, paddingHorizontal: 30 }, emptyGlyph: { color: "#B94A63", fontSize: 37, marginBottom: 12 }, emptyTitle: { fontSize: 16, fontWeight: "800" }, emptyBody: { textAlign: "center", fontSize: 13, lineHeight: 19 },
});
