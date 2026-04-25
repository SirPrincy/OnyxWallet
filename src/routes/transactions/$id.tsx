import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/transactions/$id')({
  component: TransactionDetailComponent,
});

function TransactionDetailComponent() {
  const { id } = Route.useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      <p>Viewing details for transaction ID: {id}</p>
      <div className="mt-8 p-4 bg-surface-container-highest rounded-xl border border-white/5">
         <p className="text-on-surface/60 italic">Detailed view implementation coming soon...</p>
      </div>
    </div>
  );
}
