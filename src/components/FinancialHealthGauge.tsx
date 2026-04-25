import React from 'react';
import { motion } from 'motion/react';

interface FinancialHealthGaugeProps {
  score: number; // 0 to 100
  impact?: 'none' | 'positive' | 'negative';
}

export default function FinancialHealthGauge({ score, impact = 'none' }: FinancialHealthGaugeProps) {
  const getColor = (val: number) => {
    if (val < 40) return '#ff4d4d'; // error
    if (val < 70) return '#ffa500'; // warning (orange)
    return '#00e676'; // primary (greenish)
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-40 h-40">
      <svg className="w-full h-full -rotate-90">
        {/* Background Track */}
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="text-surface-container-highest/20"
        />
        {/* Progress Bar */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="45"
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset,
            scale: impact === 'none' ? 1 : [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            scale: { duration: 0.3, repeat: impact !== 'none' ? 1 : 0 }
          }}
          strokeLinecap="round"
        />
      </svg>

      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-headline font-bold text-on-surface"
        >
          {score}
        </motion.span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Health Score</span>
      </div>

      {/* Impact Animation (Vibration) */}
      {impact !== 'none' && (
        <motion.div
          animate={{ x: [-2, 2, -2, 2, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ boxShadow: `0 0 20px ${impact === 'positive' ? '#00e67644' : '#ff4d4d44'}` }}
        />
      )}
    </div>
  );
}
