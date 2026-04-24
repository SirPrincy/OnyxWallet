import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, Home, Building2, CreditCard, 
  Award, ChevronRight, ArrowDown, X, Wallet, ArrowRight, CheckCircle, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useCurrency } from '../hooks/useCurrency';

export default function DebtScreen() {
  const liabilities = useFinancialStore(s => s.liabilities);
  const payLiability = useFinancialStore(s => s.payLiability);
  const addLiability = useFinancialStore(s => s.addLiability);
  const wallets = useWalletStore(s => s.wallets);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');

  React.useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  // Add Liability State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Mortgage' | 'Personal Loan' | 'Student Loan' | 'Credit Card' | 'Other' | 'Leasing'>('Personal Loan');
  const [newTotalAmount, setNewTotalAmount] = useState('');
  const [newRemainingAmount, setNewRemainingAmount] = useState('');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [newMonthlyPayment, setNewMonthlyPayment] = useState('');
  const [newProvider, setNewProvider] = useState('');

  const handleAddLiability = () => {
    if (!newName || !newTotalAmount || !newRemainingAmount || !newMonthlyPayment) return;
    
    addLiability({
      name: newName,
      type: newType,
      totalAmount: parseFloat(newTotalAmount),
      remainingAmount: parseFloat(newRemainingAmount),
      interestRate: parseFloat(newInterestRate) || 0,
      monthlyPayment: parseFloat(newMonthlyPayment),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default due date 30 days
      provider: newProvider || 'Unknown Provider',
    });

    setShowAddModal(false);
    setNewName('');
    setNewTotalAmount('');
    setNewRemainingAmount('');
    setNewInterestRate('');
    setNewMonthlyPayment('');
    setNewProvider('');
  };

  const totalRemaining = useMemo(() => 
    liabilities.reduce((sum, d) => sum + d.remainingAmount, 0), 
  [liabilities]);

  const totalPaid = useMemo(() => 
    liabilities.reduce((sum, d) => sum + (d.totalAmount - d.remainingAmount), 0), 
  [liabilities]);

  const totalOriginal = useMemo(() => 
    liabilities.reduce((sum, d) => sum + d.totalAmount, 0), 
  [liabilities]);

  const handlePayment = () => {
    if (!selectedDebtId || !paymentAmount || !selectedWalletId) return;
    
    payLiability(selectedDebtId, parseFloat(paymentAmount), selectedWalletId);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedDebtId(null);
      setPaymentAmount('');
    }, 1500);
  };

  const selectedDebt = useMemo(() => 
    liabilities.find(d => d.id === selectedDebtId), 
  [liabilities, selectedDebtId]);

  const sortedBySmallest = useMemo(() => 
    [...liabilities].sort((a, b) => a.remainingAmount - b.remainingAmount),
  [liabilities]);

  const { primaryCurrencySymbol, formatCurrency } = useCurrency();

  const debtToIncomeRatio = 18; // Mock for now

  return (
    <div className="space-y-12 pb-12">
      {/* Section 1: Total Debt Overview */}
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Indebtedness</span>
          <h2 className="font-headline text-6xl md:text-7xl text-on-surface tracking-tight mb-4">{formatCurrency(totalRemaining)}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-low border border-outline-variant/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.6)]"></span>
            <p className="font-sans text-xs text-on-surface-variant">Debt-to-Income Ratio: <span className="text-primary font-medium">{debtToIncomeRatio}% (Healthy)</span></p>
          </div>
        </div>

        {/* Asymmetric Stat Grid */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 bg-surface-container-low/40 backdrop-blur-xl p-6 rounded-xl border border-white/5 flex flex-col justify-between h-32">
            <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Total Capital Repaid</span>
            <span className="font-headline text-3xl text-on-surface">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="col-span-5 bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col justify-between h-32">
            <span className="font-sans text-[10px] uppercase tracking-widest text-primary/80">Monthly Service</span>
            <span className="font-headline text-3xl text-primary">{formatCurrency(liabilities.reduce((sum, l) => sum + l.monthlyPayment, 0))}</span>
          </div>
        </div>
      </section>

      {/* Section 2: Active Liabilities List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-2xl text-on-surface italic">Portfolio Structure</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            aria-label="Add liability"
            className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-white/5 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {liabilities.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-white/5">
              <p className="text-on-surface-variant font-medium">No active liabilities.</p>
              <p className="text-xs text-on-surface-variant/60 mt-2">Add a debt to start tracking your repayment journey.</p>
            </div>
          ) : liabilities.map((debt) => {
            const paid = debt.totalAmount - debt.remainingAmount;
            const progress = (paid / debt.totalAmount) * 100;
            const Icon = debt.type === 'Mortgage' ? Home : debt.type === 'Credit Card' ? CreditCard : Building2;

            return (
              <div 
                key={debt.id}
                onClick={() => setSelectedDebtId(debt.id)}
                className={`group p-6 rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container border-l-2 border-primary cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-sans text-base font-medium text-on-surface">{debt.name}</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1">Interest: {debt.interestRate}% APR • {debt.provider}</p>
                  </div>
                  <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] uppercase tracking-wider font-medium">
                    <span className="text-on-surface-variant">Paid: {formatCurrency(paid)}</span>
                    <span className="text-on-surface">Remaining: {formatCurrency(debt.remainingAmount)}</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Repayment Strategy */}
      {liabilities.length > 0 && (
        <section>
          <div className="relative overflow-hidden p-8 rounded-2xl bg-surface-container-high border border-outline-variant/10">
            {/* Background Pattern */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-primary/5"></div>
            <div className="absolute top-24 -right-6 w-32 h-32 rounded-full border border-primary/10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-1 block">Repayment Strategy</span>
                  <h3 className="font-headline text-3xl text-on-surface">The Snowball</h3>
                </div>
                <TrendingDown className="w-8 h-8 text-primary" />
              </div>

              <div className="bg-surface-container-low/40 backdrop-blur-xl p-6 rounded-xl border border-white/5 mb-8">
                <p className="font-sans text-xs text-on-surface-variant mb-4">Focused elimination of the smallest balances to maximize psychological momentum and cash flow.</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Next Target</span>
                    <p className="font-sans font-medium text-on-surface">{sortedBySmallest[0].name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Projected Payoff</span>
                    <p className="font-sans font-medium text-primary">Est. {new Date(new Date().setMonth(new Date().getMonth() + Math.ceil(sortedBySmallest[0].remainingAmount / sortedBySmallest[0].monthlyPayment))).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedDebtId(sortedBySmallest[0].id)}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-sans font-semibold text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/10 active:scale-[0.98] transition-transform"
              >
                Boost Payment
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedDebtId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDebtId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2rem] z-[120] p-8 max-h-[80vh] overflow-y-auto no-scrollbar border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-3xl text-on-surface italic">Boost Payment</h3>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Accelerate your financial freedom</p>
                </div>
                <button
                  onClick={() => setSelectedDebtId(null)}
                  aria-label="Close"
                  className="p-2 rounded-full bg-white/5 text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-surface-container-highest/30 border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Targeting</p>
                  <p className="text-on-surface font-medium">{selectedDebt?.name}</p>
                  <p className="text-primary text-xs mt-1">Remaining: {formatCurrency(selectedDebt ? selectedDebt.remainingAmount : 0)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Payment Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline text-2xl">{primaryCurrencySymbol} </span>
                    <input 
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-6 pl-10 pr-4 text-on-surface text-3xl font-headline focus:ring-1 focus:ring-primary/40"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Source Liquidity</span>
                    <select 
                      value={selectedWalletId}
                      onChange={(e) => setSelectedWalletId(e.target.value)}
                      className="bg-transparent text-xs text-on-surface font-medium border-b border-primary/20 focus:outline-none focus:border-primary pb-1"
                    >
                      {wallets.map(w => (
                        <option key={w.id} value={w.id} className="bg-surface-container-high text-on-surface">
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Wallet className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest">
                      Available: {formatCurrency(wallets.find(w => w.id === selectedWalletId)?.balance || 0)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isSuccess}
                  className="w-full py-5 metallic-gradient rounded-xl text-background font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSuccess ? (
                    <>Success <CheckCircle className="w-4 h-4" /></>
                  ) : (
                    <>Confirm Payment <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Add Liability</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">New Debt Record</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                  className="p-3 rounded-full bg-white/5 text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Name / Purpose</label>
                  <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Dream Home Mortgage"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Type</label>
                    <select 
                      value={newType}
                      onChange={(e: any) => setNewType(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 appearance-none"
                    >
                      <option value="Mortgage">Mortgage</option>
                      <option value="Personal Loan">Personal Loan</option>
                      <option value="Student Loan">Student Loan</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Leasing">Leasing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Provider</label>
                    <input 
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. Chase Bank"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Total Amount ({primaryCurrencySymbol})</label>
                    <input 
                      type="number"
                      value={newTotalAmount}
                      onChange={(e) => setNewTotalAmount(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface font-headline text-xl focus:ring-1 focus:ring-primary/40"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Remaining ({primaryCurrencySymbol})</label>
                    <input 
                      type="number"
                      value={newRemainingAmount}
                      onChange={(e) => setNewRemainingAmount(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface font-headline text-xl focus:ring-1 focus:ring-primary/40"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Monthly Pay ({primaryCurrencySymbol})</label>
                    <input 
                      type="number"
                      value={newMonthlyPayment}
                      onChange={(e) => setNewMonthlyPayment(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Interest Rate (%)</label>
                    <input 
                      type="number"
                      value={newInterestRate}
                      onChange={(e) => setNewInterestRate(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddLiability}
                  className="w-full py-6 mt-4 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
                >
                  Create Liability
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

  );
}
