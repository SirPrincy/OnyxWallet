import { createFileRoute } from '@tanstack/react-router';
import WalletScreen from '../components/WalletScreen';

export const Route = createFileRoute('/investing')({
  component: WalletScreen,
});
