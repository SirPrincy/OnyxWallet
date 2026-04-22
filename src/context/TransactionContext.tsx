import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../services/database.service';
import { settingsService } from '../services/settings.service';
import { migrationService } from '../services/migration.service';
import { transactionService } from '../services/transaction.service';
import { walletService } from '../services/wallet.service';
import { budgetService } from '../services/budget.service';
import { financialService } from '../services/financial.service';
import { gamificationService } from '../services/gamification.service';
import { profileService } from '../services/profile.service';
import { 
  Transaction, Budget, Wallet, Liability, Mission, Achievement, 
  SavingsGoal, Category, RecurringTransaction, TierData 
} from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  wallets: Wallet[];
  liabilities: Liability[];
  recurringTransactions: RecurringTransaction[];
  savingsGoals: SavingsGoal[];
  missions: Mission[];
  achievements: Achievement[];
  updateMission: (id: string, progress: number, total: number, level?: number, description?: string) => Promise<void>;
  updateAchievement: (id: string, earned: boolean) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'date' | 'time'> & { date?: string; time?: string; timestamp?: number }) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudgetWallets: (category: string, walletIds: string[]) => void;
  updateBudgetLimit: (category: string, limit: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number, walletId?: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  reorderWallets: (newWallets: Wallet[]) => void;
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  updateLiability: (id: string, updates: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  payLiability: (id: string, amount: number, walletId?: string) => void;
  profiles: any[];
  addProfile: (profile: any) => Promise<void>;
  isPasscodeEnabled: boolean;
  setIsPasscodeEnabled: (enabled: boolean) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  hasCompletedSetup: boolean;
  completeSetup: () => Promise<void>;
  currentUser: any | null;
  isAuthenticated: boolean;
  login: (profile: any) => Promise<void>;
  logout: () => Promise<void>;
  hashPasscode: (plain: string) => Promise<string>;
  isLoading: boolean;
  addBudget: (budget: Omit<Budget, 'spent'>) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  totalLiquidity: number;
  xp: number;
  tierData: TierData;
}


const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Luxury Goods', icon: 'shopping_bag', color: '#B4947C', type: 'expense', subcategories: [{ name: 'Watches', icon: 'award' }, { name: 'Jewelry', icon: 'diamond' }, { name: 'Apparel', icon: 'shopping_bag' }] },
  { id: '2', name: 'Tech', icon: 'smartphone', color: '#60A5FA', type: 'expense', subcategories: [{ name: 'Hardware', icon: 'smartphone' }, { name: 'Software', icon: 'code' }, { name: 'Gadgets', icon: 'cpu' }] },
  { id: '3', name: 'Dining', icon: 'restaurant', color: '#F87171', type: 'expense', subcategories: [{ name: 'Fine Dining', icon: 'utensils' }, { name: 'Bar & Spirits', icon: 'glass-water' }, { name: 'Casual', icon: 'coffee' }] },
  { id: '4', name: 'Salary', icon: 'banknote', color: '#34D399', type: 'income', subcategories: [{ name: 'Regular Salary', icon: 'banknote' }, { name: 'Bonus', icon: 'sparkles' }, { name: 'Dividend', icon: 'trending-up' }, { name: 'Commissions', icon: 'award' }, { name: 'Tips', icon: 'heart' }, { name: 'Overtime', icon: 'clock' }] },
  { id: '5', name: 'Private Aviation', icon: 'plane', color: '#A78BFA', type: 'expense', subcategories: [{ name: 'Fuel', icon: 'fuel' }, { name: 'Maintenance', icon: 'settings' }, { name: 'Charter', icon: 'plane' }] },
  { id: '6', name: 'Transport', icon: 'car', color: '#FBBF24', type: 'expense', subcategories: [{ name: 'Uber Premium', icon: 'car' }, { name: 'Private Driver', icon: 'user-check' }, { name: 'Gasoline', icon: 'fuel' }] },
  { id: '7', name: 'Hospitality', icon: 'hotel', color: '#F472B6', type: 'expense', subcategories: [{ name: 'Hotels', icon: 'hotel' }, { name: 'Resorts', icon: 'palmtree' }, { name: 'Vacation Rental', icon: 'home' }] },
  { id: '8', name: 'Investment', icon: 'trending-up', color: '#10B981', type: 'income', subcategories: [{ name: 'Stocks', icon: 'bar-chart' }, { name: 'Real Estate', icon: 'building' }, { name: 'Crypto', icon: 'bitcoin' }, { name: 'Bonds', icon: 'activity' }, { name: 'Interest', icon: 'payments' }] },
  { id: '9', name: 'Lifestyle', icon: 'heart', color: '#EC4899', type: 'expense', subcategories: [{ name: 'Wellness', icon: 'heart' }, { name: 'Concierge', icon: 'user' }, { name: 'Health', icon: 'activity' }] },
  { id: '10', name: 'Fine Dining', icon: 'utensils', color: '#EF4444', type: 'expense', subcategories: [{ name: 'Michelin Star', icon: 'star' }, { name: 'Private Chef', icon: 'utensils' }] },
  { id: '11', name: 'First Class Travel', icon: 'award', color: '#8B5CF6', type: 'expense', subcategories: [{ name: 'Aviation', icon: 'plane' }, { name: 'Executive Lounge', icon: 'sofa' }] },
  { id: '12', name: 'Business', icon: 'briefcase', color: '#3B82F6', type: 'income', subcategories: [{ name: 'Revenue', icon: 'trending-up' }, { name: 'Consulting', icon: 'user-check' }, { name: 'Sales', icon: 'shopping_bag' }, { name: 'Services', icon: 'briefcase' }] },
  { id: '13', name: 'Real Estate', icon: 'building', color: '#F59E0B', type: 'income', subcategories: [{ name: 'Rental', icon: 'home' }, { name: 'Sale', icon: 'building' }, { name: 'Commercial', icon: 'building' }] },
  { id: '14', name: 'Consulting', icon: 'user-check', color: '#8B5CF6', type: 'income', subcategories: [{ name: 'Retainer', icon: 'briefcase' }, { name: 'Hourly', icon: 'clock' }, { name: 'Project Base', icon: 'award' }] },
  { id: '15', name: 'Gifts', icon: 'heart', color: '#EC4899', type: 'income', subcategories: [{ name: 'Family', icon: 'heart' }, { name: 'Donation', icon: 'star' }] }
];


export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isPasscodeEnabled, setIsPasscodeEnabledState] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalLiquidity = React.useMemo(() => {
    return wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
  }, [wallets]);

  const xp = React.useMemo(() => {
    const xpFromLiquidity = Math.max(0, totalLiquidity) / 10;
    const xpFromTx = transactions.length * 50;
    const xpFromGoals = savingsGoals.filter(g => g.current >= g.target).length * 500;
    return xpFromLiquidity + xpFromTx + xpFromGoals;
  }, [totalLiquidity, transactions.length, savingsGoals]);

  const tierData = React.useMemo(() => {
    const TIERS = [
      { level: 1, name: 'Bronze', threshold: 0 },
      { level: 2, name: 'Silver', threshold: 5000 },
      { level: 3, name: 'Gold', threshold: 15000 },
      { level: 4, name: 'Platinum', threshold: 50000 },
      { level: 5, name: 'Diamond', threshold: 150000 },
      { level: 6, name: 'Archon', threshold: 500000 }
    ];
    let currentTier = TIERS[0];
    let next = TIERS[1];
    
    for (let i = 0; i < TIERS.length; i++) {
      if (xp >= TIERS[i].threshold) {
        currentTier = TIERS[i];
        next = TIERS[i+1] || TIERS[i];
      }
    }
    
    let progress = 100;
    let left = 0;
    if (currentTier !== next) {
      const range = next.threshold - currentTier.threshold;
      const currentXPInTier = xp - currentTier.threshold;
      progress = (currentXPInTier / range) * 100;
      left = next.threshold - xp;
    }

    return {
      tierName: currentTier.name,
      level: currentTier.level,
      progressPercent: Math.min(100, Math.max(0, progress)),
      xpLeft: left,
      nextTier: next.name
    };
  }, [xp]);

  const loadUserData = async (profileId: string) => {
    try {
      const [
        walletsData,
        transactionsData,
        budgetsData,
        goalsData,
        categoriesData,
        liabilitiesData,
        missionsData,
        achievementsData
      ] = await Promise.all([
        walletService.getWallets(profileId),
        transactionService.getTransactions(profileId),
        budgetService.getBudgets(profileId),
        financialService.getSavingsGoals(profileId),
        financialService.getCategories(profileId),
        financialService.getLiabilities(profileId),
        financialService.getMissions(profileId),
        financialService.getAchievements(profileId)
      ]);

      setWallets(walletsData);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setSavingsGoals(goalsData);
      setCategories(categoriesData.length > 0 ? categoriesData : INITIAL_CATEGORIES);
      setLiabilities(liabilitiesData);
      
      const recurringRes = await databaseService.query('SELECT * FROM recurring_transactions WHERE profileId = ?', [profileId]);
      setRecurringTransactions(recurringRes.values || []);

      if (missionsData.length > 0) setMissions(missionsData);
      if (achievementsData.length > 0) setAchievements(achievementsData);
      
      await databaseService.saveToStore();
      await syncGamification(profileId, { wallets: walletsData, transactions: transactionsData, savingsGoals: goalsData });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const syncGamification = async (profileId: string, currentData?: { wallets: Wallet[], transactions: Transaction[], savingsGoals: SavingsGoal[] }) => {
    const data = currentData || { wallets, transactions, savingsGoals };
    const missionUpdates = gamificationService.evaluateMissions(data, missions);
    const achievementUpdates = gamificationService.evaluateAchievements(data, achievements);
    
    let needsRefresh = false;
    if (missionUpdates.length > 0) {
      for (const update of missionUpdates) {
        await financialService.updateMission(update.id, update);
      }
      needsRefresh = true;
    }
    if (achievementUpdates.length > 0) {
      for (const id of achievementUpdates) {
        await financialService.updateAchievement(id, true);
      }
      needsRefresh = true;
    }
    
    if (needsRefresh) {
      const [m, a] = await Promise.all([
        financialService.getMissions(profileId),
        financialService.getAchievements(profileId)
      ]);
      setMissions(m);
      setAchievements(a);
    }
  };

  // Initialize DB and Load Data
  useEffect(() => {
    const initApp = async () => {
      try {
        await databaseService.init();
        await migrationService.migrateFromLocalStorage();

        const [
          profilesRes,
          passcodeEnabled,
          onboardingDone,
          setupDone,
          savedUser
        ] = await Promise.all([
          profileService.getProfiles(),
          profileService.isPasscodeEnabled(),
          settingsService.getSetting<boolean>('is_onboarding_complete'),
          settingsService.getSetting<boolean>('is_setup_complete'),
          profileService.getCurrentUser()
        ]);

        setProfiles(profilesRes);
        setIsPasscodeEnabledState(passcodeEnabled);
        
        if (onboardingDone !== null) setHasCompletedOnboarding(onboardingDone);
        if (setupDone !== null) setHasCompletedSetup(setupDone);
        
        if (savedUser) {
          setCurrentUser(savedUser);
          setIsAuthenticated(true);
          await loadUserData(savedUser.id);
        }

      } catch (error) {
        console.error('Failed to initialize app data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const hashPasscode = profileService.hashPasscode.bind(profileService);

  const setIsPasscodeEnabled = async (enabled: boolean) => {
    setIsPasscodeEnabledState(enabled);
    await profileService.setPasscodeEnabled(enabled);
  };

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'timestamp' | 'date' | 'time'> & { date?: string; time?: string; timestamp?: number }) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;

    try {
      await transactionService.addTransaction(newTx, profileId);
      
      // Refresh relevant states from services
      const [updatedWallets, updatedTransactions, updatedLiabilities, updatedGoals] = await Promise.all([
        walletService.getWallets(profileId),
        transactionService.getTransactions(profileId),
        financialService.getLiabilities(profileId),
        financialService.getSavingsGoals(profileId)
      ]);
      
      setWallets(updatedWallets);
      setTransactions(updatedTransactions);
      setLiabilities(updatedLiabilities);
      setSavingsGoals(updatedGoals);

      await syncGamification(profileId, { wallets: updatedWallets, transactions: updatedTransactions, savingsGoals: updatedGoals });
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;

    try {
      await transactionService.updateTransaction(id, updates, transactions);
      
      // Refresh relevant states
      const [updatedWallets, updatedTransactions] = await Promise.all([
        walletService.getWallets(profileId),
        transactionService.getTransactions(profileId)
      ]);
      
      setWallets(updatedWallets);
      setTransactions(updatedTransactions);

      await syncGamification(profileId, { wallets: updatedWallets, transactions: updatedTransactions, savingsGoals });
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;

    try {
      await transactionService.deleteTransaction(id, transactions);
      
      // Refresh relevant states
      const [updatedWallets, updatedTransactions, updatedLiabilities, updatedGoals] = await Promise.all([
        walletService.getWallets(profileId),
        transactionService.getTransactions(profileId),
        financialService.getLiabilities(profileId),
        financialService.getSavingsGoals(profileId)
      ]);
      
      setWallets(updatedWallets);
      setTransactions(updatedTransactions);
      setLiabilities(updatedLiabilities);
      setSavingsGoals(updatedGoals);

      await syncGamification(profileId, { wallets: updatedWallets, transactions: updatedTransactions, savingsGoals: updatedGoals });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const updateBudgetWallets = async (category: string, walletIds: string[]) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await budgetService.updateBudgetWallets(category, walletIds);
      const updated = await budgetService.getBudgets(profileId);
      setBudgets(updated);
    } catch (error) {
      console.error('Failed to update budget wallets:', error);
    }
  };

  const updateBudgetLimit = async (category: string, limit: number) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await budgetService.updateBudgetLimit(category, limit);
      const updated = await budgetService.getBudgets(profileId);
      setBudgets(updated);
    } catch (error) {
      console.error('Failed to update budget limit:', error);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'spent'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await budgetService.addOrUpdateBudget({ ...budget, spent: 0 }, profileId);
      const updated = await budgetService.getBudgets(profileId);
      setBudgets(updated);
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const deleteBudget = async (category: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await budgetService.deleteBudget(category);
      setBudgets(prev => prev.filter(b => b.category !== category));
    } catch (error) {
      console.error('Failed to delete budget:', error);
    }
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await financialService.addSavingsGoal(goal, profileId);
      const updated = await financialService.getSavingsGoals(profileId);
      setSavingsGoals(updated);
      await syncGamification(profileId, { wallets, transactions, savingsGoals: updated });
    } catch (error) {
      console.error('Failed to add savings goal:', error);
    }
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await financialService.updateSavingsGoal(id, updates);
      const updated = await financialService.getSavingsGoals(profileId);
      setSavingsGoals(updated);
      await syncGamification(profileId, { wallets, transactions, savingsGoals: updated });
    } catch (error) {
      console.error('Failed to update savings goal:', error);
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await financialService.updateSavingsGoal(id, { isCompleted: false }); // Using update as a proxy for delete or just implement delete in service
      // Actually I'll implement delete in service if missing
      await databaseService.run('DELETE FROM savings_goals WHERE id = ?', [id]);
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
      const updated = savingsGoals.filter(g => g.id !== id);
      await syncGamification(profileId, { wallets, transactions, savingsGoals: updated });
    } catch (error) {
      console.error('Failed to delete savings goal:', error);
    }
  };

  const contributeToGoal = async (goalId: string, amount: number, walletId?: string) => {
    if (walletId) {
      const goal = savingsGoals.find(g => g.id === goalId);
      await addTransaction({
        title: `Injection: ${goal?.title || 'Savings Goal'}`,
        amount: -amount,
        type: 'expense',
        category: 'Transfer',
        walletId: walletId,
        icon: 'swap_horiz',
        goalId: goalId
      });
    } else {
      const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
      const profileId = currentSettingsUser?.id || currentUser?.id;
      try {
        const goal = savingsGoals.find(g => g.id === goalId);
        if (goal) {
          const newCurrent = goal.current + amount;
          await financialService.updateSavingsGoal(goalId, { 
            current: newCurrent, 
            isCompleted: newCurrent >= goal.target 
          });
          const updatedGoals = await financialService.getSavingsGoals(profileId);
          setSavingsGoals(updatedGoals);
          await syncGamification(profileId, { wallets, transactions, savingsGoals: updatedGoals });
        }
      } catch (error) {
        console.error('Failed to contribute to goal:', error);
      }
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await financialService.addCategory(category, profileId);
      const updatedCats = await financialService.getCategories(profileId);
      setCategories(updatedCats);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      // Direct SQL for name sync (as it affects other tables)
      if (updates.name) {
        const oldName = categories.find(cat => cat.id === id)?.name;
        if (oldName && oldName !== updates.name) {
          await databaseService.executeSet([
            { statement: 'UPDATE transactions SET category = ? WHERE category = ?', values: [updates.name, oldName] },
            { statement: 'UPDATE budgets SET category = ? WHERE category = ?', values: [updates.name, oldName] }
          ]);
        }
      }

      // Update category itself (using direct query for now as service update is simple)
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
      setCategories(updatedCats);
      setTransactions(updatedTxs);
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await databaseService.run('DELETE FROM categories WHERE id = ?', [id]);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const addWallet = async (wallet: Omit<Wallet, 'id'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await walletService.addWallet(wallet, profileId);
      const updatedWallets = await walletService.getWallets(profileId);
      setWallets(updatedWallets);
      await syncGamification(profileId, { wallets: updatedWallets, transactions, savingsGoals });
    } catch (error) {
      console.error('Failed to add wallet:', error);
    }
  };

  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await walletService.updateWallet(id, updates);
      const updatedWallets = await walletService.getWallets(profileId);
      setWallets(updatedWallets);
      await syncGamification(profileId, { wallets: updatedWallets, transactions, savingsGoals });
    } catch (error) {
      console.error('Failed to update wallet:', error);
    }
  };

  const deleteWallet = async (id: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await walletService.deleteWallet(id);
      setWallets(prev => prev.filter(w => w.id !== id));
      const updated = wallets.filter(w => w.id !== id);
      await syncGamification(profileId, { wallets: updated, transactions, savingsGoals });
    } catch (error) {
      console.error('Failed to delete wallet:', error);
    }
  };

  const reorderWallets = async (newWallets: Wallet[]) => {
    setWallets(newWallets);
    // Optional: persist order if added to schema later
  };

  const addLiability = async (liability: Omit<Liability, 'id'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await financialService.addLiability(liability, profileId);
      const updated = await financialService.getLiabilities(profileId);
      setLiabilities(updated);
    } catch (error) {
      console.error('Failed to add liability:', error);
    }
  };

  const updateLiability = async (id: string, updates: Partial<Liability>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      const entries = Object.entries(updates);
      if (entries.length > 0) {
        const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
        const values = entries.map(([, value]) => value);
        await databaseService.run(`UPDATE liabilities SET ${setClause} WHERE id = ?`, [...values, id]);
      }
      const updated = await financialService.getLiabilities(profileId);
      setLiabilities(updated);
    } catch (error) {
      console.error('Failed to update liability:', error);
    }
  };

  const deleteLiability = async (id: string) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    try {
      await databaseService.run('DELETE FROM liabilities WHERE id = ?', [id]);
      setLiabilities(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete liability:', error);
    }
  };

  const payLiability = async (id: string, amount: number, walletId?: string) => {
    if (walletId) {
      const liability = liabilities.find(l => l.id === id);
      await addTransaction({
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
      const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
      const profileId = currentSettingsUser?.id || currentUser?.id;
      try {
        await databaseService.run(
          'UPDATE liabilities SET remainingAmount = MAX(0, remainingAmount - ?) WHERE id = ?',
          [amount, id]
        );
        const updated = await financialService.getLiabilities(profileId);
        setLiabilities(updated);
      } catch (error) {
        console.error('Failed to pay liability:', error);
      }
    }
  };

  const addRecurringTransaction = async (recurring: Omit<RecurringTransaction, 'id'>) => {
    const currentSettingsUser = await settingsService.getSetting<any>('onyx_current_user');
    const profileId = currentSettingsUser?.id || currentUser?.id;
    const newRecurring = { ...recurring, id: crypto.randomUUID() };
    try {
      await databaseService.run(
        'INSERT INTO recurring_transactions (id, name, amount, type, category, frequency, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newRecurring.id, newRecurring.name, newRecurring.amount, newRecurring.type, newRecurring.category, newRecurring.frequency, profileId]
      );
      setRecurringTransactions(prev => [...prev, newRecurring]);
    } catch (error) {
      console.error('Failed to add recurring transaction:', error);
    }
  };

  const updateRecurringTransaction = async (id: string, updates: Partial<RecurringTransaction>) => {
    try {
      const entries = Object.entries(updates);
      if (entries.length > 0) {
        const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
        const values = entries.map(([, value]) => value);
        await databaseService.run(`UPDATE recurring_transactions SET ${setClause} WHERE id = ?`, [...values, id]);
      }
      setRecurringTransactions(prev => prev.map(rec => rec.id === id ? { ...rec, ...updates } : rec));
    } catch (error) {
      console.error('Failed to update recurring transaction:', error);
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    try {
      await databaseService.run('DELETE FROM recurring_transactions WHERE id = ?', [id]);
      setRecurringTransactions(prev => prev.filter(rec => rec.id !== id));
    } catch (error) {
      console.error('Failed to delete recurring transaction:', error);
    }
  };

  const addProfile = async (profile: any) => {
    try {
      const profileToSave = await profileService.addProfile(profile);
      setProfiles(prev => [...prev, profileToSave]);

      // Initialize defaults for the new profile
      for (const cat of INITIAL_CATEGORIES) {
        await financialService.addCategory(cat, profileToSave.id);
        if (cat.type === 'expense') {
          await budgetService.addOrUpdateBudget({
            category: cat.name,
            subtext: 'Monthly Budget',
            spent: 0,
            limit: 5000,
            linkedWallets: []
          }, profileToSave.id);
        }
      }

      // Initialize Default Missions
      const defaultMissions: Omit<Mission, 'id'>[] = [
        { title: 'Security Buffer', description: 'Establish a fundamental liquidity reserve', progress: 0, total: 3000, icon: 'shield', type: 'growth', level: 1 },
        { title: 'Diversification', description: 'Establish multiple reserves', progress: 0, total: 3, icon: 'account_balance', type: 'growth', level: 1 },
        { title: 'Positive Cashflow', description: 'Maintain income > expenses', progress: 0, total: 1, icon: 'trending-up', type: 'growth', level: 1 }
      ];
      for (const m of defaultMissions) {
        await financialService.addMission(m, profileToSave.id);
      }

      // Initialize Default Achievements
      const defaultAchievements: Omit<Achievement, 'id'>[] = [
        { title: 'First $10k', icon: 'star', earned: false },
        { title: 'Master Saver', icon: 'workspace_premium', earned: false },
        { title: 'Globalist', icon: 'public', earned: false },
        { title: 'Fast Starter', icon: 'rocket_launch', earned: false }
      ];
      for (const a of defaultAchievements) {
        await financialService.addAchievement(a, profileToSave.id);
      }
      await databaseService.saveToStore();
    } catch (error) {
      console.error('Failed to add profile:', error);
    }
  };

  const updateMission = async (id: string, progress: number, total: number, level?: number, description?: string) => {
    try {
      await financialService.updateMission(id, { progress, total, level, description });
      setMissions(prev => prev.map(m => m.id === id ? { ...m, progress, total, level: level ?? m.level, description: description ?? m.description } : m));
    } catch (error) {
      console.error('Failed to update mission:', error);
    }
  };

  const updateAchievement = async (id: string, earned: boolean) => {
    try {
      await financialService.updateAchievement(id, earned);
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, earned } : a));
    } catch (error) {
      console.error('Failed to update achievement:', error);
    }
  };

  const contextValue: TransactionContextType = {
    transactions,
    budgets,
    categories,
    recurringTransactions,
    savingsGoals,
    wallets,
    liabilities,
    missions,
    achievements,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudgetWallets,
    updateBudgetLimit,
    addBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    addWallet,
    updateWallet,
    deleteWallet,
    reorderWallets,
    addLiability,
    updateLiability,
    deleteLiability,
    payLiability,
    profiles,
    addProfile,
    hashPasscode,
    isPasscodeEnabled,
    setIsPasscodeEnabled,
    hasCompletedOnboarding,
    completeOnboarding: async () => {
      setHasCompletedOnboarding(true);
      await settingsService.setSetting('is_onboarding_complete', true);
    },
    resetOnboarding: async () => {
      setHasCompletedOnboarding(false);
      await settingsService.setSetting('is_onboarding_complete', false);
    },
    hasCompletedSetup,
    completeSetup: async () => {
      setHasCompletedSetup(true);
      await settingsService.setSetting('is_setup_complete', true);
    },
    currentUser,
    isAuthenticated,
    login: async (profile: any) => {
      setIsAuthenticated(true);
      setCurrentUser(profile);
      await profileService.setCurrentUser(profile);
      await loadUserData(profile.id);
    },
    logout: async () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      await profileService.setCurrentUser(null);
    },
    isLoading,
    updateMission,
    updateAchievement,
    totalLiquidity,
    xp,
    tierData
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}
