import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { PrimaryButton } from "@/components/hami-primitives";
import { useColors } from "@/hooks/use-colors";

const slides = [
  { eyebrow: "WELCOME TO HAMI", title: "Far apart.\nStill together.", body: "A private digital home for the people who matter most.", glyph: "♥", tint: "#F4DCE1" },
  { eyebrow: "SHARE THE EVERYDAY", title: "The little things\nare everything.", body: "Keep a gentle timeline of moods, meals, places, and tiny moments.", glyph: "✦", tint: "#E8E2F3" },
  { eyebrow: "KEEP IT CLOSE", title: "Memories that\nfeel like home.", body: "Preserve the days you never want to forget, together.", glyph: "◌", tint: "#F4E6D7" },
  { eyebrow: "YOUR PRIVATE SPACE", title: "Stay close to\nwhat matters.", body: "Connect with a partner, family, or the people who make life feel like yours.", glyph: "☾", tint: "#E2ECE5" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return <ScreenContainer className="px-6 pt-6" edges={["top", "bottom", "left", "right"]}><View style={styles.topBar}><Text style={[styles.brand, { color: colors.foreground }]}>HAMI</Text>{!isLast ? <Pressable onPress={() => router.replace("/")}><Text style={[styles.skip, { color: colors.muted }]}>Skip</Text></Pressable> : null}</View><View style={styles.content}><View style={[styles.art, { backgroundColor: slide.tint }]}><View style={styles.artOrbit} /><Text style={[styles.glyph, { color: colors.primary }]}>{slide.glyph}</Text><View style={[styles.artDot, { backgroundColor: colors.primary }]} /></View><Text style={[styles.eyebrow, { color: colors.primary }]}>{slide.eyebrow}</Text><Text style={[styles.title, { color: colors.foreground }]}>{slide.title}</Text><Text style={[styles.body, { color: colors.muted }]}>{slide.body}</Text></View><View><View style={styles.dots}>{slides.map((item, dotIndex) => <View key={item.eyebrow} style={[styles.dot, { backgroundColor: dotIndex === index ? colors.primary : colors.border, width: dotIndex === index ? 26 : 7 }]} />)}</View><PrimaryButton label={isLast ? "Enter your shared home" : "Continue"} icon={isLast ? "heart.fill" : "arrow.up.right"} onPress={() => isLast ? router.replace("/") : setIndex((value) => value + 1)} /><Pressable onPress={() => router.replace("/")} style={styles.login}><Text style={[styles.loginText, { color: colors.muted }]}>Already have an account? <Text style={{ color: colors.primary, fontWeight: "800" }}>Log in</Text></Text></Pressable></View></ScreenContainer>;
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontSize: 17, fontWeight: "900", letterSpacing: 3 },
  skip: { fontSize: 13, fontWeight: "700" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 },
  art: { width: 260, height: 260, borderRadius: 130, alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 45 },
  artOrbit: { position: "absolute", width: 194, height: 194, borderRadius: 97, borderWidth: 1, borderColor: "rgba(148, 88, 105, 0.28)", transform: [{ rotate: "28deg" }] },
  glyph: { fontSize: 92, fontWeight: "800" },
  artDot: { width: 10, height: 10, borderRadius: 5, position: "absolute", right: 57, bottom: 62 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 2, marginBottom: 12 },
  title: { textAlign: "center", fontSize: 38, lineHeight: 40, letterSpacing: -1.3, fontWeight: "800" },
  body: { textAlign: "center", fontSize: 15, lineHeight: 22, maxWidth: 290, marginTop: 14 },
  dots: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 18 },
  dot: { height: 7, borderRadius: 4 },
  login: { alignItems: "center", paddingTop: 16, paddingBottom: 4 },
  loginText: { fontSize: 12 },
});
