import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService, AISuggestion } from '../services/ai.service';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useCurrency } from '../hooks/useCurrency';

export default function SafeToSpendAI() {
  const transactions = useFinancialStore(s => s.transactions);
  const budgets = useFinancialStore(s => s.budgets);
  const wallets = useWalletStore(s => s.wallets);
  const [loading, setLoading] = useState(false);
  const { primaryCurrencySymbol } = useCurrency();
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);

  const getAISuggestion = async () => {
    setLoading(true);
    try {
      const data = await aiService.getSafeToSpendSuggestion(transactions, wallets, budgets);
      if (data) setSuggestion(data);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAISuggestion();
  }, [transactions.length]); // Re-calculate when transactions change

  return (
    <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className={`w-4 h-4 text-primary ${loading ? 'animate-pulse' : ''}`} />
      </div>
      
      <div className="space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-1 block">AI Safe-to-Spend</span>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-10 w-32 bg-surface-container-highest animate-pulse rounded-lg" />
            ) : (
              <h4 className="font-headline text-4xl text-on-surface">{primaryCurrencySymbol} {suggestion?.dailyLimit?.toLocaleString() || 0}</h4>
            )}
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Daily Cap</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="h-3 w-3/4 bg-surface-container-highest animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-surface-container-highest animate-pulse rounded" />
            </motion.div>
          ) : suggestion && (
            <motion.div 
              key="suggestion"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  suggestion.riskLevel === 'Low' ? 'bg-primary' :
                  suggestion.riskLevel === 'Medium' ? 'bg-orange-400' : 'bg-red-500'
                }`} />
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  {suggestion.reasoning}
                </p>
              </div>

              <div className="space-y-2">
                {suggestion.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start bg-surface-container/40 p-3 rounded-xl border border-white/5">
                    <TrendingUp className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <p className="text-[9px] text-on-surface-variant leading-tight">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={getAISuggestion}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-white/5 bg-surface-container hover:bg-surface-container-high transition-colors text-[9px] uppercase tracking-widest font-bold text-on-surface-variant flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Recalculate Limit
        </button>
      </div>
    </div>
  );
}
