import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, spacing } from '../theme/tokens';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = PropsWithChildren<{ style?: ViewStyle; focused?: boolean }>;

export default function BlurCard({ children, style, focused: controlledFocused }: Props) {
  const [hover, setHover] = useState(false);
  const isFocused = controlledFocused || hover;

  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(isFocused ? 1 : 0, { duration: 220 });
  }, [isFocused]);

  const aStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(t.value, [0, 1], [colors.hairline, colors.accentUnder]),
    shadowOpacity: 0.1 + 0.15 * t.value,
    shadowRadius: 8 + 6 * t.value,
    elevation: 2 + Math.round(4 * t.value),
    transform: [{ translateY: -2 * t.value }],
  }));

  return (
    <Animated.View style={[styles.container, aStyle, style]}> 
      <BlurView
        intensity={25}
        tint="dark"
        style={styles.blur}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {children}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  blur: { padding: spacing.lg },
});


