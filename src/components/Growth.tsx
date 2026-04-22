import React, { useState } from 'react';
import { 
  Star, Flame, Award, Rocket, Diamond, Shield, Globe, 
  Sparkles, Landmark, Wallet, Plus, ChevronRight, CheckCircle2,
  TrendingUp, Target, Zap, X, Calendar, ArrowRight
} from 'lucide-react';
import { useTransactions } from '../context/useTransactions';
import { motion, AnimatePresence } from 'motion/react';
import { ICON_MAP } from '../constants';

import SafeToSpendAI from './SafeToSpendAI';

// Local overrides or additions for specialized goal icons
const IconMap: Record<string, React.ElementType> = {
  ...ICON_MAP,
  local_fire_department: Flame,
  workspace_premium: Award,
  rocket_launch: Rocket,
  auto_graph: TrendingUp,
  auto_awesome: Sparkles,
  public: Globe,
  savings: Wallet,
};

export default function Growth() {
  const { 
    savingsGoals, contributeToGoal, addSavingsGoal, wallets, transactions,
    missions, achievements, updateMission, updateAchievement,
    tierData, xp
  } = useTransactions();
  
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contribAmount, setContribAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');

  // New Goal State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');

  const totalLiquidity = React.useMemo(() => {
    return wallets.reduce((sum, w) => sum + (w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance), 0);
  }, [wallets]);
  const currentMonthTransactions = React.useMemo(() => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    return transactions.filter(t => t.timestamp >= startOfMonth);
  }, [transactions]);
  
  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = Math.abs(currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const averageMonthlyIncome = React.useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return totalIncome > 0 ? Math.max(3000, totalIncome / 3) : 3000;
  }, [transactions]);

  const { tierName, level, progressPercent, xpLeft, nextTier } = tierData;

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) return;
    addSavingsGoal({
      title: newGoalTitle,
      desc: newGoalDesc || 'Strategic wealth objective',
      target: parseFloat(newGoalTarget),
      current: 0
    });
    setShowAddModal(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalDesc('');
  };

  const handleContribute = () => {
    if (!selectedGoalId || !contribAmount) return;
    contributeToGoal(selectedGoalId, parseFloat(contribAmount), selectedWalletId);
    setSelectedGoalId(null);
    setContribAmount('');
  };

  const selectedWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];
  const selectedMission = missions.find(m => m.id === selectedMissionId);

  return (
    <div className="space-y-12 pb-24">
      {/* Wealth Ascension Status */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low rounded-3xl p-10 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Shield className="text-primary w-6 h-6" />
                </div>
                <span className="text-on-surface-variant font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Tier Recognition</span>
              </div>
              
              <h2 className="font-headline text-5xl text-on-surface mb-2 tracking-tight">Wealth Tier {['I','II','III','IV','V','VI'][level-1]}</h2>
              <p className="text-primary text-[10px] uppercase tracking-[0.2em] font-bold italic mb-10 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {tierName} Status Verified
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  <span>Ascension Progress</span>
                  <span className="text-primary">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-primary via-primary-container to-primary-fixed shadow-[0_0_15px_rgba(242,202,80,0.3)]"
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-on-surface-variant/60 uppercase tracking-widest font-mono">
                  <span>{xpLeft > 0 ? `${Math.round(xpLeft).toLocaleString()} XP Left` : 'Max Tier'}</span>
                  <span>Next: {nextTier} Tier</span>
                </div>
              </div>
            </div>
          </div>
          <SafeToSpendAI />
        </div>
      </section>

      {/* Strategic Reserves (Savings Goals) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <h3 className="font-headline text-2xl text-on-surface italic">Reserves Stratégiques</h3>
            <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Active</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-white/5 hover:bg-white/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-4">
          {savingsGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <motion.div 
                layout
                key={goal.id} 
                onClick={() => setSelectedGoalId(goal.id)}
                className="bg-surface-container/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 hover:bg-surface-container-high transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h4 className="text-on-surface font-headline text-lg tracking-tight group-hover:text-primary transition-colors">{goal.title}</h4>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{goal.desc}</p>
                  </div>
                  <div className="bg-surface-container-highest p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="flex justify-between items-end mb-3">
                  <div className="space-y-1">
                    <p className="text-2xl font-headline text-on-surface">${goal.current.toLocaleString()}</p>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Accumulated</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-on-surface-variant/80">${goal.target.toLocaleString()}</p>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Target</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full h-1 bg-surface-container-highest/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Strategic Missions */}
      <section className="space-y-6">
        <h3 className="font-headline text-2xl text-on-surface italic px-1">Missions Stratégiques</h3>
        <div className="space-y-4">
          {missions.map((mission, i) => {
            const Icon = IconMap[mission.icon] || Landmark;
            const progressPct = mission.total > 0 ? (mission.progress / mission.total) * 100 : 0;
            return (
              <div 
                key={mission.id} 
                onClick={() => setSelectedMissionId(mission.id)}
                className="relative group overflow-hidden bg-surface-container-low p-6 rounded-3xl border border-white/5 cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0 group-hover:rotate-12 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-base text-on-surface group-hover:text-primary transition-colors">{mission.title}</h4>
                      {mission.level > 1 && (
                        <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">LVL {mission.level}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{mission.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 transition-all duration-1000" style={{ width: `${Math.min(100, progressPct)}%` }}></div>
                      </div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{Math.min(100, Math.round(progressPct))}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Legacy Achievements */}
      <section className="space-y-6">
         <h3 className="font-headline text-2xl text-on-surface italic px-1">Hauts Faits</h3>
         <div className="grid grid-cols-4 gap-6 px-1">
          {achievements.map((badge) => {
            const Icon = IconMap[badge.icon] || Star;
            return (
              <div key={badge.id} className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-500 cursor-help group ${badge.earned ? 'bg-gradient-to-tr from-primary to-primary-container shadow-[0_10px_30px_rgba(242,202,80,0.2)]' : 'bg-surface-container-highest/50 border border-white/5'}`}>
                  {badge.earned && <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10"></div>}
                  <Icon className={`${badge.earned ? 'text-background' : 'text-on-surface-variant/30'} w-7 h-7`} />
                </div>
                <span className="text-[8px] uppercase tracking-widest text-center text-on-surface-variant/80 font-bold max-w-[60px] leading-tight">{badge.title}</span>
              </div>
            );
          })}
         </div>
      </section>

      {/* MODALS */}
      <AnimatePresence>
        {selectedGoalId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoalId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Allocation</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Strategic Reserve Funding</p>
                </div>
                <button onClick={() => setSelectedGoalId(null)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Source Wallet</label>
                  <div className="grid grid-cols-1 gap-3">
                    {wallets.filter(w => w.type !== 'Credit Card').map(w => (
                      <button 
                        key={w.id}
                        onClick={() => setSelectedWalletId(w.id)}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${selectedWalletId === w.id ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-low border-white/5 hover:bg-surface-container'}`}
                      >
                         <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedWalletId === w.id ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                             <Wallet className="w-5 h-5" />
                           </div>
                           <div className="text-left">
                             <p className={`text-sm font-medium ${selectedWalletId === w.id ? 'text-primary' : 'text-on-surface'}`}>{w.name}</p>
                             <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">${w.balance.toLocaleString()}</p>
                           </div>
                         </div>
                         {selectedWalletId === w.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Capital Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-headline text-4xl">$</span>
                    <input 
                      type="number"
                      value={contribAmount}
                      onChange={(e) => setContribAmount(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-3xl py-10 pl-14 pr-6 text-on-surface text-5xl font-headline focus:ring-0 focus:border-primary/50"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleContribute}
                  className="w-full py-8 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
                >
                  Authorize Injection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}

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
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Nouvel Objectif</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Future Asset Acquisition</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Identification</label>
                  <input 
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg"
                    placeholder="e.g. Monaco Residence"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Target Capital ($)</label>
                  <input 
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg font-headline"
                    placeholder="1,000,000"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Strategic Brief</label>
                  <textarea 
                    value={newGoalDesc}
                    onChange={(e) => setNewGoalDesc(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-6 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-lg resize-none"
                    placeholder="Rationale for this investment..."
                    rows={3}
                  />
                </div>
                <button 
                  onClick={handleAddGoal}
                  className="w-full py-8 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
                >
                  Initialize Objective
                </button>
              </div>
            </motion.div>
          </>
        )}

        {selectedMission && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMissionId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <h3 className="font-headline text-4xl text-on-surface italic">
                    {selectedMission.title}
                    {selectedMission.level > 1 && <span className="ml-4 text-primary text-2xl font-bold">LVL {selectedMission.level}</span>}
                  </h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Mission Details</p>
                </div>
                <button onClick={() => setSelectedMissionId(null)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                  <p className="text-on-surface-variant text-base leading-relaxed">{selectedMission.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end text-[10px] uppercase tracking-[0.3em] font-bold">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-primary">{selectedMission.progress.toLocaleString()} / {selectedMission.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedMission.total > 0 ? Math.min(100, (selectedMission.progress / selectedMission.total) * 100) : 0}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedMissionId(null)}
                  className="w-full py-6 bg-surface-container-highest rounded-full text-on-surface font-bold uppercase tracking-[0.3em] text-xs hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
