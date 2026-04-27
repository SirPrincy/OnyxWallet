import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

class DatabaseService {
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private dbName: string = 'onyx_wallet';

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  private initializationPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        const platform = Capacitor.getPlatform();
        
        if (platform === 'web') {
          const jeepSqlite = document.querySelector('jeep-sqlite');
          if (jeepSqlite) {
            await this.sqliteConnection.initWebStore();
          }
        }

        this.db = await this.sqliteConnection.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );

        await this.db.open();
        await this.createTables();
        await this.migrateSchema();
      } catch (error) {
        console.error('Database initialization failed:', error);
        this.initializationPromise = null; // Allow retry
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    const schema = `
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL,
        currency TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT,
        lastFour TEXT,
        provider TEXT,
        isVisible INTEGER DEFAULT 1,
        autoSavePercent REAL DEFAULT 0,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        subcategoryIcon TEXT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        icon TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        walletId TEXT,
        toWalletId TEXT,
        profileId TEXT,
        liabilityId TEXT,
        goalId TEXT,
        FOREIGN KEY (walletId) REFERENCES wallets (id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS budgets (
        category TEXT PRIMARY KEY,
        subtext TEXT,
        spent REAL NOT NULL DEFAULT 0,
        "limit" REAL NOT NULL,
        linkedWallets TEXT,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS savings_goals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        desc TEXT,
        current REAL NOT NULL DEFAULT 0,
        target REAL NOT NULL,
        isCompleted INTEGER DEFAULT 0,
        targetDate TEXT,
        priority TEXT DEFAULT 'medium',
        icon TEXT,
        color TEXT,
        category TEXT DEFAULT 'other',
        inflationRate REAL DEFAULT 0,
        autoAllocationPercent REAL DEFAULT 0,
        linkedWalletId TEXT,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL,
        subcategories TEXT,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS liabilities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        remainingAmount REAL NOT NULL,
        interestRate REAL NOT NULL,
        monthlyPayment REAL NOT NULL,
        dueDate TEXT NOT NULL,
        provider TEXT NOT NULL,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS recurring_transactions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        frequency TEXT NOT NULL,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS missions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        progress REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 100,
        icon TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT DEFAULT 'growth',
        level INTEGER DEFAULT 1,
        maxLevel INTEGER,
        status TEXT DEFAULT 'active',
        unlockedAtLevel INTEGER DEFAULT 1,
        path TEXT DEFAULT 'neutral',
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        earned INTEGER DEFAULT 0,
        rarity TEXT DEFAULT 'common',
        description TEXT,
        earnedDate TEXT,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        passcode TEXT,
        role TEXT,
        tier TEXT,
        status TEXT,
        lastActive TEXT,
        image TEXT,
        color TEXT,
        currency TEXT DEFAULT 'USD',
        path TEXT DEFAULT 'neutral',
        monthlySalary REAL DEFAULT 0,
        salaryDay INTEGER DEFAULT 1,
        salarySource TEXT,
        salaryWalletId TEXT,
        autoAddSalary INTEGER DEFAULT 0,
        lastSalaryAdded TEXT
      );
    `;

    try {
      await this.db.execute(schema);
    } catch (error) {
      console.error('Failed to create tables:', error);
    }
  }

  private async migrateSchema(): Promise<void> {
    if (!this.db) return;
    
    const tables = [
      'wallets', 'transactions', 'budgets', 'savings_goals', 
      'categories', 'liabilities', 'recurring_transactions',
      'missions', 'achievements'
    ];

    for (const table of tables) {
      try {
        const res = await this.db.query(`PRAGMA table_info(${table})`);
        if (res.values && !res.values.some((col: any) => col.name === 'profileId')) {
          await this.db.execute(`ALTER TABLE ${table} ADD COLUMN profileId TEXT`);
          console.log(`Added profileId column to ${table}`);
        }

        if (table === 'missions') {
          if (res.values && !res.values.some((col: any) => col.name === 'level')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN level INTEGER DEFAULT 1`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'category')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN category TEXT DEFAULT 'growth'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'maxLevel')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN maxLevel INTEGER`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'status')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN status TEXT DEFAULT 'active'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'unlockedAtLevel')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN unlockedAtLevel INTEGER DEFAULT 1`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'path')) {
            await this.db.execute(`ALTER TABLE missions ADD COLUMN path TEXT DEFAULT 'neutral'`);
          }
        }

        if (table === 'achievements') {
          if (res.values && !res.values.some((col: any) => col.name === 'rarity')) {
            await this.db.execute(`ALTER TABLE achievements ADD COLUMN rarity TEXT DEFAULT 'common'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'description')) {
            await this.db.execute(`ALTER TABLE achievements ADD COLUMN description TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'earnedDate')) {
            await this.db.execute(`ALTER TABLE achievements ADD COLUMN earnedDate TEXT`);
          }
        }

        if (table === 'savings_goals') {
          if (res.values && !res.values.some((col: any) => col.name === 'targetDate')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN targetDate TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'priority')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN priority TEXT DEFAULT 'medium'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'icon')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN icon TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'color')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN color TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'category')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN category TEXT DEFAULT 'other'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'inflationRate')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN inflationRate REAL DEFAULT 0`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'autoAllocationPercent')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN autoAllocationPercent REAL DEFAULT 0`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'linkedWalletId')) {
            await this.db.execute(`ALTER TABLE savings_goals ADD COLUMN linkedWalletId TEXT`);
          }
        }

        if (table === 'profiles') {
          if (res.values && !res.values.some((col: any) => col.name === 'path')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN path TEXT DEFAULT 'neutral'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'currency')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN currency TEXT DEFAULT 'USD'`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'monthlySalary')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN monthlySalary REAL DEFAULT 0`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'salaryDay')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN salaryDay INTEGER DEFAULT 1`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'salarySource')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN salarySource TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'salaryWalletId')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN salaryWalletId TEXT`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'autoAddSalary')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN autoAddSalary INTEGER DEFAULT 0`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'lastSalaryAdded')) {
            await this.db.execute(`ALTER TABLE profiles ADD COLUMN lastSalaryAdded TEXT`);
          }
        }

        if (table === 'wallets') {
          if (res.values && !res.values.some((col: any) => col.name === 'autoSavePercent')) {
            await this.db.execute(`ALTER TABLE wallets ADD COLUMN autoSavePercent REAL DEFAULT 0`);
          }
        }

        if (table === 'transactions') {
          if (res.values && !res.values.some((col: any) => col.name === 'toWalletId')) {
            await this.db.execute(`ALTER TABLE transactions ADD COLUMN toWalletId TEXT`);
            console.log(`Added toWalletId column to transactions`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'liabilityId')) {
            await this.db.execute(`ALTER TABLE transactions ADD COLUMN liabilityId TEXT`);
            console.log(`Added liabilityId column to transactions`);
          }
          if (res.values && !res.values.some((col: any) => col.name === 'goalId')) {
            await this.db.execute(`ALTER TABLE transactions ADD COLUMN goalId TEXT`);
            console.log(`Added goalId column to transactions`);
          }
        }
      } catch (error) {
        console.error(`Failed to migrate schema for ${table}:`, error);
      }
    }
  }

  private operationQueue: Promise<any> = Promise.resolve();

  private async enqueue<T>(operation: () => Promise<T>): Promise<T> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
    
    if (!this.db) throw new Error('Database not initialized');

    const nextInQueue = this.operationQueue.then(operation);
    this.operationQueue = nextInQueue.catch(() => {});
    return nextInQueue;
  }

  async query(statement: string, values: any[] = []): Promise<any> {
    return this.enqueue(() => this.db!.query(statement, values));
  }

  async run(statement: string, values: any[] = []): Promise<any> {
    return this.enqueue(() => this.db!.run(statement, values));
  }

  async execute(statements: string): Promise<any> {
    return this.enqueue(() => this.db!.execute(statements));
  }

  async executeSet(set: { statement: string, values?: any[] }[]): Promise<any> {
    return this.enqueue(() => this.db!.executeSet(set));
  }

  async saveToStore(): Promise<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      await this.sqliteConnection.saveToStore(this.dbName);
    }
  }

  /**
   * Returns a disposable database session that automatically handles
   * any cleanup or specific session-level logic.
   * Leverages TS 6.0 'using' keyword support.
   */
  async getSession() {
    await this.init();
    const self = this;
    return {
      db: this.db!,
      [Symbol.asyncDispose]: async () => {
        // In a more complex app, we might close the connection or
        // release a lock here. For Onyx, we ensure the store is saved.
        await self.saveToStore();
      }
    };
  }
}

export const databaseService = new DatabaseService();
