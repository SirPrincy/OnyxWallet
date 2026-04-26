import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, CreditCard, Landmark, ArrowRight, 
  Coins, Smartphone, DollarSign, Edit3,
  ChevronRight, BadgeCheck, Globe, Library,
  Settings2, Eye, EyeOff, GripVertical, X, Check,
  TrendingUp, Trash2, Zap, Info
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useWalletStore } from '../store/useWalletStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrency } from '../hooks/useCurrency';
import { Wallet } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';
import { convertCurrency } from '../utils/currency';

type WalletType = 'Credit Card' | 'Bank Account' | 'Crypto' | 'Investment' | 'Cash' | 'Mobile Money';

export default function WalletManagement() {
  const wallets = useWalletStore(s => s.wallets);
  const totalNetWorth = useWalletStore(s => s.totalLiquidity);
  const addWallet = useWalletStore(s => s.addWallet);
  const updateWallet = useWalletStore(s => s.updateWallet);
  const deleteWallet = useWalletStore(s => s.deleteWallet);
  const currentUser = useAuthStore(s => s.currentUser);
  const profileCurrency = currentUser?.currency || 'USD';
  const { formatCurrency } = useCurrency();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [showMore, setShowMore] = useState(false);

  // Modal State
  const [modalType, setModalType] = useState<WalletType>('Bank Account');
  const [modalName, setModalName] = useState('');
  const [modalBalance, setModalBalance] = useState('');
  const [modalProvider, setModalProvider] = useState('');
  const [modalLastFour, setModalLastFour] = useState('');
  const [modalCurrency, setModalCurrency] = useState<string>('USD');
  const [autoSavePercent, setAutoSavePercent] = useState<number>(0);

  const [currency, setCurrency] = useState<string>(profileCurrency);

  useEffect(() => {
    setCurrency(profileCurrency);
  }, [profileCurrency]);

  const groupedWallets = useMemo(() => {
    const groups: Record<WalletType, Wallet[]> = {
      'Credit Card': [],
      'Bank Account': [],
      'Crypto': [],
      'Investment': [],
      'Cash': [],
      'Mobile Money': []
    };
    wallets.forEach(w => {
      if (groups[w.type as WalletType]) {
        groups[w.type as WalletType].push(w);
      }
    });
    return groups;
  }, [wallets]);

  const formatValue = (amount: number, fromCurrency: string, toCurrency: string) => {
    const value = convertCurrency(amount, fromCurrency, toCurrency);

    if (toCurrency === "BTC" || toCurrency === "ETH") {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const result = parts.join('.');
        return `${toCurrency === "BTC" ? "₿" : "Ξ"} ${result}`;
    }

    const symbol = SUPPORTED_CURRENCIES.find(c => c.code === toCurrency)?.symbol;
    return formatCurrency(value, symbol);
  };

  const handleSaveWallet = () => {
    if (!modalName || !modalBalance) return;
    
    const walletData = {
      name: modalName,
      type: modalType,
      balance: parseFloat(modalBalance),
      provider: modalProvider,
      lastFour: modalLastFour,
      currency: modalCurrency,
      color: '#B4947C',
      icon: 'landmark',
      isVisible: true,
      autoSavePercent: autoSavePercent // Note: Assuming the Wallet type supports this or we add it to the DB soon
    };

    if (currentUser?.id) {
      if (editingWallet) {
        updateWallet(editingWallet.id, walletData, currentUser.id);
      } else {
        addWallet(walletData, currentUser.id);
      }
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
    setModalCurrency('USD');
    setAutoSavePercent(0);
    setShowMore(false);
  };

  const openEdit = (w: Wallet) => {
    setEditingWallet(w);
    setModalName(w.name);
    setModalBalance(w.balance.toString());
    setModalType(w.type as WalletType);
    setModalProvider(w.provider || '');
    setModalLastFour(w.lastFour || '');
    setModalCurrency(w.currency);
    setAutoSavePercent((w as any).autoSavePercent || 0);
    setShowAddWallet(true);
  };

  return (
    <div className="space-y-16 pb-32 relative">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">Portfolio Consolidation</p>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl leading-tight text-on-surface">Wallet Management</h2>
        </div>
        <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-primary/20 pl-4 md:pl-0 md:pr-4">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Net Liquidity</p>
          <p className="font-headline text-4xl text-primary">{formatValue(totalNetWorth, profileCurrency, currency)}</p>
        </div>
      </section>

      {/* Centralized Add Button */}
      <button
        onClick={() => { setEditingWallet(null); setShowAddWallet(true); }}
        className="w-full py-6 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center gap-3 group hover:bg-primary/20 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" strokeWidth={3} />
        </div>
        <span className="font-headline text-2xl italic text-primary">Initialize New Strategic Base</span>
      </button>

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
                         type === 'Mobile Money' ? <Smartphone className="w-6 h-6 text-primary" /> :
                         type === 'Investment' ? <TrendingUp className="w-6 h-6 text-primary" /> :
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
                          {formatValue(wallet.balance, wallet.currency || 'USD', currency)}
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
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="p-3 rounded-full bg-white/5 text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
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
                      <option value="Mobile Money">Mobile Money</option>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Currency</label>
                    <select
                      value={modalCurrency}
                      onChange={(e) => setModalCurrency(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg appearance-none"
                    >
                      {SUPPORTED_CURRENCIES.map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} ({curr.symbol}) - {curr.label}
                        </option>
                      ))}
                      <option value="BTC">BTC (₿) - Bitcoin</option>
                      <option value="ETH">ETH (Ξ) - Ethereum</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Current Liquidity</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={modalBalance}
                        onChange={(e) => setModalBalance(e.target.value)}
                        className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface text-lg focus:ring-1 focus:ring-primary/40"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Automated Savings Protocol */}
                {modalType !== 'Credit Card' && (
                  <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Auto-Allocation</h4>
                          <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tight">Income Redirection Protocol</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-headline text-primary">{autoSavePercent}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={autoSavePercent}
                        onChange={e => setAutoSavePercent(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[8px] text-on-surface-variant uppercase tracking-widest font-bold">
                        <span>Disabled</span>
                        <span>Balanced (15%)</span>
                        <span>Aggressive (50%)</span>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3 bg-black/20 rounded-xl">
                      <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                      <p className="text-[9px] text-on-surface-variant leading-relaxed italic">
                        Every income transaction into this wallet will automatically trigger a contribution to your highest-priority savings goal.
                      </p>
                    </div>
                  </div>
                )}

                {/* Collapsible More Section */}
                <div className="space-y-4 pt-4">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary font-bold"
                  >
                    <Settings2 className={`w-3 h-3 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                    {showMore ? 'Hide Advanced Details' : 'Show More Details'}
                  </button>

                  <AnimatePresence>
                    {showMore && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-8"
                      >
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Provider</label>
                            <input
                              value={modalProvider}
                              onChange={(e) => setModalProvider(e.target.value)}
                              className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg"
                              placeholder="e.g. Goldman Sachs"
                            />
                          </div>
                          {modalType !== 'Cash' && (
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
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4 pt-4">
                  {editingWallet && currentUser?.id && (
                    <button 
                      onClick={() => { deleteWallet(editingWallet.id, currentUser.id); closeModal(); }}
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
