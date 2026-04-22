import { databaseService } from './database.service';
import { SavingsGoal, Category, Liability, Mission, Achievement } from '../types';

export class FinancialService {
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
      'INSERT INTO savings_goals (id, title, desc, current, target, isCompleted, profileId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, newGoal.title, newGoal.desc, newGoal.current, newGoal.target, newGoal.isCompleted ? 1 : 0, profileId]
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

  // MISSIONS & ACHIEVEMENTS
  async getMissions(profileId: string): Promise<Mission[]> {
    const res = await databaseService.query('SELECT * FROM missions WHERE profileId = ?', [profileId]);
    return res.values || [];
  }

  async addMission(mission: Omit<Mission, 'id'>, profileId: string): Promise<Mission> {
    const id = crypto.randomUUID();
    const newMission = { ...mission, id };
    await databaseService.run(
      'INSERT INTO missions (id, title, description, progress, total, icon, type, level, profileId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, newMission.title, newMission.description, newMission.progress, newMission.total, newMission.icon, newMission.type, newMission.level || 1, profileId]
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
      'INSERT INTO achievements (id, title, icon, earned, profileId) VALUES (?, ?, ?, ?, ?)',
      [id, newAchievement.title, newAchievement.icon, newAchievement.earned ? 1 : 0, profileId]
    );
    await databaseService.saveToStore();
    return newAchievement;
  }

  async updateAchievement(id: string, earned: boolean): Promise<void> {
    await databaseService.run('UPDATE achievements SET earned = ? WHERE id = ?', [earned ? 1 : 0, id]);
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
