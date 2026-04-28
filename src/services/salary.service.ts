import { Profile } from '../types';
import { Temporal } from '@js-temporal/polyfill';
import { transactionService } from './transaction.service';
import { financialService } from './financial.service';

export class SalaryService {
  async processAutoSalary(profile: Profile): Promise<void> {
    if (!profile.monthlySalary || !profile.autoAddSalary || !profile.salaryDay) return;

    const now = Temporal.Now.plainDateISO();
    const currentYearMonth = `${now.year}-${String(now.month).padStart(2, '0')}`;

    // If already added this month, skip
    if (profile.lastSalaryAdded === currentYearMonth) return;

    // Check if it's the day or later
    if (now.day >= profile.salaryDay) {
      // Add the transaction
      await transactionService.addTransaction({
        title: `Flux: ${profile.salarySource || 'Apport Mensuel'}`,
        amount: profile.monthlySalary,
        type: 'income',
        category: 'Capital Inflow',
        walletId: profile.salaryWalletId,
        icon: 'payments',
        timestamp: Temporal.Now.instant().epochMilliseconds
      }, profile.id);

      // Update profile with last salary added month
      await financialService.updateProfile(profile.id, { lastSalaryAdded: currentYearMonth });
    }
  }

  calculateAnnualized(monthlySalary: number): number {
    return monthlySalary * 12;
  }

  getDaysUntilNextSalary(salaryDay: number): number {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let targetDate = new Date(currentYear, currentMonth, salaryDay);
    if (today > salaryDay) {
      targetDate = new Date(currentYear, currentMonth + 1, salaryDay);
    }

    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const salaryService = new SalaryService();
