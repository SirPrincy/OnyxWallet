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
  Sofa, Flame, Rocket, Globe, Wallet
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
    type: 'short',
    category: 'growth',
    level: 1,
    status: 'active',
    unlockedAtLevel: 1
  },
  {
    id: '2',
    title: 'Offshore Transfer Audit',
    description: 'Due in 2 days',
    progress: 0,
    total: 1,
    icon: 'account_balance',
    type: 'medium',
    category: 'audit',
    level: 1,
    status: 'active',
    unlockedAtLevel: 1
  },
  {
    id: '3',
    title: 'Asset Appraisal: Jewelry',
    description: 'Pending Approval',
    progress: 0,
    total: 1,
    icon: 'diamond',
    type: 'flash',
    category: 'appraisal',
    level: 1,
    status: 'active',
    unlockedAtLevel: 1
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
  // These will be overridden by the store's initial state from gamificationService.ALL_ACHIEVEMENTS
  { id: 'first_10k', title: 'Premier $10k', icon: 'trending-up', earned: false, rarity: 'common' },
  { id: 'saver_initiation', title: 'Initié de l\'Épargne', icon: 'target', earned: false, rarity: 'common' },
  { id: 'tx_starter', title: 'Explorateur', icon: 'zap', earned: false, rarity: 'common' },
  { id: 'wallet_duo', title: 'Diversificateur Junior', icon: 'wallet', earned: false, rarity: 'common' },
  { id: 'milestone_50k', title: 'Cap des 50k', icon: 'award', earned: false, rarity: 'rare' },
  { id: 'goal_slayer', title: 'Réalisateur d\'Elite', icon: 'check-circle', earned: false, rarity: 'rare' },
  { id: 'global_investor', title: 'Investisseur Global', icon: 'globe', earned: false, rarity: 'rare' },
  { id: 'six_figure_club', title: 'Club des 6 Chiffres', icon: 'diamond', earned: false, rarity: 'epic' },
  { id: 'luxury_collector', title: 'Collectionneur de Luxe', icon: 'shopping-bag', earned: false, rarity: 'epic' },
  { id: 'portfolio_pro', title: 'Portfolio Pro', icon: 'bar-chart', earned: false, rarity: 'epic' },
  { id: 'investment_whale', title: 'Baleine d\'Investissement', icon: 'trending-up', earned: false, rarity: 'epic' },
  { id: 'half_millionaire', title: 'Demi-Millionnaire', icon: 'star', earned: false, rarity: 'legendary' },
  { id: 'onyx_titan', title: 'Titan d\'Onyx', icon: 'crown', earned: false, rarity: 'legendary' },
  { id: 'wealth_architect', title: 'Architecte de Fortune', icon: 'building', earned: false, rarity: 'legendary' },
  { id: 'legacy_builder', title: 'Bâtisseur d\'Héritage', icon: 'landmark', earned: false, rarity: 'legendary' },
  { id: 'early_adopter', title: 'Early Adopter', icon: 'rocket', earned: false, rarity: 'common' },
  { id: 'frugal_master', title: 'Maître de la Frugalité', icon: 'shield', earned: false, rarity: 'rare' },
  { id: 'crypto_pioneer', title: 'Pionnier Crypto', icon: 'bitcoin', earned: false, rarity: 'rare' },
  { id: 'diversified_king', title: 'Roi de la Diversification', icon: 'globe', earned: false, rarity: 'epic' },
  { id: 'emergency_proof', title: 'Preuve d\'Urgence', icon: 'shield', earned: false, rarity: 'rare' },
  { id: 'jet_setter', title: 'Jet Setter', icon: 'plane', earned: false, rarity: 'epic' },
  { id: 'inflation_fighter', title: 'Combattant de l\'Inflation', icon: 'trending-up', earned: false, rarity: 'rare' },
  { id: 'auto_pilot', title: 'Auto-Pilote', icon: 'settings', earned: false, rarity: 'common' },
  { id: 'high_roller', title: 'High Roller', icon: 'diamond', earned: false, rarity: 'epic' },
  { id: 'philanthropist', title: 'Philanthrope', icon: 'heart', earned: false, rarity: 'rare' }
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

export const ICON_MAP: Record<string, React.ElementType> = {
  ...ICON_OPTIONS.reduce((acc, opt) => ({
    ...acc,
    [opt.id]: opt.icon
  }), {}),
  restaurant: (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  payments: TrendingUp,
  auto_graph: BarChart,
  account_balance: Landmark,
  local_fire_department: Flame,
  workspace_premium: Award,
  rocket_launch: Rocket,
  rocket: Rocket,
  auto_awesome: Sparkles,
  public: Globe,
  savings: Wallet,
};

export const COLOR_OPTIONS = APP_COLORS.categories;
