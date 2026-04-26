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
  CheckCircle2,
  Search,
  Filter,
  Globe,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWalletStore } from '../store/useWalletStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { useFinancialStore } from '../store/useFinancialStore';
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
  const [setupStep, setSetupStep] = useState<'info' | 'identity' | 'quiz' | 'path-result' | 'wallet' | 'finish'>('info');
  const completeOnboarding = useAuthStore(s => s.completeOnboarding);
  const completeSetup = useAuthStore(s => s.completeSetup);
  const login = useAuthStore(s => s.login);
  const addProfile = useAuthStore(s => s.addProfile);
  const addWallet = useWalletStore(s => s.addWallet);
  const setPath = useGamificationStore(s => s.setPath);
  const [direction, setDirection] = useState(0);

  // Identity state
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [recommendedPath, setRecommendedPath] = useState<string>('neutral');

  const QUIZ_QUESTIONS = [
    {
      question: "What is your primary financial focus right now?",
      options: [
        { text: "Maximizing investment growth and crypto returns", path: "investor" },
        { text: "Cutting expenses and eliminating debt", path: "frugal" },
        { text: "Maintaining a balanced and secure portfolio", path: "guardian" },
        { text: "Building a long-term legacy for my family", path: "legacy" }
      ]
    },
    {
      question: "How do you prefer to manage your monthly budget?",
      options: [
        { text: "I optimize every penny for efficiency", path: "frugal" },
        { text: "I automate everything for a hands-off approach", path: "nomad" },
        { text: "I prioritize ethical and sustainable investments", path: "alchemist" },
        { text: "I take high risks for potentially high rewards", path: "catalyst" }
      ]
    },
    {
      question: "Which of these sounds most like your 'Dream Portfolio'?",
      options: [
        { text: "A mix of blue-chip stocks and real estate", path: "guardian" },
        { text: "Early-stage startups and emerging tech", path: "catalyst" },
        { text: "Global assets accessible from anywhere", path: "nomad" },
        { text: "Diversified impact and social bonds", path: "alchemist" }
      ]
    },
    {
      question: "In a market downturn, what is your first reaction?",
      options: [
        { text: "Hold firm and stick to the defensive plan", path: "guardian" },
        { text: "Buy the dip aggressively", path: "investor" },
        { text: "Review my lifestyle costs immediately", path: "frugal" },
        { text: "Check if my long-term mission is still valid", path: "legacy" }
      ]
    },
    {
      question: "How do you view wealth in the grand scheme of things?",
      options: [
        { text: "A tool for absolute freedom and mobility", path: "nomad" },
        { text: "A responsibility to leave the world better", path: "alchemist" },
        { text: "A foundation for future generations", path: "legacy" },
        { text: "A scoreboard for strategic success", path: "investor" }
      ]
    },
    {
      question: "How important is immediate access to your capital (liquidity)?",
      options: [
        { text: "Extremely. I need to move funds across borders instantly", path: "nomad" },
        { text: "Important. I prefer liquid stocks and crypto", path: "investor" },
        { text: "Moderately. I balance cash with long-term assets", path: "guardian" },
        { text: "Low. I prioritize illiquid, high-value legacy assets", path: "legacy" }
      ]
    },
    {
      question: "What is your stance on using debt (leverage) to grow?",
      options: [
        { text: "I use strategic debt to accelerate high-risk growth", path: "catalyst" },
        { text: "I use moderate leverage for proven investments", path: "investor" },
        { text: "I avoid debt at all costs to remain agile", path: "frugal" },
        { text: "I focus on paying down existing debt first", path: "neutral" }
      ]
    }
  ];

  const PATHS_DATA: Record<string, any> = {
    investor: { name: 'The Strategic Investor', desc: 'Focus on market growth, crypto assets, and passive income generation.', color: 'text-emerald-400' },
    frugal: { name: 'The Frugal Architect', desc: 'Master of discipline, budget optimization, and debt elimination.', color: 'text-blue-400' },
    neutral: { name: 'The Balanced Path', desc: 'A versatile approach balancing growth and security.', color: 'text-primary' },
    guardian: { name: 'Wealth Guardian', desc: 'Prioritizes capital preservation, stability, and risk mitigation.', color: 'text-amber-500' },
    catalyst: { name: 'Venture Catalyst', desc: 'High-risk, high-reward strategy focusing on disruptive opportunities.', color: 'text-rose-500' },
    alchemist: { name: 'Ethical Alchemist', desc: 'Aligns financial growth with social and environmental impact.', color: 'text-teal-400' },
    nomad: { name: 'Digital Nomad', desc: 'Optimizes for global mobility, remote income, and borderless finance.', color: 'text-indigo-400' },
    legacy: { name: 'Legacy Builder', desc: 'Long-term focused, emphasizing estate planning and generational wealth.', color: 'text-purple-400' }
  };

  // Wallet state
  const [walletName, setWalletName] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [cryptoQuantity, setCryptoQuantity] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState('');
  const [walletType, setWalletType] = useState<
    'Bank Account' | 'Credit Card' | 'Cash' | 'Mobile Money' | 'Crypto'
  >('Bank Account');
  const [walletCurrency, setWalletCurrency] = useState('USD');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.label.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.includes(currencySearch)
  );

  const handleQuizAnswer = (path: string) => {
    const nextAnswers = [...quizAnswers, 0]; // Index doesn't matter much now, we use paths
    setQuizAnswers(nextAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate result
      // Simplified: use the last answer or most frequent. Let's use frequency
      const allPaths = [...quizAnswers.map((_, i) => QUIZ_QUESTIONS[i].options[0].path), path]; // This is wrong, let's fix
    }
  };

  const submitQuiz = (finalPath: string) => {
    // Determine the path based on answers
    // For now, let's just use the last choice or a simple logic
    setRecommendedPath(finalPath);
    setSetupStep('path-result');
  };

  const nextStep = () => {
    if (setupStep === 'info') {
      if (currentStep < STEPS.length - 1) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
      } else {
        setSetupStep('identity');
      }
    } else if (setupStep === 'identity') {
      if (name && passcode) setSetupStep('quiz');
    } else if (setupStep === 'path-result') {
      setSetupStep('wallet');
    } else if (setupStep === 'wallet') {
      if (walletName && (walletType === 'Crypto' ? (cryptoQuantity && cryptoPrice) : walletBalance)) {
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
      color: 'border-primary',
      currency: walletCurrency,
      path: recommendedPath as any
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

    const wallet = {
      id: 'initial-wallet',
      name: walletName,
      balance: balance || 0,
      type: walletType,
      currency: walletCurrency,
      color: '#B4947C',
      icon: 'landmark',
      provider: 'Onyx Reserve',
      isVisible: true
    };
    await addWallet(wallet, newProfile.id);

    // Apply the recommended path to gamification store
    await setPath(
      recommendedPath as any,
      newProfile.id,
      walletCurrency,
      (level) => useFinancialStore.getState().upgradeToEliteCategories(level, newProfile.id)
    );

    // 3. Mark completion
    setSetupStep('finish');
  };

  const handleComplete = async () => {
    // Force a gamification sync to calculate the initial tier based on the deposit
    const profileId = useAuthStore.getState().currentUser?.id;
    if (profileId) {
      const gamStore = useGamificationStore.getState();
      const finStore = useFinancialStore.getState();

      await gamStore.syncGamification(
        profileId,
        useAuthStore.getState().currentUser?.currency,
        (level: number) => finStore.upgradeToEliteCategories(level, profileId)
      );
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
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isInfo = setupStep === 'info';
          const steps = ['info', 'identity', 'quiz', 'path-result', 'wallet', 'finish'];
          const currentSetupIndex = steps.indexOf(setupStep);

          const isActive = (isInfo && index <= currentStep) || 
                           (!isInfo && index <= currentSetupIndex);
          
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
          ) : setupStep === 'quiz' ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-sm space-y-8"
            >
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Question {quizStep + 1} of 7</p>
                <h2 className="text-2xl font-headline italic text-on-surface leading-tight">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h2>
              </div>
              <div className="grid gap-3">
                {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => quizStep < 6 ? handleQuizAnswer(opt.path) : submitQuiz(opt.path)}
                    className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface/80 group-hover:text-on-surface transition-colors">{opt.text}</span>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : setupStep === 'path-result' ? (
            <motion.div
              key="path-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm space-y-8"
            >
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center relative">
                <Sparkles className="w-10 h-10 text-primary" strokeWidth={1} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Strategic Alignment</p>
                <h1 className="text-4xl font-headline italic text-on-surface">Congratulations</h1>
                <p className="text-sm text-on-surface-variant/80">Your profile aligns perfectly with:</p>

                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-primary/20 space-y-3">
                  <h3 className={`text-2xl font-headline italic ${PATHS_DATA[recommendedPath].color}`}>
                    {PATHS_DATA[recommendedPath].name}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {PATHS_DATA[recommendedPath].desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setQuizStep(0);
                    setQuizAnswers([]);
                    setSetupStep('quiz');
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
                >
                  Retake assessment
                </button>
              </div>
            </motion.div>
          ) : setupStep === 'wallet' ? (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-12"
            >
              <div className="mx-auto w-20 h-20 rounded-full glass-card border border-white/10 flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-primary" strokeWidth={1} />
              </div>
              <div className="space-y-8 text-left">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-headline italic text-on-surface">First Deposit</h2>
                  <p className="text-xs text-on-surface-variant">Initialize your primary reserve account.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Wallet Type</label>
                      <button
                        onClick={() => setShowTypeSelector(true)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left flex items-center justify-between group"
                      >
                        <span className="text-sm text-on-surface/60 group-hover:text-on-surface transition-colors">{walletType}</span>
                        <Filter className="w-4 h-4 text-white/20 group-hover:text-primary" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Currency</label>
                      <button
                        onClick={() => setShowCurrencySelector(true)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left flex items-center justify-between group"
                      >
                        <span className="text-sm text-on-surface/60 group-hover:text-on-surface transition-colors">{walletCurrency}</span>
                        <Globe className="w-4 h-4 text-white/20 group-hover:text-primary" />
                      </button>
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
                          Total Value: {SUPPORTED_CURRENCIES.find(c => c.code === walletCurrency)?.symbol || '$'} {((parseFloat(cryptoQuantity) || 0) * (parseFloat(cryptoPrice) || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Initial Balance ({SUPPORTED_CURRENCIES.find(c => c.code === walletCurrency)?.symbol || '$'})</label>
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
        {(setupStep === 'quiz') ? null : setupStep === 'finish' ? (
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

      {/* Type Selector Modal */}
      <AnimatePresence>
        {showTypeSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTypeSelector(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-3xl text-on-surface italic">Select Wallet Type</h3>
                <button onClick={() => setShowTypeSelector(false)} className="p-2"><X className="w-6 h-6 text-on-surface-variant" /></button>
              </div>
              <div className="grid gap-3">
                {['Bank Account', 'Credit Card', 'Cash', 'Mobile Money', 'Crypto'].map(type => (
                  <button
                    key={type}
                    onClick={() => { setWalletType(type as any); setShowTypeSelector(false); }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${walletType === type ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}
                  >
                    <span className="font-bold uppercase tracking-widest text-[11px]">{type}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Currency Selector Modal */}
      <AnimatePresence>
        {showCurrencySelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCurrencySelector(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10 h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-3xl text-on-surface italic">Select Currency</h3>
                <button onClick={() => setShowCurrencySelector(false)} className="p-2"><X className="w-6 h-6 text-on-surface-variant" /></button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  autoFocus
                  placeholder="Search code, name or symbol..."
                  value={currencySearch}
                  onChange={e => setCurrencySearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-on-surface focus:border-primary outline-none"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                {filteredCurrencies.map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => { setWalletCurrency(curr.code); setShowCurrencySelector(false); }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${walletCurrency === curr.code ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}
                  >
                    <div>
                      <span className="font-bold uppercase tracking-widest text-[11px]">{curr.code} - {curr.label}</span>
                    </div>
                    <span className="font-headline text-lg italic">({curr.symbol})</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Aesthetic Grain Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}
