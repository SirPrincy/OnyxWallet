import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import { TransactionProvider } from './context/TransactionContext';
import { useTransactions } from './context/useTransactions';

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
  } = useTransactions();

  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

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
    return <Onboarding />;
  }

  const handleLogin = async (_passcode: string | null, profile: any) => {
    // We delay the state update slightly to prevent "Form submission canceled"
    setTimeout(async () => {
      await login(profile);
    }, 10);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (screen: Screen, source: 'bottom-nav' | 'drawer' | 'internal') => {
    setActiveScreen(screen);
    if (['history', 'budget', 'growth', 'settings', 'investing', 'wallet', 'debt'].includes(screen) && source === 'drawer') {
      setIsBottomNavVisible(false);
    } else if (screen === 'profile') {
      setIsBottomNavVisible(false);
    } else {
      setIsBottomNavVisible(true);
    }
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
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <AnimatePresence mode="wait">
        {shouldShowLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Login onLogin={handleLogin} onAddProfile={resetOnboarding} isPasscodeEnabled={isPasscodeEnabled} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background text-on-surface"
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
            
            <main className={`pt-24 px-6 max-w-2xl mx-auto min-h-screen ${isBottomNavVisible ? 'pb-32' : 'pb-12'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {renderScreen()}
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
              {showNewTransaction && (
                <NewTransaction 
                  onClose={() => setShowNewTransaction(false)} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Suspense>
  );
}

export default function App() {
  return (
    <TransactionProvider>
      <AppContent />
    </TransactionProvider>
  );
}
