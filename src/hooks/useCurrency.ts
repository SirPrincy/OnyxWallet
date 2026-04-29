import { useMemo } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { useAuthStore } from '../store/useAuthStore';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

export function useCurrency() {
  const wallets = useWalletStore(s => s.wallets);
  const profileCurrency = useAuthStore(s => s.currentUser?.currency);

  const primaryCurrencySymbol = useMemo(() => {
    const primaryCurrency = profileCurrency || wallets[0]?.currency || 'USD';
    return SUPPORTED_CURRENCIES.find((c: any) => c.code === primaryCurrency)?.symbol || '$';
  }, [profileCurrency, wallets]);

  const formatCurrency = (val: number, symbol?: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const parts = formatter.formatToParts(Math.abs(val));
    const formattedNumber = parts
      .map(part => part.type === 'group' ? ' ' : part.value)
      .join('');

    return `${val < 0 ? '-' : ''}${symbol || primaryCurrencySymbol} ${formattedNumber}`;
  };

  return {
    primaryCurrencySymbol,
    formatCurrency
  };
}
