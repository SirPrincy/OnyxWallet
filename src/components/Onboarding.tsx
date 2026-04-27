import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Wallet as WalletIcon, 
  Sparkles,
  Lock,
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
    title: "Commitment to",
    subtitle: "PRIVACY",
    description: "Onyx Wallet is 100% offline. No servers, no tracking, total control over your financial legacy.",
    icon: <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1} />,
    color: "from-primary/20 to-transparent"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupStep, setSetupStep] = useState<'entry' | 'info' | 'identity' | 'quiz' | 'path-result' | 'wallet' | 'finish' | 'tutorial'>('entry');
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
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString(36).substring(7));
  const [profileColor, setProfileColor] = useState('border-primary');

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [recommendedPath, setRecommendedPath] = useState<string>('neutral');

  const QUIZ_QUESTIONS = [
    // --- DIMENSION 1: BEHAVIOR (Comportement) ---
    {
      dimension: "Behavior",
      question: "How do you handle unexpected financial opportunities?",
      options: [
        { text: "I analyze the math and optimize for the best ROI", path: "frugal" },
        { text: "I act quickly to capitalize on high-growth trends", path: "catalyst" },
        { text: "I check if it fits within my balanced reserve plan", path: "guardian" },
        { text: "I consult my long-term strategy before moving", path: "legacy" }
      ]
    },
    {
      dimension: "Behavior",
      question: "When it comes to monthly expenses, what is your habit?",
      options: [
        { text: "I track every single cent with absolute precision", path: "frugal" },
        { text: "I spend to maintain a global, mobile lifestyle", path: "nomad" },
        { text: "I prioritize ethical and high-impact consumption", path: "alchemist" },
        { text: "I invest the majority and live on the rest", path: "investor" }
      ]
    },
    {
      dimension: "Behavior",
      question: "How do you prepare for financial 'Black Swan' events?",
      options: [
        { text: "Massive cash reserves and physical assets", path: "guardian" },
        { text: "Highly liquid global assets and crypto", path: "nomad" },
        { text: "Diversified income streams across sectors", path: "investor" },
        { text: "Strict debt elimination and cost reduction", path: "frugal" }
      ]
    },

    // --- DIMENSION 2: VISION ---
    {
      dimension: "Vision",
      question: "What is the ultimate purpose of your capital?",
      options: [
        { text: "To achieve total borderless freedom of movement", path: "nomad" },
        { text: "To create a lasting impact on society/environment", path: "alchemist" },
        { text: "To build a dynasty and multi-generational wealth", path: "legacy" },
        { text: "To win the 'game' of strategic accumulation", path: "investor" }
      ]
    },
    {
      dimension: "Vision",
      question: "Which market environment do you thrive in?",
      options: [
        { text: "High volatility where disruption is constant", path: "catalyst" },
        { text: "Stable, predictable growth with low risk", path: "guardian" },
        { text: "Efficient markets where math dictates success", path: "frugal" },
        { text: "Emerging markets and new asset classes", path: "investor" }
      ]
    },
    {
      dimension: "Vision",
      question: "How do you want to be remembered financially?",
      options: [
        { text: "As a master of strategic market growth", path: "investor" },
        { text: "As a visionary who funded the future", path: "alchemist" },
        { text: "As the bedrock of a secure family legacy", path: "legacy" },
        { text: "As a pioneer of a new, decentralized economy", path: "catalyst" }
      ]
    },

    // --- DIMENSION 3: TIE-BREAKER (Brise-égalité) ---
    {
      dimension: "Tie-Breaker",
      question: "Final choice: If you had to pick only one focus...",
      options: [
        { text: "Pure Precision: Math, logic, and optimization", path: "frugal" },
        { text: "Pure Growth: Risk, reward, and disruption", path: "catalyst" },
        { text: "Pure Security: Stability, safety, and preservation", path: "guardian" },
        { text: "Pure Freedom: Mobility, global access, and flow", path: "nomad" }
      ]
    }
  ];

  const PATHS_DATA: Record<string, any> = {
    investor: { name: 'The Strategic Investor', desc: 'Focus on market growth, crypto assets, and passive income generation.', color: 'text-emerald-400', bonus: '+10% XP on Crypto & Investment missions' },
    frugal: { name: 'The Frugal Architect', desc: 'Master of discipline, budget optimization, and debt elimination.', color: 'text-blue-400', bonus: '+20% XP for staying under budget' },
    neutral: { name: 'The Balanced Path', desc: 'A versatile approach balancing growth and security.', color: 'text-primary', bonus: 'Balanced XP growth across all categories' },
    guardian: { name: 'Wealth Guardian', desc: 'Prioritizes capital preservation, stability, and risk mitigation.', color: 'text-amber-500', bonus: '+15% XP for Emergency Fund progress' },
    catalyst: { name: 'Venture Catalyst', desc: 'High-risk, high-reward strategy focusing on disruptive opportunities.', color: 'text-rose-500', bonus: 'Double XP on high-growth asset discovery' },
    alchemist: { name: 'Ethical Alchemist', desc: 'Aligns financial growth with social and environmental impact.', color: 'text-teal-400', bonus: '+15% XP on Philanthropy & ESG goals' },
    nomad: { name: 'Digital Nomad', desc: 'Optimizes for global mobility, remote income, and borderless finance.', color: 'text-indigo-400', bonus: '+10% XP on Currency & Mobility missions' },
    legacy: { name: 'Legacy Builder', desc: 'Long-term focused, emphasizing estate planning and generational wealth.', color: 'text-purple-400', bonus: '+20% XP on Property & Multi-gen goals' }
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
    const nextAnswers = [...quizAnswers, path];
    setQuizAnswers(nextAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      calculateResult(nextAnswers);
    }
  };

  const calculateResult = (answers: string[]) => {
    const behaviorPaths = answers.slice(0, 3);
    const visionPaths = answers.slice(3, 6);
    const tieBreaker = answers[6];

    const counts: Record<string, number> = {};
    visionPaths.forEach(p => counts[p] = (counts[p] || 0) + 2);
    behaviorPaths.forEach(p => counts[p] = (counts[p] || 0) + 1);
    counts[tieBreaker] = (counts[tieBreaker] || 0) + 3;

    let maxCount = -1;
    let finalPath = 'neutral';

    Object.entries(counts).forEach(([path, count]) => {
      if (count > maxCount) {
        maxCount = count;
        finalPath = path;
      }
    });

    setRecommendedPath(finalPath);
    setSetupStep('path-result');
  };

  const submitQuiz = (finalPath: string) => {
    handleQuizAnswer(finalPath);
  };

  const nextStep = () => {
    if (setupStep === 'entry') {
      setSetupStep('info');
    } else if (setupStep === 'info') {
      if (currentStep < STEPS.length - 1) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
      } else {
        setSetupStep('identity');
      }
    } else if (setupStep === 'identity') {
      if (name && passcode && passcode === confirmPasscode) setSetupStep('quiz');
    } else if (setupStep === 'path-result') {
      setSetupStep('wallet');
    } else if (setupStep === 'wallet') {
      if (walletName && (walletType === 'Crypto' ? (cryptoQuantity && cryptoPrice) : walletBalance)) {
        handleFinalize();
      }
    } else if (setupStep === 'finish') {
      setSetupStep('tutorial');
    }
  };

  const handleFinalize = async () => {
    const newProfile = {
      name,
      passcode,
      role: 'Owner',
      tier: 'Bronze',
      status: 'Active',
      lastActive: 'Now',
      image: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatarSeed}`,
      color: profileColor,
      currency: walletCurrency,
      path: recommendedPath as any
    };
    
    const { INITIAL_CATEGORIES } = await import('../store/useFinancialStore');
    const savedProfile = await addProfile(newProfile, INITIAL_CATEGORIES);
    await login(savedProfile);

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
    await addWallet(wallet, savedProfile.id);

    await setPath(
      recommendedPath as any,
      savedProfile.id,
      walletCurrency,
      (level) => useFinancialStore.getState().upgradeToEliteCategories(level, savedProfile.id)
    );

    setSetupStep('finish');
  };

  const handleComplete = async () => {
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

      <div className="relative z-10 px-8 pt-12 flex gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
          const steps = ['entry', 'info', 'identity', 'quiz', 'path-result', 'wallet', 'finish', 'tutorial'];
          const currentSetupIndex = steps.indexOf(setupStep);
          const isActive = index <= currentSetupIndex;
          return (
            <div key={index} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence custom={direction} mode="wait">
          {setupStep === 'entry' ? (
            <motion.div
              key="entry"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm space-y-12"
            >
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1} />
                <h1 className="text-4xl font-headline italic text-on-surface">Choose Entry</h1>
                <p className="text-sm text-on-surface-variant/80 max-w-[280px] mx-auto">
                  Initialize a new financial reserve or restore your existing vault.
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => setSetupStep('info')}
                  className="w-full p-6 rounded-3xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-primary font-bold uppercase tracking-widest text-[11px] mb-1">Create New Vault</h3>
                      <p className="text-xs text-on-surface-variant">Start your journey from scratch.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => alert('Restore feature coming soon: Import your .json vault file.')}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-on-surface font-bold uppercase tracking-widest text-[11px] mb-1">Restore from Export</h3>
                      <p className="text-xs text-on-surface-variant">Import an existing local backup.</p>
                    </div>
                    <Lock className="w-4 h-4 text-white/20" />
                  </div>
                </button>
              </div>
            </motion.div>
          ) : setupStep === 'info' ? (
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

                {currentStep === 1 && (
                  <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/20 text-left space-y-3">
                    <div className="flex gap-3 text-[11px] text-on-surface-variant leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>No servers, no tracking. Your data stays on your device.</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-on-surface-variant leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>If access key is lost, data recovery is <span className="text-on-surface font-bold">impossible</span>.</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : setupStep === 'identity' ? (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-10"
            >
              <div className="relative mx-auto w-28 h-28">
                <div className={`w-full h-full rounded-full border-4 ${profileColor} p-1 bg-surface-container overflow-hidden relative group`}>
                  <img
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatarSeed}`}
                    className="w-full h-full object-cover rounded-full"
                    alt="Profile"
                  />
                  <button
                    onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                  </button>
                </div>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  {[
                    { c: 'border-primary', bg: 'bg-primary' },
                    { c: 'border-blue-400', bg: 'bg-blue-400' },
                    { c: 'border-emerald-400', bg: 'bg-emerald-400' },
                    { c: 'border-purple-400', bg: 'bg-purple-400' }
                  ].map(color => (
                    <button
                      key={color.c}
                      onClick={() => setProfileColor(color.c)}
                      className={`w-6 h-6 rounded-full ${color.bg} border-2 ${profileColor === color.c ? 'border-white' : 'border-transparent'} shadow-lg`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6 text-left">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Secure Passcode</label>
                      <input
                        type="password"
                        value={passcode}
                        onChange={e => setPasscode(e.target.value)}
                        placeholder="Key"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Confirm Key</label>
                      <input
                        type="password"
                        value={confirmPasscode}
                        onChange={e => setConfirmPasscode(e.target.value)}
                        placeholder="Confirm"
                        className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all ${confirmPasscode && confirmPasscode !== passcode ? 'border-red-500/50' : 'border-white/10'}`}
                      />
                    </div>
                  </div>
                  {confirmPasscode && confirmPasscode !== passcode && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">Keys do not match</p>
                  )}
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

                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-primary/20 space-y-4">
                  <div className="space-y-1">
                    <h3 className={`text-2xl font-headline italic ${PATHS_DATA[recommendedPath].color}`}>
                      {PATHS_DATA[recommendedPath].name}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {PATHS_DATA[recommendedPath].desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{PATHS_DATA[recommendedPath].bonus}</span>
                    </div>
                  </div>
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
                        <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Price ({walletCurrency})</label>
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
          ) : setupStep === 'finish' ? (
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
          ) : setupStep === 'tutorial' ? (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-10"
            >
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Strategic Path</p>
                <h1 className="text-3xl font-headline italic text-on-surface">Your First Acts</h1>
                <p className="text-xs text-on-surface-variant">Recommended actions for your {PATHS_DATA[recommendedPath].name} profile.</p>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Security Buffer", desc: "Establish your first liquidity reserve.", xp: "+50 XP", icon: <ShieldCheck className="w-4 h-4" /> },
                  { title: "Diversification", desc: "Open 3 different strategic wallets.", xp: "+75 XP", icon: <WalletIcon className="w-4 h-4" /> },
                  { title: "Positive Cashflow", desc: "Earn more than you spend this month.", xp: "+100 XP", icon: <TrendingUp className="w-4 h-4" /> },
                  { title: "AI Strategic Audit", desc: "Get your first automated portfolio analysis.", xp: "+25 XP", icon: <Sparkles className="w-4 h-4" /> }
                ].map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 text-left group hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      {act.icon}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface">{act.title}</h4>
                      <p className="text-[9px] text-on-surface-variant leading-relaxed line-clamp-1">{act.desc}</p>
                    </div>
                    <div className="text-[10px] font-bold text-primary italic whitespace-nowrap bg-primary/10 px-3 py-1 rounded-full">
                      {act.xp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-12 flex flex-col items-center gap-6">
        {(setupStep === 'quiz' || setupStep === 'entry') ? null : (setupStep === 'finish' || setupStep === 'tutorial') ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={setupStep === 'finish' ? nextStep : handleComplete}
            className={`w-full max-w-sm py-4 rounded-full flex items-center justify-center gap-2 group transition-all duration-300 ${
              setupStep === 'finish'
                ? 'bg-green-500 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]'
                : 'metallic-gradient shadow-[0_20px_40px_-10px_rgba(242,202,80,0.3)]'
            }`}
          >
            <span className={`font-bold uppercase tracking-[0.2em] text-[11px] ${
              setupStep === 'finish' ? 'text-white' : 'text-on-primary'
            }`}>
              {setupStep === 'finish' ? 'Launch Strategic Path' : 'Enter Vault'}
            </span>
            <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
              setupStep === 'finish' ? 'text-white' : 'text-on-primary'
            }`} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={
              (setupStep === 'identity' && (!name || !passcode || passcode !== confirmPasscode)) ||
              (setupStep === 'wallet' && (
                !walletName ||
                (walletType === 'Crypto' ? (!cryptoQuantity || !cryptoPrice) : !walletBalance)
              ))
            }
            className="w-full max-w-sm metallic-gradient py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(242,202,80,0.3)] group disabled:opacity-50"
          >
            <span className="font-bold uppercase tracking-[0.2em] text-[11px] text-on-primary">
              {setupStep === 'info' && currentStep === 1 ? "I Accept & Continue" :
               setupStep === 'info' && currentStep === STEPS.length - 1 ? "Start Setup" :
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

      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}
