import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Monetary invariant: store as paise
export type Currency = 'INR';
export type Method =
  | 'UPI'
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'NetBanking'
  | 'Wallet'
  | 'Other';

export type Settings = {
  monthlyBudgetPaise: number; // 0 = not set
  tz: 'Asia/Kolkata';
  currency: Currency; // 'INR'
  aiAssist: boolean; // default false
};

export type Expense = {
  id: string;
  rawText: string;
  amountPaise: number;
  currency: Currency; // 'INR'
  merchant?: string;
  category: string; // default 'Misc'
  method?: Method;
  note?: string;
  occurredAt: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type UserMap = { term: string; category: string; lastUsedAt: string };

type State = {
  settings: Settings;
  expenses: Expense[];
  userMap: UserMap[];
};

type Actions = {
  setSettings: (updater: Partial<Settings>) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  learnCategory: (term: string, category: string, tsISO: string) => void;
};

const zustandStorage = createJSONStorage<State>(() => AsyncStorage);

export const useExpenseStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      settings: { monthlyBudgetPaise: 0, tz: 'Asia/Kolkata', currency: 'INR', aiAssist: false },
      expenses: [],
      userMap: [],

      setSettings: (updater) => set((s) => ({ settings: { ...s.settings, ...updater } })),

      addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),

      updateExpense: (expense) =>
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === expense.id ? expense : e)),
        })),

      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      learnCategory: (term, category, tsISO) =>
        set((s) => {
          const lower = term.toLowerCase();
          const existing = s.userMap.find((m) => m.term === lower);
          if (existing) {
            existing.category = category;
            existing.lastUsedAt = tsISO;
            return { userMap: [...s.userMap] };
          }
          return { userMap: [{ term: lower, category, lastUsedAt: tsISO }, ...s.userMap] };
        }),
    }),
    {
      name: 'expense-app-store',
      storage: zustandStorage,
      version: 1,
      partialize: (state) => ({ settings: state.settings, expenses: state.expenses, userMap: state.userMap }),
    }
  )
);


