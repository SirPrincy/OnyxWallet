export interface CurrencyThresholds {
  avgMonthlyIncome: number;
  silverXP: number;
  goldXP: number;
  platinumXP: number;
  diamondXP: number;
  archonXP: number;
}

export const REGIONAL_THRESHOLDS: Record<string, CurrencyThresholds> = {
  USD: {
    avgMonthlyIncome: 5000,
    silverXP: 5000,
    goldXP: 15000,
    platinumXP: 50000,
    diamondXP: 150000,
    archonXP: 500000
  },
  EUR: {
    avgMonthlyIncome: 4500,
    silverXP: 4500,
    goldXP: 14000,
    platinumXP: 45000,
    diamondXP: 140000,
    archonXP: 450000
  },
  GBP: {
    avgMonthlyIncome: 4000,
    silverXP: 4000,
    goldXP: 12000,
    platinumXP: 40000,
    diamondXP: 120000,
    archonXP: 400000
  },
  JPY: {
    avgMonthlyIncome: 400000,
    silverXP: 400000,
    goldXP: 1200000,
    platinumXP: 4000000,
    diamondXP: 12000000,
    archonXP: 40000000
  },
  MGA: {
    avgMonthlyIncome: 1500000,
    silverXP: 1500000,
    goldXP: 4500000,
    platinumXP: 15000000,
    diamondXP: 45000000,
    archonXP: 150000000
  },
  AUD: {
    avgMonthlyIncome: 6500,
    silverXP: 6500,
    goldXP: 20000,
    platinumXP: 65000,
    diamondXP: 200000,
    archonXP: 650000
  },
  CAD: {
    avgMonthlyIncome: 6000,
    silverXP: 6000,
    goldXP: 18000,
    platinumXP: 60000,
    diamondXP: 180000,
    archonXP: 600000
  },
  CHF: {
    avgMonthlyIncome: 7000,
    silverXP: 7000,
    goldXP: 21000,
    platinumXP: 70000,
    diamondXP: 210000,
    archonXP: 700000
  },
  CNY: {
    avgMonthlyIncome: 10000,
    silverXP: 10000,
    goldXP: 30000,
    platinumXP: 100000,
    diamondXP: 300000,
    archonXP: 1000000
  },
  HKD: {
    avgMonthlyIncome: 25000,
    silverXP: 25000,
    goldXP: 75000,
    platinumXP: 250000,
    diamondXP: 750000,
    archonXP: 2500000
  },
  NZD: {
    avgMonthlyIncome: 6000,
    silverXP: 6000,
    goldXP: 18000,
    platinumXP: 60000,
    diamondXP: 180000,
    archonXP: 600000
  }
};

export const getThresholds = (currency: string): CurrencyThresholds => {
  return REGIONAL_THRESHOLDS[currency] || REGIONAL_THRESHOLDS.USD;
};
