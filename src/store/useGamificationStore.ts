import { create } from 'zustand';
import { Mission, Achievement, TierData } from '../types';
import { gamificationService } from '../services/gamification.service';
import { financialService } from '../services/financial.service';
import { useFinancialStore } from './useFinancialStore';
import { useWalletStore } from './useWalletStore';
import { getThresholds } from '../constants/thresholds';

interface GamificationState {
  missions: Mission[];
  achievements: Achievement[];
  xp: number;
  tierData: TierData;

  setMissions: (m: Mission[]) => void;
  setAchievements: (a: Achievement[]) => void;
  
  updateMission: (id: string, progress: number, total: number, level?: number, description?: string) => Promise<void>;
  updateAchievement: (id: string, earned: boolean) => Promise<void>;
  syncGamification: (profileId: string) => Promise<void>;
  calculateXP: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  missions: [],
  achievements: [],
  xp: 0,
  tierData: {
    tierName: 'Bronze',
    level: 1,
    progressPercent: 0,
    xpLeft: 5000,
    nextTier: 'Silver'
  },

  setMissions: (m) => set({ missions: m }),
  setAchievements: (a) => set({ achievements: a }),

  calculateXP: () => {
    const wallets = useWalletStore.getState().wallets;
    const transactions = useFinancialStore.getState().transactions;
    const savingsGoals = useFinancialStore.getState().savingsGoals;

    // Get currency from primary wallet or default to USD
    const primaryCurrency = wallets[0]?.currency || 'USD';
    const thresholds = getThresholds(primaryCurrency);

    const TIERS = [
      { level: 1, name: 'Bronze', threshold: 0 },
      { level: 2, name: 'Silver', threshold: thresholds.silverXP },
      { level: 3, name: 'Gold', threshold: thresholds.goldXP },
      { level: 4, name: 'Platinum', threshold: thresholds.platinumXP },
      { level: 5, name: 'Diamond', threshold: thresholds.diamondXP },
      { level: 6, name: 'Archon', threshold: thresholds.archonXP }
    ];

    const totalLiquidity = wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);

    // XP Calculation
    const xpFromLiquidity = Math.max(0, totalLiquidity) / 10;
    const xpFromTx = transactions.length * 50;
    const xpFromGoals = savingsGoals.filter(g => g.current >= g.target).length * 500;
    const xp = xpFromLiquidity + xpFromTx + xpFromGoals;

    // Stability Bonus (Runway)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const averageMonthlyIncome = totalIncome > 0 ? Math.max(thresholds.avgMonthlyIncome, totalIncome / 3) : thresholds.avgMonthlyIncome;
    const runwayMonths = totalLiquidity / averageMonthlyIncome;

    let currentTier = TIERS[0];
    let next = TIERS[1];
    
    // Calculate Tier based on XP
    for (let i = 0; i < TIERS.length; i++) {
      if (xp >= TIERS[i].threshold) {
        currentTier = TIERS[i];
        next = TIERS[i+1] || TIERS[i];
      }
    }

    // Bump Tier based on Stability (Runway)
    // 1 month = at least Silver (2)
    // 3 months = at least Gold (3)
    // 6 months = at least Platinum (4)
    if (runwayMonths >= 6 && currentTier.level < 4) {
      currentTier = TIERS[3];
      next = TIERS[4];
    } else if (runwayMonths >= 3 && currentTier.level < 3) {
      currentTier = TIERS[2];
      next = TIERS[3];
    } else if (runwayMonths >= 1 && currentTier.level < 2) {
      currentTier = TIERS[1];
      next = TIERS[2];
    }
    
    let progress = 100;
    let left = 0;
    if (currentTier !== next) {
      const range = next.threshold - currentTier.threshold;
      const currentXPInTier = Math.max(0, xp - currentTier.threshold);
      progress = (currentXPInTier / range) * 100;
      left = Math.max(0, next.threshold - xp);
    }

    const oldLevel = get().tierData.level;

    set({
      xp,
      tierData: {
        tierName: currentTier.name,
        level: currentTier.level,
        progressPercent: Math.min(100, Math.max(0, progress)),
        xpLeft: left,
        nextTier: next.name
      }
    });

    // If upgraded to Platinum (4) or higher, trigger category upgrades
    if (oldLevel < 4 && currentTier.level >= 4) {
      useFinancialStore.getState().upgradeToEliteCategories();
    }
  },

  updateMission: async (id, progress, total, level, description) => {
    await financialService.updateMission(id, { progress, total, level, description });
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, progress, total, level: level ?? m.level, description: description ?? m.description } : m)
    }));
    get().calculateXP();
  },

  updateAchievement: async (id, earned) => {
    await financialService.updateAchievement(id, earned);
    set(state => ({
      achievements: state.achievements.map(a => a.id === id ? { ...a, earned } : a)
    }));
    get().calculateXP();
  },

  syncGamification: async (profileId) => {
    const wallets = useWalletStore.getState().wallets;
    const transactions = useFinancialStore.getState().transactions;
    const savingsGoals = useFinancialStore.getState().savingsGoals;

    const data = { wallets, transactions, savingsGoals };
    const missions = get().missions;
    const achievements = get().achievements;

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
      set({ missions: m, achievements: a });
    }

    get().calculateXP();
  }
}));
