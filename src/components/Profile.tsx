import React, { useState } from 'react';
import { 
  Award, ChevronRight, Landmark, Verified, 
  FileText, Shield, ExternalLink, LogOut, X, Plus, Search, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile as ProfileType } from '../types';

interface ProfileProps {
  profile: ProfileType | null;
}

const MOCK_INSTITUTIONS = [
  { name: 'J.P. Morgan Reserve', icon: Landmark, color: 'bg-blue-500/10 text-blue-500' },
  { name: 'Goldman Sachs Private', icon: Landmark, color: 'bg-yellow-500/10 text-yellow-500' },
  { name: 'UBS Wealth Management', icon: Landmark, color: 'bg-red-500/10 text-red-500' },
  { name: 'Morgan Stanley', icon: Landmark, color: 'bg-indigo-500/10 text-indigo-500' },
  { name: 'Credit Suisse', icon: Landmark, color: 'bg-blue-600/10 text-blue-600' },
  { name: 'Barclays Wealth', icon: Landmark, color: 'bg-sky-500/10 text-sky-500' },
];

export default function Profile({ profile }: ProfileProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkedSuccess, setLinkedSuccess] = useState(false);

  const institutions = [
    { name: 'Chase Private Client', type: 'Checking •••• 8821', status: 'Active' },
    { name: 'HSBC Premier', type: 'Savings •••• 4409', status: 'Active' }
  ];

  const handleLink = (name: string) => {
    setIsLinking(true);
    // Simulate linking process
    setTimeout(() => {
      setIsLinking(false);
      setLinkedSuccess(true);
      setTimeout(() => {
        setLinkedSuccess(false);
        setShowLinkModal(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* User Identity Profile */}
      <section className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[2rem] p-1 bg-gradient-to-tr from-primary to-transparent rotate-3">
            <div className="w-full h-full rounded-[1.8rem] overflow-hidden border-4 border-background -rotate-3">
              <img 
                className="w-full h-full object-cover scale-110" 
                src={profile?.image} 
                alt={profile?.name}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background border border-primary/30 text-primary text-[9px] font-bold tracking-widest uppercase rounded-full shadow-2xl backdrop-blur-md">
            {profile?.role}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1 justify-center">
          <h2 className="font-headline text-4xl text-on-surface italic">{profile?.name}</h2>
          <Verified className="w-5 h-5 text-blue-400 fill-blue-400/10" />
        </div>
        <p className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase opacity-60">
          ID: ONYX-{profile?.id}00X-{profile?.name?.split(' ')[0].toUpperCase()}
        </p>
      </section>

      {/* Financial Tier Details */}
      <section>
        <div className="bg-surface-container-low rounded-[1.5rem] p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2 italic">Global Ranking</p>
              <h3 className="font-headline text-3xl text-on-surface">Wealth Tier IV</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Status: Platinum Reserve</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Award className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="space-y-3 mb-8 relative z-10">
            <div className="flex justify-between text-[10px] font-bold tracking-[0.1em] uppercase">
              <span className="text-on-surface-variant">Progress to Tier V</span>
              <span className="text-primary tracking-widest">85% Complete</span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <button className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:gap-3 transition-all relative z-10">
            Benefits Portfolio <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Personal Information Section */}
      <section>
        <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 mb-4 px-1">Identity Details</h4>
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
          <div className="group flex items-center justify-between p-4 border-b border-outline-variant/10 hover:bg-surface-container transition-colors cursor-pointer">
            <div>
              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Full Name</p>
              <p className="text-sm font-medium text-on-surface">Julian Alistair Thorne</p>
            </div>
            <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
          </div>
          <div className="group flex items-center justify-between p-4 border-b border-outline-variant/10 hover:bg-surface-container transition-colors cursor-pointer">
            <div>
              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Date of Birth</p>
              <p className="text-sm font-medium text-on-surface">14 November 1984</p>
            </div>
            <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
          </div>
          <div className="group flex items-center justify-between p-4 hover:bg-surface-container transition-colors cursor-pointer">
            <div>
              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5">Phone Number</p>
              <p className="text-sm font-medium text-on-surface">+44 (0) 20 7946 0124</p>
            </div>
            <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
          </div>
        </div>
      </section>

      {/* Connected Accounts */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60">Connected Institutions</h4>
          <button 
            onClick={() => setShowLinkModal(true)}
            className="text-primary text-[10px] font-bold tracking-wider uppercase hover:underline"
          >
            Link New Account
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {institutions.map((inst, i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 border border-outline-variant/5 hover:bg-surface-container transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant/10">
                <Landmark className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">{inst.name}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">{inst.type}</p>
              </div>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{inst.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Account Management & Security */}
      <section className="space-y-6">
        <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 px-1">Session Management</h4>
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-surface-container border border-white/5 flex items-center justify-between group hover:bg-surface-container-high transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="font-semibold text-sm text-on-surface">Private Passcode</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Active • Secure</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-background transition-all">
              Update
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/10">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h5 className="font-semibold text-sm text-on-surface italic">Switch Account</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">End current session</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('isOnyxAuthenticated');
                localStorage.removeItem('onyx_current_user');
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-red-400/10 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400 hover:text-white transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Link New Account Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLinking && setShowLinkModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[2rem] z-[120] p-8 max-h-[85vh] overflow-y-auto no-scrollbar border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-3xl text-on-surface italic">Link Account</h3>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Secure Open Banking Integration</p>
                </div>
                <button 
                  onClick={() => setShowLinkModal(false)} 
                  disabled={isLinking}
                  className="p-2 rounded-full bg-white/5 text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {linkedSuccess ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-headline text-2xl text-on-surface">Connection Successful</h4>
                  <p className="text-on-surface-variant text-sm max-w-xs">Your institution has been securely linked to Alchemist Wealth.</p>
                </div>
              ) : isLinking ? (
                <div className="py-12 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <Landmark className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-headline text-2xl text-on-surface">Establishing Secure Link</h4>
                    <p className="text-on-surface-variant text-sm">Verifying credentials with institutional servers...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
                    <input 
                      type="text"
                      placeholder="Search for your institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 px-1">Global Institutions</p>
                    <div className="grid grid-cols-1 gap-3">
                      {MOCK_INSTITUTIONS.filter(inst => inst.name.toLowerCase().includes(searchQuery.toLowerCase())).map((inst, i) => (
                        <button 
                          key={i}
                          onClick={() => handleLink(inst.name)}
                          className="w-full bg-surface-container-highest/50 p-4 rounded-xl flex items-center justify-between border border-white/5 hover:bg-surface-container-highest transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inst.color}`}>
                              <inst.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-on-surface">{inst.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                    <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-on-surface uppercase tracking-wider">Bank-Grade Security</p>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        We use 256-bit AES encryption to protect your data. We never store your login credentials.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
