import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Calendar, ChevronDown, DollarSign, Settings2, 
  Plus, Edit3, Trash2, X, Palette, Heart, 
  Utensils, Award, ShoppingBag, Smartphone, 
  Plane, Car, Hotel, CreditCard, RefreshCcw, Layers
} from 'lucide-react';
import { financialService } from '../services/financial.service';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';
import { Category, RecurringTransaction } from '../types';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';

type Period = 'Monthly' | 'Quarterly' | 'Annually';

export default function IncomeStatement() {
  const transactions = useFinancialStore(s => s.transactions);
  const wallets = useWalletStore(s => s.wallets);
  const categories = useFinancialStore(s => s.categories);
  const addCategory = useFinancialStore(s => s.addCategory);
  const updateCategory = useFinancialStore(s => s.updateCategory);
  const deleteCategory = useFinancialStore(s => s.deleteCategory);
  const recurringTransactions = useFinancialStore(s => s.recurringTransactions);
  const addRecurringTransaction = useFinancialStore(s => s.addRecurringTransaction);
  const updateRecurringTransaction = useFinancialStore(s => s.updateRecurringTransaction);
  const deleteRecurringTransaction = useFinancialStore(s => s.deleteRecurringTransaction);
  const [period, setPeriod] = useState<Period>('Monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showManageDrawer, setShowManageDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'Categories' | 'Recurring'>('Categories');
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [isAddingRecurring, setIsAddingRecurring] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('shopping_bag');
  const [newCatColor, setNewCatColor] = useState(COLOR_OPTIONS[0]);
  const [newCatType, setNewCatType] = useState<'income' | 'expense'>('expense');

  const [newRecName, setNewRecName] = useState('');
  const [newRecAmount, setNewRecAmount] = useState('');
  const [newRecType, setNewRecType] = useState<'income' | 'expense'>('expense');
  const [newRecCategory, setNewRecCategory] = useState('');
  const [newRecFreq, setNewRecFreq] = useState<'Monthly' | 'Quarterly' | 'Annually'>('Monthly');

  const stats = useMemo(() => {
    return financialService.calculateIncomeStatement(transactions, recurringTransactions, period);
  }, [transactions, period, recurringTransactions]);

  const primaryCurrencySymbol = useMemo(() => {
    const primaryCurrency = wallets[0]?.currency || 'USD';
    return SUPPORTED_CURRENCIES.find((c: any) => c.code === primaryCurrency)?.symbol || '$';
  }, [wallets]);

  const formatCurrency = (val: number) => {
    const parts = Math.abs(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${val < 0 ? '-' : ''}${primaryCurrencySymbol} ${parts.join('.')}`;
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatIcon(cat.icon);
    setNewCatColor(cat.color);
    setNewCatType(cat.type);
    setIsAddingCategory(false);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setNewCatName('');
    setNewCatIcon('shopping_bag');
    setNewCatColor(COLOR_OPTIONS[0]);
    setNewCatType('expense');
    setIsAddingCategory(true);
  };

  const handleOpenAddRec = () => {
    setEditingRecurring(null);
    setNewRecName('');
    setNewRecAmount('');
    setNewRecType('expense');
    setNewRecCategory(categories.find(c => c.type === 'expense')?.name || '');
    setNewRecFreq('Monthly');
    setIsAddingRecurring(true);
  };

  const handleOpenEditRec = (rec: RecurringTransaction) => {
    setEditingRecurring(rec);
    setNewRecName(rec.name);
    setNewRecAmount(rec.amount.toString());
    setNewRecType(rec.type);
    setNewRecCategory(rec.category);
    setNewRecFreq(rec.frequency);
    setIsAddingRecurring(false);
  };

  const handleSaveRecurring = () => {
    const amount = parseFloat(newRecAmount);
    if (!newRecName.trim() || isNaN(amount)) return;

    if (isAddingRecurring) {
      addRecurringTransaction({
        name: newRecName,
        amount,
        type: newRecType,
        category: newRecCategory,
        frequency: newRecFreq
      });
    } else if (editingRecurring) {
      updateRecurringTransaction(editingRecurring.id, {
        name: newRecName,
        amount,
        type: newRecType,
        category: newRecCategory,
        frequency: newRecFreq
      });
    }
    setEditingRecurring(null);
    setIsAddingRecurring(false);
  };

  const handleSaveCategory = () => {
    if (!newCatName.trim()) return;

    if (isAddingCategory) {
      addCategory({
        name: newCatName,
        icon: newCatIcon,
        color: newCatColor,
        type: newCatType,
        subcategories: []
      });
    } else if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: newCatName,
        icon: newCatIcon,
        color: newCatColor,
        type: newCatType
      });
    }
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end px-1">
        <h3 className="font-headline text-2xl">Income Statement</h3>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowManageDrawer(true)}
            className="w-10 h-10 rounded-full bg-surface-container-low border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-white/5 text-[10px] uppercase tracking-widest font-bold text-primary transition-all hover:bg-surface-container-high"
            >
              <Calendar className="w-3 h-3" />
              {period}
              <ChevronDown className={`w-3 h-3 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showPeriodDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 bg-surface-container-high border border-white/10 rounded-2xl p-2 z-20 shadow-2xl backdrop-blur-xl"
                  >
                    {(['Monthly', 'Quarterly', 'Annually'] as Period[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setShowPeriodDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${period === p ? 'bg-primary text-background' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Main Summary Card */}
        <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  <ArrowUpRight className="w-3 h-3 text-primary" />
                  Total Revenue
                </div>
                <p className="font-headline text-3xl text-on-surface">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                  Total Expenses
                </div>
                <p className="font-headline text-3xl text-on-surface">{formatCurrency(stats.expenses)}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Net Flow</p>
                <h4 className="font-headline text-4xl text-on-surface">
                  {formatCurrency(stats.netIncome)}
                </h4>
              </div>
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${stats.netIncome >= 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                {stats.netIncome >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant px-1">Expense Breakdown</h4>
            <BarChart3 className="w-4 h-4 text-on-surface-variant/40" />
          </div>
          
          <div className="space-y-5">
            {stats.categories.slice(0, 4).map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-on-surface">{cat.name}</span>
                  <span className="text-on-surface-variant font-mono">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.amount / stats.expenses) * 100}%` }}
                    className="h-full bg-primary/40 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Drawer */}
      <AnimatePresence>
        {showManageDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-low border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-headline text-3xl italic">Financial Logic</h3>
                <button onClick={() => setShowManageDrawer(false)} className="p-2 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                {(['Categories', 'Recurring'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                {activeTab === 'Categories' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Expense & Income Groups</p>
                      <button 
                        onClick={handleOpenAdd}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary hover:opacity-70"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map(cat => (
                        <div key={cat.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                              {React.createElement(ICON_OPTIONS.find(i => i.id === cat.icon)?.icon || ShoppingBag, { className: 'w-5 h-5' })}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{cat.name}</p>
                              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">{cat.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(cat)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-2 text-on-surface-variant hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Category Form */}
                    <AnimatePresence>
                      {(editingCategory || isAddingCategory) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="p-6 rounded-3xl bg-surface-container border border-primary/20 space-y-8"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                              {isAddingCategory ? 'New Category' : 'Edit Category'}
                            </p>
                            <button onClick={() => { setEditingCategory(null); setIsAddingCategory(false); }} className="text-on-surface-variant">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-6">
                            <input 
                              type="text" 
                              placeholder="Category Name"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                            />

                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Icon Select</p>
                              <div className="flex flex-wrap gap-2">
                                {ICON_OPTIONS.map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setNewCatIcon(opt.id)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${newCatIcon === opt.id ? 'bg-primary border-primary text-background' : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'}`}
                                  >
                                    <opt.icon className="w-5 h-5" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Color Palette</p>
                              <div className="flex flex-wrap gap-3">
                                {COLOR_OPTIONS.map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setNewCatColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${newCatColor === color ? 'scale-125 border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => setNewCatType('income')}
                                className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newCatType === 'income' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}
                              >
                                Income
                              </button>
                              <button 
                                onClick={() => setNewCatType('expense')}
                                className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newCatType === 'expense' ? 'bg-red-400/20 border-red-400 text-red-400' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}
                              >
                                Expense
                              </button>
                            </div>

                            <button 
                              onClick={handleSaveCategory}
                              className="w-full py-4 bg-primary text-background rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                            >
                              {isAddingCategory ? 'Create Category' : 'Save Changes'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Regular Cash Flows</p>
                      <button 
                        onClick={handleOpenAddRec}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary hover:opacity-70"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Regular
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {recurringTransactions.map(rec => (
                        <div key={rec.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${rec.type === 'income' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                              <RefreshCcw className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{rec.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">{rec.frequency}</p>
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">{rec.category}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-mono font-bold ${rec.type === 'income' ? 'text-primary' : 'text-red-400'}`}>
                              {formatCurrency(rec.type === 'income' ? rec.amount : -rec.amount)}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleOpenEditRec(rec)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteRecurringTransaction(rec.id)} className="p-2 text-on-surface-variant hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recurring Form */}
                    <AnimatePresence>
                      {(editingRecurring || isAddingRecurring) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="p-6 rounded-3xl bg-surface-container border border-primary/20 space-y-6"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                              {isAddingRecurring ? 'New Regular Flow' : 'Edit Regular Flow'}
                            </p>
                            <button onClick={() => { setEditingRecurring(null); setIsAddingRecurring(false); }} className="text-on-surface-variant">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Flow Name</p>
                              <input 
                                type="text" 
                                placeholder="e.g. Salary, Rent"
                                value={newRecName}
                                onChange={(e) => setNewRecName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Amount</p>
                                <input 
                                  type="number" 
                                  placeholder="0.00"
                                  value={newRecAmount}
                                  onChange={(e) => setNewRecAmount(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Frequency</p>
                                <select 
                                  value={newRecFreq}
                                  onChange={(e) => setNewRecFreq(e.target.value as any)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary text-on-surface appearance-none"
                                >
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Annually">Annually</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Category Mapping</p>
                              <select 
                                value={newRecCategory}
                                onChange={(e) => setNewRecCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary text-on-surface appearance-none"
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.name}>{cat.name} ({cat.type})</option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <button 
                                onClick={() => setNewRecType('income')}
                                className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newRecType === 'income' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}
                              >
                                Income
                              </button>
                              <button 
                                onClick={() => setNewRecType('expense')}
                                className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newRecType === 'expense' ? 'bg-red-400/20 border-red-400 text-red-400' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}
                              >
                                Expense
                              </button>
                            </div>

                            <button 
                              onClick={handleSaveRecurring}
                              className="w-full py-4 bg-primary text-background rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 mt-4"
                            >
                              {isAddingRecurring ? 'Add Flow' : 'Update Flow'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function BarChart3(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
