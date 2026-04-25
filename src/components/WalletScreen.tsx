import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, CreditCard, Wallet, Bitcoin, 
  Send, Download, ArrowLeftRight, Snowflake,
  Stars, LineChart, Building2, ChevronRight, X, ArrowRight, CheckCircle, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useCurrency } from '../hooks/useCurrency';

export default function WalletScreen() {
  const transactions = useFinancialStore(s => s.transactions);
  const wallets = useWalletStore(s => s.wallets);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const walletBases = {
    main: 412000,
    offshore: 724000,
    crypto: 98000
  };

  const walletStats = useMemo(() => {
    const calculateBalance = (walletId: string, base: number) => {
      const delta = transactions
        .filter(tx => tx.walletId === walletId)
        .reduce((sum: number, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
      return base + delta;
    };

    return {
      main: calculateBalance('main', walletBases.main),
      offshore: calculateBalance('offshore', walletBases.offshore),
      crypto: calculateBalance('crypto', walletBases.crypto)
    };
  }, [transactions]);

  const netWorth = useMemo(() => {
    return (Object.values(walletStats) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  }, [walletStats]);

  const { primaryCurrencySymbol, formatCurrency } = useCurrency();

  const handleActionSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveAction(null);
      setTransferAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Title & Hero */}
      <section>
        <h2 className="font-headline text-4xl text-on-surface mb-2">Portfolio Management</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-on-surface-variant text-sm font-sans uppercase tracking-widest">AUM (Assets Under Management)</span>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-5xl font-headline tracking-tight text-on-surface">
            {formatCurrency(netWorth)}
          </span>
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-bold ml-1">4.2%</span>
          </div>
        </div>
      </section>

      {/* Wallet Carousel */}
      <section className="-mx-6">
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-6">
          {/* Main Vault Card */}
          <div className="snap-center shrink-0 w-[85%] bg-gradient-to-br from-surface-container-highest to-surface-container-low rounded-2xl p-6 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-on-surface-variant mb-1">Main Vault</p>
                <p className="text-2xl font-headline text-primary">{formatCurrency(walletStats.main)}</p>
              </div>
              <CreditCard className="w-6 h-6 text-on-surface-variant" />
            </div>
            <div className="flex justify-between items-end">
              <p className="font-mono text-sm tracking-[0.2em] text-on-surface/60">**** **** **** 8829</p>
              <p className="text-xs font-sans text-on-surface-variant">12/28</p>
            </div>
          </div>

          {/* Investment Portfolio Card */}
          <div className="snap-center shrink-0 w-[85%] bg-surface-container/70 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/20 shadow-2xl">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-on-surface-variant mb-1">Investment Portfolio</p>
                <p className="text-2xl font-headline text-on-surface">{formatCurrency(walletStats.offshore)}</p>
              </div>
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex gap-2">
              <span className="bg-surface-variant px-2 py-1 rounded text-[10px] uppercase font-bold text-on-surface-variant">Equity</span>
              <span className="bg-surface-variant px-2 py-1 rounded text-[10px] uppercase font-bold text-on-surface-variant">Global Tech</span>
            </div>
          </div>

          {/* Crypto Card */}
          <div className="snap-center shrink-0 w-[85%] bg-surface-container-highest rounded-2xl p-6 border border-primary/10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-on-surface-variant mb-1">Crypto Ledger</p>
                <p className="text-2xl font-headline text-on-surface">{formatCurrency(walletStats.crypto)}</p>
              </div>
              <Bitcoin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center ring-2 ring-surface-container-highest">
                <span className="text-[10px] font-bold text-white">₿</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center ring-2 ring-surface-container-highest">
                <span className="text-[10px] font-bold text-white">Ξ</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center ring-2 ring-surface-container-highest">
                <span className="text-[10px] font-bold text-on-surface-variant">+3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-4">
        {[
          { icon: Send, label: 'Send', id: 'send' },
          { icon: Download, label: 'Receive', id: 'receive' },
          { icon: ArrowLeftRight, label: 'Swap', id: 'swap' },
          { icon: Snowflake, label: 'Freeze', id: 'freeze' }
        ].map((action, i) => (
          <div 
            key={i} 
            onClick={() => setActiveAction(action.id)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl border border-outline-variant/30 flex items-center justify-center group-active:scale-95 transition-all group-hover:border-primary/50 bg-surface-container-low">
              <action.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-on-surface-variant">{action.label}</span>
          </div>
        ))}
      </section>

      {/* Assets List */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline text-2xl px-2">Key Holdings</h3>
          <span className="text-primary text-[10px] uppercase tracking-[0.2em] hover:underline cursor-pointer">Analytics</span>
        </div>
        <div className="space-y-4">
          {[
            { icon: Stars, label: 'Gold Spot (XAU)', sub: '14.50 oz', value: '$29,482.10', change: '+1.2%', positive: true, allocation: '12.5%', description: 'Investment grade physical gold bars stored in the London Vaults. Bullion quality 999.9 fine gold.' },
            { icon: LineChart, label: 'Vanguard S&P 500', sub: 'VOO • 240 Units', value: '$114,832.00', change: '-0.4%', positive: false, allocation: '48.2%', description: 'Exchange-traded fund providing exposure to the 500 largest US companies. Institutional share class with ultra-low expense ratio.' },
            { icon: Building2, label: 'Real Estate Trust', sub: 'REIT • 1,200 Shares', value: '$84,100.00', change: '+0.8%', positive: true, allocation: '35.3%', description: 'Diversified portfolio of premium commercial real estate assets across major European metropolitan areas.' }
          ].map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center transition-colors group-hover:bg-primary/10">
                  <asset.icon className={`w-5 h-5 ${asset.positive ? 'text-primary' : 'text-on-surface-variant'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">{asset.label}</p>
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">{asset.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Allocation</p>
                  <p className="text-xs font-medium text-on-surface">{asset.allocation}</p>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-headline text-lg">{formatCurrency(parseFloat(asset.value.replace('$', '').replace(',', '')))}</p>
                  <div className="flex items-center justify-end gap-2">
                    <p className={`text-[10px] font-bold ${asset.positive ? 'text-primary' : 'text-red-400'}`}>{asset.change}</p>
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="p-1.5 rounded-lg bg-white/5 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all ml-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Asset Details Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[130]"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[500px] bg-[#0e0e0e] border border-white/10 rounded-t-[2.5rem] sm:rounded-3xl z-[140] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-white/5">
                      <selectedAsset.icon className={`w-7 h-7 ${selectedAsset.positive ? 'text-primary' : 'text-on-surface-variant'}`} />
                    </div>
                    <div>
                      <h3 className="font-headline text-3xl text-on-surface italic">{selectedAsset.label}</h3>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mt-1">{selectedAsset.sub}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    aria-label="Close"
                    className="p-3 rounded-xl bg-white/5 text-on-surface-variant hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Current Valuation</p>
                    <p className="font-headline text-2xl text-on-surface">{selectedAsset.value}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Portfolio Share</p>
                    <p className="font-headline text-2xl text-primary">{selectedAsset.allocation}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3 px-1">Asset Performance</h4>
                    <div className="h-32 w-full bg-white/5 rounded-2xl border border-white/5 flex items-end p-4 gap-1">
                      {[40, 60, 45, 70, 55, 80, 75, 90, 85, 95].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex-1 rounded-t-sm ${selectedAsset.positive ? 'bg-primary/20' : 'bg-red-400/20'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant px-1">Institutional Notes</h4>
                    <div className="p-5 rounded-2xl bg-surface-container/30 border border-white/5">
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {selectedAsset.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                  <button className="w-full py-5 metallic-gradient rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                    Execution Terminal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Action Modals */}
      <AnimatePresence>
        {activeAction && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAction(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2.5rem] z-[120] p-8 max-h-[85vh] overflow-y-auto no-scrollbar border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-headline text-4xl text-on-surface italic capitalize">{activeAction} Capital</h3>
                  <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] mt-2">Secure Institutional Channel</p>
                </div>
                <button
                  onClick={() => setActiveAction(null)}
                  aria-label="Close"
                  className="p-3 rounded-full bg-white/5 text-on-surface-variant hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8 mt-12">
                {activeAction === 'send' && (
                  <>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant ml-2">Recipient Address</label>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="0x... or ENS name"
                          className="w-full bg-surface-container-highest/30 border border-white/5 rounded-2xl p-6 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant ml-2">Amount to {activeAction}</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-headline text-3xl">{primaryCurrencySymbol} </span>
                    <input 
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-surface-container-highest/30 border border-white/5 rounded-2xl p-8 pl-12 text-5xl font-headline text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">Source Wallet</span>
                    <p className="text-on-surface font-medium">Main Vault (Instititutional)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Fee (0.2%)</span>
                    <p className="text-on-surface-variant font-medium">{primaryCurrencySymbol} {(parseFloat(transferAmount) * 0.002 || 0).toFixed(2)}</p>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleActionSubmit}
                  disabled={isSuccess}
                  className="w-full py-6 metallic-gradient rounded-2xl text-background font-bold uppercase tracking-[0.25em] text-xs shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isSuccess ? (
                    <>Transaction Validated <CheckCircle className="w-5 h-5" /></>
                  ) : (
                    <>Authorize Transfer <ArrowRight className="w-5 h-5" /></>
                  )}
                </motion.button>

                <p className="text-center text-[9px] uppercase tracking-widest text-on-surface-variant/40">
                  By authorizing, you agree to Alchemist Wealth's institutional terms of service.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
