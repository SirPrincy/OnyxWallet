import { Mission, Achievement, Transaction, Wallet, SavingsGoal } from '../types';

export interface GamificationData {
  wallets: Wallet[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
}

export class GamificationService {
  evaluateMissions(data: GamificationData, currentMissions: Mission[]): Partial<Mission>[] {
    const { wallets, transactions } = data;
    
    // Calculate metrics
    const totalLiquidity = wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const averageMonthlyIncome = totalIncome > 0 ? Math.max(3000, totalIncome / 3) : 3000;
    
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const currentMonthTransactions = transactions.filter(t => t.timestamp >= startOfMonth);
    const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = Math.abs(currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

    const updates: (Partial<Mission> & { id: string })[] = [];

    currentMissions.forEach(m => {
      let newProgress = m.progress;
      let newTotal = m.total;
      let newLevel = m.level || 1;
      let newDesc = m.description;
      let changed = false;

      if (m.title === 'Security Buffer' || m.title === 'Emergency Fund' || m.title === 'Security Buffer I' || m.title === 'Financial Fortress') {
        const MULTIPLIERS = [1, 1.5, 2, 3, 6];
        const currentMult = MULTIPLIERS[Math.min(newLevel - 1, MULTIPLIERS.length - 1)];
        
        newTotal = averageMonthlyIncome * currentMult;
        newProgress = Math.min(totalLiquidity, newTotal);
        newDesc = `Save ${currentMult} month${currentMult > 1 ? 's' : ''} of salary`;
        if (currentMult === 6) newDesc += ' (Ultimate Security)';

        if (totalLiquidity >= newTotal && newLevel < MULTIPLIERS.length) {
          newLevel += 1;
          const nextMult = MULTIPLIERS[newLevel - 1];
          newTotal = averageMonthlyIncome * nextMult;
          newProgress = Math.min(totalLiquidity, newTotal);
          newDesc = `Save ${nextMult} month${nextMult > 1 ? 's' : ''} of salary`;
          if (nextMult === 6) newDesc += ' (Ultimate Security)';
        }
        changed = true;
      } else if (m.title === 'Diversification') {
        newTotal = 3 * newLevel;
        newProgress = wallets.length;
        if (newProgress >= newTotal && newLevel < 3) {
          newLevel += 1;
          newTotal = 3 * newLevel;
        }
        changed = true;
      } else if (m.title === 'Positive Cashflow') {
        newTotal = 1;
        newProgress = monthlyIncome > monthlyExpense ? 1 : 0;
        changed = true;
      }

      if (changed && (newProgress !== m.progress || newTotal !== m.total || newLevel !== m.level || newDesc !== m.description)) {
        updates.push({ id: m.id, progress: newProgress, total: newTotal, level: newLevel, description: newDesc });
      }
    });

    return updates;
  }

  evaluateAchievements(data: GamificationData, currentAchievements: Achievement[]): string[] {
    const { wallets, transactions, savingsGoals } = data;
    const totalLiquidity = wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
    
    const newlyEarnedIds: string[] = [];

    currentAchievements.forEach(a => {
      if (a.earned) return;
      let earned = false;
      
      if (a.title === 'First $10k') {
        earned = totalLiquidity >= 10000;
      } else if (a.title === 'Master Saver') {
        earned = savingsGoals.some(g => g.current >= g.target);
      } else if (a.title === 'Globalist') {
        earned = wallets.length > 2;
      } else if (a.title === 'Fast Starter') {
        earned = transactions.length >= 10;
      }

      if (earned) {
        newlyEarnedIds.push(a.id);
      }
    });

    return newlyEarnedIds;
  }
}

export const gamificationService = new GamificationService();
