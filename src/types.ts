export type WealthPath = 'investor' | 'frugal' | 'neutral' | 'guardian' | 'catalyst' | 'alchemist' | 'nomad' | 'legacy';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  subcategoryIcon?: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  date: string;
  time: string;
  icon: string;
  timestamp: number;
  walletId?: string;
  liabilityId?: string;
  goalId?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: string;
  type: 'short' | 'medium' | 'long' | 'flash';
  category: 'growth' | 'audit' | 'appraisal';
  level: number;
  maxLevel?: number;
  status: 'active' | 'completed' | 'locked';
  unlockedAtLevel: number;
  path?: WealthPath;
}

export interface Budget {
  category: string;
  subtext: string;
  spent: number;
  limit: number;
  linkedWallets?: string[]; // IDs of linked wallets
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description?: string;
  earnedDate?: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'Credit Card' | 'Bank Account' | 'Cash' | 'Crypto' | 'Investment' | 'Property' | 'Mobile Money';
  balance: number;
  currency: string;
  color: string;
  icon?: string;
  lastFour?: string;
  provider?: string;
  isVisible: boolean;
}

export interface Liability {
  id: string;
  name: string;
  type: 'Mortgage' | 'Personal Loan' | 'Student Loan' | 'Credit Card' | 'Other' | 'Leasing';
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: string;
  provider: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  desc: string;
  current: number;
  target: number;
  isCompleted: boolean;
  targetDate?: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  color: string;
  category: 'emergency' | 'luxury' | 'travel' | 'investment' | 'other';
  inflationRate?: number;
  autoAllocationPercent?: number;
  linkedWalletId?: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  timestamp: number;
  walletId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  subcategories: { name: string, icon: string }[];
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annually';
}

export interface Profile {
  id: string;
  name: string;
  passcode: string | null;
  role: string;
  tier: string;
  status: string;
  lastActive: string | number;
  image?: string;
  color: string;
  currency: string;
  path?: WealthPath;
}

export interface TierData {
  tierName: string;
  level: number;
  progressPercent: number;
  xpLeft: number;
  nextTier: string;
}
