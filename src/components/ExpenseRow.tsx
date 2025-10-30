import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/tokens';
import { Expense } from '../hooks/useExpenseStore';
import { formatINRPaise } from '../utils/money';
import { Swipeable } from 'react-native-gesture-handler';

type Props = { expense: Expense; onPress?: () => void; onDelete?: () => void; overBudget?: boolean; onEdit?: () => void };

export default function ExpenseRow({ expense, onPress, onDelete, overBudget, onEdit }: Props) {
  const ref = useRef<Swipeable>(null);
  const renderRightActions = () => (
    <Pressable style={styles.rightAction} onPress={() => { onDelete && onDelete(); ref.current?.close(); }}>
      <Text style={styles.actionText}>Delete</Text>
    </Pressable>
  );
  return (
    <Swipeable ref={ref} renderRightActions={onDelete ? renderRightActions : undefined}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${expense.merchant || 'Expense'} ${formatINRPaise(expense.amountPaise)}`}
        accessibilityHint="Opens expense details"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: '#F4F6F7' }] }
      >
        <View style={styles.left}>
          <Text style={styles.merchant}>{expense.merchant || '—'}</Text>
          <Text style={styles.meta}>
            {expense.category} {expense.method ? `• ${expense.method}` : ''}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.amount, { color: overBudget ? colors.textPrimary : colors.accentUnder }]}>{formatINRPaise(expense.amountPaise)}</Text>
          <View style={styles.iconRow}>
            {onEdit && (
              <Pressable onPress={onEdit} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Edit expense">
                <Ionicons name="pencil" size={16} color={colors.textSecondary} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Delete expense">
                <Ionicons name="trash" size={16} color={colors.accentOver} />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  left: { flex: 1 },
  merchant: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.textSecondary, marginTop: 2, fontSize: 13 },
  right: { alignItems: 'flex-end' },
  amount: { color: colors.textPrimary, fontWeight: '700', fontVariant: ['tabular-nums'] },
  iconRow: { flexDirection: 'row', marginTop: 6 },
  iconBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  rightAction: { backgroundColor: colors.accentOver, justifyContent: 'center', alignItems: 'center', width: 88 },
  actionText: { color: 'white', fontWeight: '700' },
});


