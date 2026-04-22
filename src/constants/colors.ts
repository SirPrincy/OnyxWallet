/**
 * Onyx Wallet - Application Color Palette Library
 * Defines the central visual identity of the "Private Vault" experience.
 */

export const APP_COLORS = {
  // Brand Base
  brand: {
    gold: '#f2ca50',
    goldDark: '#d4af37',
    goldLight: '#f7d983',
    black: '#131313',
    charcoal: '#201f1f',
  },

  // Functional Colors
  status: {
    income: '#34D399',    // Emerald 400
    expense: '#F87171',   // Red 400
    transfer: '#60A5FA',  // Blue 400
    neutral: '#d0c5af',   // Gold tint gray
    warning: '#FBBF24',   // Amber 400
    success: '#10B981',   // Emerald 500
  },

  // UI Surfaces (Following Material Design naming for consistency with index.css)
  surface: {
    main: '#131313',
    container: '#201f1f',
    low: '#1c1b1b',
    high: '#2a2a2a',
    highest: '#353534',
    outline: '#4d4635',
  },

  // Text & Content
  on: {
    surface: '#e5e2e1',
    surfaceVariant: '#d0c5af',
    primary: '#131313',
  },

  // Extended Palette for Categories
  categories: [
    '#B4947C', // Earth
    '#60A5FA', // Sky
    '#F87171', // Ruby
    '#34D399', // Emerald
    '#A78BFA', // Violet
    '#FBBF24', // Amber
    '#F472B6', // Pink
    '#10B981', // Forest
    '#06B6D4', // Cyan
    '#EF4444', // Crimson
    '#8B5CF6', // Purple
    '#d4af37', // Gold
  ]
};

// Semantic helpers
export const THEME_COLORS = {
  primary: APP_COLORS.brand.gold,
  secondary: APP_COLORS.brand.goldDark,
  accent: APP_COLORS.brand.goldLight,
  error: APP_COLORS.status.expense,
  info: APP_COLORS.status.transfer,
  success: APP_COLORS.status.income,
};
