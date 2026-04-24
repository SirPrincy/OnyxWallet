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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
            className="fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-[#0e0e0e] border-r border-white/5 z-[70] flex flex-col"
          >
            {/* Header / Profile Section */}
            <div className="relative pt-12 pb-6 px-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl bg-surface-container-highest border border-primary/20 p-0.5 group cursor-pointer flex-shrink-0"
                  onClick={() => handleItemClick('profile')}
                >
                  <div className="w-full h-full rounded-[10px] overflow-hidden relative bg-surface-container-highest flex items-center justify-center">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.classList.add('bg-primary/10');
                        }}
                      />
                    ) : null}
                    <span className="font-headline text-xl text-primary italic">
                      {profile?.name ? getInitials(profile.name) : 'O'}
                    </span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                </div>
                
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-xl text-white italic tracking-tight truncate">{profile?.name}</h2>
                    <Crown className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                    <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-primary font-bold truncate">{profile?.role}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <p className="font-sans text-[8px] uppercase tracking-[0.1em] text-on-surface-variant/40 font-medium">{profile?.tier} Tier</p>
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
                  <span className="text-[8px] text-white/20 uppercase tracking-widest mb-0.5">Asset Status</span>
                  <span className="text-[10px] text-white/60 font-medium uppercase tracking-tight">{profile?.status || 'Active'}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-white/20 uppercase tracking-widest mb-0.5">Strategy</span>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-tight italic">{profile?.path || 'Neutral'}</span>
                </div>
              </div>
              
              <p className="font-sans text-[8px] text-white/10 uppercase tracking-[0.3em] text-center">
                Onyx Wallet Premium
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
