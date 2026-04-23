import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Shield, Target, ChevronRight, Zap, TrendingUp, Gem } from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';

export default function PathSelection() {
  const currentPath = useGamificationStore(s => s.path);
  const setPath = useGamificationStore(s => s.setPath);

  const paths = [
    {
      id: 'investor',
      name: 'The Strategic Investor',
      desc: 'Focus on market growth, crypto assets, and passive income generation.',
      perks: ['+50% XP for Investment transactions', 'Unlock High-Yield Missions', 'Portfolio Analysis Tools'],
      icon: TrendingUp,
      color: '#34D399',
      accent: 'text-emerald-400'
    },
    {
      id: 'frugal',
      name: 'The Frugal Architect',
      desc: 'Master of discipline, budget optimization, and debt elimination.',
      perks: ['Bonus XP for staying under budget', 'Unlock Discipline Challenges', 'Expense Optimization AI'],
      icon: Shield,
      color: '#60A5FA',
      accent: 'text-blue-400'
    },
    {
        id: 'neutral',
        name: 'The Balanced Path',
        desc: 'A versatile approach balancing growth and security.',
        perks: ['Standard XP progression', 'Access to all mission types', 'Flexible strategy'],
        icon: Target,
        color: '#F2CA50',
        accent: 'text-primary'
      }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <h3 className="font-headline text-2xl text-on-surface italic">Strategic Alignment</h3>
        <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Class Selection</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map((p) => {
          const isActive = currentPath === p.id;
          const Icon = p.icon;

          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPath(p.id as any)}
              className={`relative p-6 rounded-[2.5rem] border text-left transition-all overflow-hidden flex flex-col h-full ${
                isActive
                  ? 'bg-surface-container-high border-primary/50 shadow-[0_0_30px_rgba(242,202,80,0.15)]'
                  : 'bg-surface-container-low/40 border-white/5 hover:border-white/10'
              }`}
            >
              {isActive && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isActive ? 'bg-primary text-background' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                <Icon size={24} />
              </div>

              <h4 className={`font-headline text-xl mb-2 ${isActive ? 'text-on-surface' : 'text-on-surface/80'}`}>{p.name}</h4>
              <p className="text-[11px] text-on-surface-variant mb-6 flex-grow">{p.desc}</p>

              <div className="space-y-2 mt-auto">
                {p.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Zap className={`w-3 h-3 ${isActive ? p.accent : 'text-on-surface-variant/40'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? 'text-on-surface-variant' : 'text-on-surface-variant/60'}`}>{perk}</span>
                  </div>
                ))}
              </div>

              {isActive && (
                <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Active Class</span>
                  <Rocket size={14} className="text-primary" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
