import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen({ children }: PropsWithChildren<{}>) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.background, colors.background]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.ambient} pointerEvents="none">
        <LinearGradient
          colors={["rgba(43,201,166,0.05)", 'transparent']}
          start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 0.4 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xl,
      }}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  ambient: { ...StyleSheet.absoluteFillObject },
  content: { },
});



