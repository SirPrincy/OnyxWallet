import { createFileRoute } from '@tanstack/react-router';
import History from '../../components/History';

export const Route = createFileRoute('/transactions/')({
  component: History,
});
