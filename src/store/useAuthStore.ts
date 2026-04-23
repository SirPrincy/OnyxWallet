import { create } from 'zustand';
import { profileService } from '../services/profile.service';
import { settingsService } from '../services/settings.service';
import { financialService } from '../services/financial.service';
import { budgetService } from '../services/budget.service';
import { databaseService } from '../services/database.service';

interface AuthState {
  profiles: any[];
  isPasscodeEnabled: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedSetup: boolean;
  currentUser: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setLoading: (loading: boolean) => void;
  setProfiles: (profiles: any[]) => void;
  setIsPasscodeEnabledState: (enabled: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setHasCompletedSetup: (completed: boolean) => void;
  setCurrentUser: (user: any | null) => void;
  setIsAuthenticated: (auth: boolean) => void;

  setIsPasscodeEnabled: (enabled: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  completeSetup: () => Promise<void>;
  login: (profile: any) => Promise<void>;
  logout: () => Promise<void>;
  hashPasscode: (plain: string) => Promise<string>;
  addProfile: (profile: any, initialCategories: any[]) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profiles: [],
  isPasscodeEnabled: true,
  hasCompletedOnboarding: false,
  hasCompletedSetup: false,
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,

  setLoading: (loading) => set({ isLoading: loading }),
  setProfiles: (profiles) => set({ profiles }),
  setIsPasscodeEnabledState: (enabled) => set({ isPasscodeEnabled: enabled }),
  setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  setHasCompletedSetup: (completed) => set({ hasCompletedSetup: completed }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setIsPasscodeEnabled: async (enabled) => {
    set({ isPasscodeEnabled: enabled });
    await profileService.setPasscodeEnabled(enabled);
  },

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    await settingsService.setSetting('is_onboarding_complete', true);
  },

  resetOnboarding: async () => {
    set({ hasCompletedOnboarding: false });
    await settingsService.setSetting('is_onboarding_complete', false);
  },

  completeSetup: async () => {
    set({ hasCompletedSetup: true });
    await settingsService.setSetting('is_setup_complete', true);
  },

  login: async (profile) => {
    set({ currentUser: profile, isAuthenticated: true });
    await profileService.setCurrentUser(profile);
  },

  logout: async () => {
    set({ currentUser: null, isAuthenticated: false });
    await profileService.setCurrentUser(null);
  },

  hashPasscode: async (plain) => {
    return profileService.hashPasscode(plain);
  },

  addProfile: async (profile, initialCategories) => {
    const profileToSave = await profileService.addProfile(profile);
    set(state => ({ profiles: [...state.profiles, profileToSave] }));

    // Initialize defaults for the new profile
    for (const cat of initialCategories) {
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

    const defaultMissions = [
      { title: 'Security Buffer', description: 'Establish a fundamental liquidity reserve', progress: 0, total: 3000, icon: 'shield', type: 'growth', level: 1 },
      { title: 'Diversification', description: 'Establish multiple reserves', progress: 0, total: 3, icon: 'account_balance', type: 'growth', level: 1 },
      { title: 'Positive Cashflow', description: 'Maintain income > expenses', progress: 0, total: 1, icon: 'trending-up', type: 'growth', level: 1 }
    ];
    for (const m of defaultMissions) {
      await financialService.addMission(m as any, profileToSave.id);
    }

    const defaultAchievements = [
      { title: 'First $10k', icon: 'star', earned: false },
      { title: 'Master Saver', icon: 'workspace_premium', earned: false },
      { title: 'Globalist', icon: 'public', earned: false },
      { title: 'Fast Starter', icon: 'rocket_launch', earned: false }
    ];
    for (const a of defaultAchievements) {
      await financialService.addAchievement(a as any, profileToSave.id);
    }
    
    await databaseService.saveToStore();
    return profileToSave;
  }
}));
