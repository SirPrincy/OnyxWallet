import { createFileRoute } from '@tanstack/react-router';
import Settings from '../components/Settings';
import { useAuthStore } from '../store/useAuthStore';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

function SettingsComponent() {
  const { currentUser, logout } = useAuthStore();
  return <Settings profile={currentUser} onLogout={logout} />;
}
