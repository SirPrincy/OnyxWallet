export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'MGA', symbol: 'Ar', label: 'Ariary' },
  { code: 'BTC', symbol: '₿', label: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', label: 'Ethereum' }
];
