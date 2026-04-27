import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { PATHS_DATA } from './constants';

interface PathResultStepProps {
  recommendedPath: string;
  onRetake: () => void;
}

export const PathResultStep: React.FC<PathResultStepProps> = ({ recommendedPath, onRetake }) => {
  const path = PATHS_DATA[recommendedPath];
  return (
    <motion.div
      key="path-result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm space-y-8"
    >
      <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center relative">
        <Sparkles className="w-10 h-10 text-primary" strokeWidth={1} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
        />
      </div>
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Strategic Alignment</p>
        <h1 className="text-4xl font-headline italic text-on-surface">Congratulations</h1>
        <p className="text-sm text-on-surface-variant/80">Your profile aligns perfectly with:</p>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-primary/20 space-y-4">
          <div className="space-y-1">
            <h3 className={`text-2xl font-headline italic ${path.color}`}>
              {path.name}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {path.desc}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{path.bonus}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRetake}
          className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
        >
          Retake assessment
        </button>
      </div>
    </motion.div>
  );
};
