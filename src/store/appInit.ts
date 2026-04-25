import { databaseService } from '../services/database.service';
import { migrationService } from '../services/migration.service';
import { profileService } from '../services/profile.service';
import { settingsService } from '../services/settings.service';
import { walletService } from '../services/wallet.service';
import { transactionService } from '../services/transaction.service';
import { budgetService } from '../services/budget.service';
import { financialService } from '../services/financial.service';
import { useAuthStore } from './useAuthStore';
import { useFinancialStore, INITIAL_CATEGORIES } from './useFinancialStore';
import { useWalletStore } from './useWalletStore';
import { useGamificationStore } from './useGamificationStore';

export const loadUserData = async (profileId: string) => {
  try {
    const [
      walletsData,
      transactionsData,
      budgetsData,
      goalsData,
      categoriesData,
      liabilitiesData,
      missionsData,
      achievementsData,
      recurringTransactionsData
    ] = await Promise.all([
      walletService.getWallets(profileId),
      transactionService.getTransactions(profileId),
      budgetService.getBudgets(profileId),
      financialService.getSavingsGoals(profileId),
      financialService.getCategories(profileId),
      financialService.getLiabilities(profileId),
      financialService.getMissions(profileId),
      financialService.getAchievements(profileId),
      financialService.getRecurringTransactions(profileId)
    ]);

    useWalletStore.getState().setWallets(walletsData);
    
    const finStore = useFinancialStore.getState();
    finStore.setTransactions(transactionsData);
    finStore.setBudgets(budgetsData);
    finStore.setSavingsGoals(goalsData);
    finStore.setCategories(categoriesData.length > 0 ? categoriesData : INITIAL_CATEGORIES);
    finStore.setLiabilities(liabilitiesData);
    finStore.setRecurringTransactions(recurringTransactionsData);

    const gamStore = useGamificationStore.getState();
    if (missionsData.length > 0) gamStore.setMissions(missionsData);
    if (achievementsData.length > 0) gamStore.setAchievements(achievementsData);
    
    await databaseService.saveToStore();
    await gamStore.syncGamification(profileId);
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
};

export const initApp = async () => {
  const authStore = useAuthStore.getState();
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

    authStore.setProfiles(profilesRes);
    authStore.setIsPasscodeEnabledState(passcodeEnabled);
    
    if (onboardingDone !== null) authStore.setHasCompletedOnboarding(onboardingDone);
    if (setupDone !== null) authStore.setHasCompletedSetup(setupDone);
    
    if (savedUser) {
      authStore.setCurrentUser(savedUser);
      authStore.setIsAuthenticated(true);
      await loadUserData(savedUser.id);
    }

  } catch (error) {
    console.error('Failed to initialize app data:', error);
  } finally {
    authStore.setLoading(false);
  }
};
