import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from './constants';

interface QuizStepProps {
  quizStep: number;
  handleQuizAnswer: (path: string) => void;
  submitQuiz: (path: string) => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ quizStep, handleQuizAnswer, submitQuiz }) => {
  const currentQuestion = QUIZ_QUESTIONS[quizStep];
  return (
    <div className="w-full max-w-sm overflow-hidden py-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={quizStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Question {quizStep + 1} of 7</p>
            <h2 className="text-2xl font-headline italic text-on-surface leading-tight">
              {currentQuestion.question}
            </h2>
          </div>
          <div className="grid gap-3">
            {currentQuestion.options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => quizStep < 6 ? handleQuizAnswer(opt.path) : submitQuiz(opt.path)}
                className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface/80 group-hover:text-on-surface transition-colors">{opt.text}</span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
