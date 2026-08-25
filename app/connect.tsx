import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { PrimaryButton } from "@/components/hami-primitives";
import { useHami } from "@/lib/hami-context";
import { useColors } from "@/hooks/use-colors";

export default function ConnectRoute() {
  const colors = useColors();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { acceptInvite } = useHami();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (code) setAccepted(acceptInvite(code));
  }, [code, acceptInvite]);

  return <ScreenContainer className="px-5 pt-4" edges={["top", "bottom", "left", "right"]}><View style={styles.center}><Text style={[styles.eyebrow, { color: colors.primary }]}>HAMI INVITE</Text><Text style={[styles.title, { color: colors.foreground }]}>{accepted ? "You’re invited into a private home." : "This invite needs a fresh code."}</Text><Text style={[styles.body, { color: colors.muted }]}>{accepted ? "Create or finish your account, then add your details so both people can share one private story." : "Ask your person to generate another invite link and share it with you privately."}</Text><PrimaryButton label={accepted ? "Continue to partner setup" : "Create a new invite"} icon={accepted ? "heart.fill" : "link"} onPress={() => router.push(accepted ? "/partner-setup" : "/invite")} /></View></ScreenContainer>;
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: "center", paddingBottom: 80 }, eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 8 }, title: { fontSize: 30, lineHeight: 36, fontWeight: "800" }, body: { fontSize: 14, lineHeight: 21, marginTop: 12, marginBottom: 24 },
});
