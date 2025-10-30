import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

type Props = { value: Date; onChange: (delta: -1 | 1) => void };

export default function MonthSwitcher({ value, onChange }: Props) {
  const label = value.toLocaleString('en-US', { month: 'long' });
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onChange(-1)}>
        <Text style={styles.arrow}>‹</Text>
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => onChange(1)}>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  arrow: { color: colors.textPrimary, fontSize: 24, paddingHorizontal: spacing.md },
  label: { color: colors.textPrimary, fontSize: typography.size18 },
});



