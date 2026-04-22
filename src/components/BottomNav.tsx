import React from 'react';
import { Home, History, Wallet, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';

type NavItem = 'home' | 'history' | 'budget' | 'growth' | 'profile';

export default function BottomNav({ active, onChange, onPlusClick }: { active: NavItem; onChange: (item: NavItem) => void; onPlusClick: () => void }) {
  const items: { id: NavItem; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-24 flex justify-around items-center px-4 pb-4 bg-[#1c1b1b]/80 backdrop-blur-2xl rounded-t-[24px] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {items.slice(0, 2).map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
            active === item.id 
              ? 'text-[#D4AF37]' 
              : 'text-white/40 active:text-[#D4AF37] hover:text-[#D4AF37]/80'
          }`}
        >
          <item.icon className="w-6 h-6" fill="none" />
          <span className="font-sans text-[10px] font-semibold tracking-widest uppercase mt-1">{item.label}</span>
        </button>
      ))}

      <div className="relative -top-4">
        <button 
          onClick={onPlusClick}
          className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-background shadow-lg shadow-[#D4AF37]/20 active:scale-90 transition-transform"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {items.slice(2).map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
            active === item.id 
              ? 'text-[#D4AF37]' 
              : 'text-white/40 active:text-[#D4AF37] hover:text-[#D4AF37]/80'
          }`}
        >
          <item.icon className="w-6 h-6" fill="none" />
          <span className="font-sans text-[10px] font-semibold tracking-widest uppercase mt-1">{item.label}</span>
        </button>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </nav>
  );
}
