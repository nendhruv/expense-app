import React, { PropsWithChildren } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function AnimatedChip({ delay = 0, children }: PropsWithChildren<{ delay?: number }>) {
  const style = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 240, delay }),
    transform: [
      { translateY: withTiming(0, { duration: 240, delay }) },
      { scale: withTiming(1, { duration: 240, delay }) },
    ],
  }));
  return <Animated.View style={[{ opacity: 0, transform: [{ translateY: 6 }, { scale: 0.98 }] }, style]}>{children}</Animated.View>;
}


