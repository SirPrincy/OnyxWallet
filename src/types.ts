import React from 'react';

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
  type: 'growth' | 'audit' | 'appraisal';
  level: number;
  maxLevel?: number;
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
}

export interface Wallet {
  id: string;
  name: string;
  type: 'Credit Card' | 'Bank Account' | 'Cash' | 'Crypto' | 'Investment' | 'Property';
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
}

export interface TierData {
  tierName: string;
  level: number;
  progressPercent: number;
  xpLeft: number;
  nextTier: string;
}
