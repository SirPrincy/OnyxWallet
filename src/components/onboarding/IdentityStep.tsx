import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface IdentityStepProps {
  name: string;
  setName: (name: string) => void;
  passcode: string;
  setPasscode: (passcode: string) => void;
  confirmPasscode: string;
  setConfirmPasscode: (passcode: string) => void;
  avatarSeed: string;
  setAvatarSeed: (seed: string) => void;
  profileColor: string;
  setProfileColor: (color: string) => void;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
  name, setName, passcode, setPasscode, confirmPasscode, setConfirmPasscode,
  avatarSeed, setAvatarSeed, profileColor, setProfileColor
}) => {
  return (
    <motion.div
      key="identity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm space-y-10"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-28 h-28">
          <div className={`w-full h-full rounded-full border-4 ${profileColor} p-1 bg-surface-container overflow-hidden relative group`}>
            <img
              src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatarSeed}`}
              className="w-full h-full object-cover rounded-full"
              alt="Profile"
            />
            <button
              onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {[
            { c: 'border-primary', bg: 'bg-primary' },
            { c: 'border-blue-400', bg: 'bg-blue-400' },
            { c: 'border-emerald-400', bg: 'bg-emerald-400' },
            { c: 'border-purple-400', bg: 'bg-purple-400' }
          ].map(color => (
            <button
              key={color.c}
              onClick={() => setProfileColor(color.c)}
              className={`w-8 h-8 rounded-full ${color.bg} border-2 ${profileColor === color.c ? 'border-white' : 'border-transparent'} shadow-lg transition-transform active:scale-95`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 text-left">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-headline italic text-on-surface">Establish Identity</h2>
          <p className="text-xs text-on-surface-variant">Choose your name and a secure access key.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Identity Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Julian Vane"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Secure Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Key"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold ml-1">Confirm Key</label>
              <input
                type="password"
                value={confirmPasscode}
                onChange={e => setConfirmPasscode(e.target.value)}
                placeholder="Confirm"
                className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all ${confirmPasscode && confirmPasscode !== passcode ? 'border-red-500/50' : 'border-white/10'}`}
              />
            </div>
          </div>
          {confirmPasscode && confirmPasscode !== passcode && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">Keys do not match</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
