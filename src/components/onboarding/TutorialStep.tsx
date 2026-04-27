import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Wallet as WalletIcon, TrendingUp, Sparkles } from 'lucide-react';
import { PATHS_DATA } from './constants';

interface TutorialStepProps {
  recommendedPath: string;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({ recommendedPath }) => {
  const path = PATHS_DATA[recommendedPath];
  return (
    <motion.div
      key="tutorial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm space-y-10"
    >
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Strategic Path</p>
        <h1 className="text-3xl font-headline italic text-on-surface">Your First Acts</h1>
        <p className="text-xs text-on-surface-variant">Recommended actions for your {path.name} profile.</p>
      </div>

      <div className="space-y-3">
        {[
          { title: "Security Buffer", desc: "Establish your first liquidity reserve.", xp: "+50 XP", icon: <ShieldCheck className="w-4 h-4" /> },
          { title: "Diversification", desc: "Open 3 different strategic wallets.", xp: "+75 XP", icon: <WalletIcon className="w-4 h-4" /> },
          { title: "Positive Cashflow", desc: "Earn more than you spend this month.", xp: "+100 XP", icon: <TrendingUp className="w-4 h-4" /> },
          { title: "AI Strategic Audit", desc: "Get your first automated portfolio analysis.", xp: "+25 XP", icon: <Sparkles className="w-4 h-4" /> }
        ].map((act, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 text-left group hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
              {act.icon}
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface">{act.title}</h4>
              <p className="text-[9px] text-on-surface-variant leading-relaxed line-clamp-1">{act.desc}</p>
            </div>
            <div className="text-[10px] font-bold text-primary italic whitespace-nowrap bg-primary/10 px-3 py-1 rounded-full">
              {act.xp}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
