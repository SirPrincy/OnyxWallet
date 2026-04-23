import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Wallet as WalletIcon, 
  Sparkles,
  Lock,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWalletStore } from '../store/useWalletStore';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "Welcome to",
    subtitle: "ONYX WALLET",
    description: "Experience the ultimate wealth management interface. Designed for precision, built for your progress.",
    icon: <Sparkles className="w-12 h-12 text-primary" strokeWidth={1} />,
    color: "from-primary/20 to-transparent"
  },
  {
    title: "Absolute",
    subtitle: "PRIVACY",
    description: "Your financial data never leaves your device. No cloud, no tracking, just secure local encryption.",
    icon: <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1} />,
    color: "from-red-500/20 to-transparent"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupStep, setSetupStep] = useState<'info' | 'identity' | 'wallet' | 'finish'>('info');
  const completeOnboarding = useAuthStore(s => s.completeOnboarding);
  const completeSetup = useAuthStore(s => s.completeSetup);
  const login = useAuthStore(s => s.login);
  const addProfile = useAuthStore(s => s.addProfile);
  const addWallet = useWalletStore(s => s.addWallet);
  const [direction, setDirection] = useState(0);

  // Identity state
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  // Wallet state
  const [walletName, setWalletName] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [cryptoQuantity, setCryptoQuantity] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState('');
  const [walletType, setWalletType] = useState<
    'Bank Account' | 'Credit Card' | 'Cash' | 'Mobile Money' | 'Crypto'
  >('Bank Account');
  const [walletCurrency, setWalletCurrency] = useState('USD');

  const nextStep = () => {
    if (setupStep === 'info') {
      if (currentStep < STEPS.length - 1) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
      } else {
        setSetupStep('identity');
      }
    } else if (setupStep === 'identity') {
      if (name && passcode) setSetupStep('wallet');
    } else if (setupStep === 'wallet') {
      if (walletName && walletBalance) {
        handleFinalize();
      }
    }
  };

  const handleFinalize = async () => {
    // 1. Create Profile
    const newProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      passcode,
      role: 'Owner',
      tier: 'Bronze',
      status: 'Active',
      lastActive: 'Now',
      image: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name}`,
      color: 'border-primary'
    };
    
    // Save profile to SQLite using context
    // We use the INITIAL_CATEGORIES from useFinancialStore which are now STANDARD
    const { INITIAL_CATEGORIES } = await import('../store/useFinancialStore');

    await addProfile(newProfile, INITIAL_CATEGORIES);
    
    // Auto-login using context
    await login(newProfile);

    // 2. Create Wallet
    const balance = walletType === 'Crypto'
      ? (parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0)
      : parseFloat(walletBalance);

    await addWallet({
      name: walletName,
      balance: balance || 0,
      type: walletType,
      currency: walletCurrency,
      color: '#B4947C',
      icon: 'landmark',
      provider: 'Onyx Reserve',
      isVisible: true
    });

    // 3. Mark completion
    setSetupStep('finish');
  };

  const handleComplete = async () => {
    // Force a gamification sync to calculate the initial tier based on the deposit
    const profileId = useAuthStore.getState().currentUser?.id;
    if (profileId) {
      const { useGamificationStore } = await import('../store/useGamificationStore');
      await useGamificationStore.getState().syncGamification(profileId);
    }
    await completeSetup();
    await completeOnboarding();
    // This will trigger App.tsx to show the main app since isAuthenticated is true
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden font-sans">
      {/* Ambient Background Gradient */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-b ${STEPS[currentStep].color}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#131313_100%)] opacity-80" />
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 px-8 pt-12 flex gap-2">
        {[0, 1, 2, 3].map((index) => {
          const isInfo = setupStep === 'info';
          const isActive = (isInfo && index <= currentStep) || 
                           (!isInfo && setupStep === 'identity' && index <= 2) ||
                           (!isInfo && setupStep === 'wallet' && index <= 3) ||
                           (setupStep === 'finish');
          
          return (
            <div 
              key={index} 
              className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence custom={direction} mode="wait">
          {setupStep === 'info' ? (
            <motion.div
              key={`info-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm space-y-12"
            >
              <div className="mx-auto w-24 h-24 rounded-full glass-card border border-white/10 flex items-center justify-center relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                />
                {STEPS[currentStep].icon}
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">{STEPS[currentStep].title}</p>
                <h1 className="text-5xl font-headline italic text-on-surface tracking-tight">{STEPS[currentStep].subtitle}</h1>
                <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[280px] mx-auto">{STEPS[currentStep].description}</p>
              </div>
            </motion.div>
          ) : setupStep === 'identity' ? (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-12"
            >
              <div className="mx-auto w-24 h-24 rounded-full glass-card border border-white/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" strokeWidth={1} />
              </div>
              <div className="space-y-8 text-left">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-headline italic text-on-surface">Establish Identity</h2>
                  <p className="text-xs text-on-surface-variant">Choose your name and a secure access key.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Identity Name</label>
                    <input 
                      autoFocus
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Julian Vane"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Secure Passcode</label>
                    <input 
                      type="password"
                      value={passcode}
                      onChange={e => setPasscode(e.target.value)}
                      placeholder="Enter Access Key"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : setupStep === 'wallet' ? (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-12"
            >
              <div className="mx-auto w-24 h-24 rounded-full glass-card border border-white/10 flex items-center justify-center">
                <WalletIcon className="w-10 h-10 text-primary" strokeWidth={1} />
              </div>
              <div className="space-y-8 text-left">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-headline italic text-on-surface">First Deposit</h2>
                  <p className="text-xs text-on-surface-variant">Initialize your primary reserve account.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Wallet Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['Bank Account', 'Credit Card', 'Cash', 'Mobile Money', 'Crypto'].map(type => (
                        <button
                          key={type}
                          onClick={() => setWalletType(type)}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${walletType === type ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Currency</label>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORTED_CURRENCIES.map(curr => (
                        <button
                          key={curr.code}
                          onClick={() => setWalletCurrency(curr.code)}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${walletCurrency === curr.code ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'}`}
                        >
                          {curr.code} ({curr.symbol})
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Wallet Label</label>
                    <input 
                      autoFocus
                      value={walletName}
                      onChange={e => setWalletName(e.target.value)}
                      placeholder="e.g. Global Reserve"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                    />
                  </div>
                  {walletType === 'Crypto' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Quantity</label>
                        <input
                          type="number"
                          value={cryptoQuantity}
                          onChange={e => setCryptoQuantity(e.target.value)}
                          placeholder="0.5"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Price (USD)</label>
                        <input
                          type="number"
                          value={cryptoPrice}
                          onChange={e => setCryptoPrice(e.target.value)}
                          placeholder="70000"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="col-span-2 mt-2 px-1">
                        <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                          Total Value: ${((parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Initial Balance ($)</label>
                      <input
                        type="number"
                        value={walletBalance}
                        onChange={e => setWalletBalance(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finish"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm space-y-8"
            >
              <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-headline italic text-on-surface">Vault Ready</h1>
                <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[280px] mx-auto">
                  Your identity is secured and your reserve is initialized. Let the growth begin.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 p-12 flex flex-col items-center gap-6">
        {setupStep === 'finish' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="w-full max-w-sm bg-green-500 py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] group"
          >
            <span className="font-bold uppercase tracking-[0.2em] text-[11px] text-white">
              Launch Dashboard
            </span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={
              (setupStep === 'identity' && (!name || !passcode)) ||
              (setupStep === 'wallet' && (
                !walletName ||
                (walletType === 'Crypto' ? (!cryptoQuantity || !cryptoPrice) : !walletBalance)
              ))
            }
            className="w-full max-w-sm metallic-gradient py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(242,202,80,0.3)] group disabled:opacity-50"
          >
            <span className="font-bold uppercase tracking-[0.2em] text-[11px] text-on-primary">
              {setupStep === 'info' && currentStep === STEPS.length - 1 ? "Start Setup" : 
               setupStep === 'wallet' ? "Finalize" : "Continue"}
            </span>
            <ChevronRight className="w-4 h-4 text-on-primary group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}

        {setupStep === 'info' && (
          <button 
            onClick={() => setSetupStep('identity')}
            className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors py-2"
          >
            Skip to Setup
          </button>
        )}
      </div>

      {/* Aesthetic Grain Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}
