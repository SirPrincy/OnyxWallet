import { createFileRoute } from '@tanstack/react-router';
import Settings from '../components/Settings';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      openSection: (search.openSection as string) || undefined,
    }
  },
});

function SettingsComponent() {
  const { currentUser, logout } = useAuthStore();
  const { openSection } = Route.useSearch();
  const [initialOpenSection, setInitialOpenSection] = useState<string | undefined>(openSection);

  useEffect(() => {
    if (openSection) {
      setInitialOpenSection(openSection);
    }
  }, [openSection]);

  return <Settings profile={currentUser} onLogout={logout} initialOpenSection={initialOpenSection} />;
}
