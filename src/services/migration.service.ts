import { databaseService } from './database.service';
import { settingsService } from './settings.service';

class MigrationService {
  async migrateFromLocalStorage(): Promise<void> {
    const isMigrated = await settingsService.getSetting<boolean>('is_sqlite_migrated');
    if (isMigrated) return;

    console.log('Starting migration from LocalStorage to SQLite...');

    try {
      // 1. Profiles
      const profiles = JSON.parse(localStorage.getItem('onyx_saved_profiles') || '[]');
      let defaultProfileId = 'default_profile';
      
      for (const p of profiles) {
        const pId = p.id || Math.random().toString(36).substr(2, 9);
        if (defaultProfileId === 'default_profile') defaultProfileId = pId;
        
        await databaseService.run(
          `INSERT OR IGNORE INTO profiles (id, name, passcode, role, tier, status, lastActive, image, color) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pId, p.name, p.passcode, p.role || 'Owner', p.tier || 'Standard', p.status || 'Active', p.lastActive || 'Now', p.image, p.color || 'border-primary']
        );
      }

      // 2. Wallets
      const wallets = JSON.parse(localStorage.getItem('onyx_wallets') || '[]');
      for (const wallet of wallets) {
        await databaseService.run(
          `INSERT OR IGNORE INTO wallets (id, name, type, balance, currency, color, icon, lastFour, provider, isVisible, profileId) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [wallet.id, wallet.name, wallet.type, wallet.balance, wallet.currency, wallet.color, wallet.icon, wallet.lastFour, wallet.provider, wallet.isVisible ? 1 : 0, defaultProfileId]
        );
      }

      // 3. Transactions
      const transactions = JSON.parse(localStorage.getItem('onyx_transactions') || '[]');
      for (const tx of transactions) {
        await databaseService.run(
          `INSERT OR IGNORE INTO transactions (id, title, category, subcategory, subcategoryIcon, amount, type, date, time, icon, timestamp, walletId, profileId) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tx.id, tx.title, tx.category, tx.subcategory, tx.subcategoryIcon, tx.amount, tx.type, tx.date, tx.time, tx.icon, tx.timestamp, tx.walletId, defaultProfileId]
        );
      }

      // 4. Budgets
      const budgets = JSON.parse(localStorage.getItem('onyx_budgets') || '[]');
      for (const budget of budgets) {
        await databaseService.run(
          `INSERT OR IGNORE INTO budgets (category, subtext, spent, "limit", linkedWallets, profileId) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [budget.category, budget.subtext, budget.spent, budget.limit, JSON.stringify(budget.linkedWallets || []), defaultProfileId]
        );
      }

      // 5. Savings Goals
      const goals = JSON.parse(localStorage.getItem('onyx_savings_goals') || '[]');
      for (const goal of goals) {
        await databaseService.run(
          `INSERT OR IGNORE INTO savings_goals (id, title, desc, current, target, isCompleted, profileId) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [goal.id, goal.title, goal.desc, goal.current, goal.target, goal.isCompleted ? 1 : 0, defaultProfileId]
        );
      }

      // 6. Categories
      const categories = JSON.parse(localStorage.getItem('onyx_categories') || '[]');
      for (const cat of categories) {
        await databaseService.run(
          `INSERT OR IGNORE INTO categories (id, name, icon, color, type, subcategories, profileId) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cat.id, cat.name, cat.icon, cat.color, cat.type, JSON.stringify(cat.subcategories || []), defaultProfileId]
        );
      }

      // 7. Liabilities
      const liabilities = JSON.parse(localStorage.getItem('onyx_liabilities') || '[]');
      for (const l of liabilities) {
        await databaseService.run(
          `INSERT OR IGNORE INTO liabilities (id, name, type, totalAmount, remainingAmount, interestRate, monthlyPayment, dueDate, provider, profileId) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [l.id, l.name, l.type, l.totalAmount, l.remainingAmount, l.interestRate, l.monthlyPayment, l.dueDate, l.provider, defaultProfileId]
        );
      }

      // 8. Settings
      const isPasscodeEnabled = localStorage.getItem('isOnyxPasscodeEnabled') !== 'false';
      await settingsService.setSetting('is_passcode_enabled', isPasscodeEnabled);

      await databaseService.saveToStore();
      await settingsService.setSetting('is_sqlite_migrated', true);
      
      console.log('Migration completed successfully.');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

export const migrationService = new MigrationService();
