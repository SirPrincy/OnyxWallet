import { useMemo } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

export function useCurrency() {
  const wallets = useWalletStore(s => s.wallets);

  const primaryCurrencySymbol = useMemo(() => {
    const primaryCurrency = wallets[0]?.currency || 'USD';
    return SUPPORTED_CURRENCIES.find((c: any) => c.code === primaryCurrency)?.symbol || '$';
  }, [wallets]);

  const formatCurrency = (val: number, symbol?: string) => {
    const parts = Math.abs(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${val < 0 ? '-' : ''}${symbol || primaryCurrencySymbol} ${parts.join('.')}`;
  };

  return {
    primaryCurrencySymbol,
    formatCurrency
  };
}
