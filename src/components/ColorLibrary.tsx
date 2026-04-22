import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { APP_COLORS } from '../constants/colors';

interface ColorLibraryProps {
  onBack: () => void;
}

interface ColorBoxProps {
  label: string;
  hex: string;
  category: string;
  copiedColor: string | null;
  onCopy: (hex: string) => void;
  key?: React.Key;
}

const ColorBox = ({ label, hex, category, copiedColor, onCopy }: ColorBoxProps) => (
  <div className="group relative">
    <div 
      onClick={() => onCopy(hex)}
      className="aspect-square rounded-2xl cursor-pointer overflow-hidden border border-white/5 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 mb-3"
      style={{ backgroundColor: hex }}
    >
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {copiedColor === hex ? (
          <CheckCircle2 className="text-white w-6 h-6 animate-in zoom-in duration-300" />
        ) : (
          <Copy className="text-white w-6 h-6 opacity-60" />
        )}
      </div>
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">{category}</p>
      <h4 className="text-xs font-medium text-on-surface truncate">{label}</h4>
      <p className="text-[10px] text-primary/60 font-mono mt-0.5">{hex.toUpperCase()}</p>
    </div>
  </div>
);

export default function ColorLibrary({ onBack }: ColorLibraryProps) {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Settings</span>
          </button>
          <div className="text-right">
            <h1 className="font-headline text-2xl text-on-surface">Visual Identity</h1>
            <p className="text-[10px] text-primary tracking-widest uppercase font-bold">Onyx Color Library</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-16">
        {/* Brand Section */}
        <section>
          <h2 className="font-headline text-3xl text-primary mb-8 italic">Brand Essentials</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <ColorBox category="Legacy" label="Vault Gold" hex={APP_COLORS.brand.gold} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Legacy" label="Signature Dark" hex={APP_COLORS.brand.goldDark} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Legacy" label="Highlite" hex={APP_COLORS.brand.goldLight} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Base" label="Solid Void" hex={APP_COLORS.brand.black} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Base" label="Charcoal" hex={APP_COLORS.brand.charcoal} copiedColor={copiedColor} onCopy={copyToClipboard} />
          </div>
        </section>

        {/* Functional Section */}
        <section>
          <h2 className="font-headline text-3xl text-primary mb-8 italic">Functional System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorBox category="Status" label="Asset Flow / In" hex={APP_COLORS.status.income} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Status" label="Asset Flow / Out" hex={APP_COLORS.status.expense} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Status" label="Internal Link" hex={APP_COLORS.status.transfer} copiedColor={copiedColor} onCopy={copyToClipboard} />
            <ColorBox category="Status" label="Amber Alert" hex={APP_COLORS.status.warning} copiedColor={copiedColor} onCopy={copyToClipboard} />
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <header className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl text-primary italic">Entity Colors</h2>
            <p className="text-[10px] text-on-surface-variant tracking-widest uppercase max-w-[200px] text-right">
              Used for categorizing transactions and assets
            </p>
          </header>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {APP_COLORS.categories.map((hex, i) => (
              <ColorBox key={i} category="Entity" label={`Level ${i + 1}`} hex={hex} copiedColor={copiedColor} onCopy={copyToClipboard} />
            ))}
          </div>
        </section>

        {/* Copy Instruction */}
        <div className="pt-12 pb-20 text-center border-t border-white/5">
          <p className="text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Click a color to copy Hex code to clipboard
          </p>
        </div>
      </main>
    </motion.div>
  );
}
