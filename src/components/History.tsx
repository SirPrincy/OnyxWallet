import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ShoppingBag, Utensils, Banknote, 
  Car, Dumbbell, ArrowLeftRight, History as HistoryIcon,
  Filter, X, Check, Hotel, Fuel, Landmark, Briefcase,
  Edit2, Trash2, Calendar, Clock, Tag, Wallet,
  Star, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrency } from '../hooks/useCurrency';
import { Transaction } from '../types';
import NewTransaction from './NewTransaction';
import { ICON_MAP } from '../constants';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function History() {
  const transactions = useFinancialStore(s => s.transactions);
  const wallets = useWalletStore(s => s.wallets);
  const deleteTransaction = useFinancialStore(s => s.deleteTransaction);
  const currentUser = useAuthStore(s => s.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { primaryCurrencySymbol, formatCurrency } = useCurrency();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDelete = () => {
    if (selectedTx && currentUser?.id) {
      deleteTransaction(selectedTx.id, currentUser.id);
      setSelectedTx(null);
      setShowDeleteConfirm(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(tx => tx.category));
    return ['All', ...Array.from(cats)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      result = result.filter(tx => 
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(tx => tx.type === filterType);
    }

    if (selectedCategory !== 'All') {
      result = result.filter(tx => tx.category === selectedCategory);
    }

    if (minAmount) {
      result = result.filter(tx => Math.abs(tx.amount) >= parseFloat(minAmount));
    }
    if (maxAmount) {
      result = result.filter(tx => Math.abs(tx.amount) <= parseFloat(maxAmount));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.timestamp - a.timestamp;
        case 'oldest': return a.timestamp - b.timestamp;
        case 'highest': return Math.abs(b.amount) - Math.abs(a.amount);
        case 'lowest': return Math.abs(a.amount) - Math.abs(b.amount);
        default: return 0;
      }
    });

    return result;
  }, [searchQuery, filterType, sortBy, minAmount, maxAmount, selectedCategory]);

  const grouped = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      if (!acc[tx.date]) acc[tx.date] = [];
      acc[tx.date].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  const resetFilters = () => {
    setFilterType('all');
    setSortBy('newest');
    setMinAmount('');
    setMaxAmount('');
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Sort By</label>
        <div className="grid grid-cols-2 gap-2">
          {(['newest', 'oldest', 'highest', 'lowest'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`py-3 px-4 rounded-xl border text-[11px] font-medium transition-all flex items-center justify-between ${sortBy === option ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
              {sortBy === option && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-full border text-[10px] font-medium transition-all ${selectedCategory === cat ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Amount Range</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">{primaryCurrencySymbol}</span>
            <input 
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-7 pr-3 text-xs text-white placeholder:text-white/10 focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="w-3 h-[1px] bg-white/10" />
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">{primaryCurrencySymbol}</span>
            <input 
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-7 pr-3 text-xs text-white placeholder:text-white/10 focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button 
          onClick={resetFilters}
          className="flex-1 py-4 rounded-xl border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={() => setShowFilters(false)}
          className="flex-[2] py-4 rounded-xl bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          Apply
        </button>
      </div>
    </div>
  );

  const isFilterActive = useMemo(() => {
    return filterType !== 'all' || 
           selectedCategory !== 'All' || 
           minAmount !== '' || 
           maxAmount !== '' || 
           searchQuery !== '' ||
           sortBy !== 'newest';
  }, [filterType, selectedCategory, minAmount, maxAmount, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      <section>
        <h2 className="font-headline text-5xl mb-6 text-on-surface">History</h2>
        
        <div className="flex gap-3 relative">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 transition-all" 
              placeholder="Search transactions..." 
              type="text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-xl transition-all border ${
              showFilters 
                ? 'bg-primary/10 border-primary text-primary' 
                : isFilterActive 
                  ? 'bg-primary/5 border-primary/30 text-primary' 
                  : 'bg-surface-container-lowest border-white/5 text-on-surface-variant hover:text-primary hover:border-primary/30'
            }`}
          >
            <Filter className="w-6 h-6" />
            {isFilterActive && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(242,202,80,0.8)]"
              />
            )}
          </button>
        </div>

        {/* Desktop Filter Panel (Inline) */}
        <AnimatePresence>
          {!isMobile && showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-8 bg-surface-container-low/50 border border-white/5 rounded-3xl backdrop-blur-xl">
                <FilterContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobile && showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#0e0e0e] border-t border-white/10 rounded-t-[2.5rem] z-[110] px-8 pt-10 pb-12 max-h-[90vh] overflow-y-auto no-scrollbar"
              >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline text-3xl text-white italic">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 no-scrollbar">
          {(['all', 'expense', 'income', 'transfer'] as const).map((type) => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all ${filterType === type ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-primary/30'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {(Object.entries(grouped) as [string, Transaction[]][]).length > 0 ? (
        (Object.entries(grouped) as [string, Transaction[]][]).map(([date, txs]) => (
          <section key={date} className="mb-10">
            <h3 className="uppercase tracking-[0.2em] text-on-surface-variant/60 text-[10px] font-bold mb-4 ml-1">{date}</h3>
            <div className="space-y-1">
              {txs.map((tx) => {
                const Icon = ICON_MAP[tx.subcategoryIcon || tx.icon] || ShoppingBag;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low/70 backdrop-blur-xl group hover:bg-surface-container-high/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{tx.title}</p>
                        <p className="text-xs text-on-surface-variant/60">
                          {tx.time} • {tx.category} {tx.subcategory && `/ ${tx.subcategory}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-headline text-2xl ${tx.amount > 0 ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="py-20 text-center space-y-4 opacity-40">
          <Search className="w-12 h-12 mx-auto" />
          <p className="text-sm uppercase tracking-widest">No transactions found</p>
        </div>
      )}

      <div className="py-12 flex flex-col items-center opacity-20">
        <HistoryIcon className="w-16 h-16 mb-4" />
        <p className="text-sm uppercase tracking-widest">End of Recent History</p>
      </div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && !isEditing && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2rem] z-[120] p-8 max-h-[80vh] overflow-y-auto no-scrollbar border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-headline text-3xl text-on-surface italic">{selectedTx.title}</h3>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">{selectedTx.type}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-2 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-highest/30 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                      {React.createElement((selectedTx.subcategoryIcon ? ICON_MAP[selectedTx.subcategoryIcon] : ICON_MAP[selectedTx.icon]) || ShoppingBag, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Amount</p>
                      <p className={`font-headline text-3xl ${selectedTx.amount > 0 ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(selectedTx.amount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-highest/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Date</span>
                    </div>
                    <p className="text-sm text-on-surface">{selectedTx.date}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-highest/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Time</span>
                    </div>
                    <p className="text-sm text-on-surface">{selectedTx.time}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-highest/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                      <Tag className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Classification</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm text-on-surface">{selectedTx.category}</p>
                       {selectedTx.subcategory && (
                         <>
                           <ChevronRight className="w-3 h-3 text-white/20" />
                           <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                             {selectedTx.subcategoryIcon && React.createElement(ICON_MAP[selectedTx.subcategoryIcon] || Star, { className: 'w-3 h-3 text-primary' })}
                             <span className="text-xs text-primary font-medium">{selectedTx.subcategory}</span>
                           </div>
                         </>
                       )}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-highest/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                      <Wallet className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Wallet</span>
                    </div>
                    <p className="text-sm text-on-surface">{selectedTx.walletId || 'Main Vault'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-on-surface text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[130]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface-container-low rounded-[2rem] z-[140] p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <Trash2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-headline text-3xl text-on-surface italic mb-2">Confirm Deletion</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    This action is irreversible. Are you certain you wish to remove this transaction from your records?
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-on-surface text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-4 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {isEditing && selectedTx && (
          <NewTransaction 
            onClose={() => {
              setIsEditing(false);
              setSelectedTx(null);
            }} 
            editTransaction={selectedTx}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
