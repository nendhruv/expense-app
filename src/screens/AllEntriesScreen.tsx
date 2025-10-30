import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import MonthSwitcher from '../components/MonthSwitcher';
import FiltersRow from '../components/FiltersRow';
import ExpenseRow from '../components/ExpenseRow';
import { useExpenseStore } from '../hooks/useExpenseStore';
import dayjs from 'dayjs';
import Screen from '../components/Screen';
import { formatINRPaise } from '../utils/money';

export default function AllEntriesScreen() {
  const navigation = useNavigation();
  const [month, setMonth] = useState(new Date());
  const [filter, setFilter] = useState('All');
  const expenses = useExpenseStore((s) => s.expenses);
  const settings = useExpenseStore((s) => s.settings);

  const monthLabel = useMemo(
    () => month.toLocaleString('en-US', { month: 'long' }),
    [month]
  );

  const inMonth = useMemo(() => {
    const m0 = dayjs(month).startOf('month');
    const m1 = m0.add(1, 'month');
    return expenses.filter((e) => {
      const d = dayjs(e.occurredAt);
      const hit = !d.isBefore(m0) && d.isBefore(m1);
      if (!hit) return false;
      if (filter === 'All') return true;
      return e.category === filter;
    });
  }, [expenses, month, filter]);

  const sections = useMemo(() => {
    const map = new Map<string, typeof inMonth>();
    inMonth.forEach((e) => {
      const key = dayjs(e.occurredAt).format('DD MMM');
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    });
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [inMonth]);

  const totalPaise = useMemo(() => inMonth.reduce((s, e) => s + e.amountPaise, 0), [inMonth]);
  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{monthLabel}</Text>
        <View style={{ width: 48 }} />
      </View>

      <MonthSwitcher value={month} onChange={(delta) => setMonth(dayjs(month).add(delta, 'month').toDate())} />
      <FiltersRow value={filter} onChange={setFilter} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseRow expense={item} overBudget={settings.monthlyBudgetPaise > 0 && totalPaise > settings.monthlyBudgetPaise} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title.toUpperCase()}</Text></View>
        )}
        ItemSeparatorComponent={() => <View style={styles.hairlineInset} />}
        stickySectionHeadersEnabled
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingVertical: spacing.xl }}><Text style={styles.placeholder}>💸 No entries this month — log the first one!</Text></View>}
        contentContainerStyle={{ paddingVertical: spacing.md }}
        ListFooterComponent={() => (
          <View style={styles.footer}><Text style={styles.footerText}>{`Total: ${formatINRPaise(totalPaise)} • ${inMonth.length} entries`}</Text></View>
        )}
      />
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
  placeholder: { color: colors.textPrimary, marginTop: spacing.lg },
  sectionHeader: { paddingTop: 16, paddingBottom: 8, backgroundColor: colors.background },
  sectionHeaderText: { color: colors.textSecondary, fontSize: 13, letterSpacing: 0.5 },
  hairlineInset: { height: 1, backgroundColor: colors.hairline, marginLeft: 16, marginRight: 16 },
  footer: { paddingVertical: spacing.lg },
  footerText: { color: colors.textSecondary },
});


