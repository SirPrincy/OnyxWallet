import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
const Home = React.lazy(() => import('./components/Home'));
const History = React.lazy(() => import('./components/History'));
const Budget = React.lazy(() => import('./components/Budget'));
const Growth = React.lazy(() => import('./components/Growth'));
const Settings = React.lazy(() => import('./components/Settings'));
const WalletScreen = React.lazy(() => import('./components/WalletScreen'));
const Profile = React.lazy(() => import('./components/Profile'));
const DebtScreen = React.lazy(() => import('./components/DebtScreen'));
const NewTransaction = React.lazy(() => import('./components/NewTransaction'));
const WalletManagement = React.lazy(() => import('./components/WalletManagement'));
const Login = React.lazy(() => import('./components/Login'));
const Onboarding = React.lazy(() => import('./components/Onboarding'));
import NavigationDrawer from './components/NavigationDrawer';
import { useAuthStore } from './store/useAuthStore';
import { initApp } from './store/appInit';
import { Profile as ProfileType } from './types';

type Screen = 'home' | 'history' | 'budget' | 'growth' | 'settings' | 'investing' | 'wallet' | 'profile' | 'debt';

const PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcc7sVLbIEsC6jX2qV0QnosQxuaMBipKUciaVSyEjoFWvKacXxdAhtcJksFdTrkEcM9ZyoO1TZQ5utfhy2GSmu_ZBAPsaEvyHYbGHqKU9qkeW4LJi8FsjYTCTP0IpUYYxA-PY3JZOf1jKL_5_dCubD5hDqlDMFSonirymzzqEIXp45AxNSCoA7888jm5szoufJTJb0sJFllM4djAOta2Fh96j8ZxSOtosAmIhDc_HceulCBd29kiOZIqXl86aYARqt3gtY8JhKMoo";

function AppContent() {
  const { 
    isPasscodeEnabled, 
    hasCompletedOnboarding, 
    isLoading, 
    isAuthenticated, 
    currentUser,
    login,
    logout,
    resetOnboarding
  } = useAuthStore();

  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [showExitToast, setShowExitToast] = useState(false);

  const activeScreenRef = useRef<Screen>('home');
  const lastBackPress = useRef<number>(0);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    const backButtonHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (showNewTransaction) {
        setShowNewTransaction(false);
        return;
      }
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }

      if (activeScreenRef.current !== 'home') {
        handleNavigation('home', 'internal');
      } else {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          CapApp.exitApp();
        } else {
          lastBackPress.current = now;
          setShowExitToast(true);
          setTimeout(() => setShowExitToast(false), 2000);
        }
      }
    });

    return () => {
      backButtonHandler.then(h => h.remove());
    };
  }, [showNewTransaction, isDrawerOpen]);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRightSwipe && !isDrawerOpen && touchStart < 50) {
      setIsDrawerOpen(true);
    }
    if (isLeftSwipe && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface/60 font-medium animate-pulse">Initializing Secure Vault...</p>
        </div>
      </div>
    );
  }

  // Show login if no user is selected OR if they need to authenticate
  const shouldShowLogin = !currentUser || (isPasscodeEnabled && !isAuthenticated);

  if (!hasCompletedOnboarding) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <Onboarding />
      </React.Suspense>
    );
  }

  const handleLogin = async (_passcode: string | null, profile: ProfileType) => {
    // We delay the state update slightly to prevent "Form submission canceled"
    setTimeout(async () => {
      await login(profile);
    }, 10);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (screen: Screen, _source: 'bottom-nav' | 'drawer' | 'internal') => {
    setActiveScreen(screen);

    // Bottom nav is visible for main dashboard screens
    const mainScreens: Screen[] = ['home', 'history', 'budget', 'growth'];
    setIsBottomNavVisible(mainScreens.includes(screen));
  };

  const getTitle = () => {
    switch (activeScreen) {
      case 'home': return 'Home';
      case 'history': return 'History';
      case 'budget': return 'Budget';
      case 'growth': return 'Growth & Reserves';
      case 'settings': return 'Settings';
      case 'investing': return 'Investing';
      case 'wallet': return 'Wallet';
      case 'profile': return 'My Profile';
      case 'debt': return 'Liabilities';
      default: return 'Home';
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <Home onNavigate={(s) => handleNavigation(s, 'internal')} />;
      case 'history': return <History />;
      case 'budget': return <Budget />;
      case 'growth': return <Growth />;
      case 'settings': return <Settings profile={currentUser} onLogout={handleLogout} />;
      case 'investing': return <WalletScreen />;
      case 'wallet': return <WalletManagement />;
      case 'profile': return <Profile profile={currentUser} />;
      case 'debt': return <DebtScreen />;
      default: return <Home onNavigate={(s) => handleNavigation(s, 'internal')} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {shouldShowLogin ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <React.Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <Login onLogin={handleLogin} onAddProfile={resetOnboarding} isPasscodeEnabled={isPasscodeEnabled} />
          </React.Suspense>
        </motion.div>
      ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background text-on-surface"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <TopBar 
              title={getTitle()} 
              onMenuClick={() => setIsDrawerOpen(true)} 
              profileImage={currentUser?.image || PROFILE_IMAGE}
            />

            <NavigationDrawer 
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)} 
              profile={currentUser} 
              onNavigate={handleNavigation}
            />
            
            <main className={`pt-20 px-6 max-w-2xl mx-auto min-h-screen ${isBottomNavVisible ? 'pb-32' : 'pb-12'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <React.Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  }>
                    {renderScreen()}
                  </React.Suspense>
                </motion.div>
              </AnimatePresence>
            </main>

            <AnimatePresence>
              {isBottomNavVisible && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-0 left-0 w-full z-50"
                >
                  <BottomNav 
                    active={activeScreen} 
                    onChange={(s) => handleNavigation(s, 'bottom-nav')} 
                    onPlusClick={() => setShowNewTransaction(true)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showExitToast && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-surface-container-highest/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl"
                >
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Appuyez à nouveau pour quitter</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showNewTransaction && (
                <React.Suspense fallback={null}>
                  <NewTransaction
                    onClose={() => setShowNewTransaction(false)}
                  />
                </React.Suspense>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
