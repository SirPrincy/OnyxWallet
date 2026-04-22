import { 
  Transaction, Mission, Budget, Achievement 
} from './types';
import { 
  ShoppingBag, Smartphone, Utensils, Plane, Car, Hotel, 
  Heart, Award, TrendingUp, CreditCard, DollarSign,
  Dumbbell, Fuel, Landmark, Briefcase, Car as TaxiIcon,
  ArrowLeftRight, Activity, Building, BarChart, Bitcoin,
  Coffee, Code, Cpu, Diamond, GlassWater, Home, Palmtree,
  Settings, Star, User, UserCheck, Sparkles, Banknote,
  Sofa
} from 'lucide-react';
import React from 'react';
import { APP_COLORS } from './constants/colors';

const now = new Date();
const today = now.getTime();
const yesterday = new Date(now).setDate(now.getDate() - 1);
const twoDaysAgo = new Date(now).setDate(now.getDate() - 2);
const threeDaysAgo = new Date(now).setDate(now.getDate() - 3);

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Hermès Paris',
    category: 'Luxury Goods',
    amount: -2840.00,
    type: 'expense',
    date: 'Today',
    time: '02:30 PM',
    icon: 'shopping_bag',
    timestamp: today,
  },
  {
    id: '2',
    title: 'Apple Store Regent St.',
    category: 'Tech',
    amount: -1299.00,
    type: 'expense',
    date: 'Today',
    time: '09:41 AM',
    icon: 'shopping_bag',
    timestamp: today,
  },
  {
    id: '3',
    title: 'The Alchemist',
    category: 'Dining',
    amount: -84.50,
    type: 'expense',
    date: 'Today',
    time: '12:30 PM',
    icon: 'restaurant',
    timestamp: today,
  },
  {
    id: '4',
    title: 'Salary Deposit',
    category: 'Monthly',
    amount: 8450.00,
    type: 'income',
    date: 'Today',
    time: '08:00 AM',
    icon: 'payments',
    timestamp: today,
  },
  {
    id: '5',
    title: 'NetJets Service',
    category: 'Private Aviation',
    amount: -14500.00,
    type: 'expense',
    date: 'Yesterday',
    time: '04:15 PM',
    icon: 'local_gas_station',
    timestamp: yesterday,
  },
  {
    id: '6',
    title: 'Uber Premium',
    category: 'Transport',
    amount: -42.20,
    type: 'expense',
    date: 'Yesterday',
    time: '11:15 PM',
    icon: 'local_taxi',
    timestamp: yesterday,
  },
  {
    id: '7',
    title: 'Aman Tokyo',
    category: 'Hospitality',
    amount: -4200.00,
    type: 'expense',
    date: '2 days ago',
    time: '08:00 PM',
    icon: 'hotel',
    timestamp: twoDaysAgo,
  },
  {
    id: '8',
    title: 'Rolex Boutique',
    category: 'Luxury Goods',
    amount: -18500.00,
    type: 'expense',
    date: '3 days ago',
    time: '11:00 AM',
    icon: 'shopping_bag',
    timestamp: threeDaysAgo,
  },
  {
    id: '9',
    title: 'Dividends',
    category: 'Investment',
    amount: 1250.00,
    type: 'income',
    date: '3 days ago',
    time: '09:00 AM',
    icon: 'payments',
    timestamp: threeDaysAgo,
  },
];

export const MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Rebalance Luxury Portfolio',
    description: 'Align assets to target weights',
    progress: 65,
    total: 100,
    icon: 'auto_graph',
    type: 'growth',
  },
  {
    id: '2',
    title: 'Offshore Transfer Audit',
    description: 'Due in 2 days',
    progress: 0,
    total: 1,
    icon: 'account_balance',
    type: 'audit',
  },
  {
    id: '3',
    title: 'Asset Appraisal: Jewelry',
    description: 'Pending Approval',
    progress: 0,
    total: 1,
    icon: 'diamond',
    type: 'appraisal',
  },
];

export const BUDGETS: Budget[] = [
  {
    category: 'Fine Dining',
    subtext: 'GASTRONOMY & SPIRITS',
    spent: 8200,
    limit: 10000,
    linkedWallets: ['main'],
  },
  {
    category: 'First Class Travel',
    subtext: 'AVIATION & RETREATS',
    spent: 15400,
    limit: 25000,
    linkedWallets: ['offshore'],
  },
  {
    category: 'Luxury Goods',
    subtext: 'TIMEPIECES & COUTURE',
    spent: 12000,
    limit: 15000,
    linkedWallets: ['main', 'offshore'],
  },
  {
    category: 'Lifestyle',
    subtext: 'WELLNESS & CONCIERGE',
    spent: 7250,
    limit: 10000,
    linkedWallets: ['main'],
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First $10k', icon: 'star', earned: true },
  { id: '2', title: '30 Day Streak', icon: 'local_fire_department', earned: true },
  { id: '3', title: 'Master Saver', icon: 'workspace_premium', earned: true },
  { id: '4', title: 'Fast Starter', icon: 'rocket_launch', earned: true },
  { id: '5', title: 'Century Club', icon: 'diamond', earned: false },
  { id: '6', title: 'Safe Guard', icon: 'shield', earned: false },
  { id: '7', title: 'Globalist', icon: 'public', earned: false },
  { id: '8', title: 'Alchemist', icon: 'auto_awesome', earned: false },
];

export const ICON_OPTIONS = [
  { id: 'shopping_bag', icon: ShoppingBag },
  { id: 'smartphone', icon: Smartphone },
  { id: 'restaurant', icon: Utensils },
  { id: 'plane', icon: Plane },
  { id: 'local_taxi', icon: TaxiIcon },
  { id: 'hotel', icon: Hotel },
  { id: 'heart', icon: Heart },
  { id: 'award', icon: Award },
  { id: 'trending-up', icon: TrendingUp },
  { id: 'credit-card', icon: CreditCard },
  { id: 'payments', icon: DollarSign },
  { id: 'fitness_center', icon: Dumbbell },
  { id: 'local_gas_station', icon: Fuel },
  { id: 'landmark', icon: Landmark },
  { id: 'briefcase', icon: Briefcase },
  { id: 'swap_horiz', icon: ArrowLeftRight },
  { id: 'activity', icon: Activity },
  { id: 'building', icon: Building },
  { id: 'bar-chart', icon: BarChart },
  { id: 'bitcoin', icon: Bitcoin },
  { id: 'coffee', icon: Coffee },
  { id: 'code', icon: Code },
  { id: 'cpu', icon: Cpu },
  { id: 'diamond', icon: Diamond },
  { id: 'glass-water', icon: GlassWater },
  { id: 'home', icon: Home },
  { id: 'palmtree', icon: Palmtree },
  { id: 'settings', icon: Settings },
  { id: 'star', icon: Star },
  { id: 'user', icon: User },
  { id: 'user-check', icon: UserCheck },
  { id: 'sparkles', icon: Sparkles },
  { id: 'banknote', icon: Banknote },
  { id: 'sofa', icon: Sofa }
];

export const ICON_MAP: Record<string, React.ElementType> = ICON_OPTIONS.reduce((acc, opt) => ({
  ...acc,
  [opt.id]: opt.icon
}), {});

export const COLOR_OPTIONS = APP_COLORS.categories;
