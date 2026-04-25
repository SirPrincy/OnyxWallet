import { createFileRoute } from '@tanstack/react-router';
import Growth from '../components/Growth';

export const Route = createFileRoute('/growth')({
  component: Growth,
});
