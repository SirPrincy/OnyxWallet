import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Banknote } from 'lucide-react';

interface VaultVisualProps {
  progress: number; // 0 to 100
  trigger: any;     // Any value that changes when a contribution happens
  color?: string;
  type?: 'coins' | 'cash';
}

export default function VaultVisual({ progress, trigger, color = '#F2CA50', type = 'coins' }: VaultVisualProps) {
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 + 10, // 10% to 90%
      }));
      setParticles(prev => [...prev, ...newParticles]);

      const timer = setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="relative w-full h-48 bg-surface-container-highest/20 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
      {/* Container Background */}
      <div className="absolute inset-x-4 bottom-4 top-4 border-2 border-dashed border-white/10 rounded-2xl" />

      {/* Filling Level */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${progress}%` }}
        className="absolute inset-x-4 bottom-4 rounded-b-2xl rounded-t-lg transition-all duration-1000"
        style={{
          backgroundColor: color,
          opacity: 0.3,
          boxShadow: `0 0 30px ${color}40`
        }}
      />

      {/* Falling Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0 }}
            animate={{ y: 160, x: `${p.x + (Math.random() * 10 - 5)}%`, opacity: 0, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="absolute top-0 z-20"
            style={{ color }}
          >
            {type === 'coins' ? <Coins size={20} /> : <Banknote size={24} />}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      {/* Milestone Markers */}
      <div className="absolute inset-y-4 right-6 flex flex-col justify-between text-[8px] text-white/20 font-mono py-2">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  );
}
