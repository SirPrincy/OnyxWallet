import { create } from 'zustand';
import { Mission, Achievement, TierData, Wallet, Transaction, SavingsGoal } from '../types';
import { gamificationService } from '../services/gamification.service';
import { financialService } from '../services/financial.service';

interface GamificationState {
  missions: Mission[];
  achievements: Achievement[];
  xp: number;
  tierData: TierData;

  setMissions: (m: Mission[]) => void;
  setAchievements: (a: Achievement[]) => void;

  updateMission: (id: string, progress: number, total: number, level?: number, description?: string) => Promise<void>;
  updateAchievement: (id: string, earned: boolean) => Promise<void>;
  syncGamification: (profileId: string, data: { wallets: Wallet[], transactions: Transaction[], savingsGoals: SavingsGoal[], totalLiquidity: number }) => Promise<void>;
  calculateXP: (data: { transactions: Transaction[], savingsGoals: SavingsGoal[], totalLiquidity: number }) => void;
}

const TIERS = [
  { level: 1, name: 'Bronze', threshold: 0 },
  { level: 2, name: 'Silver', threshold: 5000 },
  { level: 3, name: 'Gold', threshold: 15000 },
  { level: 4, name: 'Platinum', threshold: 50000 },
  { level: 5, name: 'Diamond', threshold: 150000 },
  { level: 6, name: 'Archon', threshold: 500000 }
];

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

  calculateXP: ({ transactions, savingsGoals, totalLiquidity }) => {
    const xpFromLiquidity = Math.max(0, totalLiquidity) / 10;
    const xpFromTx = transactions.length * 50;
    const xpFromGoals = savingsGoals.filter(g => g.current >= g.target).length * 500;
    const xp = xpFromLiquidity + xpFromTx + xpFromGoals;

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
  },

  updateMission: async (id, progress, total, level, description) => {
    await financialService.updateMission(id, { progress, total, level, description });
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, progress, total, level: level ?? m.level, description: description ?? m.description } : m)
    }));
  },

  updateAchievement: async (id, earned) => {
    await financialService.updateAchievement(id, earned);
    set(state => ({
      achievements: state.achievements.map(a => a.id === id ? { ...a, earned } : a)
    }));
  },

  syncGamification: async (profileId, data) => {
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

    get().calculateXP(data);
  }
}));
