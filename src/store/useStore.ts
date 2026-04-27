import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Income, Expense, Task } from '../types';
import type { Lang } from '../i18n/translations';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface StoreState {
  incomes: Income[];
  expenses: Expense[];
  tasks: Task[];
  dateFrom: string;
  dateTo: string;
  onboardingDone: boolean;
  language: Lang;
  navStyle: 'icons' | 'pill' | 'labels';

  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  deleteIncomeGroup: (groupId: string) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  deleteExpenseGroup: (groupId: string) => void;

  addTask: (text: string, insightId?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  setDateRange: (from: string, to: string) => void;
  setOnboardingDone: () => void;
  setLanguage: (lang: Lang) => void;
  setNavStyle: (style: 'icons' | 'pill' | 'labels') => void;

  filteredIncomes: () => Income[];
  filteredExpenses: () => Expense[];
  totalIncome: () => number;
  totalExpenses: () => number;
  freeMoney: () => number;
  pendingIncome: () => number;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const now = new Date();
const defaultFrom = format(startOfMonth(now), 'yyyy-MM-dd');
const defaultTo = format(endOfMonth(now), 'yyyy-MM-dd');

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      incomes: [],
      expenses: [],
      tasks: [],
      dateFrom: defaultFrom,
      dateTo: defaultTo,
      onboardingDone: false,
      language: 'en',
      navStyle: 'icons',

      addIncome: (income) =>
        set((s) => ({ incomes: [...s.incomes, { ...income, id: uid() }] })),
      updateIncome: (id, income) =>
        set((s) => ({ incomes: s.incomes.map((i) => (i.id === id ? { ...i, ...income } : i)) })),
      deleteIncome: (id) =>
        set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),
      deleteIncomeGroup: (groupId) =>
        set((s) => ({ incomes: s.incomes.filter((i) => i.recurringGroupId !== groupId) })),

      addExpense: (expense) =>
        set((s) => ({ expenses: [...s.expenses, { ...expense, id: uid() }] })),
      updateExpense: (id, expense) =>
        set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)) })),
      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      deleteExpenseGroup: (groupId) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.recurringGroupId !== groupId) })),

      addTask: (text, insightId) =>
        set((s) => ({
          tasks: [...s.tasks, { id: uid(), text, done: false, insightId, createdAt: new Date().toISOString() }],
        })),
      toggleTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
      setOnboardingDone: () => set({ onboardingDone: true }),
      setLanguage: (lang) => set({ language: lang }),
      setNavStyle: (style) => set({ navStyle: style }),

      filteredIncomes: () => {
        const { incomes, dateFrom, dateTo } = get();
        return incomes.filter((i) => i.date >= dateFrom && i.date <= dateTo);
      },
      filteredExpenses: () => {
        const { expenses, dateFrom, dateTo } = get();
        return expenses.filter((e) => e.date >= dateFrom && e.date <= dateTo);
      },
      totalIncome: () => get().filteredIncomes().filter((i) => i.status === 'received').reduce((s, i) => s + i.amount, 0),
      totalExpenses: () => get().filteredExpenses().reduce((s, e) => s + e.amount, 0),
      freeMoney: () => get().totalIncome() - get().totalExpenses(),
      pendingIncome: () => get().filteredIncomes().filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    }),
    {
      name: 'calm-money-store',
      // dateFrom/dateTo are NOT persisted — always reset to current month on load
      partialize: (state) => ({
        incomes: state.incomes,
        expenses: state.expenses,
        tasks: state.tasks,
        onboardingDone: state.onboardingDone,
        language: state.language,
        navStyle: state.navStyle,
      }),
    }
  )
);
