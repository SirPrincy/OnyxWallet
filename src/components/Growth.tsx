import React, { useState } from 'react';
import { 
  Star, Award, Rocket, Diamond, Shield, Globe,
  Sparkles, Landmark, Wallet, Plus, ChevronRight, CheckCircle2,
  TrendingUp, Target, Zap, X, ArrowRight, History,
  AlertCircle, Clock, Map, Gem, Lock, Crown, Info
} from 'lucide-react';
import { useFinancialStore } from '../store/useFinancialStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { useWalletStore } from '../store/useWalletStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import { ICON_MAP } from '../constants';
import { useCurrency } from '../hooks/useCurrency';

import SafeToSpendAI from './SafeToSpendAI';
import VaultVisual from './VaultVisual';
import PathSelection from './PathSelection';
import GoalWizard from './GoalWizard';
import MissionBoard from './MissionBoard';

export default function Growth() {
  const savingsGoals = useFinancialStore(s => s.savingsGoals);
  const contributeToGoal = useFinancialStore(s => s.contributeToGoal);
  const addSavingsGoal = useFinancialStore(s => s.addSavingsGoal);
  const transactions = useFinancialStore(s => s.transactions);
  
  const wallets = useWalletStore(s => s.wallets);
  
  const missions = useGamificationStore(s => s.missions);
  const achievements = useGamificationStore(s => s.achievements);
  const tierData = useGamificationStore(s => s.tierData);
  const path = useGamificationStore(s => s.path);
  const currentUser = useAuthStore(s => s.currentUser);
  
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPathModal, setShowPathModal] = useState(false);
  const [contribAmount, setContribAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');

  // New Goal State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newGoalCategory, setNewGoalCategory] = useState<'emergency' | 'luxury' | 'travel' | 'investment' | 'other'>('other');
  const [newGoalIcon, setNewGoalIcon] = useState('target');
  const [newGoalColor, setNewGoalColor] = useState('#F2CA50');
  const [newGoalInflation, setNewGoalInflation] = useState(0);
  const [newGoalAutoAlloc, setNewGoalAutoAlloc] = useState(0);

  const [historyGoalId, setHistoryGoalId] = useState<string | null>(null);
  const [goalHistory, setGoalHistory] = useState<any[]>([]);
  const [view, setView] = useState<'overview' | 'missions'>('overview');

  const totalLiquidity = useWalletStore(s => s.totalLiquidity);
  const { primaryCurrencySymbol, formatCurrency } = useCurrency();

  const averageMonthlyIncome = React.useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return totalIncome > 0 ? Math.max(3000, totalIncome / 3) : 3000;
  }, [transactions]);

  const { tierName, level, progressPercent, xpLeft, nextTier } = tierData;

  // Prestige Theme logic
  const isPrestige = level >= 6;
  const prestigeClass = isPrestige ? 'border-primary/30 shadow-[0_0_30px_rgba(242,202,80,0.1)] bg-gradient-to-b from-surface-container-low to-black' : 'bg-surface-container-low border-white/5';

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget || !currentUser?.id) return;
    addSavingsGoal({
      title: newGoalTitle,
      desc: newGoalDesc || 'Strategic wealth objective',
      target: parseFloat(newGoalTarget),
      current: 0,
      targetDate: newGoalDate,
      priority: newGoalPriority,
      category: newGoalCategory,
      icon: newGoalIcon,
      color: newGoalColor,
      inflationRate: newGoalInflation,
      autoAllocationPercent: newGoalAutoAlloc
    }, currentUser.id);
    setShowAddModal(false);
    resetNewGoalForm();
  };

  const resetNewGoalForm = () => {
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalDesc('');
    setNewGoalDate('');
    setNewGoalPriority('medium');
    setNewGoalCategory('other');
    setNewGoalIcon('target');
    setNewGoalColor('#F2CA50');
    setNewGoalInflation(0);
    setNewGoalAutoAlloc(0);
  };

  const handleContribute = () => {
    if (!selectedGoalId || !contribAmount || !currentUser?.id) return;
    contributeToGoal(selectedGoalId, parseFloat(contribAmount), currentUser.id, selectedWalletId);
    setSelectedGoalId(null);
    setContribAmount('');
  };

  const fetchHistory = async (goalId: string) => {
    const history = await useFinancialStore.getState().getGoalHistory(goalId);
    setGoalHistory(history);
    setHistoryGoalId(goalId);
  };

  // Liquidity-based layout transformation
  const isHighLiquidity = totalLiquidity > 50000;
  const selectedMission = missions.find(m => m.id === selectedMissionId);
  const getGoalHistory = useFinancialStore(s => s.getGoalHistory);

  if (savingsGoals.length === 0) {
    return <GoalWizard onComplete={() => {}} />;
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Sub-Navigation */}
      <div className="flex gap-4 p-1.5 bg-surface-container-highest/30 rounded-2xl border border-white/5">
        <button
          onClick={() => setView('overview')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-primary text-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('missions')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'missions' ? 'bg-primary text-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Missions
        </button>
      </div>

      {view === 'missions' ? (
        <MissionBoard />
      ) : (
        <>
      {/* Wealth Ascension Status */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-[3rem] p-12 relative overflow-hidden border transition-all duration-1000 ${prestigeClass}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${isPrestige ? 'bg-primary text-background border-primary shadow-[0_0_20px_rgba(242,202,80,0.5)]' : 'bg-primary/20 text-primary border-primary/30'}`}>
                  {isPrestige ? <Crown className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                </div>
                <div>
                  <span className="text-on-surface-variant font-sans text-[10px] uppercase tracking-[0.4em] font-bold block mb-1">Tier Recognition</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">VERIFIED</span>
                    {isPrestige && <span className="text-primary text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 animate-pulse">PRESTIGE</span>}
                  </div>
                </div>
              </div>
              
              <h2 className={`font-headline text-6xl mb-3 tracking-tighter ${isPrestige ? 'text-primary' : 'text-on-surface'}`}>
                Tier {['I','II','III','IV','V','VI'][level-1]}
              </h2>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] font-bold italic mb-12 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                {tierName} Estate Class
              </p>

              <div className="space-y-6">
                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                  <span>Ascension Progress</span>
                  <span className={isPrestige ? 'text-primary' : 'text-on-surface'}>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-primary via-primary-container to-primary shadow-[0_0_20px_rgba(242,202,80,0.4)]"
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-on-surface-variant/60 uppercase tracking-widest font-mono">
                  <span>{xpLeft > 0 ? `${Math.round(xpLeft).toLocaleString()} XP to Ascension` : 'Pinnacle Reached'}</span>
                  <span className="flex items-center gap-2">
                    {nextTier}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <SafeToSpendAI />
        </div>
      </section>

      {/* Path Selection UI */}
      <section>
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-headline text-3xl italic text-on-surface">Alignement Stratégique</h3>
                <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Class Selection</span>
              </div>
              <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-md">
                Votre profil actuel est configuré sur <span className="text-primary font-bold">{path.charAt(0).toUpperCase() + path.slice(1)}</span>.
                Modifiez votre classe pour optimiser vos gains d'expérience et débloquer des missions spécifiques.
              </p>
            </div>
            <button
              onClick={() => setShowPathModal(true)}
              className="px-8 py-4 bg-surface-container-highest border border-white/10 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-3"
            >
              <Map className="w-4 h-4" />
              Changer de Classe
            </button>
          </div>
        </div>
      </section>

      {/* Strategic Reserves (Savings Goals) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <h3 className="font-headline text-2xl text-on-surface italic">
                {isHighLiquidity ? 'Strategic Portfolio' : 'Reserves Stratégiques'}
            </h3>
            <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Active</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-white/5 hover:bg-white/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className={`grid gap-6 ${isHighLiquidity ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {savingsGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const Icon = ICON_MAP[goal.icon] || Target;
            const isOverdue = goal.targetDate && new Date(goal.targetDate).getTime() < Date.now() && !goal.isCompleted;

            // Inflation adjustment
            const yearsToTarget = goal.targetDate ? Math.max(0.1, (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365)) : 0;
            const adjustedTarget = goal.inflationRate ? goal.target * Math.pow(1 + (goal.inflationRate / 100), yearsToTarget) : goal.target;

            return (
              <motion.div 
                layout
                key={goal.id} 
                className={`bg-surface-container/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 hover:bg-surface-container-high transition-all group relative overflow-hidden`}
              >
                {/* Status Alert */}
                {isOverdue && (
                  <div className="bg-error/20 px-6 py-2 flex items-center gap-2 border-b border-error/10">
                    <AlertCircle className="w-4 h-4 text-error" />
                    <span className="text-[10px] text-error font-bold uppercase tracking-wider">Date limite dépassée - Action requise</span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform" style={{ color: goal.color || '#F2CA50' }}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-on-surface font-headline text-xl tracking-tight">{goal.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                            goal.priority === 'high' ? 'bg-error/20 text-error' :
                            goal.priority === 'medium' ? 'bg-primary/20 text-primary' : 'bg-on-surface-variant/20 text-on-surface-variant'
                          }`}>
                            {goal.priority} priority
                          </span>
                          {goal.autoAllocationPercent ? (
                              <span className="text-[8px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                                Auto: {goal.autoAllocationPercent}%
                              </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                        onClick={() => fetchHistory(goal.id)}
                        className="p-3 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedGoalId(goal.id)}
                        className="p-3 rounded-xl bg-primary text-background hover:scale-105 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Vault Visualization */}
                  <div className="mb-8">
                    <VaultVisual
                        progress={progress}
                        trigger={goal.current}
                        color={goal.color}
                        type={goal.category === 'emergency' ? 'cash' : 'coins'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-headline text-on-surface">{formatCurrency(goal.current)}</p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Accumulated</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <p className="text-3xl font-headline text-on-surface-variant/80">{formatCurrency(adjustedTarget)}</p>
                        {goal.inflationRate ? <Info className="w-3 h-3 text-primary" /> : null}
                      </div>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                        {goal.inflationRate ? 'Inflation Adjusted Target' : 'Objective'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

        </>
      )}

      {/* Haute Collection (Achievements) */}
      <section className="space-y-8">
         <div className="flex items-center justify-between px-1">
            <h3 className="font-headline text-2xl text-on-surface italic">Collection de Distinction</h3>
            <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
              {achievements.filter(a => a.earned).length} / {achievements.length} Earned
            </span>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map((badge) => {
            const Icon = ICON_MAP[badge.icon] || Star;
            const rarityColors = {
              common: 'from-on-surface-variant/20 to-on-surface-variant/5 text-on-surface-variant/40',
              rare: 'from-blue-500/20 to-blue-900/10 text-blue-400',
              epic: 'from-purple-500/20 to-purple-900/10 text-purple-400',
              legendary: 'from-primary/20 to-primary-container/10 text-primary'
            };
            const earnedRarityColors = {
              common: 'from-on-surface-variant to-on-surface-variant/80 text-background',
              rare: 'from-blue-500 to-blue-600 text-white',
              epic: 'from-purple-500 to-purple-600 text-white',
              legendary: 'from-primary via-primary-container to-primary text-background'
            };

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`relative p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4 transition-all overflow-hidden ${
                  badge.earned ? 'bg-surface-container-high border-white/10' : 'bg-surface-container-low/40 opacity-60'
                }`}
              >
                {/* Rarity Glow */}
                {badge.earned && badge.rarity !== 'common' && (
                  <div className={`absolute inset-0 opacity-20 blur-2xl -z-10 bg-gradient-to-tr ${rarityColors[badge.rarity]}`} />
                )}

                <div className={`w-16 h-16 rounded-full flex items-center justify-center relative bg-gradient-to-tr shadow-2xl ${
                  badge.earned ? earnedRarityColors[badge.rarity] : rarityColors[badge.rarity]
                }`}>
                  {badge.earned && badge.rarity === 'legendary' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-background/30"
                    />
                  )}
                  <Icon className="w-7 h-7" />
                </div>

                <div className="text-center space-y-1">
                  <h5 className="text-[10px] font-bold text-on-surface leading-tight uppercase tracking-widest">{badge.title}</h5>
                  <p className={`text-[7px] font-bold uppercase tracking-[0.2em] ${
                    badge.rarity === 'legendary' ? 'text-primary' :
                    badge.rarity === 'epic' ? 'text-purple-400' :
                    badge.rarity === 'rare' ? 'text-blue-400' : 'text-on-surface-variant/60'
                  }`}>
                    {badge.rarity}
                  </p>
                </div>

                {badge.earned && (
                   <div className="absolute top-3 right-3">
                     <CheckCircle2 className="w-3 h-3 text-primary" />
                   </div>
                )}
              </motion.div>
            );
          })}
         </div>
      </section>

      {/* MODALS */}
      <AnimatePresence>
        {showPathModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPathModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10 overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Alignement</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Select Your Strategic Path</p>
                </div>
                <button onClick={() => setShowPathModal(false)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="pb-12">
                <PathSelection />
              </div>

              <button
                onClick={() => setShowPathModal(false)}
                className="w-full py-6 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
              >
                Confirmer l'Alignement
              </button>
            </motion.div>
          </>
        )}

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
                               <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{formatCurrency(w.balance)}</p>
                           </div>
                         </div>
                         {selectedWalletId === w.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Capital Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-headline text-4xl">{primaryCurrencySymbol} </span>
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
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10 overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Nouvel Objectif</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Wealth Expansion Blueprint</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Template / Category Choice */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Stratégie</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'emergency', label: 'Urgence', icon: Shield, color: '#F87171' },
                      { id: 'luxury', label: 'Luxe', icon: Gem, color: '#A78BFA' },
                      { id: 'travel', label: 'Voyage', icon: Map, color: '#60A5FA' },
                      { id: 'investment', label: 'Investissement', icon: TrendingUp, color: '#34D399' },
                      { id: 'other', label: 'Autre', icon: Target, color: '#F2CA50' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setNewGoalCategory(cat.id as any);
                          setNewGoalColor(cat.color);
                          setNewGoalIcon(cat.id === 'emergency' ? 'shield' : cat.id === 'luxury' ? 'diamond' : cat.id === 'travel' ? 'palmtree' : cat.id === 'investment' ? 'trending-up' : 'target');
                        }}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${newGoalCategory === cat.id ? 'bg-primary/10 border-primary/40' : 'bg-surface-container-low border-white/5'}`}
                      >
                        <cat.icon className={`w-5 h-5 ${newGoalCategory === cat.id ? 'text-primary' : 'text-on-surface-variant'}`} />
                        <span className={`text-[9px] font-bold uppercase ${newGoalCategory === cat.id ? 'text-primary' : 'text-on-surface-variant'}`}>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Identification</label>
                    <input
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base"
                      placeholder="e.g. Monaco Residence"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Date Cible</label>
                    <input
                      type="date"
                      value={newGoalDate}
                      onChange={(e) => setNewGoalDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Capital Cible ({primaryCurrencySymbol})</label>
                    <input
                      type="number"
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base font-headline"
                      placeholder="1 000 000"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Priorité</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          onClick={() => setNewGoalPriority(p as any)}
                          className={`flex-1 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newGoalPriority === p ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-surface-container-low border-white/5 text-on-surface-variant'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Logic: Inflation & Auto-Alloc */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Inflation Toggle (%)</label>
                    <input
                      type="number"
                      value={newGoalInflation}
                      onChange={(e) => setNewGoalInflation(parseFloat(e.target.value))}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Auto-Allocation (%)</label>
                    <input
                      type="number"
                      value={newGoalAutoAlloc}
                      onChange={(e) => setNewGoalAutoAlloc(parseFloat(e.target.value))}
                      className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                {newGoalCategory === 'emergency' && (
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
                    <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Progressive Buffer Calculator</p>
                    <div className="flex flex-wrap gap-2">
                       {[1, 3, 6, 12].map(months => (
                          <button
                            key={months}
                            onClick={() => setNewGoalTarget((averageMonthlyIncome * months).toString())}
                            className="flex-1 min-w-[80px] p-4 bg-background/50 rounded-xl border border-white/5 text-center group hover:border-primary/30 transition-colors"
                          >
                             <p className="text-[10px] text-on-surface font-bold uppercase">{months}M</p>
                             <p className="text-[8px] text-on-surface-variant/60 font-mono italic">{formatCurrency(averageMonthlyIncome * months).split('.')[0]}</p>
                          </button>
                       ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Strategic Brief</label>
                  <textarea 
                    value={newGoalDesc}
                    onChange={(e) => setNewGoalDesc(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-1 focus:ring-primary/40 text-base resize-none"
                    placeholder="Rationale for this investment..."
                    rows={2}
                  />
                </div>
                <button 
                  onClick={handleAddGoal}
                  className="w-full py-6 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
                >
                  Initialize Objective
                </button>
              </div>
            </motion.div>
          </>
        )}

        {historyGoalId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryGoalId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[120] p-10 border-t border-white/10 overflow-y-auto max-h-[80vh]"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h3 className="font-headline text-4xl text-on-surface italic">Historique</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Goal Contribution Ledger</p>
                </div>
                <button onClick={() => setHistoryGoalId(null)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {goalHistory.length === 0 ? (
                   <div className="py-20 text-center space-y-4">
                     <History className="w-12 h-12 text-on-surface-variant/20 mx-auto" />
                     <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold">Aucune injection enregistrée</p>
                   </div>
                ) : (
                  goalHistory.map((h) => (
                    <div key={h.id} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-on-surface font-medium">{formatCurrency(h.amount)}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{h.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                    <span className="text-primary">{Math.round(selectedMission.progress).toLocaleString()} / {Math.round(selectedMission.total).toLocaleString()}</span>
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
