import React, { useState, useMemo } from 'react';
import { 
  Plus, CreditCard, Landmark, ArrowRight, 
  Coins, Smartphone, DollarSign, Edit3,
  ChevronRight, BadgeCheck, Globe, Library,
  Settings2, Eye, EyeOff, GripVertical, X, Check,
  TrendingUp, Trash2
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useTransactions } from '../context/useTransactions';
import { Wallet } from '../types';

type WalletType = 'Credit Card' | 'Bank Account' | 'Crypto' | 'Investment' | 'Cash';
type Currency = 'USD' | 'EUR' | 'BTC';

export default function WalletManagement() {
  const { wallets, addWallet, updateWallet, deleteWallet, reorderWallets } = useTransactions();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<WalletType>('Bank Account');
  const [modalName, setModalName] = useState('');
  const [modalBalance, setModalBalance] = useState('');
  const [modalProvider, setModalProvider] = useState('');
  const [modalLastFour, setModalLastFour] = useState('');

  const [currency, setCurrency] = useState<Currency>('USD');

  const groupedWallets = useMemo(() => {
    const groups: Record<WalletType, Wallet[]> = {
      'Credit Card': [],
      'Bank Account': [],
      'Crypto': [],
      'Investment': [],
      'Cash': []
    };
    wallets.forEach(w => {
      if (groups[w.type as WalletType]) {
        groups[w.type as WalletType].push(w);
      }
    });
    return groups;
  }, [wallets]);

  const totalNetWorth = useMemo(() => 
    wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0),
  [wallets]);

  const rates = { USD: 1, EUR: 0.92, BTC: 0.000015 };
  const formatValue = (usdAmount: number, cur: Currency) => {
    const value = usdAmount * rates[cur];
    if (cur === 'BTC') return `₿ ${value.toFixed(6)}`;
    const symbol = cur === 'USD' ? '$' : '€';
    return `${symbol} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSaveWallet = () => {
    if (!modalName || !modalBalance) return;
    
    const walletData = {
      name: modalName,
      type: modalType,
      balance: parseFloat(modalBalance),
      provider: modalProvider,
      lastFour: modalLastFour,
      currency: 'USD',
      color: '#B4947C',
      icon: 'landmark',
      isVisible: true
    };

    if (editingWallet) {
      updateWallet(editingWallet.id, walletData);
    } else {
      addWallet(walletData);
    }

    closeModal();
  };

  const closeModal = () => {
    setShowAddWallet(false);
    setEditingWallet(null);
    setModalName('');
    setModalBalance('');
    setModalProvider('');
    setModalLastFour('');
  };

  const openEdit = (w: Wallet) => {
    setEditingWallet(w);
    setModalName(w.name);
    setModalBalance(w.balance.toString());
    setModalType(w.type as WalletType);
    setModalProvider(w.provider || '');
    setModalLastFour(w.lastFour || '');
    setShowAddWallet(true);
  };

  return (
    <div className="space-y-16 pb-20 relative">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">Portfolio Consolidation</p>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl leading-tight text-on-surface">Wallet Management</h2>
        </div>
        <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-primary/20 pl-4 md:pl-0 md:pr-4">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Net Liquidity</p>
          <p className="font-headline text-4xl text-primary">{formatValue(totalNetWorth, currency)}</p>
        </div>
      </section>

      <div className="space-y-12">
        {(Object.keys(groupedWallets) as WalletType[]).map(type => {
          const typeWallets = groupedWallets[type];
          if (typeWallets.length === 0 && type !== 'Bank Account') return null;

          return (
            <div key={type} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-headline text-3xl italic">{type}s</h3>
                <button 
                  onClick={() => { setModalType(type); setShowAddWallet(true); }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-all font-sans"
                >
                  <Plus className="w-3 h-3" />
                  Add {type}
                </button>
              </div>

              <div className="grid gap-4">
                {typeWallets.map(wallet => (
                  <div 
                    key={wallet.id}
                    onClick={() => openEdit(wallet)}
                    className="p-5 flex items-center justify-between bg-surface-container-low/60 backdrop-blur-md rounded-2xl hover:bg-surface-container transition-all cursor-pointer group border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/5">
                        {type === 'Credit Card' ? <CreditCard className="w-6 h-6 text-primary" /> : 
                         type === 'Crypto' ? <Coins className="w-6 h-6 text-primary" /> :
                         type === 'Cash' ? <DollarSign className="w-6 h-6 text-primary" /> : 
                         <Library className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm">{wallet.name}</h4>
                          {wallet.lastFour && <span className="text-[10px] text-on-surface-variant/40 font-mono">••{wallet.lastFour}</span>}
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">{wallet.provider || wallet.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={`font-medium ${wallet.type === 'Credit Card' ? 'text-on-surface' : 'text-primary'}`}>
                          {formatValue(wallet.balance, currency)}
                        </p>
                        <p className="text-[9px] uppercase text-on-surface-variant tracking-tighter">
                          Verified Today
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAddWallet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">{editingWallet ? 'Configure Wallet' : 'New Strategic Base'}</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Asset Allocation Protocol</p>
                </div>
                <button onClick={closeModal} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Asset Type</label>
                    <select 
                      value={modalType}
                      onChange={(e) => setModalType(e.target.value as WalletType)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg appearance-none"
                    >
                      <option value="Bank Account">Bank Account</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Crypto">Crypto Wallet</option>
                      <option value="Investment">Investment Portfolio</option>
                      <option value="Cash">Physical Cash</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Label</label>
                    <input 
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg"
                      placeholder="e.g. JP Morgan Reserve"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Current Liquidity ($)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-headline text-4xl font-sans">$</span>
                    <input 
                      type="number"
                      value={modalBalance}
                      onChange={(e) => setModalBalance(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-3xl py-10 pl-14 pr-6 text-on-surface text-5xl font-headline focus:ring-0 focus:border-primary/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Provider</label>
                    <input 
                      value={modalProvider}
                      onChange={(e) => setModalProvider(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg"
                      placeholder="e.g. Goldman Sachs"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Suffix (Last 4)</label>
                    <input 
                      maxLength={4}
                      value={modalLastFour}
                      onChange={(e) => setModalLastFour(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg font-mono"
                      placeholder="8821"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {editingWallet && (
                    <button 
                      onClick={() => { deleteWallet(editingWallet.id); closeModal(); }}
                      className="flex-1 py-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-sans"
                    >
                      <Trash2 className="w-4 h-4" />
                      Decommission
                    </button>
                  )}
                  <button 
                    onClick={handleSaveWallet}
                    className="flex-[2] py-8 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all font-sans"
                  >
                    {editingWallet ? 'Archive Changes' : 'Initialize Base'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
