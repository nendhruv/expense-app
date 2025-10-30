import { useMemo } from 'react';
import { useExpenseStore } from './useExpenseStore';
import dayjs from 'dayjs';

export function useMonthlySpend(targetDate: Date = new Date()) {
  const expenses = useExpenseStore((s) => s.expenses);
  const settings = useExpenseStore((s) => s.settings);

  return useMemo(() => {
    const month = dayjs(targetDate).startOf('month');
    const next = month.add(1, 'month');
    const inMonth = expenses.filter((e) => {
      const d = dayjs(e.occurredAt);
      return !d.isBefore(month) && d.isBefore(next);
    });
    const spentPaise = inMonth.reduce((sum, e) => sum + (e.amountPaise || 0), 0);
    return { expenses: inMonth, spentPaise, budgetPaise: settings.monthlyBudgetPaise };
  }, [expenses, settings, targetDate]);
}


