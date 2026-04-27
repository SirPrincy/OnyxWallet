import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Profile from '../components/Profile';
import { useAuthStore } from '../store/useAuthStore';

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
});

function ProfileComponent() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Profile
      profile={currentUser}
      onManageIncome={() => navigate({ to: '/settings', search: { openSection: 'income' } as any })}
    />
  );
}
