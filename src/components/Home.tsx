import React, { useMemo } from 'react';
import { TrendingUp, CreditCard, ShoppingBag, Car, Hotel, Fuel, Landmark, Diamond, BarChart3, Clock, Wallet, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useFinancialStore } from '../store/useFinancialStore';
import { useWalletStore } from '../store/useWalletStore';
import { useGamificationStore } from '../store/useGamificationStore';
import IncomeStatement from './IncomeStatement';

const IconMap: Record<string, React.ElementType> = {
  shopping_bag: ShoppingBag,
  restaurant: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  payments: TrendingUp,
  local_gas_station: Fuel,
  local_taxi: Car,
  hotel: Hotel,
  auto_graph: BarChart3,
  account_balance: Landmark,
  diamond: Diamond,
};

export default function Home({ onNavigate }: { onNavigate: (screen: 'home' | 'history' | 'budget' | 'growth' | 'investing') => void }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const transactions = useFinancialStore(s => s.transactions);
  const recurringTransactions = useFinancialStore(s => s.recurringTransactions);
  const savingsGoals = useFinancialStore(s => s.savingsGoals);
  const budgets = useFinancialStore(s => s.budgets);
  const wallets = useWalletStore(s => s.wallets);
  const totalLiquidity = useWalletStore(s => s.totalLiquidity);
  const tierData = useGamificationStore(s => s.tierData);
  const missions = useGamificationStore(s => s.missions);

  const growthPercent = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    const netChange = transactions
      .filter(t => t.timestamp >= thirtyDaysAgo)
      .reduce((sum, t) => {
        if (t.type === 'income') return sum + t.amount;
        if (t.type === 'expense') return sum - Math.abs(t.amount);
        return sum;
      }, 0);
    
    const previousWealth = totalLiquidity - netChange;

    if (previousWealth <= 0) return netChange > 0 ? 100 : 0;
    return (netChange / previousWealth) * 100;
  }, [transactions, totalLiquidity]);

  const spendingTrend = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
      
      const spent = Math.abs(transactions
        .filter(t => t.type === 'expense' && t.timestamp >= startOfDay && t.timestamp < endOfDay)
        .reduce((sum, t) => sum + t.amount, 0));
      
      return spent;
    });

    const maxSpent = Math.max(...days, 1);
    return days.map(s => Math.max(10, (s / maxSpent) * 100));
  }, [transactions]);

  const totalInvested = useMemo(() => {
    return savingsGoals.reduce((sum, g) => sum + g.current, 0);
  }, [savingsGoals]);

  const mainMission = useMemo(() => {
    const active = missions.filter(m => m.progress < m.total);
    if (active.length === 0) return missions[0];
    return [...active].sort((a, b) => (b.progress / b.total) - (a.progress / a.total))[0];
  }, [missions]);

  const safeToSpend = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate() + 1;

    // 1. Expected Income this month (Recurring + Income already received)
    const monthlyIncome = recurringTransactions
      .filter(rt => rt.type === 'income' && rt.frequency === 'Monthly')
      .reduce((sum, rt) => sum + rt.amount, 0);
    
    // 2. Already received income this month
    const curMonthIncomeResult = transactions
      .filter(tx => tx.type === 'income' && 
        new Date(tx.timestamp).getMonth() === now.getMonth() &&
        new Date(tx.timestamp).getFullYear() === now.getFullYear())
      .reduce((sum, tx) => sum + tx.amount, 0);

    // 3. Fixed Expenses (Recurring)
    const fixedExpenses = recurringTransactions
      .filter(rt => rt.type === 'expense' && rt.frequency === 'Monthly')
      .reduce((sum, rt) => sum + rt.amount, 0);

    // 4. Savings Targets (Simulated monthly target: 10% of remaining if not specified, 
    // or we can use the difference between target and current divided by some months)
    // For simplicity: let's say we want to put $5,000 aside for savings goals this month.
    const savingsTarget = 5000; 

    // 5. Already spent this month (Expenses)
    const curMonthSpent = Math.abs(transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.timestamp).getMonth() === now.getMonth())
      .reduce((sum, tx) => sum + tx.amount, 0));

    const totalAvailable = monthlyIncome + curMonthIncomeResult - fixedExpenses - savingsTarget;
    const remainingForMonth = totalAvailable - curMonthSpent;
    
    // Safe to spend today
    const perDay = remainingForMonth / daysRemaining;

    return {
      monthly: Math.max(0, remainingForMonth),
      daily: Math.max(0, perDay),
      percent: Math.min(100, Math.max(0, (curMonthSpent / totalAvailable) * 100))
    };
  }, [transactions, recurringTransactions]);

  return (
    <div className="space-y-10 pb-12">
      {/* Total Liquidity Section */}
      <header className="flex flex-col items-center text-center space-y-2 pt-4">
        <span className="text-on-surface-variant tracking-[0.1em] uppercase font-semibold text-[0.75rem]">Total Liquidity</span>
        <div className="flex items-baseline gap-2 relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
            <svg className="w-full h-12 text-primary" viewBox="0 0 100 20">
              <path d="M0 15 Q 25 5, 50 12 T 100 8" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <span className="text-primary-container font-headline text-5xl md:text-7xl">$</span>
          <span className="text-on-surface font-headline text-6xl md:text-8xl tracking-tight">
            {totalLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {transactions.length > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low text-primary text-sm font-medium">
            <TrendingUp className={`w-4 h-4 ${growthPercent < 0 ? 'rotate-180 text-error' : ''}`} />
            <span className={growthPercent < 0 ? 'text-error' : ''}>
              {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}% this month
            </span>
          </div>
        )}
      </header>

      {/* Private Reserve Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur opacity-30"></div>
        <div className="relative h-56 w-full rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#0e0e0e] p-8 flex flex-col justify-between overflow-hidden border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-headline text-2xl text-primary leading-none">Private Reserve</p>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase">{tierData.tierName} Tier {['I','II','III','IV','V','VI'][tierData.level-1]}</p>
            </div>
            <CreditCard className="w-10 h-10 text-primary/40" />
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <p className="font-mono text-lg tracking-[0.25em] text-on-surface/80">•••• •••• •••• 8892</p>
              <div className="flex gap-8">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Card Holder</p>
                  <p className="text-xs font-medium uppercase tracking-wider">{currentUser?.name || 'Onyx Member'}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-on-surface-variant">Expires</p>
                  <p className="text-xs font-medium tracking-wider">12/28</p>
                </div>
              </div>
            </div>
            <div className="w-12 h-8 rounded-md bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-primary/80"></div>
                <div className="w-5 h-5 rounded-full bg-primary-container/80"></div>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Safe-to-Spend Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Safe-to-Spend
          </h3>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Rest of month</span>
        </div>
        <div className="bg-surface-container p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <p className="text-5xl font-headline text-on-surface tracking-tight">${safeToSpend.monthly.toLocaleString()}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-bold">Remaining in your vault</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-headline text-primary">${safeToSpend.daily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">Per day limit</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
              <span className="text-on-surface-variant">Consumption Pulse</span>
              <span className={safeToSpend.percent > 90 ? 'text-error' : 'text-primary'}>{safeToSpend.percent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safeToSpend.percent}%` }}
                className={`h-full ${safeToSpend.percent > 90 ? 'bg-error' : 'bg-primary'} transition-all`}
              />
            </div>
          </div>

          <p className="mt-6 text-[10px] text-on-surface-variant/60 italic leading-relaxed">
            Basé sur vos flux récurrents et vos objectifs d'épargne. Dépensez moins de <span className="text-primary font-bold">${safeToSpend.daily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> aujourd'hui pour rester sur la trajectoire de votre patrimoine.
          </p>
        </div>
      </section>

      {/* Active Portfolio Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl">Active Portfolio</h3>
          <span 
            onClick={() => onNavigate('investing')}
            className="text-primary font-sans text-[10px] uppercase tracking-widest cursor-pointer hover:underline"
          >
            Details
          </span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Total Invested Assets</p>
              <h4 className="text-3xl font-headline">${totalInvested.toLocaleString()}</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Daily Yield</p>
              <p className="text-primary font-medium flex items-center justify-end gap-1">
                <TrendingUp className="w-4 h-4" />
                +$0.00
              </p>
            </div>
          </div>
          <div className="h-16 w-full flex items-end gap-1">
            {savingsGoals.slice(0, 7).map((g, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors cursor-help`} 
                style={{ height: `${Math.max(10, (g.current / g.target) * 100)}%` }}
                title={g.title}
              ></div>
            ))}
            {savingsGoals.length < 7 && Array.from({ length: 7 - savingsGoals.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1 rounded-t-sm bg-surface-container-highest/30 h-[10%]"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Missions */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl">Weekly Missions</h3>
          <span 
            onClick={() => onNavigate('growth')}
            className="text-primary font-sans text-[10px] uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
          >
            View All
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {mainMission && (
            <div 
              onClick={() => onNavigate('growth')}
              className="col-span-2 bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="space-y-2">
                <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Active Objective</p>
                <h4 className="text-lg font-headline">{mainMission.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-32 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(mainMission.progress / mainMission.total) * 100}%` }}></div>
                  </div>
                  <span className="text-[10px] text-on-surface/60 italic">{Math.round((mainMission.progress / mainMission.total) * 100)}% complete</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                <Rocket className="w-6 h-6" />
              </div>
            </div>
          )}
          {missions
            .filter(m => !mainMission || m.id !== mainMission.id)
            .slice(0, 4)
            .map((mission) => {
              const Icon = IconMap[mission.icon] || Landmark;
              const progress = (mission.progress / mission.total) * 100;
              return (
                <div 
                  key={mission.id} 
                  onClick={() => onNavigate('growth')}
                  className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 space-y-3 cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <Icon className="text-primary w-6 h-6" />
                    <span className="text-[8px] font-bold text-primary/60">{Math.round(progress)}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight line-clamp-1">{mission.title}</p>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter line-clamp-1">{mission.description}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <IncomeStatement />

      {/* Spending Trends */}
      <section className="space-y-4">
        <h3 className="font-headline text-2xl">Spending Trends</h3>
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-2xl font-headline">
                ${Math.abs(transactions
                  .filter(tx => tx.type === 'expense' && 
                    new Date(tx.timestamp).getMonth() === new Date().getMonth() &&
                    new Date(tx.timestamp).getFullYear() === new Date().getFullYear())
                  .reduce((sum, tx) => sum + tx.amount, 0)
                ).toLocaleString()}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Expenses This Month</p>
            </div>
            <div className="flex gap-1.5 h-12 items-end">
              {spendingTrend.map((h, i) => (
                <div 
                  key={i} 
                  className={`w-2 rounded-t-sm ${h > 80 ? 'bg-primary' : 'bg-surface-container-highest'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-[10px] text-on-surface-variant italic text-center py-4">No spending data for this period.</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  {/* Categorized spending would go here */}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl">Recent Activities</h3>
          <span 
            onClick={() => onNavigate('history')}
            className="text-primary font-sans text-[10px] uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
          >
            History
          </span>
        </div>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="bg-surface-container-low/30 p-8 rounded-xl border border-dashed border-outline-variant/20 text-center">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-2">Welcome to your Vault</p>
              <p className="text-xs text-on-surface-variant/60 italic">Your financial history starts with your first move.</p>
            </div>
          ) : (
            transactions.slice(0, 3).map((tx) => {
              const Icon = IconMap[tx.icon] || ShoppingBag;
              return (
                <div key={tx.id} className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.title}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{tx.date}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
