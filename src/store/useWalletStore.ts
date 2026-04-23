import { create } from 'zustand';
import { Wallet } from '../types';
import { walletService } from '../services/wallet.service';
import { useAuthStore } from './useAuthStore';
import { useGamificationStore } from './useGamificationStore';
import { useFinancialStore } from './useFinancialStore';

interface WalletState {
  wallets: Wallet[];
  totalLiquidity: number;

  setWallets: (w: Wallet[]) => void;
  reloadWallets: (profileId: string) => Promise<void>;

  addWallet: (wallet: Omit<Wallet, 'id'>) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  reorderWallets: (newWallets: Wallet[]) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],

  totalLiquidity: 0,

  setWallets: (w) => set({
    wallets: w,
    totalLiquidity: w.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0)
  }),

  reloadWallets: async (profileId: string) => {
    const updatedWallets = await walletService.getWallets(profileId);
    set({ wallets: updatedWallets });
  },

  addWallet: async (wallet) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.addWallet(wallet, profileId);
    await get().reloadWallets(profileId);
    const financialStore = useFinancialStore.getState();
    useGamificationStore.getState().syncGamification(profileId, {
      wallets: get().wallets,
      transactions: financialStore.transactions,
      savingsGoals: financialStore.savingsGoals,
      totalLiquidity: get().totalLiquidity
    });
  },

  updateWallet: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.updateWallet(id, updates);
    await get().reloadWallets(profileId);
    const financialStore = useFinancialStore.getState();
    useGamificationStore.getState().syncGamification(profileId, {
      wallets: get().wallets,
      transactions: financialStore.transactions,
      savingsGoals: financialStore.savingsGoals,
      totalLiquidity: get().totalLiquidity
    });
  },

  deleteWallet: async (id) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.deleteWallet(id);
    const updatedWallets = get().wallets.filter(w => w.id !== id);
    const totalLiquidity = updatedWallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
    set({ wallets: updatedWallets, totalLiquidity });
    const financialStore = useFinancialStore.getState();
    useGamificationStore.getState().syncGamification(profileId, {
      wallets: updatedWallets,
      transactions: financialStore.transactions,
      savingsGoals: financialStore.savingsGoals,
      totalLiquidity
    });
  },

  reorderWallets: async (newWallets) => {
    set({ wallets: newWallets });
  }
}));
