import { create } from 'zustand';
import { Transaction, Budget, Category, SavingsGoal, Liability, RecurringTransaction } from '../types';
import { transactionService } from '../services/transaction.service';
import { budgetService } from '../services/budget.service';
import { financialService } from '../services/financial.service';
import { databaseService } from '../services/database.service';
import { useAuthStore } from './useAuthStore';
import { useWalletStore } from './useWalletStore';
import { useGamificationStore } from './useGamificationStore';
import { STANDARD_CATEGORIES, ELITE_UPGRADES } from '../constants/categories';

export const INITIAL_CATEGORIES: Category[] = STANDARD_CATEGORIES.map((c, i) => ({ ...c, id: (i + 1).toString() })) as Category[];

interface FinancialState {
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

  addTransaction: (newTx: Omit<Transaction, 'id' | 'timestamp' | 'date' | 'time'> & { date?: string; time?: string; timestamp?: number }) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  updateBudgetWallets: (category: string, walletIds: string[]) => Promise<void>;
  updateBudgetLimit: (category: string, limit: number) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'spent'>) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number, walletId?: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addLiability: (liability: Omit<Liability, 'id'>) => Promise<void>;
  updateLiability: (id: string, updates: Partial<Liability>) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  payLiability: (id: string, amount: number, walletId?: string) => Promise<void>;

  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  upgradeToEliteCategories: () => Promise<void>;
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

  addTransaction: async (newTx) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;

    await transactionService.addTransaction(newTx as any, profileId);
    
    const [updatedTransactions, updatedLiabilities, updatedGoals] = await Promise.all([
      transactionService.getTransactions(profileId),
      financialService.getLiabilities(profileId),
      financialService.getSavingsGoals(profileId)
    ]);
    
    // Wallets reload
    const walletStore = useWalletStore.getState();
    await walletStore.reloadWallets(profileId);
    
    set({
      transactions: updatedTransactions,
      liabilities: updatedLiabilities,
      savingsGoals: updatedGoals
    });

    useGamificationStore.getState().syncGamification(profileId);
  },

  updateTransaction: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;

    await transactionService.updateTransaction(id, updates, get().transactions);
    
    const updatedTransactions = await transactionService.getTransactions(profileId);
    await useWalletStore.getState().reloadWallets(profileId);
    
    set({ transactions: updatedTransactions });
    useGamificationStore.getState().syncGamification(profileId);
  },

  deleteTransaction: async (id) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;

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

    useGamificationStore.getState().syncGamification(profileId);
  },

  updateBudgetWallets: async (category, walletIds) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await budgetService.updateBudgetWallets(category, walletIds);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  updateBudgetLimit: async (category, limit) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await budgetService.updateBudgetLimit(category, limit);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  addBudget: async (budget) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await budgetService.addOrUpdateBudget({ ...budget, spent: 0 }, profileId);
    set({ budgets: await budgetService.getBudgets(profileId) });
  },

  deleteBudget: async (category) => {
    await budgetService.deleteBudget(category);
    set(state => ({ budgets: state.budgets.filter(b => b.category !== category) }));
  },

  addSavingsGoal: async (goal) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await financialService.addSavingsGoal(goal, profileId);
    const updated = await financialService.getSavingsGoals(profileId);
    set({ savingsGoals: updated });
    useGamificationStore.getState().syncGamification(profileId);
  },

  updateSavingsGoal: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await financialService.updateSavingsGoal(id, updates);
    const updated = await financialService.getSavingsGoals(profileId);
    set({ savingsGoals: updated });
    useGamificationStore.getState().syncGamification(profileId);
  },

  deleteSavingsGoal: async (id) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await databaseService.run('DELETE FROM savings_goals WHERE id = ?', [id]);
    const updated = get().savingsGoals.filter(g => g.id !== id);
    set({ savingsGoals: updated });
    useGamificationStore.getState().syncGamification(profileId);
  },

  contributeToGoal: async (goalId, amount, walletId) => {
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
      });
    } else {
      const profileId = useAuthStore.getState().currentUser?.id;
      if (!profileId) return;
      const goal = get().savingsGoals.find(g => g.id === goalId);
      if (goal) {
        const newCurrent = goal.current + amount;
        await financialService.updateSavingsGoal(goalId, { 
          current: newCurrent, 
          isCompleted: newCurrent >= goal.target 
        });
        const updatedGoals = await financialService.getSavingsGoals(profileId);
        set({ savingsGoals: updatedGoals });
        useGamificationStore.getState().syncGamification(profileId);
      }
    }
  },

  addCategory: async (category) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await financialService.addCategory(category, profileId);
    set({ categories: await financialService.getCategories(profileId) });
  },

  updateCategory: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    
    if (updates.name) {
      const oldName = get().categories.find(cat => cat.id === id)?.name;
      if (oldName && oldName !== updates.name) {
        await databaseService.executeSet([
          { statement: 'UPDATE transactions SET category = ? WHERE category = ?', values: [updates.name, oldName] },
          { statement: 'UPDATE budgets SET category = ? WHERE category = ?', values: [updates.name, oldName] }
        ]);
      }
    }

    const entries = Object.entries(updates);
    if (entries.length > 0) {
      const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
      const values = entries.map(([key, value]) => key === 'subcategories' ? JSON.stringify(value) : value);
      await databaseService.run(`UPDATE categories SET ${setClause} WHERE id = ?`, [...values, id]);
    }

    const [updatedCats, updatedTxs, updatedBudgets] = await Promise.all([
      financialService.getCategories(profileId),
      transactionService.getTransactions(profileId),
      budgetService.getBudgets(profileId)
    ]);
    
    set({ categories: updatedCats, transactions: updatedTxs, budgets: updatedBudgets });
  },

  upgradeToEliteCategories: async () => {
    const { categories, updateCategory } = get();
    const { tierData } = useGamificationStore.getState();

    if (tierData.level < 4) return; // Need at least Platinum

    for (const cat of categories) {
      const upgrade = ELITE_UPGRADES[cat.name];
      if (upgrade) {
        await updateCategory(cat.id, upgrade);
      }
    }
  },

  deleteCategory: async (id) => {
    await databaseService.run('DELETE FROM categories WHERE id = ?', [id]);
    set(state => ({ categories: state.categories.filter(cat => cat.id !== id) }));
  },

  addLiability: async (liability) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await financialService.addLiability(liability, profileId);
    set({ liabilities: await financialService.getLiabilities(profileId) });
  },

  updateLiability: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    const entries = Object.entries(updates);
    if (entries.length > 0) {
      const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
      const values = entries.map(([, value]) => value);
      await databaseService.run(`UPDATE liabilities SET ${setClause} WHERE id = ?`, [...values, id]);
    }
    set({ liabilities: await financialService.getLiabilities(profileId) });
  },

  deleteLiability: async (id) => {
    await databaseService.run('DELETE FROM liabilities WHERE id = ?', [id]);
    set(state => ({ liabilities: state.liabilities.filter(l => l.id !== id) }));
  },

  payLiability: async (id, amount, walletId) => {
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
        liabilityId: id
      });
    } else {
      const profileId = useAuthStore.getState().currentUser?.id;
      if (!profileId) return;
      await databaseService.run(
        'UPDATE liabilities SET remainingAmount = MAX(0, remainingAmount - ?) WHERE id = ?',
        [amount, id]
      );
      set({ liabilities: await financialService.getLiabilities(profileId) });
    }
  },

  addRecurringTransaction: async (recurring) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    const newRecurring = { ...recurring, id: crypto.randomUUID() };
    await databaseService.run(
      'INSERT INTO recurring_transactions (id, name, amount, type, category, frequency, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newRecurring.id, newRecurring.name, newRecurring.amount, newRecurring.type, newRecurring.category, newRecurring.frequency, profileId]
    );
    set(state => ({ recurringTransactions: [...state.recurringTransactions, newRecurring] }));
  },

  updateRecurringTransaction: async (id, updates) => {
    const entries = Object.entries(updates);
    if (entries.length > 0) {
      const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
      const values = entries.map(([, value]) => value);
      await databaseService.run(`UPDATE recurring_transactions SET ${setClause} WHERE id = ?`, [...values, id]);
    }
    set(state => ({
      recurringTransactions: state.recurringTransactions.map(rec => rec.id === id ? { ...rec, ...updates } : rec)
    }));
  },

  deleteRecurringTransaction: async (id) => {
    await databaseService.run('DELETE FROM recurring_transactions WHERE id = ?', [id]);
    set(state => ({ recurringTransactions: state.recurringTransactions.filter(rec => rec.id !== id) }));
  }
}));
