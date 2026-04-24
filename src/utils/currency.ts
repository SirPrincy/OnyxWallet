const UNITS_PER_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  MGA: 4500,
  BTC: 0.000015,
  ETH: 0.00038,
  JPY: 150,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.88,
  CNY: 7.19,
  HKD: 7.82,
  NZD: 1.63,
};

export function getUnitsPerUSD(currency: string): number {
  return UNITS_PER_USD[currency] || 1;
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  const amountInUSD = amount / getUnitsPerUSD(fromCurrency);
  return amountInUSD * getUnitsPerUSD(toCurrency);
}
