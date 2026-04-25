import { create } from 'zustand';
import { Wallet } from '../types';
import { walletService } from '../services/wallet.service';
import { useAuthStore } from './useAuthStore';
import { useGamificationStore } from './useGamificationStore';
import { convertCurrency } from '../utils/currency';

export interface WalletState {
  wallets: Wallet[];
  totalLiquidity: number;
  totalLiquidityCurrency: string;
  
  setWallets: (w: Wallet[], targetCurrency?: string) => void;
  reloadWallets: (profileId: string, targetCurrency?: string) => Promise<void>;

  addWallet: (wallet: Omit<Wallet, 'id'>, profileId: string) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>, profileId: string) => Promise<void>;
  deleteWallet: (id: string, profileId: string) => Promise<void>;
  reorderWallets: (newWallets: Wallet[], targetCurrency?: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  totalLiquidity: 0,
  totalLiquidityCurrency: 'USD',

  setWallets: (w, targetCurrency) => {
    const currency = targetCurrency || useAuthStore.getState().currentUser?.currency || 'USD';
    const total = w.reduce((sum, wallet) => {
      const signedBalance = wallet.type === 'Credit Card' ? -Math.abs(wallet.balance) : wallet.balance;
      const normalizedBalance = convertCurrency(signedBalance, wallet.currency || 'USD', currency);
      return sum + normalizedBalance;
    }, 0);
    set({ wallets: w, totalLiquidity: total, totalLiquidityCurrency: currency });
  },
  
  reloadWallets: async (profileId, targetCurrency) => {
    const updatedWallets = await walletService.getWallets(profileId);
    get().setWallets(updatedWallets, targetCurrency);
  },

  addWallet: async (wallet, profileId) => {
    await walletService.addWallet(wallet, profileId);
    await get().reloadWallets(profileId);

    const gamStore = useGamificationStore.getState();
    const profileCurrency = useAuthStore.getState().currentUser?.currency;
    await gamStore.syncGamification(profileId, profileCurrency);
  },

  updateWallet: async (id, updates, profileId) => {
    await walletService.updateWallet(id, updates);
    await get().reloadWallets(profileId);

    const gamStore = useGamificationStore.getState();
    const profileCurrency = useAuthStore.getState().currentUser?.currency;
    await gamStore.syncGamification(profileId, profileCurrency);
  },

  deleteWallet: async (id, profileId) => {
    await walletService.deleteWallet(id);
    const updatedWallets = get().wallets.filter(w => w.id !== id);
    get().setWallets(updatedWallets);

    const gamStore = useGamificationStore.getState();
    const profileCurrency = useAuthStore.getState().currentUser?.currency;
    await gamStore.syncGamification(profileId, profileCurrency);
  },

  reorderWallets: async (newWallets) => {
    get().setWallets(newWallets);
  }
}));
