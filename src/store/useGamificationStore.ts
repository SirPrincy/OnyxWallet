import { create } from 'zustand';
import { Mission, Achievement, TierData, Wallet, Transaction, SavingsGoal, WealthPath } from '../types';
import { gamificationService, GamificationData } from '../services/gamification.service';
import { financialService } from '../services/financial.service';
import { walletService } from '../services/wallet.service';
import { transactionService } from '../services/transaction.service';

export interface GamificationState {
  missions: Mission[];
  achievements: Achievement[];
  xp: number;
  isSyncing: boolean;
  tierData: TierData;
  path: WealthPath;

  setMissions: (m: Mission[]) => void;
  setAchievements: (a: Achievement[]) => void;
  setPath: (
    path: WealthPath,
    profileId: string,
    profileCurrency?: string,
    onLevelUp?: (level: number) => void
  ) => Promise<void>;
  
  updateMission: (id: string, progress: number, total: number, level?: number, description?: string, status?: string) => Promise<void>;
  updateAchievement: (id: string, earned: boolean) => Promise<void>;
  syncGamification: (
    profileId: string,
    profileCurrency?: string,
    onLevelUp?: (level: number) => void
  ) => Promise<void>;
  calculateXP: (
    profileId: string,
    data: GamificationData,
    profileCurrency?: string,
    onLevelUp?: (level: number) => void
  ) => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  missions: [],
  achievements: [],
  xp: 0,
  isSyncing: false,
  path: 'neutral',
  tierData: {
    tierName: 'Bronze',
    level: 1,
    progressPercent: 0,
    xpLeft: 5000,
    nextTier: 'Silver'
  },

  setMissions: (m) => set({ missions: m }),
  setAchievements: (a) => set({ achievements: a }),
  setPath: async (path, profileId, profileCurrency, onLevelUp) => {
    await financialService.updateProfile(profileId, { path });
    set({ path });
    await get().syncGamification(profileId, profileCurrency, onLevelUp);
  },

  calculateXP: (profileId, data, profileCurrency, onLevelUp) => {
    const { missions, achievements, tierData } = get();
    const currency = profileCurrency || 'USD';
    
    const { xp, tierData: newTierData } = gamificationService.calculateXP(
      data,
      missions,
      achievements,
      currency
    );

    const oldLevel = tierData.level;
    set({ xp, tierData: newTierData });

    if (oldLevel < newTierData.level && onLevelUp) {
      onLevelUp(newTierData.level);
    }
  },

  updateMission: async (id, progress, total, level, description, status) => {
    await financialService.updateMission(id, { progress, total, level, description, status: status as any });
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, progress, total, level: level ?? m.level, description: description ?? m.description, status: (status as any) ?? m.status } : m)
    }));
  },

  updateAchievement: async (id, earned) => {
    await financialService.updateAchievement(id, earned);
    set(state => ({
      achievements: state.achievements.map(a => a.id === id ? { ...a, earned } : a)
    }));
  },

  syncGamification: async (profileId, profileCurrency, onLevelUp) => {
    if (get().isSyncing) return;
    set({ isSyncing: true });

    try {
      const [wallets, transactions, savingsGoals] = await Promise.all([
        walletService.getWallets(profileId),
        transactionService.getTransactions(profileId),
        financialService.getSavingsGoals(profileId)
      ]);

      const data: GamificationData = {
        wallets,
        transactions,
        savingsGoals,
        currentLevel: get().tierData.level,
        path: get().path
      };

      const { missions, achievements } = get();

      await gamificationService.sync(
        profileId,
        data,
        missions,
        achievements,
        {
          updateMission: (id, updates) => financialService.updateMission(id, updates),
          updateAchievement: (id, earned) => financialService.updateAchievement(id, earned),
          refreshData: async () => {
            const [m, a] = await Promise.all([
              financialService.getMissions(profileId),
              financialService.getAchievements(profileId)
            ]);
            set({ missions: m, achievements: a });
            return { missions: m, achievements: a };
          },
          onComplete: () => {
            get().calculateXP(profileId, data, profileCurrency, onLevelUp);
            set({ isSyncing: false });
          }
        }
      );
    } catch (error) {
      console.error('Gamification sync failed:', error);
      set({ isSyncing: false });
    }
  },
}));
