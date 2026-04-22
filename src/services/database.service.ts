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
        level INTEGER DEFAULT 1,
        profileId TEXT
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        earned INTEGER DEFAULT 0,
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
        color TEXT
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
            console.log(`Added level column to missions`);
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
}

export const databaseService = new DatabaseService();
