import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, Lock } from 'lucide-react';

interface EntryStepProps {
  onSelectNew: () => void;
  onRestore: () => void;
}

export const EntryStep: React.FC<EntryStepProps> = ({ onSelectNew, onRestore }) => {
  return (
    <motion.div
      key="entry"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm space-y-12"
    >
      <div className="space-y-4">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1} />
        <h1 className="text-4xl font-headline italic text-on-surface">Choose Entry</h1>
        <p className="text-sm text-on-surface-variant/80 max-w-[280px] mx-auto">
          Initialize a new financial reserve or restore your existing vault.
        </p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={onSelectNew}
          className="w-full p-6 rounded-3xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-primary font-bold uppercase tracking-widest text-[11px] mb-1">Create New Vault</h3>
              <p className="text-xs text-on-surface-variant">Start your journey from scratch.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={onRestore}
          className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group opacity-60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-on-surface font-bold uppercase tracking-widest text-[11px] mb-1">Restore from Export</h3>
              <p className="text-xs text-on-surface-variant">Import an existing local backup.</p>
            </div>
            <Lock className="w-4 h-4 text-white/20" />
          </div>
        </button>
      </div>
    </motion.div>
  );
};
