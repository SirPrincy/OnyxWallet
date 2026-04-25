import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Home from '../components/Home';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  return <Home onNavigate={(s: 'home' | 'history' | 'budget' | 'growth' | 'investing') => {
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
    navigate({ to: screenToPath[s] || '/' });
  }} />;
}
