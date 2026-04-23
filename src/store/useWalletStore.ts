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
  
  get totalLiquidity() {
    return get().wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
  },

  setWallets: (w) => set({ wallets: w }),
  
  reloadWallets: async (profileId: string) => {
    const updatedWallets = await walletService.getWallets(profileId);
    set({ wallets: updatedWallets });
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
    set(state => ({ wallets: state.wallets.filter(w => w.id !== id) }));
    useGamificationStore.getState().syncGamification(profileId);
  },

  reorderWallets: async (newWallets) => {
    set({ wallets: newWallets });
  }
}));
