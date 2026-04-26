import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Shield,
  Gem,
  Map,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrency } from '../hooks/useCurrency';

interface GoalWizardProps {
  onComplete: () => void;
}

export default function GoalWizard({ onComplete }: GoalWizardProps) {
  const [step, setStep] = useState<'intro' | 'type' | 'target' | 'finish'>('intro');
  const [category, setCategory] = useState<'emergency' | 'luxury' | 'travel' | 'investment' | 'other'>('other');
  const [target, setTarget] = useState('10000');
  const [title, setTitle] = useState('');

  const addSavingsGoal = useFinancialStore(s => s.addSavingsGoal);
  const currentUser = useAuthStore(s => s.currentUser);
  const { primaryCurrencySymbol } = useCurrency();

  const handleFinish = async () => {
    if (!target || !currentUser?.id) return;

    const goalTitle = title || (
      category === 'emergency' ? 'Emergency Buffer' :
      category === 'luxury' ? 'Premium Asset' :
      category === 'travel' ? 'Global Voyage' :
      category === 'investment' ? 'Capital Reserve' : 'Strategic Goal'
    );

    await addSavingsGoal({
      title: goalTitle,
      desc: 'Strategic wealth objective initialized via wizard.',
      target: parseFloat(target),
      current: 0,
      priority: 'medium',
      category: category,
      icon: category === 'emergency' ? 'shield' : category === 'luxury' ? 'diamond' : category === 'travel' ? 'palmtree' : category === 'investment' ? 'trending-up' : 'target',
      color: category === 'emergency' ? '#F87171' : category === 'luxury' ? '#A78BFA' : category === 'travel' ? '#60A5FA' : category === 'investment' ? '#34D399' : '#F2CA50'
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
              <Target className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-headline italic text-on-surface">Wealth Objective</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                Define a primary financial target to begin your capital accumulation journey.
              </p>
            </div>
            <button
              onClick={() => setStep('type')}
              className="w-full py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs"
            >
              Set Objective
            </button>
          </motion.div>
        ) : step === 'type' ? (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-8"
          >
            <div className="text-left space-y-2">
              <h3 className="text-2xl font-headline italic text-on-surface">Strategic Intent</h3>
              <p className="text-xs text-on-surface-variant">What is the focus of this reserve?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'emergency', label: 'Emergency', icon: Shield },
                { id: 'investment', label: 'Investment', icon: TrendingUp },
                { id: 'luxury', label: 'Luxury', icon: Gem },
                { id: 'travel', label: 'Travel', icon: Map },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setCategory(type.id as any)}
                  className={`p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 ${category === type.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <type.icon className={`w-6 h-6 ${category === type.id ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${category === type.id ? 'text-primary' : 'text-on-surface'}`}>{type.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('intro')} className="p-5 rounded-2xl bg-white/5 border border-white/10"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></button>
              <button
                onClick={() => setStep('target')}
                className="flex-1 py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs"
              >
                Continue
              </button>
            </div>
          </motion.div>
        ) : step === 'target' ? (
          <motion.div
            key="target"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-12"
          >
            <div className="text-left space-y-2">
              <h3 className="text-2xl font-headline italic text-on-surface">Capital Target</h3>
              <p className="text-xs text-on-surface-variant">How much liquidity is required for this objective?</p>
            </div>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 font-headline text-3xl">{primaryCurrencySymbol}</span>
              <input
                type="number"
                autoFocus
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-12 pl-16 pr-8 text-6xl font-headline text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold block text-left ml-2">Label (Optional)</label>
              <input
                placeholder="e.g. 6-Month Buffer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('type')} className="p-5 rounded-2xl bg-white/5 border border-white/10"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></button>
              <button
                onClick={handleFinish}
                className="flex-1 py-5 bg-primary rounded-2xl text-background font-bold uppercase tracking-[0.2em] text-xs"
              >
                Initialize Goal
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
              <h2 className="text-4xl font-headline italic text-on-surface">Trajectory Set</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                Your savings goal is now active and tracked within your financial roadmap.
              </p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-5 bg-green-500 rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-xs"
            >
              Enter Growth Center
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
