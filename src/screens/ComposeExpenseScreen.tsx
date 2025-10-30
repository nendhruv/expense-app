import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../theme/tokens';
import NoteInput from '../components/NoteInput';
import { useExpenseStore, Expense } from '../hooks/useExpenseStore';
import { useParseExpense } from '../hooks/useParseExpense';
import { formatINRPaise } from '../utils/money';
import AnimatedChip from '../components/AnimatedChip';
import Chip from '../components/Chip';
import * as Haptics from 'expo-haptics';
import { AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateId, nowISO } from '../utils/id';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ComposeExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const editId: string | undefined = route.params?.id;
  const insets = useSafeAreaInsets();

  const expenses = useExpenseStore((s) => s.expenses);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);

  const existing = useMemo(() => expenses.find((e) => e.id === editId), [expenses, editId]);
  const [text, setText] = useState(existing?.rawText ?? '');
  const parsed = useParseExpense(text);

  useEffect(() => {
    if (existing) setText(existing.rawText);
  }, [existing?.id]);

  const canSave = parsed.amountPaise != null;

  const onSave = () => {
    if (!parsed.amountPaise) return;
    const now = nowISO();
    if (existing) {
      const updated: Expense = {
        ...existing,
        rawText: text,
        amountPaise: parsed.amountPaise,
        merchant: parsed.merchant,
        category: parsed.category || 'Misc',
        method: parsed.method,
        note: parsed.note,
        occurredAt: parsed.dateISO || existing.occurredAt,
        updatedAt: now,
      };
      updateExpense(updated);
    } else {
      const expense: Expense = {
        id: generateId(),
        rawText: text,
        amountPaise: parsed.amountPaise,
        currency: 'INR',
        merchant: parsed.merchant,
        category: parsed.category || 'Misc',
        method: parsed.method,
        note: parsed.note,
        occurredAt: parsed.dateISO || now,
        createdAt: now,
        updatedAt: now,
      };
      addExpense(expense);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    AccessibilityInfo.announceForAccessibility('Expense saved');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xl }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} disabled={!canSave}>
          <Text style={[styles.save, !canSave && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.xl }}>
        <Text style={styles.title}>{existing ? 'Edit expense' : 'New expense'}</Text>
        <NoteInput
          placeholder={'Type your expense… e.g. 799 zomato upi - dinner'}
          value={text}
          onChangeText={setText}
          autoFocus
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 2 }} style={{ marginTop: spacing.sm }}>
          <View style={styles.chipsRow}>
            {parsed.amountPaise != null && (
              <AnimatedChip delay={0}><Chip text={formatINRPaise(parsed.amountPaise)} /></AnimatedChip>
            )}
            {parsed.merchant && <AnimatedChip delay={80}><Chip text={parsed.merchant} /></AnimatedChip>}
            {parsed.category && <AnimatedChip delay={160}><Chip text={parsed.category} /></AnimatedChip>}
            {parsed.method && <AnimatedChip delay={240}><Chip text={parsed.method} /></AnimatedChip>}
            <AnimatedChip delay={320}><Chip text={parsed.dateISO ? 'Date' : 'Today'} /></AnimatedChip>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  backBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  save: { fontSize: 16, color: colors.accentUnder, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '600', marginBottom: spacing.md },
  chipsRow: { flexDirection: 'row', alignItems: 'center' },
});


