import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const FinishStep: React.FC = () => {
  return (
    <motion.div
      key="finish"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm space-y-8"
    >
      <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1} />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-headline italic text-on-surface">Vault Ready</h1>
        <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[280px] mx-auto">
          Your identity is secured and your reserve is initialized. Let the growth begin.
        </p>
      </div>
    </motion.div>
  );
};
