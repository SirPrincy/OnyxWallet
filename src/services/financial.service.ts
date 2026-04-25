import { databaseService } from './database.service';
import { SavingsGoal, Category, Liability, Mission, Achievement, Transaction, RecurringTransaction, Profile, GoalContribution } from '../types';

export class FinancialService {
  // PROFILE
  async updateProfile(id: string, updates: Partial<Profile>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await databaseService.run(`UPDATE profiles SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  // SAVINGS GOALS
  async getSavingsGoals(profileId: string): Promise<SavingsGoal[]> {
    const res = await databaseService.query('SELECT * FROM savings_goals WHERE profileId = ?', [profileId]);
    if (!res.values) return [];
    return res.values.map((g: any) => ({ ...g, isCompleted: g.isCompleted === 1 }));
  }

  async addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'isCompleted'>, profileId: string): Promise<SavingsGoal> {
    const id = crypto.randomUUID();
    const newGoal: SavingsGoal = { ...goal, id, isCompleted: goal.current >= goal.target };
    await databaseService.run(
      'INSERT INTO savings_goals (id, title, desc, current, target, isCompleted, targetDate, priority, icon, color, category, inflationRate, autoAllocationPercent, linkedWalletId, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, newGoal.title, newGoal.desc, newGoal.current, newGoal.target, newGoal.isCompleted ? 1 : 0, newGoal.targetDate, newGoal.priority, newGoal.icon, newGoal.color, newGoal.category, newGoal.inflationRate || 0, newGoal.autoAllocationPercent || 0, newGoal.linkedWalletId, profileId]
    );
    await databaseService.saveToStore();
    return newGoal;
  }

  async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([key, value]) => key === 'isCompleted' ? (value ? 1 : 0) : value);
    await databaseService.run(`UPDATE savings_goals SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  async deleteSavingsGoal(id: string): Promise<void> {
    await databaseService.run('DELETE FROM savings_goals WHERE id = ?', [id]);
    await databaseService.saveToStore();
  }

  async addGoalContribution(contribution: Omit<GoalContribution, 'id'>, profileId: string): Promise<void> {
    const id = crypto.randomUUID();
    await databaseService.run(
      'INSERT INTO goal_contributions (id, goalId, amount, date, timestamp, walletId, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, contribution.goalId, contribution.amount, contribution.date, contribution.timestamp, contribution.walletId, profileId]
    );
    await databaseService.saveToStore();
  }

  async getGoalContributions(goalId: string): Promise<GoalContribution[]> {
    const res = await databaseService.query('SELECT * FROM goal_contributions WHERE goalId = ? ORDER BY timestamp DESC', [goalId]);
    return res.values || [];
  }

  // LIABILITIES
  async getLiabilities(profileId: string): Promise<Liability[]> {
    const res = await databaseService.query('SELECT * FROM liabilities WHERE profileId = ?', [profileId]);
    return res.values || [];
  }

  async addLiability(liability: Omit<Liability, 'id'>, profileId: string): Promise<Liability> {
    const id = crypto.randomUUID();
    const newLiability = { ...liability, id };
    await databaseService.run(
      'INSERT INTO liabilities (id, name, type, totalAmount, remainingAmount, interestRate, monthlyPayment, dueDate, provider, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, newLiability.name, newLiability.type, newLiability.totalAmount, newLiability.remainingAmount, newLiability.interestRate, newLiability.monthlyPayment, newLiability.dueDate, newLiability.provider, profileId]
    );
    await databaseService.saveToStore();
    return newLiability;
  }

  async updateLiability(id: string, updates: Partial<Liability>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await databaseService.run(`UPDATE liabilities SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  async deleteLiability(id: string): Promise<void> {
    await databaseService.run('DELETE FROM liabilities WHERE id = ?', [id]);
    await databaseService.saveToStore();
  }

  async payLiability(id: string, amount: number): Promise<void> {
    await databaseService.run(
      'UPDATE liabilities SET remainingAmount = MAX(0, remainingAmount - ?) WHERE id = ?',
      [amount, id]
    );
    await databaseService.saveToStore();
  }

  // CATEGORIES
  async getCategories(profileId: string): Promise<Category[]> {
    const res = await databaseService.query('SELECT * FROM categories WHERE profileId = ?', [profileId]);
    if (!res.values) return [];
    return res.values.map((c: any) => ({ ...c, subcategories: JSON.parse(c.subcategories || '[]') }));
  }

  async addCategory(category: Omit<Category, 'id'>, profileId: string): Promise<Category> {
    const id = crypto.randomUUID();
    const newCat = { ...category, id };
    await databaseService.run(
      'INSERT INTO categories (id, name, icon, color, type, subcategories, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, newCat.name, newCat.icon, newCat.color, newCat.type, JSON.stringify(newCat.subcategories || []), profileId]
    );
    await databaseService.saveToStore();
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([key, value]) => key === 'subcategories' ? JSON.stringify(value) : value);
    await databaseService.run(`UPDATE categories SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  async deleteCategory(id: string): Promise<void> {
    await databaseService.run('DELETE FROM categories WHERE id = ?', [id]);
    await databaseService.saveToStore();
  }

  async renameCategoryInRelatedTables(oldName: string, newName: string): Promise<void> {
    await databaseService.executeSet([
      { statement: 'UPDATE transactions SET category = ? WHERE category = ?', values: [newName, oldName] },
      { statement: 'UPDATE budgets SET category = ? WHERE category = ?', values: [newName, oldName] }
    ]);
    await databaseService.saveToStore();
  }

  // RECURRING TRANSACTIONS
  async addRecurringTransaction(recurring: Omit<RecurringTransaction, 'id'>, profileId: string): Promise<RecurringTransaction> {
    const id = crypto.randomUUID();
    const newRecurring = { ...recurring, id };
    await databaseService.run(
      'INSERT INTO recurring_transactions (id, name, amount, type, category, frequency, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, newRecurring.name, newRecurring.amount, newRecurring.type, newRecurring.category, newRecurring.frequency, profileId]
    );
    await databaseService.saveToStore();
    return newRecurring;
  }

  async updateRecurringTransaction(id: string, updates: Partial<RecurringTransaction>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await databaseService.run(`UPDATE recurring_transactions SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  async deleteRecurringTransaction(id: string): Promise<void> {
    await databaseService.run('DELETE FROM recurring_transactions WHERE id = ?', [id]);
    await databaseService.saveToStore();
  }

  // MISSIONS & ACHIEVEMENTS
  async getMissions(profileId: string): Promise<Mission[]> {
    const res = await databaseService.query('SELECT * FROM missions WHERE profileId = ?', [profileId]);
    return res.values || [];
  }

  async addMission(mission: Omit<Mission, 'id'>, profileId: string): Promise<Mission> {
    const id = crypto.randomUUID();
    const newMission = { ...mission, id };
    await databaseService.run(
      'INSERT INTO missions (id, title, description, progress, total, icon, type, category, level, maxLevel, status, unlockedAtLevel, path, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, newMission.title, newMission.description, newMission.progress, newMission.total, newMission.icon, newMission.type, newMission.category || 'growth', newMission.level || 1, newMission.maxLevel, newMission.status || 'active', newMission.unlockedAtLevel || 1, newMission.path || 'neutral', profileId]
    );
    await databaseService.saveToStore();
    return newMission;
  }

  async updateMission(id: string, updates: Partial<Mission>): Promise<void> {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const setClause = entries.map(([key]) => `"${key}" = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await databaseService.run(`UPDATE missions SET ${setClause} WHERE id = ?`, [...values, id]);
    await databaseService.saveToStore();
  }

  async getAchievements(profileId: string): Promise<Achievement[]> {
    const res = await databaseService.query('SELECT * FROM achievements WHERE profileId = ?', [profileId]);
    if (!res.values) return [];
    return res.values.map((a: any) => ({ ...a, earned: a.earned === 1 }));
  }

  async addAchievement(achievement: Omit<Achievement, 'id'>, profileId: string): Promise<Achievement> {
    const id = crypto.randomUUID();
    const newAchievement = { ...achievement, id };
    await databaseService.run(
      'INSERT INTO achievements (id, title, icon, earned, rarity, description, earnedDate, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, newAchievement.title, newAchievement.icon, newAchievement.earned ? 1 : 0, newAchievement.rarity || 'common', newAchievement.description, newAchievement.earnedDate, profileId]
    );
    await databaseService.saveToStore();
    return newAchievement;
  }

  async updateAchievement(id: string, earned: boolean): Promise<void> {
    const earnedDate = earned ? new Date().toISOString() : null;
    await databaseService.run('UPDATE achievements SET earned = ?, earnedDate = ? WHERE id = ?', [earned ? 1 : 0, earnedDate, id]);
    await databaseService.saveToStore();
  }

  calculateIncomeStatement(
    transactions: Transaction[], 
    recurringTransactions: RecurringTransaction[], 
    period: 'Monthly' | 'Quarterly' | 'Annually'
  ) {
    const baseRevenue = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const baseExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const multiplier = period === 'Annually' ? 12 : period === 'Quarterly' ? 3 : 1;

    let recurringMonthlyRevenue = 0;
    let recurringMonthlyExpenses = 0;
    
    const categoryTotals: Record<string, number> = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc: Record<string, number>, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {});

    recurringTransactions.forEach(rec => {
      let monthlyEquiv = rec.amount;
      if (rec.frequency === 'Quarterly') monthlyEquiv = rec.amount / 3;
      if (rec.frequency === 'Annually') monthlyEquiv = rec.amount / 12;

      if (rec.type === 'income') {
        recurringMonthlyRevenue += monthlyEquiv;
      } else {
        recurringMonthlyExpenses += monthlyEquiv;
        categoryTotals[rec.category] = (categoryTotals[rec.category] || 0) + monthlyEquiv;
      }
    });

    const totalRevenue = (baseRevenue + recurringMonthlyRevenue) * multiplier;
    const totalExpenses = (baseExpenses + recurringMonthlyExpenses) * multiplier;
    const netIncome = totalRevenue - totalExpenses;

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome: netIncome,
      categories: Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount: amount * multiplier
      })).sort((a, b) => b.amount - a.amount)
    };
  }
}

export const financialService = new FinancialService();
