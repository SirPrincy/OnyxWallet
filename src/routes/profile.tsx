import { createFileRoute } from '@tanstack/react-router';
import Profile from '../components/Profile';
import { useAuthStore } from '../store/useAuthStore';

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
});

function ProfileComponent() {
  const { currentUser } = useAuthStore();
  return <Profile profile={currentUser} />;
}
