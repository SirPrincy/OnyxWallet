import { databaseService } from './database.service';
import { Transaction } from '../types';
import { walletService } from './wallet.service';
import { Temporal } from '@js-temporal/polyfill';

export class TransactionService {
  async getTransactions(profileId: string): Promise<Transaction[]> {
    const res = await databaseService.query('SELECT * FROM transactions WHERE profileId = ? ORDER BY timestamp DESC', [profileId]);
    return res.values || [];
  }

  async addTransaction(
    newTx: Omit<Transaction, 'id' | 'timestamp' | 'date' | 'time' | 'profileId'> & { date?: string; time?: string; timestamp?: number },
    profileId: string
  ): Promise<Transaction> {
    await using session = await databaseService.getSession();

    const id = crypto.randomUUID();
    const nowInstant = Temporal.Now.instant();
    const nowPlainDate = Temporal.Now.plainDateISO();
    const timestamp = newTx.timestamp || nowInstant.epochMilliseconds;
    
    const formatDate = (date: Temporal.PlainDate) => {
      const today = Temporal.Now.plainDateISO();
      const yesterday = today.subtract({ days: 1 });

      if (Temporal.PlainDate.compare(date, today) === 0) return 'Today';
      if (Temporal.PlainDate.compare(date, yesterday) === 0) return 'Yesterday';

      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const fullTx: Transaction = {
      ...newTx,
      id,
      timestamp,
      profileId,
      date: newTx.date || formatDate(nowPlainDate),
      time: newTx.time || Temporal.Now.plainTimeISO().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    const statements: { statement: string, values?: any[] }[] = [];

    // 1. Insert Transaction
    statements.push({
      statement: `INSERT INTO transactions (id, title, category, subcategory, subcategoryIcon, amount, type, date, time, icon, timestamp, walletId, toWalletId, profileId, liabilityId, interestAmount, goalId)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values: [
        fullTx.id, fullTx.title, fullTx.category, fullTx.subcategory, fullTx.subcategoryIcon, 
        fullTx.amount, fullTx.type, fullTx.date, fullTx.time, fullTx.icon, fullTx.timestamp, 
        fullTx.walletId, (fullTx as any).toWalletId, profileId, fullTx.liabilityId, fullTx.interestAmount || 0, fullTx.goalId
      ]
    });

    // 2. Update Wallet Balance
    if (fullTx.type === 'transfer' && (fullTx as any).toWalletId && fullTx.walletId) {
      const amount = Math.abs(fullTx.amount);
      statements.push(walletService.getUpdateBalanceStatement(fullTx.walletId, -amount));
      statements.push(walletService.getUpdateBalanceStatement((fullTx as any).toWalletId, amount));
    } else if (fullTx.walletId) {
      const adj = fullTx.type === 'income' ? fullTx.amount : -Math.abs(fullTx.amount);
      statements.push(walletService.getUpdateBalanceStatement(fullTx.walletId, adj));
    }

    // 3. Update Liability
    if (fullTx.liabilityId) {
      const interestPart = fullTx.interestAmount || 0;
      const capitalPart = Math.max(0, Math.abs(fullTx.amount) - interestPart);

      statements.push({
        statement: 'UPDATE liabilities SET remainingAmount = MAX(0, remainingAmount - ?), totalInterestPaid = totalInterestPaid + ? WHERE id = ?',
        values: [capitalPart, interestPart, fullTx.liabilityId]
      });
    }

    // 4. Update Savings Goal
    if (fullTx.goalId) {
      const amount = Math.abs(fullTx.amount);
      statements.push({
        statement: 'UPDATE savings_goals SET current = current + ?, isCompleted = CASE WHEN current + ? >= target THEN 1 ELSE 0 END WHERE id = ?',
        values: [amount, amount, fullTx.goalId]
      });
    }

    await databaseService.executeSet(statements);
    await databaseService.saveToStore();
    
    return fullTx;
  }

  async deleteTransaction(id: string, transactions: Transaction[]): Promise<void> {
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;

    const statements: { statement: string, values?: any[] }[] = [];

    // 1. Delete Transaction
    statements.push({
      statement: 'DELETE FROM transactions WHERE id = ?',
      values: [id]
    });

    // 2. Revert Wallet Balance
    if (txToDelete.type === 'transfer' && (txToDelete as any).toWalletId && txToDelete.walletId) {
      const amount = Math.abs(txToDelete.amount);
      statements.push(walletService.getUpdateBalanceStatement(txToDelete.walletId, amount));
      statements.push(walletService.getUpdateBalanceStatement((txToDelete as any).toWalletId, -amount));
    } else if (txToDelete.walletId) {
      const adj = txToDelete.type === 'income' ? -txToDelete.amount : Math.abs(txToDelete.amount);
      statements.push(walletService.getUpdateBalanceStatement(txToDelete.walletId, adj));
    }

    // 3. Revert Liability
    if (txToDelete.liabilityId) {
      const interestPart = txToDelete.interestAmount || 0;
      const capitalPart = Math.max(0, Math.abs(txToDelete.amount) - interestPart);

      statements.push({
        statement: 'UPDATE liabilities SET remainingAmount = remainingAmount + ?, totalInterestPaid = MAX(0, totalInterestPaid - ?) WHERE id = ?',
        values: [capitalPart, interestPart, txToDelete.liabilityId]
      });
    }

    // 4. Revert Savings Goal
    if (txToDelete.goalId) {
      const amount = Math.abs(txToDelete.amount);
      statements.push({
        statement: 'UPDATE savings_goals SET current = MAX(0, current - ?), isCompleted = CASE WHEN current - ? >= target THEN 1 ELSE 0 END WHERE id = ?',
        values: [amount, amount, txToDelete.goalId]
      });
    }

    await databaseService.executeSet(statements);
    await databaseService.saveToStore();
  }

  async updateTransaction(id: string, updates: Partial<Transaction>, currentTransactions: Transaction[]): Promise<void> {
    const oldTx = currentTransactions.find(t => t.id === id);
    if (!oldTx) return;

    const newTx = { ...oldTx, ...updates };
    const statements: { statement: string, values?: any[] }[] = [];

    // 1. Update the transaction itself
    const txEntries = Object.entries(updates).filter(([key]) => key !== 'id');
    if (txEntries.length > 0) {
      const setClause = txEntries.map(([key]) => `"${key}" = ?`).join(', ');
      const values = txEntries.map(([, value]) => value);
      statements.push({
        statement: `UPDATE transactions SET ${setClause} WHERE id = ?`,
        values: [...values, id]
      });
    }

    // 2. Handle balance changes if amount, type, or wallet changed
    if (
      oldTx.amount !== newTx.amount || 
      oldTx.type !== newTx.type || 
      oldTx.walletId !== newTx.walletId || 
      (oldTx as any).toWalletId !== (newTx as any).toWalletId
    ) {
      // Reverse old effect
      if (oldTx.type === 'transfer' && (oldTx as any).toWalletId && oldTx.walletId) {
        const amount = Math.abs(oldTx.amount);
        statements.push(walletService.getUpdateBalanceStatement(oldTx.walletId, amount));
        statements.push(walletService.getUpdateBalanceStatement((oldTx as any).toWalletId, -amount));
      } else if (oldTx.walletId) {
        const adj = oldTx.type === 'income' ? -oldTx.amount : Math.abs(oldTx.amount);
        statements.push(walletService.getUpdateBalanceStatement(oldTx.walletId, adj));
      }

      // Apply new effect
      if (newTx.type === 'transfer' && (newTx as any).toWalletId && newTx.walletId) {
        const amount = Math.abs(newTx.amount);
        statements.push(walletService.getUpdateBalanceStatement(newTx.walletId, -amount));
        statements.push(walletService.getUpdateBalanceStatement((newTx as any).toWalletId, amount));
      } else if (newTx.walletId) {
        const adj = newTx.type === 'income' ? newTx.amount : -Math.abs(newTx.amount);
        statements.push(walletService.getUpdateBalanceStatement(newTx.walletId, adj));
      }
    }

    if (statements.length > 0) {
      await databaseService.executeSet(statements);
      await databaseService.saveToStore();
    }
  }
}

export const transactionService = new TransactionService();
