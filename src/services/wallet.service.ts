import { databaseService } from './database.service';
import { Wallet } from '../types';

export class WalletService {
  async getWallets(profileId: string): Promise<Wallet[]> {
    const res = await databaseService.query('SELECT * FROM wallets WHERE profileId = ?', [profileId]);
    if (!res.values) return [];
    return res.values.map((w: any) => ({
      ...w,
      isVisible: w.isVisible === 1
    }));
  }

  async addWallet(wallet: Omit<Wallet, 'id'>, profileId: string): Promise<Wallet> {
    const id = crypto.randomUUID();
    const newWallet = { ...wallet, id };
    
    await databaseService.run(
      'INSERT INTO wallets (id, name, type, balance, currency, color, icon, lastFour, provider, isVisible, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, 
        newWallet.name, 
        newWallet.type, 
        newWallet.balance, 
        newWallet.currency, 
        newWallet.color, 
        newWallet.icon, 
        newWallet.lastFour, 
        newWallet.provider, 
        newWallet.isVisible ? 1 : 0, 
        profileId
      ]
    );
    await databaseService.saveToStore();
    return newWallet;
  }

  async updateWallet(id: string, updates: Partial<Wallet>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;

    const setClause = entries.map(([key]) => {
      if (key === 'isVisible') return `isVisible = ?`;
      return `"${key}" = ?`;
    }).join(', ');
    
    const values = entries.map(([key, value]) => {
      if (key === 'isVisible') return value ? 1 : 0;
      return value;
    });

    await databaseService.run(
      `UPDATE wallets SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    await databaseService.saveToStore();
  }

  async deleteWallet(id: string): Promise<void> {
    await databaseService.run('DELETE FROM wallets WHERE id = ?', [id]);
    await databaseService.saveToStore();
  }

  // Helper for batch updates (used by transaction service)
  getUpdateBalanceStatement(id: string, amount: number) {
    return {
      statement: 'UPDATE wallets SET balance = balance + ? WHERE id = ?',
      values: [amount, id]
    };
  }
}

export const walletService = new WalletService();
