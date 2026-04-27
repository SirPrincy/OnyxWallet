import { create } from 'zustand';
import { Transaction, Budget, Category, SavingsGoal, Liability, RecurringTransaction, GoalContribution } from '../types';
import { transactionService } from '../services/transaction.service';
import { budgetService } from '../services/budget.service';
import { financialService } from '../services/financial.service';
import { databaseService } from '../services/database.service';
import { useAuthStore } from './useAuthStore';
import { useWalletStore } from './useWalletStore';
import { useGamificationStore } from './useGamificationStore';
import { STANDARD_CATEGORIES, ELITE_UPGRADES } from '../constants/categories';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const INITIAL_CATEGORIES: Category[] = STANDARD_CATEGORIES.map((c, i) => ({ ...c, id: (i + 1).toString() })) as Category[];

const getCurrency = () => useAuthStore.getState().currentUser?.currency;

export interface FinancialState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
  liabilities: Liability[];
  recurringTransactions: RecurringTransaction[];

  setTransactions: (t: Transaction[]) => void;
  setBudgets: (b: Budget[]) => void;
  setCategories: (c: Category[]) => void;
  setSavingsGoals: (s: SavingsGoal[]) => void;
  setLiabilities: (l: Liability[]) => void;
  setRecurringTransactions: (r: RecurringTransaction[]) => void;

  addTransaction: (newTx: Omit<Transaction, 'id' | 'timestamp' | 'date' | 'time'> & { date?: string; time?: string; timestamp?: number }, profileId: string) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>, profileId: string) => Promise<void>;
  deleteTransaction: (id: string, profileId: string) => Promise<void>;
  
  updateBudgetWallets: (category: string, walletIds: string[], profileId: string) => Promise<void>;
  updateBudgetLimit: (category: string, limit: number, profileId: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'spent'>, profileId: string) => Promise<void>;
  deleteBudget: (category: string, profileId: string) => Promise<void>;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>, profileId: string) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>, profileId: string) => Promise<void>;
  deleteSavingsGoal: (id: string, profileId: string) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number, profileId: string, walletId?: string) => Promise<void>;
  getGoalHistory: (goalId: string) => Promise<GoalContribution[]>;

  addCategory: (category: Omit<Category, 'id'>, profileId: string) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>, profileId: string) => Promise<void>;
  deleteCategory: (id: string, profileId: string) => Promise<void>;

  addLiability: (liability: Omit<Liability, 'id'>, profileId: string) => Promise<void>;
  updateLiability: (id: string, updates: Partial<Liability>, profileId: string) => Promise<void>;
  deleteLiability: (id: string, profileId: string) => Promise<void>;
  payLiability: (id: string, amount: number, profileId: string, walletId?: string, interestAmount?: number) => Promise<void>;

  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>, profileId: string) => Promise<void>;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>, profileId: string) => Promise<void>;
  deleteRecurringTransaction: (id: string, profileId: string) => Promise<void>;
  upgradeToEliteCategories: (profileLevel: number, profileId: string) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  budgets: [],
  categories: INITIAL_CATEGORIES,
  savingsGoals: [],
  liabilities: [],
  recurringTransactions: [],

  setTransactions: (t) => set({ transactions: t }),
  setBudgets: (b) => set({ budgets: b }),
  setCategories: (c) => set({ categories: c }),
  setSavingsGoals: (s) => set({ savingsGoals: s }),
  setLiabilities: (l) => set({ liabilities: l }),
  setRecurringTransactions: (r) => set({ recurringTransactions: r }),

  addTransaction: async (newTx, profileId) => {
    // 1. Sensorial Feedback
    Haptics.impact({ style: ImpactStyle.Light });
    const { audioService } = await import('../services/audio.service');
    audioService.playSuccess();

    // 2. Optimistic Update
    const now = new Date();
    const tempId = crypto.randomUUID();
    const optimisticTx: Transaction = {
      id: tempId,
      title: newTx.title,
      category: newTx.category,
      subcategory: newTx.subcategory,
      subcategoryIcon: newTx.subcategoryIcon,
      amount: newTx.amount,
      type: newTx.type,
      date: newTx.date || 'Today',
      time: newTx.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      icon: newTx.icon,
      timestamp: newTx.timestamp || now.getTime(),
      walletId: newTx.walletId,
      liabilityId: newTx.liabilityId,
      goalId: newTx.goalId,
    };

    const previousTransactions = get().transactions;
    const previousLiabilities = get().liabilities;
    const previousGoals = get().savingsGoals;

    set({ transactions: [optimisticTx, ...previousTransactions] });

    try {
      // 3. Database Sync
      await transactionService.addTransaction(newTx as any, profileId);

      // Auto-Allocation Logic
      if (newTx.type === 'income') {
        const goals = get().savingsGoals;
        const incomeAmount = newTx.amount;

        for (const goal of goals) {
          if (goal.autoAllocationPercent && goal.autoAllocationPercent > 0 && !goal.isCompleted) {
            const allocationAmount = (incomeAmount * goal.autoAllocationPercent) / 100;
            if (allocationAmount > 0) {
              const newCurrent = goal.current + allocationAmount;
              await financialService.updateSavingsGoal(goal.id, {
                current: newCurrent,
                isCompleted: newCurrent >= goal.target
              });

              await financialService.addGoalContribution({
                goalId: goal.id,
                amount: allocationAmount,
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now(),
                walletId: newTx.walletId
              }, profileId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      set({ transactions: previousTransactions, liabilities: previousLiabilities, savingsGoals: previousGoals });
    }

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  updateTransaction: async (id, updates, profileId) => {
    await transactionService.updateTransaction(id, updates, get().transactions);
    
    const updatedTransactions = await transactionService.getTransactions(profileId);
    await useWalletStore.getState().reloadWallets(profileId);
    
    set({ transactions: updatedTransactions });

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  deleteTransaction: async (id, profileId) => {
    Haptics.impact({ style: ImpactStyle.Medium });
    const { audioService } = await import('../services/audio.service');
    audioService.playAction();

    await transactionService.deleteTransaction(id, get().transactions);
    
    const [updatedTransactions, updatedLiabilities, updatedGoals] = await Promise.all([
      transactionService.getTransactions(profileId),
      financialService.getLiabilities(profileId),
      financialService.getSavingsGoals(profileId)
    ]);
    
    await useWalletStore.getState().reloadWallets(profileId);
    
    set({
      transactions: updatedTransactions,
      liabilities: updatedLiabilities,
      savingsGoals: updatedGoals
    });

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  updateBudgetWallets: async (category, walletIds, profileId) => {
    await budgetService.updateBudgetWallets(category, walletIds);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  updateBudgetLimit: async (category, limit, profileId) => {
    await budgetService.updateBudgetLimit(category, limit);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  addBudget: async (budget, profileId) => {
    await budgetService.addOrUpdateBudget({ ...budget, spent: 0 }, profileId);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  deleteBudget: async (category, profileId) => {
    await budgetService.deleteBudget(category);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  addSavingsGoal: async (goal, profileId) => {
    await financialService.addSavingsGoal(goal, profileId);
    const updated = await financialService.getSavingsGoals(profileId);
    set({ savingsGoals: updated });

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  updateSavingsGoal: async (id, updates, profileId) => {
    await financialService.updateSavingsGoal(id, updates);
    const updated = await financialService.getSavingsGoals(profileId);
    set({ savingsGoals: updated });

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  deleteSavingsGoal: async (id, profileId) => {
    await financialService.deleteSavingsGoal(id);
    const updated = get().savingsGoals.filter(g => g.id !== id);
    set({ savingsGoals: updated });

    const gamStore = useGamificationStore.getState();
    const profileCurrency = getCurrency();
    await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
  },

  getGoalHistory: async (goalId) => {
    return await financialService.getGoalContributions(goalId);
  },

  contributeToGoal: async (goalId, amount, profileId, walletId) => {
    if (walletId) {
      const goal = get().savingsGoals.find(g => g.id === goalId);
      await get().addTransaction({
        title: `Injection: ${goal?.title || 'Savings Goal'}`,
        amount: -amount,
        type: 'expense',
        category: 'Transfer',
        walletId: walletId,
        icon: 'swap_horiz',
        goalId: goalId
      }, profileId);
    } else {
      const goal = get().savingsGoals.find(g => g.id === goalId);
      if (goal) {
        const newCurrent = goal.current + amount;
        await financialService.updateSavingsGoal(goalId, { 
          current: newCurrent, 
          isCompleted: newCurrent >= goal.target 
        });
        const updatedGoals = await financialService.getSavingsGoals(profileId);
        set({ savingsGoals: updatedGoals });

        const gamStore = useGamificationStore.getState();
        const profileCurrency = getCurrency();
        await gamStore.syncGamification(profileId, profileCurrency, (level) => get().upgradeToEliteCategories(level, profileId));
      }
    }
  },

  addCategory: async (category, profileId) => {
    await financialService.addCategory(category, profileId);
    set({ categories: await financialService.getCategories(profileId) });
  },

  updateCategory: async (id, updates, profileId) => {
    if (updates.name) {
      const oldName = get().categories.find(cat => cat.id === id)?.name;
      if (oldName && oldName !== updates.name) {
        await financialService.renameCategoryInRelatedTables(oldName, updates.name);
      }
    }

    await financialService.updateCategory(id, updates);

    const [updatedCats, updatedTxs, updatedBudgets] = await Promise.all([
      financialService.getCategories(profileId),
      transactionService.getTransactions(profileId),
      budgetService.getBudgets(profileId)
    ]);
    
    set({ categories: updatedCats, transactions: updatedTxs, budgets: updatedBudgets });
  },

  upgradeToEliteCategories: async (profileLevel, profileId) => {
    const { categories, updateCategory } = get();
    if (profileLevel < 4) return; // Need at least Platinum

    for (const cat of categories) {
      const upgrade = ELITE_UPGRADES[cat.name];
      if (upgrade) {
        await updateCategory(cat.id, upgrade, profileId);
      }
    }
  },

  deleteCategory: async (id, profileId) => {
    await financialService.deleteCategory(id);
    set({ categories: await financialService.getCategories(profileId) });
  },

  addLiability: async (liability, profileId) => {
    const newLiability = await financialService.addLiability(liability, profileId);
    set({ liabilities: await financialService.getLiabilities(profileId) });

    const { notificationService } = await import('../services/notification.service');
    await notificationService.scheduleLiabilityReminder(newLiability);
  },

  updateLiability: async (id, updates, profileId) => {
    await financialService.updateLiability(id, updates);
    const updatedLiabilities = await financialService.getLiabilities(profileId);
    set({ liabilities: updatedLiabilities });

    const liability = updatedLiabilities.find(l => l.id === id);
    if (liability) {
      const { notificationService } = await import('../services/notification.service');
      await notificationService.scheduleLiabilityReminder(liability);
    }
  },

  deleteLiability: async (id, profileId) => {
    await financialService.deleteLiability(id);
    set({ liabilities: await financialService.getLiabilities(profileId) });

    const { notificationService } = await import('../services/notification.service');
    await notificationService.cancelLiabilityReminders(id);
  },

  payLiability: async (id, amount, profileId, walletId, interestAmount) => {
    if (walletId) {
      const liability = get().liabilities.find(l => l.id === id);
      await get().addTransaction({
        title: `Debt Payment: ${liability?.name || 'Unknown'}`,
        amount: -amount,
        type: 'expense',
        category: 'Debt Repayment',
        subcategory: 'Liability',
        subcategoryIcon: 'credit_card',
        walletId: walletId,
        icon: 'credit_card',
        liabilityId: id,
        interestAmount: interestAmount || 0
      }, profileId);

      const updatedLiabilities = await financialService.getLiabilities(profileId);
      set({ liabilities: updatedLiabilities });
    } else {
      await financialService.payLiability(id, amount);
      set({ liabilities: await financialService.getLiabilities(profileId) });
    }
  },

  addRecurringTransaction: async (recurring, profileId) => {
    const newRecurring = await financialService.addRecurringTransaction(recurring, profileId);
    set(state => ({ recurringTransactions: [...state.recurringTransactions, newRecurring] }));
  },

  updateRecurringTransaction: async (id, updates, profileId) => {
    await financialService.updateRecurringTransaction(id, updates);
    const updated = await financialService.getRecurringTransactions(profileId);
    set({ recurringTransactions: updated });
  },

  deleteRecurringTransaction: async (id, profileId) => {
    await financialService.deleteRecurringTransaction(id);
    const updated = await financialService.getRecurringTransactions(profileId);
    set({ recurringTransactions: updated });
  }
}));
