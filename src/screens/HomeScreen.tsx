import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SectionList, Modal, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import Chip from '../components/Chip';
import BudgetProgress from '../components/BudgetProgress';
import SaveFab from '../components/SaveFab';
import UndoSnackbar from '../components/UndoSnackbar';
import ExpenseRow from '../components/ExpenseRow';
import { useParseExpense } from '../hooks/useParseExpense';
import { useExpenseStore, Expense } from '../hooks/useExpenseStore';
import { useMonthlySpend } from '../hooks/useMonthlySpend';
import { formatINRPaise } from '../utils/money';
import * as Haptics from 'expo-haptics';
import { AccessibilityInfo } from 'react-native';
import { generateId, nowISO } from '../utils/id';
import Screen from '../components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import NoteInput from '../components/NoteInput';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LayoutAnimation, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlusFab from '../components/PlusFab';
import AnimatedChip from '../components/AnimatedChip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
function categoryAccent(cat?: string): string | undefined {
  const c = (cat || '').toLowerCase();
  if (/food|dining|restaurant|grocer/.test(c)) return '#FFC773';
  if (/transport|uber|ola|petrol|fuel/.test(c)) return '#7AC4FF';
  if (/shopping|amazon|flipkart/.test(c)) return '#E77DFF';
  if (/bills|bill|wifi|electric/.test(c)) return '#7DFF9C';
  if (/misc|other|subscriptions|health|cash/.test(c)) return '#55FFE0';
  return '#55FFE0';
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const parsed = useParseExpense(text);
  const expenses = useExpenseStore((s) => s.expenses);
  const settings = useExpenseStore((s) => s.settings);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const setSettings = useExpenseStore((s) => s.setSettings);
  const { spentPaise, budgetPaise } = useMonthlySpend();

  const [snackbar, setSnackbar] = useState<{ visible: boolean; id?: string }>(() => ({ visible: false }));
  const [budgetSheet, setBudgetSheet] = useState(false);
  const [budgetInput, setBudgetInput] = useState(
    settings.monthlyBudgetPaise ? String(Math.round(settings.monthlyBudgetPaise / 100)) : ''
  );
  const [focused, setFocused] = useState(false);
  const underline = useSharedValue(0);

  // Autosave draft
  useEffect(() => {
    AsyncStorage.setItem('draft.rawText', text).catch(() => {});
  }, [text]);

  useEffect(() => {
    (async () => {
      const draft = await AsyncStorage.getItem('draft.rawText');
      if (draft) setText(draft);
    })();
  }, []);

  const canSave = useMemo(() => parsed.amountPaise != null, [parsed.amountPaise]);

  const onSave = () => {
    if (!parsed.amountPaise) return;
    const now = nowISO();
    const expense: Expense = {
      id: generateId(),
      rawText: parsed.rawText,
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addExpense(expense);
    setText('');
    setSnackbar({ visible: true, id: expense.id });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onUndo = () => {
    if (snackbar.id) deleteExpense(snackbar.id);
    setSnackbar({ visible: false });
    AccessibilityInfo.announceForAccessibility('Undo complete');
  };

  const monthLabel = useMemo(
    () => new Date().toLocaleString('en-US', { month: 'long' }),
    []
  );

  return (
    <Screen>
      <View style={styles.headerStack}>
        <LinearGradient colors={["rgba(85,255,224,0.15)", 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.headerGlow} />
        <Text style={styles.monthLabel} accessibilityRole="header">{monthLabel}</Text>
        <View style={styles.ratioRow}>
          <Text style={styles.ratioText}>
            {budgetPaise > 0
              ? `${formatINRPaise(spentPaise)} / ${formatINRPaise(budgetPaise)} • Spent`
              : `${formatINRPaise(spentPaise)}`}
          </Text>
          <TouchableOpacity onPress={() => setBudgetSheet(true)}>
            <Text style={styles.editLink}>{budgetPaise > 0 ? 'Edit budget' : 'Set budget'}</Text>
          </TouchableOpacity>
          {budgetPaise > 0 && spentPaise > budgetPaise && (
            <View style={styles.overBadge}><Text style={styles.overBadgeText}>{`Over by ${formatINRPaise(spentPaise - budgetPaise)}`}</Text></View>
          )}
        </View>
        <View style={{ marginTop: 12 }}>
          <BudgetProgress
            spentPaise={spentPaise}
            budgetPaise={settings.monthlyBudgetPaise}
            onPress={() => setBudgetSheet(true)}
          />
        </View>
      </View>
      <View style={{ height: spacing.lg }} />

      
      <SectionList
        sections={useMemo(() => {
          const map = new Map<string, typeof expenses>();
          expenses.forEach((e) => {
            const d = dayjs(e.occurredAt);
            let key = d.format('DD MMM');
            if (d.isSame(dayjs(), 'day')) key = 'Today';
            else if (d.isSame(dayjs().subtract(1, 'day'), 'day')) key = 'Yesterday';
            const arr = map.get(key) || [];
            arr.push(e);
            map.set(key, arr);
          });
          return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
        }, [expenses])}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            onPress={() => navigation.navigate('Compose' as never, { id: item.id } as never)}
            onEdit={() => navigation.navigate('Compose' as never, { id: item.id } as never)}
            onDelete={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
              deleteExpense(item.id);
              setSnackbar({ visible: true, id: item.id });
            }}
            overBudget={settings.monthlyBudgetPaise > 0 && spentPaise > settings.monthlyBudgetPaise}
          />
        )}
        renderSectionHeader={() => <View style={{ height: 8 }} />}
        stickySectionHeadersEnabled
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingVertical: spacing.xl }}><Text style={styles.placeholder}>💸 No entries yet — log the first one!</Text></View>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity onPress={() => navigation.navigate('AllEntries' as never)}>
        <Text style={styles.link}>See all entries →</Text>
      </TouchableOpacity>

      <PlusFab onPress={() => navigation.navigate('Compose' as never)} />
      <UndoSnackbar visible={snackbar.visible} message={'Logged • Undo'} onUndo={onUndo} />
      <Modal visible={budgetSheet} transparent animationType="slide" onRequestClose={() => setBudgetSheet(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={insets.top}>
          <View style={styles.sheetBackdrop}>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
            <Text style={styles.sheetTitle}>Set monthly budget</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="e.g. 25000"
              placeholderTextColor={colors.placeholder}
              value={budgetInput}
              onChangeText={setBudgetInput}
              style={styles.sheetInput}
              keyboardAppearance="light"
                autoFocus
            />
            <View style={{ height: spacing.md }} />
            <TouchableOpacity onPress={() => { const rupees = parseInt(budgetInput || '0', 10) || 0; setSettings({ monthlyBudgetPaise: rupees * 100 }); setBudgetSheet(false); }}>
              <View style={styles.sheetButton}><Text style={styles.sheetButtonText}>Save</Text></View>
            </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  headerStack: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerGlow: { display: 'none' },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerMeta: {
    color: colors.textSecondary,
  },
  ratioRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  ratioText: { color: colors.textSecondary, fontSize: 14, marginRight: spacing.sm },
  editLink: { color: colors.accentUnder, fontSize: 13, marginLeft: spacing.sm },
  overBadge: { marginLeft: spacing.sm, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: 'rgba(255,107,107,0.15)' },
  overBadgeText: { color: colors.accentOver, fontSize: 12 },
  sectionLabel: { color: colors.textSecondary, marginBottom: spacing.md, letterSpacing: 0.5 },
  link: {
    color: colors.accentUnder,
    marginTop: spacing.lg,
  },
  input: {
    color: colors.textPrimary,
    fontSize: typography.size18,
    minHeight: 72,
    lineHeight: 24,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  chipsFaded: { opacity: 0.6 },
  noteArea: {
    borderBottomWidth: 1,
    borderColor: colors.hairline,
    paddingBottom: spacing.md,
  },
  sectionHeader: { paddingTop: 16, paddingBottom: 8, backgroundColor: colors.background },
  sectionHeaderText: { color: colors.textSecondary, fontSize: 13, letterSpacing: 0.5 },
  hairlineInset: { height: 1, backgroundColor: colors.hairline, marginLeft: 16, marginRight: 16 },
  placeholder: { color: colors.textPrimary, marginTop: spacing.lg },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, padding: spacing.xl, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderColor: colors.hairline, borderTopWidth: 1 },
  sheetTitle: { color: colors.textPrimary, fontSize: typography.size18, marginBottom: spacing.md },
  sheetInput: { color: colors.textPrimary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline, borderRadius: 12, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  sheetButton: { backgroundColor: colors.accentUnder, borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center' },
  sheetButtonText: { color: '#082A26', fontWeight: '600' },
});


