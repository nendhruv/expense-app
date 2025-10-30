import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import { useExpenseStore } from '../hooks/useExpenseStore';
import { formatINRPaise } from '../utils/money';
import Screen from '../components/Screen';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const settings = useExpenseStore((s) => s.settings);
  const setSettings = useExpenseStore((s) => s.setSettings);

  const [budgetInput, setBudgetInput] = useState(
    settings.monthlyBudgetPaise ? String(Math.round(settings.monthlyBudgetPaise / 100)) : ''
  );
  const prettyBudget = useMemo(() => {
    const rupees = parseInt(budgetInput || '0', 10);
    return rupees > 0 ? formatINRPaise(rupees * 100) : 'Not set';
  }, [budgetInput]);
  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 48 }} />
      </View>
      <View style={{ height: spacing.xl }} />
      <Text style={styles.label}>Monthly Budget</Text>
      <TextInput
        keyboardType="number-pad"
        placeholder="e.g. 25000"
        placeholderTextColor={colors.textSecondary}
        value={budgetInput}
        onChangeText={setBudgetInput}
        onEndEditing={() => {
          const rupees = parseInt(budgetInput || '0', 10) || 0;
          setSettings({ monthlyBudgetPaise: rupees * 100 });
        }}
        style={styles.inputUnderline}
      />
      <Text style={styles.helper}>Current: {prettyBudget}</Text>

      <View style={{ height: spacing.xl }} />
      <View style={styles.rowBetween}>
        <Text style={styles.label}>AI Assist</Text>
        <Switch
          value={settings.aiAssist}
          onValueChange={(v) => setSettings({ aiAssist: v })}
          thumbColor={settings.aiAssist ? colors.accentUnder : '#888'}
        />
      </View>
      <Text style={styles.helper}>Optional enrichment; never sent unless enabled.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size22,
    fontWeight: typography.weightMedium,
  },
  link: {
    color: colors.accentUnder,
  },
  label: { color: colors.textPrimary, marginBottom: spacing.sm },
  inputUnderline: {
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.hairline,
  },
  helper: { color: colors.textSecondary, marginTop: spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});


