import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = { onPress: () => void; visible: boolean };

export default function SaveFab({ onPress, visible }: Props) {
  const inset = useSafeAreaInsets();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 0.95 + 0.05 * t.value }],
    pointerEvents: t.value === 0 ? 'none' : 'auto',
  }) as any);

  return (
    <Animated.View style={[styles.wrap, { bottom: inset.bottom + spacing.xl }, aStyle]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Save expense" accessibilityHint="Saves the current expense" onPress={onPress} style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}>
        <LinearGradient colors={[`${colors.accentUnder}E6`, '#46C8B7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.circle}>
          <Ionicons name="checkmark" size={24} color="#0B2D29" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const SIZE = 56;
const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: spacing.xl },
  fab: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 6, borderRadius: SIZE / 2 },
  circle: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center' },
});


