import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Fingerprint, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Profile } from '../types';

interface LoginProps {
  onLogin: (passcode: string | null, userProfile: Profile) => void;
  onAddProfile?: () => void;
  isPasscodeEnabled: boolean;
}

export default function Login({ onLogin, onAddProfile, isPasscodeEnabled }: LoginProps) {
  const profiles = useAuthStore(s => s.profiles);
  const hashPasscode = useAuthStore(s => s.hashPasscode);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(profiles[0] || null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [step, setStep] = useState<'profile' | 'passcode'>('profile');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedProfile) return;

    if (!isPasscodeEnabled) {
      onLogin(null, selectedProfile);
      return;
    }

    const hashedInput = await hashPasscode(passcode);
    if (hashedInput === selectedProfile.passcode) {
      onLogin(passcode, selectedProfile);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPasscode('');
    }
  };

  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    if (isPasscodeEnabled) {
      setStep('passcode');
    } else {
      onLogin(null, profile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Abstract Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-surface-container-highest/40 via-background to-background"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50 blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-md px-8 py-12 flex flex-col items-center">
        {/* Subtle Brand Header */}
        <header className="mb-16 flex flex-col items-center">
          <Lock className="text-primary mb-2 w-6 h-6" strokeWidth={1} />
          <h2 className="font-headline uppercase tracking-[0.3em] text-primary text-sm">ONYX WALLET</h2>
        </header>

        {/* Editorial Title */}
        <div className="text-center mb-12 space-y-4 w-full">
          <h1 className="font-headline text-5xl md:text-6xl text-on-surface tracking-tight leading-none italic">
            {step === 'profile' ? 'Welcome Back' : 'The Private Vault'}
          </h1>
          <p className="font-sans text-on-surface-variant text-[10px] tracking-[0.3em] uppercase font-bold">
            {step === 'profile' ? 'Select Profile' : `Identify: ${selectedProfile?.name}`}
          </p>
        </div>

        {step === 'profile' ? (
          <div className="w-full max-w-2xl bg-surface-container-low border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_120px_100px_100px] gap-4 p-6 border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">
                <div className="pl-4">Identity</div>
                <div className="text-center">Tier</div>
                <div className="text-center">Activity</div>
                <div className="text-right pr-4">Status</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/5">
                {profiles.length === 0 ? (
                  <div className="p-12 text-center space-y-6 flex flex-col items-center">
                    <p className="text-on-surface-variant text-xs italic">No active identities found in this vault.</p>
                    <button 
                      onClick={onAddProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-bold uppercase tracking-widest text-[10px]"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Initialize Identity
                    </button>
                  </div>
                ) : (
                  profiles.map((profile) => (
                    <motion.button
                      key={profile.id}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      onClick={() => selectProfile(profile)}
                      className="w-full grid grid-cols-[1fr_120px_100px_100px] gap-4 items-center p-4 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-4 pl-4">
                        <div className={`w-12 h-12 rounded-xl border-2 p-0.5 ${profile.color} bg-surface-container overflow-hidden shrink-0 group-hover:scale-105 transition-transform`}>
                          <img src={profile.image} alt={profile.name} className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div>
                          <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{profile.name}</p>
                          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{profile.role}</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-on-surface font-medium uppercase tracking-widest border border-white/5 group-hover:border-primary/20">
                          {profile.tier}
                        </span>
                      </div>

                      <div className="text-center text-[10px] text-on-surface-variant font-mono">
                        {profile.lastActive}
                      </div>

                      <div className="text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${profile.status === 'Active' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]' : 'bg-red-400'}`}></span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface">{profile.status}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
              
              {/* Add Profile Button in List */}
              {profiles.length > 0 && (
                <div className="p-4 bg-surface-container-low/50">
                  <button 
                    onClick={onAddProfile}
                    className="w-full py-4 border border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add New Identity
                  </button>
                </div>
              )}
            </>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleSubmit} className="w-full space-y-8 flex flex-col items-center">
            <div className="w-full space-y-6">
              <div className={`relative group w-full transition-transform duration-300 ${error ? 'animate-shake' : ''}`}>
                <input 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-center text-on-surface font-headline text-4xl tracking-[0.5em] focus:ring-0 focus:border-primary transition-colors duration-500 pb-3 placeholder:text-on-surface-variant/30 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:uppercase italic"
                  id="passcode" 
                  name="passcode" 
                  placeholder="Enter Access Key" 
                  type="password"
                />
              </div>
            </div>

            {/* Primary Action */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 relative group rounded-full flex items-center justify-center metallic-gradient shadow-[0_12px_24px_-8px_rgba(242,202,80,0.3)] px-12 py-4 w-auto"
              type="submit"
            >
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary">
                Unlock
              </span>
            </motion.button>

            {/* Back Button */}
            <button 
              onClick={() => setStep('profile')}
              className="mt-4 text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Change Profile
            </button>

            {/* Secondary Action: Biometrics */}
            <div className="mt-12 flex items-center justify-center w-full">
              <button 
                type="button"
                className="flex flex-col items-center space-y-3 group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                  <Fingerprint className="text-on-surface-variant group-hover:text-primary transition-colors duration-300 w-6 h-6" strokeWidth={1} />
                </div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors duration-300 font-medium">
                  Biometric Login
                </span>
              </button>
            </div>
          </form>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
}
