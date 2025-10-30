import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useExpenseStore } from '../hooks/useExpenseStore';

export default function EditEntrySheet() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const id: string | undefined = route.params?.id;
  const expenses = useExpenseStore((s) => s.expenses);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const existing = useMemo(() => expenses.find((e) => e.id === id), [expenses, id]);
  const [merchant, setMerchant] = useState(existing?.merchant ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [category, setCategory] = useState(existing?.category ?? 'Misc');
  const [method, setMethod] = useState(existing?.method ?? undefined);

  if (!existing) {
    return (
      <View style={styles.container}><Text style={styles.text}>Not found</Text></View>
    );
  }

  const onSave = () => {
    updateExpense({ ...existing, merchant: merchant || undefined, note: note || undefined, category, method });
    navigation.goBack();
  };

  const onDelete = () => {
    deleteExpense(existing.id);
    navigation.goBack();
  };

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>Edit Entry</Text>
      <Text style={styles.label}>Merchant</Text>
      <TextInput value={merchant} onChangeText={setMerchant} style={styles.input} placeholderTextColor={colors.textSecondary} placeholder="e.g. Zomato" />
      <Text style={styles.label}>Note</Text>
      <TextInput value={note} onChangeText={setNote} style={styles.input} placeholderTextColor={colors.textSecondary} placeholder="optional" />
      <Text style={styles.label}>Category</Text>
      <TextInput value={category} onChangeText={setCategory} style={styles.input} />
      <Text style={styles.label}>Method</Text>
      <TextInput value={method || ''} onChangeText={(t) => setMethod((t as any) || undefined)} style={styles.input} />

      <View style={{ height: spacing.lg }} />
      <TouchableOpacity onPress={onSave}><View style={styles.primary}><Text style={styles.primaryText}>Save</Text></View></TouchableOpacity>
      <View style={{ height: spacing.sm }} />
      <TouchableOpacity onPress={onDelete}><View style={styles.danger}><Text style={styles.dangerText}>Delete</Text></View></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  title: { color: colors.textPrimary, fontSize: typography.size22, fontWeight: typography.weightMedium, marginBottom: spacing.lg },
  label: { color: colors.textSecondary, marginTop: spacing.md },
  input: { color: colors.textPrimary, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: colors.hairline, borderRadius: 12, paddingHorizontal: spacing.md, paddingVertical: spacing.md, marginTop: spacing.sm },
  text: { color: colors.textPrimary },
  primary: { backgroundColor: colors.accentUnder, borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center' },
  primaryText: { color: '#082A26', fontWeight: '600' },
  danger: { backgroundColor: colors.accentOver, borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center' },
  dangerText: { color: 'white', fontWeight: '600' },
});


