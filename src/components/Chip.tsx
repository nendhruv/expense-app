import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

type Props = { text: string; active?: boolean; dotted?: boolean; style?: ViewStyle; onPress?: () => void; accentColor?: string };

export default function Chip({ text, active, dotted, style, onPress, accentColor }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={text} accessibilityHint="Double tap to edit" style={({ pressed }) => [styles.chip, active && [styles.active, accentColor ? { borderColor: accentColor, shadowColor: accentColor } : null], dotted && styles.dotted, pressed && { opacity: 0.9 }, style]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chipBg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  active: {
    borderColor: colors.accentUnder,
    shadowColor: colors.accentUnder,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  dotted: { borderStyle: 'dotted' },
  text: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
});


