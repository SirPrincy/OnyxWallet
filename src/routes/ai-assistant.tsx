import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/ai-assistant')({
  component: AIAssistantComponent,
});

function AIAssistantComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 italic font-headline">Gemini AI Assistant</h1>
      <div className="aspect-video bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center mb-6">
         <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-primary animate-ping" />
         </div>
      </div>
      <p className="text-on-surface/80 leading-relaxed">
        I am your financial co-pilot, powered by Gemini. Ask me about your spending habits,
        investment opportunities, or how to reach your savings goals faster.
      </p>
      <div className="mt-8 space-y-3">
        <div className="p-4 bg-surface-container rounded-xl border border-white/5">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Suggested</p>
          <p className="text-sm">"How much can I spend safely this week?"</p>
        </div>
        <div className="p-4 bg-surface-container rounded-xl border border-white/5">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Analysis</p>
          <p className="text-sm">"Analyze my last 30 days of transactions."</p>
        </div>
      </div>
    </div>
  );
}
