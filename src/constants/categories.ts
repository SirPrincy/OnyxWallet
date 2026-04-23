import { Category } from '../types';

export const STANDARD_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Shopping', icon: 'shopping_bag', color: '#B4947C', type: 'expense', subcategories: [{ name: 'Clothing', icon: 'shopping_bag' }, { name: 'Essentials', icon: 'shopping_bag' }] },
  { name: 'Electronics', icon: 'smartphone', color: '#60A5FA', type: 'expense', subcategories: [{ name: 'Gadgets', icon: 'smartphone' }, { name: 'Devices', icon: 'cpu' }] },
  { name: 'Food & Drinks', icon: 'restaurant', color: '#F87171', type: 'expense', subcategories: [{ name: 'Groceries', icon: 'shopping_bag' }, { name: 'Restaurants', icon: 'utensils' }, { name: 'Café', icon: 'coffee' }] },
  { name: 'Salary', icon: 'banknote', color: '#34D399', type: 'income', subcategories: [{ name: 'Regular Salary', icon: 'banknote' }, { name: 'Bonus', icon: 'sparkles' }] },
  { name: 'Transport', icon: 'car', color: '#FBBF24', type: 'expense', subcategories: [{ name: 'Commute', icon: 'car' }, { name: 'Fuel', icon: 'fuel' }] },
  { name: 'Travel', icon: 'hotel', color: '#F472B6', type: 'expense', subcategories: [{ name: 'Hotels', icon: 'hotel' }, { name: 'Flights', icon: 'plane' }] },
  { name: 'Savings', icon: 'trending-up', color: '#10B981', type: 'income', subcategories: [{ name: 'Interest', icon: 'payments' }] },
  { name: 'Wellness', icon: 'heart', color: '#EC4899', type: 'expense', subcategories: [{ name: 'Health', icon: 'activity' }, { name: 'Fitness', icon: 'fitness_center' }] },
  { name: 'Housing', icon: 'home', color: '#F59E0B', type: 'expense', subcategories: [{ name: 'Rent', icon: 'home' }, { name: 'Utilities', icon: 'settings' }] }
];

export const ELITE_UPGRADES: Record<string, Partial<Category>> = {
  'Shopping': { name: 'Luxury Goods', subcategories: [{ name: 'Watches', icon: 'award' }, { name: 'Jewelry', icon: 'diamond' }, { name: 'Apparel', icon: 'shopping_bag' }] },
  'Electronics': { name: 'Tech', subcategories: [{ name: 'Hardware', icon: 'smartphone' }, { name: 'Software', icon: 'code' }, { name: 'Gadgets', icon: 'cpu' }] },
  'Food & Drinks': { name: 'Fine Dining', subcategories: [{ name: 'Michelin Star', icon: 'star' }, { name: 'Private Chef', icon: 'utensils' }, { name: 'Bar & Spirits', icon: 'glass-water' }] },
  'Travel': { name: 'First Class Travel', subcategories: [{ name: 'Aviation', icon: 'plane' }, { name: 'Executive Lounge', icon: 'sofa' }, { name: 'Resorts', icon: 'palmtree' }] },
  'Savings': { name: 'Investment', subcategories: [{ name: 'Stocks', icon: 'bar-chart' }, { name: 'Real Estate', icon: 'building' }, { name: 'Crypto', icon: 'bitcoin' }] },
  'Wellness': { name: 'Lifestyle', subcategories: [{ name: 'Concierge', icon: 'user' }, { name: 'Private Health', icon: 'activity' }] },
  'Transport': { name: 'Private Aviation', icon: 'plane', subcategories: [{ name: 'Jet Charter', icon: 'plane' }, { name: 'Fuel', icon: 'fuel' }, { name: 'Maintenance', icon: 'settings' }] }
};
