import { createFileRoute } from '@tanstack/react-router';
import DebtScreen from '../components/DebtScreen';

export const Route = createFileRoute('/debt')({
  component: DebtScreen,
});
