import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

type Props = { visible: boolean; message: string; onUndo: () => void };

export default function UndoSnackbar({ visible, message, onUndo }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onUndo} accessibilityRole="button" accessibilityLabel="Undo" accessibilityHint="Reverts the last action">
        <Text style={styles.undo}>Undo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl,
    backgroundColor: '#1A1A1A',
    borderColor: colors.chipBorder,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: { color: colors.textPrimary },
  undo: { color: colors.accentUnder, fontWeight: '600' },
});



