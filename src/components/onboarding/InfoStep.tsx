import React from 'react';
import { motion } from 'motion/react';
import { OnboardingStep } from './constants';

interface InfoStepProps {
  currentStep: number;
  steps: OnboardingStep[];
  direction: number;
  variants: any;
}

export const InfoStep: React.FC<InfoStepProps> = ({ currentStep, steps, direction, variants }) => {
  const step = steps[currentStep];
  return (
    <motion.div
      key={`info-${currentStep}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full max-w-sm space-y-12"
    >
      <div className="mx-auto w-24 h-24 rounded-full glass-card border border-white/10 flex items-center justify-center relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
        />
        {step.icon}
      </div>

      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">{step.title}</p>
        <h1 className="text-5xl font-headline italic text-on-surface tracking-tight">{step.subtitle}</h1>
        <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[280px] mx-auto">{step.description}</p>

        {currentStep === 1 && (
          <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/20 text-left space-y-3">
            <div className="flex gap-3 text-[11px] text-on-surface-variant leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>No servers, no tracking. Your data stays on your device.</span>
            </div>
            <div className="flex gap-3 text-[11px] text-on-surface-variant leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>If access key is lost, data recovery is <span className="text-on-surface font-bold">impossible</span>.</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
