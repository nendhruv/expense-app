import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlusFab({ onPress }: { onPress: () => void }) {
  const inset = useSafeAreaInsets();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Add expense" accessibilityHint="Opens the compose screen" onPress={onPress} style={({ pressed }) => [styles.wrap, { bottom: inset.bottom + spacing.xl }, pressed && { transform: [{ scale: 0.98 }] }]}>
      <LinearGradient colors={[colors.accentUnder, '#A3F7D2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.circle}>
        <Ionicons name="add" size={24} color={'#0B2D29'} />
      </LinearGradient>
    </Pressable>
  );
}

const SIZE = 56;
const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: spacing.xl },
  circle: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center', shadowColor: 'rgba(43,201,166,0.4)', shadowOpacity: 1, shadowRadius: 8, elevation: 6 },
});


