import { create } from 'zustand';
import { Wallet } from '../types';
import { walletService } from '../services/wallet.service';
import { useAuthStore } from './useAuthStore';
import { useGamificationStore } from './useGamificationStore';

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

  setWallets: (w) => {
    const total = w.reduce((sum, wallet) => sum + (wallet.type === 'Credit Card' ? -Math.abs(wallet.balance) : wallet.balance), 0);
    set({ wallets: w, totalLiquidity: total });
  },
  
  reloadWallets: async (profileId: string) => {
    const updatedWallets = await walletService.getWallets(profileId);
    get().setWallets(updatedWallets);
  },

  addWallet: async (wallet) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.addWallet(wallet, profileId);
    await get().reloadWallets(profileId);
    useGamificationStore.getState().syncGamification(profileId);
  },

  updateWallet: async (id, updates) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.updateWallet(id, updates);
    await get().reloadWallets(profileId);
    useGamificationStore.getState().syncGamification(profileId);
  },

  deleteWallet: async (id) => {
    const profileId = useAuthStore.getState().currentUser?.id;
    if (!profileId) return;
    await walletService.deleteWallet(id);
    const newWallets = get().wallets.filter(w => w.id !== id);
    get().setWallets(newWallets);
    useGamificationStore.getState().syncGamification(profileId);
  },

  reorderWallets: async (newWallets) => {
    get().setWallets(newWallets);
  }
}));
