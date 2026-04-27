import { databaseService } from './database.service';
import { profileService } from './profile.service';

export class BackupService {
  private tables = [
    'profiles', 'wallets', 'transactions', 'budgets', 'savings_goals',
    'categories', 'liabilities', 'recurring_transactions', 'missions', 'achievements'
  ];

  async exportVault(): Promise<string> {
    const backup: Record<string, any[]> = {};

    for (const table of this.tables) {
      const res = await databaseService.query(`SELECT * FROM ${table}`);
      backup[table] = res.values || [];
    }

    return JSON.stringify(backup, null, 2);
  }

  async importVault(json: string): Promise<void> {
    const data = JSON.parse(json);

    // We only import tables that exist in our schema
    for (const table of this.tables) {
      if (data[table] && Array.isArray(data[table])) {
        for (const row of data[table]) {
          const keys = Object.keys(row);
          const placeholders = keys.map(() => '?').join(', ');
          const columns = keys.map(k => `"${k}"`).join(', ');
          const values = Object.values(row);

          // Handle table-specific logic if needed
          // e.g., avoid duplicates for profiles
          if (table === 'profiles') {
             const exists = await databaseService.query('SELECT id FROM profiles WHERE id = ?', [row.id]);
             if (exists.values && exists.values.length > 0) {
                // If profile exists, maybe skip or update.
                // Given the requirement "merge" / "multiple vault",
                // we should probably check if the ID is already there.
                // If it is, we skip this row to avoid primary key conflict.
                continue;
             }
          }

          // Generic insert (Ignore if already exists to be safe and allow partial merges)
          try {
            await databaseService.run(
              `INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${placeholders})`,
              values
            );
          } catch (err) {
            console.error(`Failed to import row into ${table}:`, err);
          }
        }
      }
    }
    await databaseService.saveToStore();
  }

  async downloadBackup() {
    const json = await this.exportVault();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onyx-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const backupService = new BackupService();
