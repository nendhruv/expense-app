import React from 'react';
import { TextInput, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../theme/tokens';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: TextStyle;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  accessibilityLabel?: string;
};

export default function NoteInput({ value, onChangeText, placeholder, style, autoFocus, onFocus, onBlur, accessibilityLabel }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      multiline
      keyboardAppearance="dark"
      autoCorrect={false}
      autoCapitalize="none"
      textAlignVertical="top"
      selectionColor={colors.accentUnder}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityLabel={accessibilityLabel || 'Add expense'}
      style={[styles.input, value ? undefined : { fontStyle: 'italic' }, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    minHeight: 96,
    padding: 0,
  },
});


