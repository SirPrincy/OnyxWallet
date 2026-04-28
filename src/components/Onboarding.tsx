import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Sparkles,
  Lock
} from 'lucide-react';
import { BiometricAuth } from 'capacitor-biometric-authentication';
import { useAuthStore } from '../store/useAuthStore';
import { useWalletStore } from '../store/useWalletStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { useFinancialStore } from '../store/useFinancialStore';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

// Modular components
import { STEPS, QUIZ_QUESTIONS, PATHS_DATA } from './onboarding/constants';
import { EntryStep } from './onboarding/EntryStep';
import { InfoStep } from './onboarding/InfoStep';
import { IdentityStep } from './onboarding/IdentityStep';
import { QuizStep } from './onboarding/QuizStep';
import { PathResultStep } from './onboarding/PathResultStep';
import { WalletStep } from './onboarding/WalletStep';
import { FinishStep } from './onboarding/FinishStep';
import { TutorialStep } from './onboarding/TutorialStep';
import { TypeSelector } from './onboarding/TypeSelector';
import { CurrencySelector } from './onboarding/CurrencySelector';

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
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  React.useEffect(() => {
    BiometricAuth.isAvailable().then(available => {
      setIsBiometricAvailable(available);
    }).catch(() => setIsBiometricAvailable(false));
  }, []);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [recommendedPath, setRecommendedPath] = useState<string>('neutral');
  const [activeQuizColor, setActiveQuizColor] = useState('from-primary/20');

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

  const handleQuizAnswer = (path: string) => {
    const nextAnswers = [...quizAnswers, path];
    setQuizAnswers(nextAnswers);

    // Dynamic color shift based on answer
    const pathColors: Record<string, string> = {
      investor: 'from-emerald-500/20',
      frugal: 'from-blue-500/20',
      guardian: 'from-amber-500/20',
      catalyst: 'from-rose-500/20',
      alchemist: 'from-teal-500/20',
      nomad: 'from-indigo-500/20',
      legacy: 'from-purple-500/20'
    };
    if (pathColors[path]) {
      setActiveQuizColor(pathColors[path]);
    }

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
      if (name && passcode && passcode === confirmPasscode) {
        setIsLocking(true);
        setTimeout(() => {
          setIsLocking(false);
          setSetupStep('quiz');
        }, 2000);
      }
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
      isBiometricEnabled,
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
          {setupStep === 'quiz' ? (
            <motion.div
              key="quiz-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 bg-gradient-to-b ${activeQuizColor} to-transparent`}
            />
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 bg-gradient-to-b ${STEPS[currentStep]?.color || 'from-primary/20 to-transparent'}`}
            />
          )}
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
            <EntryStep
              onSelectNew={() => setSetupStep('info')}
              onRestore={() => alert('Restore feature coming soon: Import your .json vault file.')}
            />
          ) : setupStep === 'info' ? (
            <InfoStep
              currentStep={currentStep}
              steps={STEPS}
              direction={direction}
              variants={variants}
            />
          ) : setupStep === 'identity' ? (
            isLocking ? (
              <motion.div
                key="locking-vault"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Lock className="w-16 h-16 text-primary" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline italic text-on-surface">Securing Vault</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Encrypting Local Database</p>
                </div>
              </motion.div>
            ) : (
              <IdentityStep
                name={name} setName={setName}
                passcode={passcode} setPasscode={setPasscode}
                confirmPasscode={confirmPasscode} setConfirmPasscode={setConfirmPasscode}
                avatarSeed={avatarSeed} setAvatarSeed={setAvatarSeed}
                profileColor={profileColor} setProfileColor={setProfileColor}
                isBiometricAvailable={isBiometricAvailable}
                isBiometricEnabled={isBiometricEnabled}
                setIsBiometricEnabled={setIsBiometricEnabled}
              />
            )
          ) : setupStep === 'quiz' ? (
            <QuizStep
              quizStep={quizStep}
              handleQuizAnswer={handleQuizAnswer}
              submitQuiz={submitQuiz}
            />
          ) : setupStep === 'path-result' ? (
            <PathResultStep
              recommendedPath={recommendedPath}
              onRetake={() => {
                setQuizStep(0);
                setQuizAnswers([]);
                setSetupStep('quiz');
              }}
            />
          ) : setupStep === 'wallet' ? (
            <WalletStep
              walletType={walletType} setShowTypeSelector={setShowTypeSelector}
              walletCurrency={walletCurrency} setShowCurrencySelector={setShowCurrencySelector}
              walletName={walletName} setWalletName={setWalletName}
              cryptoQuantity={cryptoQuantity} setCryptoQuantity={setCryptoQuantity}
              cryptoPrice={cryptoPrice} setCryptoPrice={setCryptoPrice}
              walletBalance={walletBalance} setWalletBalance={setWalletBalance}
            />
          ) : setupStep === 'finish' ? (
            <FinishStep />
          ) : setupStep === 'tutorial' ? (
            <TutorialStep recommendedPath={recommendedPath} />
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
          <TypeSelector
            walletType={walletType}
            setWalletType={setWalletType}
            setShowTypeSelector={setShowTypeSelector}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCurrencySelector && (
          <CurrencySelector
            walletCurrency={walletCurrency}
            setWalletCurrency={setWalletCurrency}
            setShowCurrencySelector={setShowCurrencySelector}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}
