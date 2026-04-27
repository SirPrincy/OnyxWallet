import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const STEPS: OnboardingStep[] = [
  {
    title: "Welcome to",
    subtitle: "ONYX WALLET",
    description: "Experience the ultimate wealth management interface. Designed for precision, built for your progress.",
    icon: <Sparkles className="w-12 h-12 text-primary" strokeWidth={1} />,
    color: "from-primary/20 to-transparent"
  },
  {
    title: "Commitment to",
    subtitle: "PRIVACY",
    description: "Onyx Wallet is 100% offline. No servers, no tracking, total control over your financial legacy.",
    icon: <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1} />,
    color: "from-primary/20 to-transparent"
  }
];

export const QUIZ_QUESTIONS = [
  // --- DIMENSION 1: BEHAVIOR (Comportement) ---
  {
    dimension: "Behavior",
    question: "How do you handle unexpected financial opportunities?",
    options: [
      { text: "I analyze the math and optimize for the best ROI", path: "frugal" },
      { text: "I act quickly to capitalize on high-growth trends", path: "catalyst" },
      { text: "I check if it fits within my balanced reserve plan", path: "guardian" },
      { text: "I consult my long-term strategy before moving", path: "legacy" }
    ]
  },
  {
    dimension: "Behavior",
    question: "When it comes to monthly expenses, what is your habit?",
    options: [
      { text: "I track every single cent with absolute precision", path: "frugal" },
      { text: "I spend to maintain a global, mobile lifestyle", path: "nomad" },
      { text: "I prioritize ethical and high-impact consumption", path: "alchemist" },
      { text: "I invest the majority and live on the rest", path: "investor" }
    ]
  },
  {
    dimension: "Behavior",
    question: "How do you prepare for financial 'Black Swan' events?",
    options: [
      { text: "Massive cash reserves and physical assets", path: "guardian" },
      { text: "Highly liquid global assets and crypto", path: "nomad" },
      { text: "Diversified income streams across sectors", path: "investor" },
      { text: "Strict debt elimination and cost reduction", path: "frugal" }
    ]
  },

  // --- DIMENSION 2: VISION ---
  {
    dimension: "Vision",
    question: "What is the ultimate purpose of your capital?",
    options: [
      { text: "To achieve total borderless freedom of movement", path: "nomad" },
      { text: "To create a lasting impact on society/environment", path: "alchemist" },
      { text: "To build a dynasty and multi-generational wealth", path: "legacy" },
      { text: "To win the 'game' of strategic accumulation", path: "investor" }
    ]
  },
  {
    dimension: "Vision",
    question: "Which market environment do you thrive in?",
    options: [
      { text: "High volatility where disruption is constant", path: "catalyst" },
      { text: "Stable, predictable growth with low risk", path: "guardian" },
      { text: "Efficient markets where math dictates success", path: "frugal" },
      { text: "Emerging markets and new asset classes", path: "investor" }
    ]
  },
  {
    dimension: "Vision",
    question: "How do you want to be remembered financially?",
    options: [
      { text: "As a master of strategic market growth", path: "investor" },
      { text: "As a visionary who funded the future", path: "alchemist" },
      { text: "As the bedrock of a secure family legacy", path: "legacy" },
      { text: "As a pioneer of a new, decentralized economy", path: "catalyst" }
    ]
  },

  // --- DIMENSION 3: TIE-BREAKER (Brise-égalité) ---
  {
    dimension: "Tie-Breaker",
    question: "Final choice: If you had to pick only one focus...",
    options: [
      { text: "Pure Precision: Math, logic, and optimization", path: "frugal" },
      { text: "Pure Growth: Risk, reward, and disruption", path: "catalyst" },
      { text: "Pure Security: Stability, safety, and preservation", path: "guardian" },
      { text: "Pure Freedom: Mobility, global access, and flow", path: "nomad" }
    ]
  }
];

export const PATHS_DATA: Record<string, any> = {
  investor: { name: 'The Strategic Investor', desc: 'Focus on market growth, crypto assets, and passive income generation.', color: 'text-emerald-400', bonus: '+10% XP on Crypto & Investment missions' },
  frugal: { name: 'The Frugal Architect', desc: 'Master of discipline, budget optimization, and debt elimination.', color: 'text-blue-400', bonus: '+20% XP for staying under budget' },
  neutral: { name: 'The Balanced Path', desc: 'A versatile approach balancing growth and security.', color: 'text-primary', bonus: 'Balanced XP growth across all categories' },
  guardian: { name: 'Wealth Guardian', desc: 'Prioritizes capital preservation, stability, and risk mitigation.', color: 'text-amber-500', bonus: '+15% XP for Emergency Fund progress' },
  catalyst: { name: 'Venture Catalyst', desc: 'High-risk, high-reward strategy focusing on disruptive opportunities.', color: 'text-rose-500', bonus: 'Double XP on high-growth asset discovery' },
  alchemist: { name: 'Ethical Alchemist', desc: 'Aligns financial growth with social and environmental impact.', color: 'text-teal-400', bonus: '+15% XP on Philanthropy & ESG goals' },
  nomad: { name: 'Digital Nomad', desc: 'Optimizes for global mobility, remote income, and borderless finance.', color: 'text-indigo-400', bonus: '+10% XP on Currency & Mobility missions' },
  legacy: { name: 'Legacy Builder', desc: 'Long-term focused, emphasizing estate planning and generational wealth.', color: 'text-purple-400', bonus: '+20% XP on Property & Multi-gen goals' }
};
