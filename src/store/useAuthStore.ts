import { create } from 'zustand';
import { Profile, Category, Mission, Achievement } from '../types';
import { profileService } from '../services/profile.service';
import { settingsService } from '../services/settings.service';
import { financialService } from '../services/financial.service';
import { budgetService } from '../services/budget.service';
import { databaseService } from '../services/database.service';

interface AuthState {
  profiles: Profile[];
  isPasscodeEnabled: boolean;
  isBiometricEnabled: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedSetup: boolean;
  currentUser: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setLoading: (loading: boolean) => void;
  setProfiles: (profiles: Profile[]) => void;
  setIsPasscodeEnabledState: (enabled: boolean) => void;
  setIsBiometricEnabledState: (enabled: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setHasCompletedSetup: (completed: boolean) => void;
  setCurrentUser: (user: Profile | null) => void;
  setIsAuthenticated: (auth: boolean) => void;

  setIsPasscodeEnabled: (enabled: boolean) => Promise<void>;
  setIsBiometricEnabled: (enabled: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  completeSetup: () => Promise<void>;
  login: (profile: Profile) => Promise<void>;
  logout: () => Promise<void>;
  hashPasscode: (plain: string) => Promise<string>;
  addProfile: (profile: Omit<Profile, 'id'>, initialCategories: Category[]) => Promise<Profile>;
}

type NewMission = Omit<Mission, 'id' | 'status' | 'unlockedAtLevel' | 'path' | 'maxLevel'>;
type NewAchievement = Omit<Achievement, 'id' | 'earnedDate' | 'rarity' | 'description'>;

export const useAuthStore = create<AuthState>((set, get) => ({
  profiles: [],
  isPasscodeEnabled: true,
  isBiometricEnabled: false,
  hasCompletedOnboarding: false,
  hasCompletedSetup: false,
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,

  setLoading: (loading) => set({ isLoading: loading }),
  setProfiles: (profiles) => set({ profiles }),
  setIsPasscodeEnabledState: (enabled) => set({ isPasscodeEnabled: enabled }),
  setIsBiometricEnabledState: (enabled) => set({ isBiometricEnabled: enabled }),
  setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  setHasCompletedSetup: (completed) => set({ hasCompletedSetup: completed }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setIsPasscodeEnabled: async (enabled) => {
    set({ isPasscodeEnabled: enabled });
    await profileService.setPasscodeEnabled(enabled);
  },

  setIsBiometricEnabled: async (enabled) => {
    set({ isBiometricEnabled: enabled });
    await profileService.setBiometricEnabled(enabled);
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
    }

    const primaryCurrency = profileToSave.currency || 'USD';
    const thresholds = (await import('../constants/thresholds')).getThresholds(primaryCurrency);

    const defaultMissions: NewMission[] = [
      { title: 'Security Buffer', description: 'Establish a fundamental liquidity reserve', progress: 0, total: thresholds.avgMonthlyIncome, icon: 'shield', type: 'short', category: 'growth', level: 1 },
      { title: 'Diversification', description: 'Establish multiple reserves', progress: 0, total: 3, icon: 'account_balance', type: 'short', category: 'growth', level: 1 },
      { title: 'Positive Cashflow', description: 'Maintain income > expenses', progress: 0, total: 1, icon: 'trending-up', type: 'short', category: 'growth', level: 1 }
    ];
    for (const m of defaultMissions) {
      await financialService.addMission(m, profileToSave.id);
    }

    const defaultAchievements: NewAchievement[] = [
      { title: 'First $10k', icon: 'star', earned: false },
      { title: 'Master Saver', icon: 'workspace_premium', earned: false },
      { title: 'Globalist', icon: 'public', earned: false },
      { title: 'Fast Starter', icon: 'rocket_launch', earned: false }
    ];
    for (const a of defaultAchievements) {
      await financialService.addAchievement(a, profileToSave.id);
    }
    
    await databaseService.saveToStore();
    return profileToSave;
  }
}));
