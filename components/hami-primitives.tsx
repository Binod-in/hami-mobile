import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type SurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Surface({ children, style }: SurfaceProps) {
  const colors = useColors();
  return <View style={[styles.surface, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

export function Avatar({ initials, size = 48, online = false }: { initials: string; size?: number; online?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: "#EED8DC" }]}>
      <Text style={[styles.avatarText, { color: colors.primary, fontSize: size * 0.34 }]}>{initials}</Text>
      {online ? <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.surface }]} /> : null}
    </View>
  );
}

export function IconButton({ name, onPress, accessibilityLabel, tone = "neutral" }: { name: IconSymbolName; onPress?: () => void; accessibilityLabel: string; tone?: "neutral" | "primary" }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: tone === "primary" ? colors.primary : colors.surface, borderColor: tone === "primary" ? colors.primary : colors.border },
        pressed && styles.pressed,
      ]}
    >
      <IconSymbol name={name} size={19} color={tone === "primary" ? "#FFF9F7" : colors.foreground} />
    </Pressable>
  );
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action ? <Pressable onPress={onAction} style={({ pressed }) => pressed && styles.pressed}><Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function Pill({ label, color }: { label: string; color?: string }) {
  const colors = useColors();
  return <View style={[styles.pill, { backgroundColor: color ?? "#F5E7E8" }]}><Text style={[styles.pillText, { color: color ? "#FFFFFF" : colors.primary }]}>{label}</Text></View>;
}

export function PrimaryButton({ label, onPress, icon }: { label: string; onPress?: () => void; icon?: IconSymbolName }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
      {icon ? <IconSymbol name={icon} size={18} color="#FFF9F7" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function ScreenTitle({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.screenTitleRow}>
      <View style={styles.screenTitleCopy}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.screenSubtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export const styles = StyleSheet.create({
  surface: { borderWidth: 1, borderRadius: 24, padding: 18 },
  avatar: { alignItems: "center", justifyContent: "center", position: "relative" },
  avatarText: { fontWeight: "800", letterSpacing: 0.5 },
  onlineDot: { position: "absolute", right: 0, bottom: 1, width: 13, height: 13, borderRadius: 7, borderWidth: 2 },
  iconButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", letterSpacing: -0.2 },
  sectionAction: { fontSize: 13, fontWeight: "700" },
  pill: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.2 },
  primaryButton: { minHeight: 50, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 20 },
  primaryButtonText: { color: "#FFF9F7", fontSize: 15, fontWeight: "800" },
  screenTitleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 },
  screenTitleCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.8, marginBottom: 8 },
  screenTitle: { fontSize: 32, lineHeight: 38, fontWeight: "800", letterSpacing: -0.8 },
  screenSubtitle: { marginTop: 7, fontSize: 14, lineHeight: 20 },
});
