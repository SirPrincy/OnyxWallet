import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldAlert, Download, Loader2 } from 'lucide-react';
import { backupService } from '../../services/backup.service';

export const FinishStep: React.FC = () => {
  const [isSaving, setIsSaving] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSaving(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-headline italic text-on-surface">Synchronizing Core</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Writing encrypted blocks</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-headline italic text-on-surface">Vault Ready</h1>
                <p className="text-sm text-on-surface-variant/80 leading-relaxed max-w-[280px] mx-auto">
                  Your identity is secured and your reserve is initialized. Let the growth begin.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
              <div className="flex items-center gap-3 text-amber-500">
                <ShieldAlert className="w-5 h-5" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Important Security Note</p>
              </div>
              <p className="text-xs text-on-surface-variant/80 text-left leading-relaxed">
                <span className="text-on-surface font-bold">Votre téléphone = Votre banque.</span><br />
                Onyx stocke tout en local. Si vous perdez cet appareil sans sauvegarde, vos données disparaîtront à jamais.
              </p>
              <button
                onClick={() => backupService.downloadBackup()}
                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-2 transition-all group"
              >
                <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface">Créer mon premier point de restauration</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
