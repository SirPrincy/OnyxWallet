import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, User, History, Wallet, 
  TrendingUp, AlertCircle, Landmark, ChevronRight, Crown, Home
} from 'lucide-react';
import { Profile } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onNavigate: (screen: any, source: 'drawer') => void;
}

export default function NavigationDrawer({ isOpen, onClose, profile, onNavigate }: NavigationDrawerProps) {
  const menuItems = [
    { icon: Home, label: 'Home', screen: 'home' as const },
    { icon: User, label: 'My profile', screen: 'profile' as const },
    { icon: History, label: 'History', screen: 'history' as const },
    { icon: Wallet, label: 'Wallet', screen: 'wallet' as const },
    { icon: TrendingUp, label: 'Investing', screen: 'investing' as const },
    { icon: Landmark, label: 'Budget', screen: 'budget' as const },
    { icon: Crown, label: 'Growth & Reserves', screen: 'growth' as const },
    { icon: AlertCircle, label: 'Liabilities', screen: 'debt' as const },
    { icon: Settings, label: 'Settings', screen: 'settings' as const },
  ];

  const handleItemClick = (screen: any) => {
    if (screen) {
      onNavigate(screen, 'drawer');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#0e0e0e] border-r border-white/5 z-[70] flex flex-col"
          >
            {/* Header / Profile Section */}
            <div className="relative pt-12 pb-6 px-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <button 
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-primary/20 p-1 mb-4 group cursor-pointer" onClick={() => handleItemClick('profile')}>
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img 
                      src={profile?.image} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-2xl text-white italic tracking-tight">{profile?.name}</h2>
                    <Crown className="w-3.5 h-3.5 text-primary" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-primary/80 font-bold">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.screen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-4.5 h-4.5 text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-sans text-sm text-white/60 group-hover:text-white transition-colors tracking-wide font-medium">{item.label}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Current Plan</span>
                  <span className="text-xs text-white/60 font-medium">Private Banking Plus</span>
                </div>
                <button className="text-[9px] text-primary font-bold uppercase tracking-widest hover:underline">Upgrade</button>
              </div>
              
              <p className="font-sans text-[8px] text-white/10 uppercase tracking-[0.4em] text-center">
                Onyx Wallet v1.2.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
