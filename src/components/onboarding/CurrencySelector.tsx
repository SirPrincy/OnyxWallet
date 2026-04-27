import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, Globe } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../constants/currencies';

interface CurrencySelectorProps {
  walletCurrency: string;
  setWalletCurrency: (currency: string) => void;
  setShowCurrencySelector: (show: boolean) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ walletCurrency, setWalletCurrency, setShowCurrencySelector }) => {
  const [currencySearch, setCurrencySearch] = useState('');

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.label.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.includes(currencySearch)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowCurrencySelector(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10 h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-3xl text-on-surface italic">Select Currency</h3>
          <button onClick={() => setShowCurrencySelector(false)} className="p-2"><X className="w-6 h-6 text-on-surface-variant" /></button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            autoFocus
            placeholder="Search code, name or symbol..."
            value={currencySearch}
            onChange={e => setCurrencySearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-on-surface focus:border-primary outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {filteredCurrencies.map(curr => (
            <button
              key={curr.code}
              onClick={() => { setWalletCurrency(curr.code); setShowCurrencySelector(false); }}
              className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${walletCurrency === curr.code ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}
            >
              <div>
                <span className="font-bold uppercase tracking-widest text-[11px]">{curr.code} - {curr.label}</span>
              </div>
              <span className="font-headline text-lg italic">({curr.symbol})</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};
