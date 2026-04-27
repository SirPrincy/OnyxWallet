import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface TypeSelectorProps {
  walletType: string;
  setWalletType: (type: any) => void;
  setShowTypeSelector: (show: boolean) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ walletType, setWalletType, setShowTypeSelector }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowTypeSelector(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10 max-h-[70vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-headline text-3xl text-on-surface italic">Select Wallet Type</h3>
          <button onClick={() => setShowTypeSelector(false)} className="p-2"><X className="w-6 h-6 text-on-surface-variant" /></button>
        </div>
        <div className="grid gap-3">
          {['Bank Account', 'Credit Card', 'Cash', 'Mobile Money', 'Crypto'].map(type => (
            <button
              key={type}
              onClick={() => { setWalletType(type as any); setShowTypeSelector(false); }}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${walletType === type ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}
            >
              <span className="font-bold uppercase tracking-widest text-[11px]">{type}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};
