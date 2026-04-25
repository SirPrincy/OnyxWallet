import { createRootRoute, Outlet } from '@tanstack/react-router';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import NavigationDrawer from '../components/NavigationDrawer';
import { useAuthStore } from '../store/useAuthStore';
import { initApp } from '../store/appInit';
import { Profile as ProfileType } from '../types';
import Login from '../components/Login';
import Onboarding from '../components/Onboarding';
import NewTransaction from '../components/NewTransaction';
import { useRouter, useLocation } from '@tanstack/react-router';

const PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcc7sVLbIEsC6jX2qV0QnosQxuaMBipKUciaVSyEjoFWvKacXxdAhtcJksFdTrkEcM9ZyoO1TZQ5utfhy2GSmu_ZBAPsaEvyHYbGHqKU9qkeW4LJi8FsjYTCTP0IpUYYxA-PY3JZOf1jKL_5_dCubD5hDqlDMFSonirymzzqEIXp45AxNSCoA7888jm5szoufJTJb0sJFllM4djAOta2Fh96j8ZxSOtosAmIhDc_HceulCBd29kiOZIqXl86aYARqt3gtY8JhKMoo";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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

  const router = useRouter();
  const location = useLocation();
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showExitToast, setShowExitToast] = useState(false);

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

      if (location.pathname !== '/') {
        router.navigate({ to: '/' });
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
  }, [showNewTransaction, isDrawerOpen, location.pathname, router]);

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

  const shouldShowLogin = !currentUser || (isPasscodeEnabled && !isAuthenticated);

  const handleLogin = async (_passcode: string | null, profile: ProfileType) => {
    setTimeout(async () => {
      await login(profile);
    }, 10);
  };

  const handleLogout = async () => {
    await logout();
  };

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/transactions')) return 'History';
    if (path === '/budget') return 'Budget';
    if (path === '/growth') return 'Growth & Reserves';
    if (path === '/settings') return 'Settings';
    if (path === '/investing') return 'Investing';
    if (path === '/accounts') return 'Wallet';
    if (path === '/profile') return 'My Profile';
    if (path === '/debt') return 'Liabilities';
    if (path === '/ai-assistant') return 'AI Assistant';
    return 'Home';
  };

  const mainPaths = ['/', '/transactions', '/budget', '/growth'];
  const isBottomNavVisible = mainPaths.includes(location.pathname);

  const getActiveScreen = (): any => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/transactions') return 'history';
    if (path === '/budget') return 'budget';
    if (path === '/growth') return 'growth';
    return '';
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
              onNavigate={(screen) => {
                const screenToPath: Record<string, string> = {
                  home: '/',
                  profile: '/profile',
                  history: '/transactions',
                  wallet: '/accounts',
                  investing: '/investing',
                  budget: '/budget',
                  growth: '/growth',
                  debt: '/debt',
                  settings: '/settings'
                };
                router.navigate({ to: screenToPath[screen] || '/' });
              }}
            />
            
            <main className={`pt-20 px-6 max-w-2xl mx-auto min-h-screen ${isBottomNavVisible ? 'pb-32' : 'pb-12'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
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
                    <Outlet />
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
                    active={getActiveScreen()}
                    onChange={(s) => {
                      const screenToPath: Record<string, string> = {
                        home: '/',
                        history: '/transactions',
                        budget: '/budget',
                        growth: '/growth'
                      };
                      router.navigate({ to: screenToPath[s] || '/' });
                    }}
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
