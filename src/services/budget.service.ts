import { databaseService } from './database.service';
import { Budget, Transaction } from '../types';

export interface BudgetImpact extends Budget {
  dynamicSpent: number;
}

export interface ForecastData {
  linearProjection: number;
  adjustedProjection: number;
  trend: number;
  dailyAvailable: number;
  isOverProjected: boolean;
  projectedOverAmount: number;
  daysRemaining: number;
}

export class BudgetService {
  async getBudgets(profileId: string): Promise<Budget[]> {
    const res = await databaseService.query('SELECT * FROM budgets WHERE profileId = ?', [profileId]);
    if (!res.values) return [];
    return res.values.map((b: any) => ({
      ...b,
      linkedWallets: JSON.parse(b.linkedWallets || '[]')
    }));
  }

  async addOrUpdateBudget(budget: Budget, profileId: string): Promise<void> {
    await databaseService.run(
      'INSERT OR REPLACE INTO budgets (category, subtext, spent, "limit", linkedWallets, profileId) VALUES (?, ?, ?, ?, ?, ?)',
      [budget.category, budget.subtext, budget.spent || 0, budget.limit, JSON.stringify(budget.linkedWallets || []), profileId]
    );
    await databaseService.saveToStore();
  }

  async deleteBudget(category: string): Promise<void> {
    await databaseService.run('DELETE FROM budgets WHERE category = ?', [category]);
    await databaseService.saveToStore();
  }

  async updateBudgetLimit(category: string, limit: number): Promise<void> {
    await databaseService.run('UPDATE budgets SET "limit" = ? WHERE category = ?', [limit, category]);
    await databaseService.saveToStore();
  }

  async updateBudgetWallets(category: string, walletIds: string[]): Promise<void> {
    await databaseService.run('UPDATE budgets SET linkedWallets = ? WHERE category = ?', [JSON.stringify(walletIds), category]);
    await databaseService.saveToStore();
  }

  calculateBudgetImpact(budgets: Budget[], transactions: Transaction[]): BudgetImpact[] {
    return budgets.map(budget => {
      const dynamicSpent = transactions
        .filter(tx => 
          tx.type === 'expense' && 
          tx.category === budget.category && 
          (!budget.linkedWallets || budget.linkedWallets.length === 0 || (tx.walletId && budget.linkedWallets.includes(tx.walletId)))
        )
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      return {
        ...budget,
        dynamicSpent: dynamicSpent || budget.spent
      };
    });
  }

  calculateForecast(totalSpent: number, totalLimit: number, projectionAdjustment: number): ForecastData {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const linearProjection = (totalSpent / dayOfMonth) * totalDays;
    const adjustedProjection = linearProjection + projectionAdjustment;
    const remainingDays = totalDays - dayOfMonth;
    const dailyAvailable = Math.max(0, (totalLimit - totalSpent) / (remainingDays || 1));
    const trend = totalLimit > 0 ? ((adjustedProjection - totalLimit) / totalLimit) * 100 : 0;
    
    return {
      linearProjection,
      adjustedProjection,
      trend,
      dailyAvailable,
      isOverProjected: adjustedProjection > totalLimit,
      projectedOverAmount: Math.max(0, adjustedProjection - totalLimit),
      daysRemaining: remainingDays
    };
  }
}

export const budgetService = new BudgetService();
