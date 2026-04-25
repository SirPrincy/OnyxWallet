import { createFileRoute } from '@tanstack/react-router';
import WalletManagement from '../../components/WalletManagement';

export const Route = createFileRoute('/accounts/')({
  component: WalletManagement,
});
