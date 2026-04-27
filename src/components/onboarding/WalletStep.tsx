import React from 'react';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, Filter, Globe } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../constants/currencies';

interface WalletStepProps {
  walletType: string;
  setShowTypeSelector: (show: boolean) => void;
  walletCurrency: string;
  setShowCurrencySelector: (show: boolean) => void;
  walletName: string;
  setWalletName: (name: string) => void;
  cryptoQuantity: string;
  setCryptoQuantity: (q: string) => void;
  cryptoPrice: string;
  setCryptoPrice: (p: string) => void;
  walletBalance: string;
  setWalletBalance: (b: string) => void;
}

export const WalletStep: React.FC<WalletStepProps> = ({
  walletType, setShowTypeSelector, walletCurrency, setShowCurrencySelector,
  walletName, setWalletName, cryptoQuantity, setCryptoQuantity, cryptoPrice, setCryptoPrice,
  walletBalance, setWalletBalance
}) => {
  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === walletCurrency)?.symbol || '$';

  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm space-y-12"
    >
      <div className="mx-auto w-20 h-20 rounded-full glass-card border border-white/10 flex items-center justify-center">
        <WalletIcon className="w-8 h-8 text-primary" strokeWidth={1} />
      </div>
      <div className="space-y-8 text-left">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-headline italic text-on-surface">First Deposit</h2>
          <p className="text-xs text-on-surface-variant">Initialize your primary reserve account.</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Wallet Type</label>
              <button
                onClick={() => setShowTypeSelector(true)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left flex items-center justify-between group"
              >
                <span className="text-sm text-on-surface/60 group-hover:text-on-surface transition-colors">{walletType}</span>
                <Filter className="w-4 h-4 text-white/20 group-hover:text-primary" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Currency</label>
              <button
                onClick={() => setShowCurrencySelector(true)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left flex items-center justify-between group"
              >
                <span className="text-sm text-on-surface/60 group-hover:text-on-surface transition-colors">{walletCurrency}</span>
                <Globe className="w-4 h-4 text-white/20 group-hover:text-primary" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Wallet Label</label>
            <input
              autoFocus
              value={walletName}
              onChange={e => setWalletName(e.target.value)}
              placeholder="e.g. Global Reserve"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
            />
          </div>
          {walletType === 'Crypto' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Quantity</label>
                <input
                  type="number"
                  value={cryptoQuantity}
                  onChange={e => setCryptoQuantity(e.target.value)}
                  placeholder="0.5"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Price ({walletCurrency})</label>
                <input
                  type="number"
                  value={cryptoPrice}
                  onChange={e => setCryptoPrice(e.target.value)}
                  placeholder="70000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="col-span-2 mt-2 px-1">
                <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                  Total Value: {currencySymbol} {((parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Initial Balance ({currencySymbol})</label>
              <input
                type="number"
                value={walletBalance}
                onChange={e => setWalletBalance(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
