import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, User, History, Wallet, 
  TrendingUp, AlertCircle, Target, PiggyBank, 
  Home, Landmark, ChevronRight, Crown
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
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
            className="fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-[#0e0e0e] border-r border-white/5 z-[70] flex flex-col"
          >
            {/* Header / Profile Section */}
            <div className="relative pt-16 pb-10 px-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest border border-primary/20 p-1 mb-6 group cursor-pointer" onClick={() => handleItemClick('profile')}>
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
                    <h2 className="font-headline text-3xl text-white italic tracking-tight">{profile?.name}</h2>
                    <Crown className="w-4 h-4 text-primary" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-primary font-bold">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-4">
              <div className="px-4 mb-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">Management</p>
              </div>
              
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.screen)}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-sans text-sm text-white/60 group-hover:text-white transition-colors tracking-wide font-medium">{item.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 bg-black/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Current Plan</span>
                  <span className="text-xs text-white/60 font-medium">Private Banking Plus</span>
                </div>
                <button className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Upgrade</button>
              </div>
              
              <p className="font-sans text-[9px] text-white/10 uppercase tracking-[0.4em] text-center">
                Alchemist Wealth v1.2.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
