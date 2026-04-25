import { createFileRoute } from '@tanstack/react-router';
import Budget from '../components/Budget';

export const Route = createFileRoute('/budget')({
  component: Budget,
});
