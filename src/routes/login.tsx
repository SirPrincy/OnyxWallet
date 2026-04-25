import { createFileRoute } from '@tanstack/react-router';
import Login from '../components/Login';
import { useAuthStore } from '../store/useAuthStore';
import { Profile } from '../types';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  const { isPasscodeEnabled, login, resetOnboarding } = useAuthStore();

  const handleLogin = async (_passcode: string | null, profile: Profile) => {
    setTimeout(async () => {
      await login(profile);
    }, 10);
  };

  return (
    <Login
      onLogin={handleLogin}
      onAddProfile={resetOnboarding}
      isPasscodeEnabled={isPasscodeEnabled}
    />
  );
}
