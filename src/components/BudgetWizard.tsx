import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrency } from '../hooks/useCurrency';

interface BudgetWizardProps {
  onComplete: () => void;
}

export default function BudgetWizard({ onComplete }: BudgetWizardProps) {
  const [step, setStep] = useState<'intro' | 'category' | 'limit' | 'finish'>('intro');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('500');

  const categories = useFinancialStore(s => s.categories);
  const addBudget = useFinancialStore(s => s.addBudget);
  const currentUser = useAuthStore(s => s.currentUser);
  const { primaryCurrencySymbol } = useCurrency();

  const expenseCategories = useMemo(() =>
    categories.filter(c => c.type === 'expense'),
  [categories]);

  const handleFinish = async () => {
    if (!category || !limit || !currentUser?.id) return;
    await addBudget({
      category,
      limit: parseFloat(limit),
      subtext: 'Primary Monthly Budget',
      linkedWallets: []
    }, currentUser.id);
    setStep('finish');
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-12">
      <AnimatePresence mode="wait">
        {step === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8"
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center relative">
              <Filter className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-headline italic text-on-surface">Budget Protocol</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                Establish your first spending limit to activate precision tracking.
              </p>
            </div>
            <button
              onClick={() => setStep('category')}
              className="w-full py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs"
            >
              Begin Initialization
            </button>
          </motion.div>
        ) : step === 'category' ? (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-8"
          >
            <div className="text-left space-y-2">
              <h3 className="text-2xl font-headline italic text-on-surface">Select Category</h3>
              <p className="text-xs text-on-surface-variant">Choose a primary expense to monitor.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
              {expenseCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-3 ${category === cat.name ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <Building2 className={`w-5 h-5 ${category === cat.name ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${category === cat.name ? 'text-primary' : 'text-on-surface'}`}>{cat.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('intro')} className="p-5 rounded-2xl bg-white/5 border border-white/10"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></button>
              <button
                disabled={!category}
                onClick={() => setStep('limit')}
                className="flex-1 py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        ) : step === 'limit' ? (
          <motion.div
            key="limit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-12"
          >
            <div className="text-left space-y-2">
              <h3 className="text-2xl font-headline italic text-on-surface">Spending Cap</h3>
              <p className="text-xs text-on-surface-variant">Set your maximum monthly allowance for {category}.</p>
            </div>
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/40 font-headline text-5xl">{primaryCurrencySymbol}</span>
              <input
                type="number"
                autoFocus
                value={limit}
                onChange={e => setLimit(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-14 pl-24 pr-8 text-8xl font-headline text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('category')} className="p-5 rounded-2xl bg-white/5 border border-white/10"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></button>
              <button
                onClick={handleFinish}
                className="flex-1 py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs"
              >
                Finalize Budget
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-headline italic text-on-surface">Strategic Guardrails Active</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                Your budget for {category} is now being monitored in real-time.
              </p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-5 bg-green-500 rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-xs"
            >
              Enter Planner
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
