import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { clamp } from '../utils/money';

type Props = { spentPaise: number; budgetPaise: number; onPress?: () => void };

export default function BudgetProgress({ spentPaise, budgetPaise, onPress }: Props) {
  const percent = useMemo(() => (budgetPaise <= 0 ? 0 : clamp((spentPaise / budgetPaise) * 100, 0, 100)), [spentPaise, budgetPaise]);
  const over = budgetPaise > 0 && spentPaise > budgetPaise;

  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(percent, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [percent]);
  const style = useAnimatedStyle(() => ({ width: `${w.value}%` }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Spent versus budget"
      accessibilityValue={{ min: 0, now: spentPaise, max: Math.max(1, budgetPaise) }}
    >
      <View style={styles.track}>
        <Animated.View style={[styles.fill, style, over ? styles.fillOver : styles.fillUnder]}>
          {!over && (
            <LinearGradient colors={[colors.accentUnder, '#32B5A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  track: { height: 8, borderRadius: radii.pill, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill, shadowColor: 'rgba(85,255,224,0.4)', shadowOpacity: 1, shadowRadius: 6 },
  fillUnder: {},
  fillOver: { backgroundColor: colors.accentOver },
});


