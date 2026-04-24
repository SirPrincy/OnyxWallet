import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ArrowUpRight, ArrowDown as ArrowDownIcon, ArrowLeftRight, 
  Calendar, Paperclip, CheckCircle, ChevronRight, 
  Wallet, ShoppingBag, Utensils, Banknote, 
  Car, Dumbbell, Hotel, Fuel, Landmark, 
  Briefcase, Smartphone, Heart, Plane, 
  Award, TrendingUp, CreditCard, DollarSign,
  ArrowLeft, Check, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useCurrency } from '../hooks/useCurrency';
import { Transaction } from '../types';
import { ICON_MAP } from '../constants';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

export default function NewTransaction({ onClose, editTransaction }: { onClose: () => void, editTransaction?: Transaction }) {
  const addTransaction = useFinancialStore(s => s.addTransaction);
  const updateTransaction = useFinancialStore(s => s.updateTransaction);
  const categories = useFinancialStore(s => s.categories);
  const liabilities = useFinancialStore(s => s.liabilities);
  const savingsGoals = useFinancialStore(s => s.savingsGoals);
  
  const wallets = useWalletStore(s => s.wallets);
  const [selectedLiabilityId, setSelectedLiabilityId] = useState<string>(editTransaction?.liabilityId || '');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(editTransaction?.goalId || '');
  
  // Initialize state based on editTransaction if present
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(editTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editTransaction ? Math.abs(editTransaction.amount).toString() : '');
  const [cryptoQuantity, setCryptoQuantity] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (editTransaction) {
      if (editTransaction.type === 'transfer') {
        const transferCat = categories.find(c => c.name === 'Transfer');
        return transferCat || categories[0];
      }
      return (categories.find(c => c.name === editTransaction.category) || categories.find(c => c.type === editTransaction.type) || categories[0]);
    }
    return categories.find(c => c.type === 'expense') || categories[0];
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(editTransaction?.subcategory || '');

  const [selectedWallet, setSelectedWallet] = useState(
    editTransaction ? (wallets.find(w => w.id === editTransaction.walletId) || wallets[0]) : wallets[0]
  );
  const [toWallet, setToWallet] = useState(wallets[1] || wallets[0]);
  const [description, setDescription] = useState(editTransaction?.title || '');
  const { primaryCurrencySymbol, formatCurrency } = useCurrency();

  const [dateTime, setDateTime] = useState(() => {
    const d = editTransaction ? new Date(editTransaction.timestamp) : new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  useEffect(() => {
    // Reset category if it doesn't match the new type (and not a transfer)
    if (type !== 'transfer' && selectedCategory && selectedCategory.type !== type) {
      const firstMatch = categories.find(c => c.type === type);
      if (firstMatch) setSelectedCategory(firstMatch);
    }
  }, [type, categories, selectedCategory]);

  useEffect(() => {
    // If selectedWallet is nullish but wallets exist (e.g. late load), set it
    if (!selectedWallet && wallets && wallets.length > 0) {
      setSelectedWallet(wallets[0]);
    }
    if (!toWallet && wallets && wallets.length > 0) {
      setToWallet(wallets[1] || wallets[0]);
    }
  }, [wallets, selectedWallet, toWallet]);

  // Filtered categories based on type
  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === (type === 'transfer' ? 'expense' : type));
  }, [categories, type]);
  
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [pickerStep, setPickerStep] = useState<'category' | 'subcategory'>('category');
  const [walletPickerMode, setWalletPickerMode] = useState<'single' | 'from' | 'to' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    const finalAmount = selectedWallet?.type === 'Crypto'
      ? (parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0)
      : parseFloat(amount);

    if (!finalAmount || finalAmount <= 0) return;
    
    setIsSubmitting(true);
    
    const [dDate, dTime] = dateTime.split('T');
    const combinedDate = new Date(dateTime);
    const timestamp = isNaN(combinedDate.getTime()) ? Date.now() : combinedDate.getTime();

    const formattedDate = () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (dDate === today) return 'Today';
      if (dDate === yesterday) return 'Yesterday';
      return new Date(dDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const commonBase = {
      date: formattedDate(),
      time: dTime,
      timestamp: timestamp,
      walletId: selectedWallet?.id || '',
    };

    const txData = type === 'transfer' ? {
      ...commonBase,
      title: description || `Transfer: ${selectedWallet?.name} → ${toWallet?.name}`,
      amount: finalAmount,
      category: 'Transfer',
      icon: 'swap_horiz',
      type: 'transfer' as const,
      toWalletId: toWallet?.id || '',
    } : {
      ...commonBase,
      title: description || selectedCategory?.name || 'Transaction',
      amount: type === 'expense' ? -finalAmount : finalAmount,
      category: selectedCategory?.name || 'Uncategorized',
      subcategory: selectedSubcategory || undefined,
      subcategoryIcon: selectedSubcategory ? selectedCategory.subcategories.find(s => s.name === selectedSubcategory)?.icon : undefined,
      icon: selectedCategory.icon,
      type: type,
      liabilityId: selectedLiabilityId || undefined,
      goalId: selectedGoalId || undefined,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, txData);
    } else {
      addTransaction(txData);
    }

    // Simulate API call for UI feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden"
    >
      {/* Background Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-surface-container-highest/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-20 border-b border-white/5">
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-primary hover:text-primary-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="font-headline italic tracking-tighter text-2xl text-primary absolute left-1/2 -translate-x-1/2">
          {editTransaction ? 'Edit Transaction' : 'New Transaction'}
        </h1>
        <div className="w-6" />
      </header>

      <main className="relative z-10 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col pt-24 overflow-y-auto no-scrollbar w-full">
        <section className="mb-10">
          <h2 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight">
            {editTransaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <p className="text-on-surface-variant mt-4 text-lg font-light max-w-md">
            {editTransaction 
              ? 'Refine your financial records with precision and absolute discretion.' 
              : 'Document your financial evolution with precision and discretion.'}
          </p>
        </section>

        <section className="grid grid-cols-3 gap-3 mb-10">
          <button 
            onClick={() => setType('expense')}
            className={`group flex flex-col items-center justify-center py-6 rounded-xl transition-all duration-300 border ${type === 'expense' ? 'bg-surface-container border-primary/40 shadow-lg shadow-primary/5' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container'}`}
          >
            <ArrowUpRight className={`${type === 'expense' ? 'text-primary' : 'text-on-surface-variant'} mb-2 w-8 h-8 group-hover:scale-110 transition-transform`} />
            <span className={`text-[10px] uppercase tracking-widest font-semibold ${type === 'expense' ? 'text-primary' : 'text-on-surface-variant'}`}>Expense</span>
          </button>
          <button 
            onClick={() => setType('income')}
            className={`group flex flex-col items-center justify-center py-6 rounded-xl transition-all duration-300 border ${type === 'income' ? 'bg-surface-container border-primary/40 shadow-lg shadow-primary/5' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container'}`}
          >
            <ArrowDownIcon className={`${type === 'income' ? 'text-primary' : 'text-on-surface-variant'} mb-2 w-8 h-8 group-hover:scale-110 transition-transform`} fill={type === 'income' ? 'currentColor' : 'none'} />
            <span className={`text-[10px] uppercase tracking-widest font-semibold ${type === 'income' ? 'text-primary' : 'text-on-surface-variant'}`}>Income</span>
          </button>
          <button 
            onClick={() => setType('transfer')}
            className={`group flex flex-col items-center justify-center py-6 rounded-xl transition-all duration-300 border ${type === 'transfer' ? 'bg-surface-container border-primary/40 shadow-lg shadow-primary/5' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container'}`}
          >
            <ArrowLeftRight className={`${type === 'transfer' ? 'text-primary' : 'text-on-surface-variant'} mb-2 w-8 h-8 group-hover:scale-110 transition-transform`} />
            <span className={`text-[10px] uppercase tracking-widest font-semibold ${type === 'transfer' ? 'text-primary' : 'text-on-surface-variant'}`}>Transfer</span>
          </button>
        </section>

        <div className="space-y-12">
          {selectedWallet?.type === 'Crypto' ? (
            <div className="space-y-8 bg-surface-container-low/50 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10"></div>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="flex flex-col space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60">Quantity</label>
                  <input
                    value={cryptoQuantity}
                    onChange={(e) => setCryptoQuantity(e.target.value)}
                    className="w-full bg-transparent border-none p-0 font-headline text-5xl md:text-6xl focus:ring-0 text-on-surface placeholder:text-on-surface-variant/20"
                    placeholder="0.00"
                    type="number"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60">Unit Price ($)</label>
                  <input
                    value={cryptoPrice}
                    onChange={(e) => setCryptoPrice(e.target.value)}
                    className="w-full bg-transparent border-none p-0 font-headline text-5xl md:text-6xl focus:ring-0 text-on-surface placeholder:text-on-surface-variant/20"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </div>
              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-bold mb-3">Equivalent Value</p>
                <p className="font-headline text-6xl text-primary tracking-tighter">
                  {formatCurrency((parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0), '$')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-surface-container-low/50 rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-8 relative z-10">Transaction Amount</label>
              <div className="relative flex items-center justify-center w-full max-w-md">
                <span className="text-4xl md:text-5xl font-headline text-primary/40 mr-4 mt-2">
                  {SUPPORTED_CURRENCIES.find(c => c.code === selectedWallet?.currency)?.symbol || '$'}
                </span>
                <input
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none p-0 font-headline text-8xl md:text-9xl focus:ring-0 text-on-surface placeholder:text-on-surface-variant/10 text-center selection:bg-primary/20"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="mt-8 w-24 h-1 bg-primary/10 rounded-full"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {type !== 'transfer' && (
              <div 
                onClick={() => {
                  setPickerStep('category');
                  setShowCategoryPicker(true);
                }}
                className="flex flex-col bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group border border-white/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant">Classification</label>
                  {selectedSubcategory && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {selectedSubcategory}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <div className="text-primary-container">
                        {React.createElement((selectedSubcategory && (selectedCategory?.subcategories as any[]).find(s => s.name === selectedSubcategory)?.icon ? ICON_MAP[(selectedCategory?.subcategories as any[]).find(s => s.name === selectedSubcategory).icon] : ICON_MAP[selectedCategory.icon]) || ShoppingBag, { className: 'w-5 h-5' })}
                      </div>
                    </div>
                    <div>
                      <span className="text-on-surface font-medium block">{selectedCategory.name}</span>
                      <span className="text-xs text-on-surface-variant">{selectedSubcategory || 'No subcategory selected'}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform w-5 h-5" />
                </div>
              </div>
            )}

            {type === 'transfer' && (
              <div 
                onClick={() => setWalletPickerMode('from')}
                className="flex flex-col bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group border border-white/5"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4">From Wallet</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <Wallet className="text-primary-container w-5 h-5" />
                    </div>
                    <span className="text-on-surface font-medium">{selectedWallet?.name || 'No Wallet'}</span>
                  </div>
                  <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform w-5 h-5" />
                </div>
              </div>
            )}

            <div 
              onClick={() => setWalletPickerMode(type === 'transfer' ? 'to' : 'single')}
              className="flex flex-col bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group border border-white/5"
            >
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4">
                {type === 'transfer' ? 'To Wallet' : 'Wallet'}
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <Wallet className="text-primary-container w-5 h-5" />
                  </div>
                  <span className="text-on-surface font-medium">
                    {type === 'transfer' ? (toWallet?.name || 'Select Wallet') : (selectedWallet?.name || 'No Wallet')}
                  </span>
                </div>
                <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform w-5 h-5" />
              </div>
            </div>

            {type === 'expense' && liabilities && liabilities.length > 0 && (
              <div 
                className="flex flex-col bg-surface-container-low p-6 rounded-2xl border border-white/5 group"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4">
                  Link to Liability (Optional)
                </label>
                <select 
                  value={selectedLiabilityId}
                  onChange={(e) => setSelectedLiabilityId(e.target.value)}
                  className="bg-transparent text-sm text-on-surface font-medium border-b border-white/10 focus:outline-none focus:border-primary pb-2 w-full appearance-none"
                >
                  <option value="" className="bg-surface-container-high text-on-surface-variant">None</option>
                  {liabilities.map(l => (
                    <option key={l.id} value={l.id} className="bg-surface-container-high text-on-surface">
                      {l.name} ({formatCurrency(l.remainingAmount)} remaining)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === 'expense' && savingsGoals && savingsGoals.length > 0 && (
              <div 
                className="flex flex-col bg-surface-container-low p-6 rounded-2xl border border-white/5 group"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4">
                  Link to Savings Goal (Optional)
                </label>
                <select 
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="bg-transparent text-sm text-on-surface font-medium border-b border-white/10 focus:outline-none focus:border-primary pb-2 w-full appearance-none"
                >
                  <option value="" className="bg-surface-container-high text-on-surface-variant">None</option>
                  {savingsGoals.map(g => (
                    <option key={g.id} value={g.id} className="bg-surface-container-high text-on-surface">
                      {g.title} ({formatCurrency(g.current)} / {formatCurrency(g.target)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col bg-surface-container-low p-6 rounded-3xl border border-white/5 hover:bg-surface-container transition-colors group">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Transaction Timing
              </label>
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <input 
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="bg-transparent border-none p-0 text-on-surface font-medium focus:ring-0 w-full text-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1 font-mono uppercase tracking-widest opacity-40">
                    {new Date(dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-surface-container-low p-6 rounded-2xl border border-white/5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant mb-4">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-surface-variant resize-none" 
              placeholder="Add a note or reference..." 
              rows={3}
            ></textarea>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl border border-dashed border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Paperclip className="text-on-surface-variant w-5 h-5" />
              <span className="text-on-surface-variant font-medium">Attach Receipt or Document</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Upload</span>
          </div>
        </div>

        <div className="py-12">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isSuccess}
            className={`relative w-full metallic-gradient py-6 rounded-xl overflow-hidden group shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
          >
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-background font-semibold tracking-[0.1em] uppercase text-sm">
                {isSubmitting ? 'Processing...' : isSuccess ? 'Success' : editTransaction ? 'Update Transaction' : 'Add Transaction'}
              </span>
              {isSuccess ? <CheckCircle className="text-background w-5 h-5" /> : <CheckCircle className="text-background w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </div>
          </button>
        </div>
      </main>

      {/* Category Picker Overlay */}
      <AnimatePresence>
        {showCategoryPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryPicker(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2rem] z-[120] p-8 max-h-[85vh] overflow-y-auto no-scrollbar border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              
              <div className="flex items-center gap-4 mb-8">
                {pickerStep === 'subcategory' && (
                  <button 
                    onClick={() => setPickerStep('category')}
                    aria-label="Back to categories"
                    className="p-2 -ml-2 rounded-full hover:bg-white/5 text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                <h3 className="font-headline text-3xl text-on-surface italic">
                  {pickerStep === 'category' ? 'Select Category' : `Subset: ${selectedCategory.name}`}
                </h3>
              </div>

              {pickerStep === 'category' ? (
                <div className="grid grid-cols-2 gap-4">
                  {categories
                    .filter(c => type === 'transfer' ? c.type === 'expense' : c.type === type)
                    .map((cat) => {
                      const IconComp = ICON_MAP[cat.icon] || ShoppingBag;
                      const isSelected = selectedCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat);
                            if (cat.subcategories.length > 0) {
                              setPickerStep('subcategory');
                            } else {
                              setSelectedSubcategory('');
                              setShowCategoryPicker(false);
                            }
                          }}
                          className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${isSelected ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-highest/50 border-transparent hover:bg-surface-container-highest line-clamp-1 text-left'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{cat.name}</span>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedSubcategory('');
                      setShowCategoryPicker(false);
                    }}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all bg-surface-container-highest/30 border border-transparent hover:border-white/10 text-left`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant">
                        <X className="w-5 h-5 opacity-40" />
                      </div>
                      <span className="text-on-surface font-medium">No specific subcategory</span>
                    </div>
                    {selectedSubcategory === '' && <Check className="w-5 h-5 text-primary" />}
                  </button>
                  {selectedCategory.subcategories.map((sub: any) => {
                    const SubIcon = ICON_MAP[sub.icon] || ShoppingBag;
                    const isSelected = selectedSubcategory === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => {
                          setSelectedSubcategory(sub.name);
                          setShowCategoryPicker(false);
                        }}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${isSelected ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-highest/30 border-transparent hover:border-white/10'} text-left`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'}`}>
                            <SubIcon className="w-5 h-5" />
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{sub.name}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wallet Picker Overlay */}
      <AnimatePresence>
        {walletPickerMode !== null && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWalletPickerMode(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2rem] z-[120] p-8 max-h-[70vh] overflow-y-auto no-scrollbar border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className="font-headline text-3xl text-on-surface mb-8 italic">
                {walletPickerMode === 'from' ? 'Select Source Wallet' : walletPickerMode === 'to' ? 'Select Destination Wallet' : 'Select Wallet'}
              </h3>
              <div className="space-y-4">
                {wallets.map((wallet) => {
                  const isSelected = walletPickerMode === 'to' ? toWallet.id === wallet.id : selectedWallet.id === wallet.id;
                  return (
                    <button
                      key={wallet.id}
                      onClick={() => {
                        if (walletPickerMode === 'to') setToWallet(wallet);
                        else setSelectedWallet(wallet);
                        setWalletPickerMode(null);
                      }}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${isSelected ? 'bg-primary/10 border border-primary/40' : 'bg-surface-container-highest/50 border border-transparent hover:bg-surface-container-highest'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className={`font-medium ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{wallet.name}</p>
                          <p className="text-xs text-on-surface-variant">Available: {formatCurrency(wallet.balance, SUPPORTED_CURRENCIES.find(c => c.code === wallet.currency)?.symbol)}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="text-primary w-6 h-6" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 w-full h-1.5 flex gap-1 px-1 z-50">
        <div className="h-full flex-1 bg-primary/20"></div>
        <div className="h-full flex-1 bg-primary/40"></div>
        <div className="h-full flex-1 bg-primary-container"></div>
        <div className="h-full flex-1 bg-primary/40"></div>
        <div className="h-full flex-1 bg-primary/20"></div>
      </div>
    </motion.div>
  );
}

