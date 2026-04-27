import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Diamond, Landmark, ScanFace, ShieldCheck, Key, 
  Banknote, Globe, Moon, CreditCard, HelpCircle, Shield, 
  ChevronRight, ArrowUpRight, Lock, Plus, Edit3, Trash2, X,
  ShoppingBag, LayoutGrid, Download, Upload, Database
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWalletStore } from '../store/useWalletStore';
import { backupService } from '../services/backup.service';
import CategoryManager from './CategoryManager';
import ColorLibrary from './ColorLibrary';
import { Palette, Calendar, Landmark as Bank, Check, ArrowLeft, Wallet } from 'lucide-react';
import { Profile } from '../types';

interface SettingsProps {
  profile: Profile | null;
  onLogout?: () => void;
  initialOpenSection?: string;
}

export default function Settings({ profile, onLogout, initialOpenSection }: SettingsProps) {
  const isPasscodeEnabled = useAuthStore(s => s.isPasscodeEnabled);
  const isBiometricEnabled = useAuthStore(s => s.isBiometricEnabled);
  const updateProfile = async (updates: Partial<Profile>) => {
    if (profile) {
      const { financialService } = await import('../services/financial.service');
      await financialService.updateProfile(profile.id, updates);
      useAuthStore.getState().setCurrentUser({ ...profile, ...updates });
    }
  };
  const setIsPasscodeEnabled = useAuthStore(s => s.setIsPasscodeEnabled);
  const setIsBiometricEnabled = useAuthStore(s => s.setIsBiometricEnabled);

  const [showCategoryHub, setShowCategoryHub] = useState(false);
  const [showColorLibrary, setShowColorLibrary] = useState(false);
  const [showIncomeManager, setShowIncomeManager] = useState(initialOpenSection === 'income');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (initialOpenSection === 'income') {
      setShowIncomeManager(true);
    }
  }, [initialOpenSection]);

  if (showCategoryHub) {
    return <CategoryManager onBack={() => setShowCategoryHub(false)} />;
  }

  if (showColorLibrary) {
    return <ColorLibrary onBack={() => setShowColorLibrary(false)} />;
  }

  if (showIncomeManager) {
    return <IncomeManager profile={profile} onBack={() => setShowIncomeManager(false)} onUpdate={updateProfile} />;
  }

  const handleExport = async () => {
    setIsBackingUp(true);
    await backupService.downloadBackup();
    setIsBackingUp(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        await backupService.importVault(content);
        // Refresh app state
        window.location.reload();
      } catch (err) {
        console.error('Import failed:', err);
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isOnyxAuthenticated');
    localStorage.removeItem('onyx_current_user');
    if (onLogout) onLogout();
    window.location.reload();
  };

  return (
    <div className="space-y-10 pb-12">
      {/* ... (previous section: User Profile Header) */}
      <section className="text-center pt-4">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/20 p-1 bg-surface-container-highest">
            <img 
              alt={`${profile?.name} Profile`} 
              className="w-full h-full object-cover rounded-xl filter grayscale hover:grayscale-0 transition-all duration-500" 
              src={profile?.image}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-primary to-primary-container text-on-primary text-[9px] px-3 py-1 rounded-full font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
            {profile?.role}
          </div>
        </div>
        <h2 className="font-headline text-3xl text-on-surface mt-4 mb-1 italic">{profile?.name}</h2>
        <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest opacity-60 italic">ID: ONYX-{profile?.id}00X</p>
      </section>

      {/* Settings List */}
      <div className="space-y-10">
        
        {/* Account */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">Account</h3>
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Personal Info</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div
              onClick={() => setShowIncomeManager(true)}
              className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5"
            >
              <div className="flex items-center gap-4">
                <Banknote className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Income Management</span>
              </div>
              <div className="flex items-center gap-2">
                {profile?.monthlySalary && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Active</span>}
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <Diamond className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Wealth Tier</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <Landmark className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Connected Banks</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">Security</h3>
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 group border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-on-surface-variant" />
                <span className="text-sm font-medium tracking-tight">Passcode Lock</span>
              </div>
              {/* Toggle Switch */}
              <div 
                onClick={() => setIsPasscodeEnabled(!isPasscodeEnabled)}
                className={`w-10 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-colors ${isPasscodeEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <motion.div 
                  layout
                  className={`w-4 h-4 rounded-full ${isPasscodeEnabled ? 'bg-on-primary ml-auto' : 'bg-on-surface-variant'}`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 group border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <ScanFace className={`w-5 h-5 ${isBiometricEnabled ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className="text-sm font-medium tracking-tight">Face ID / Biometrics</span>
              </div>
              <div
                onClick={() => setIsBiometricEnabled(!isBiometricEnabled)}
                className={`w-10 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-colors ${isBiometricEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <motion.div
                  layout
                  className={`w-4 h-4 rounded-full ${isBiometricEnabled ? 'bg-on-primary ml-auto' : 'bg-on-surface-variant'}`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">2FA Authenticator</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <Key className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Security Key</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">App Preferences</h3>
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <Banknote className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">USD</span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">French</span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">Dark</span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">Architecture</h3>
          <div className="space-y-4">
            {/* Profile Management Table Section */}
            <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Managed Profiles Dashboard</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5 text-[9px] uppercase tracking-widest text-on-surface-variant">
                    <tr>
                      <th className="px-5 py-3 font-bold">Profile</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 font-bold">Permissions</th>
                    </tr>
                  </thead>
                   <tbody className="divide-y divide-white/5">
                    {[
                      { name: 'Alex Sterling', status: 'Active', role: 'Full Access', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcc7sVLbIEsC6jX2qV0QnosQxuaMBipKUciaVSyEjoFWvKacXxdAhtcJksFdTrkEcM9ZyoO1TZQ5utfhy2GSmu_ZBAPsaEvyHYbGHqKU9qkeW4LJi8FsjYTCTP0IpUYYxA-PY3JZOf1jKL_5_dCubD5hDqlDMFSonirymzzqEIXp45AxNSCoA7888jm5szoufJTJb0sJFllM4djAOta2Fh96j8ZxSOtosAmIhDc_HceulCBd29kiOZIqXl86aYARqt3gtY8JhKMoo' },
                      { name: 'Sarah Sterling', status: 'Active', role: 'Limited', image: 'https://picsum.photos/seed/sarah/200/200' },
                      { name: 'Marcus Thorne', status: 'Locked', role: 'Read Only', image: 'https://picsum.photos/seed/marcus/200/200' }
                    ].map((p, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="w-8 h-8 rounded-lg grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" />
                            <span className="text-xs font-medium text-on-surface">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${p.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[10px] text-on-surface-variant font-mono">{p.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 text-center border-t border-white/5">
                <button className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline">Manage All Entities</button>
              </div>
            </div>

            <div 
              onClick={() => setShowCategoryHub(true)}
              className="group relative bg-surface-container-low border border-primary/20 rounded-xl p-6 flex items-center justify-between cursor-pointer overflow-hidden hover:bg-surface-container transition-all"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight uppercase">Categorization Hub</h4>
                  <p className="text-[10px] text-on-surface-variant tracking-widest font-medium uppercase mt-1">Manage Categories & Sub-entities</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>

            <div 
              onClick={() => setShowColorLibrary(true)}
              className="group relative bg-surface-container-low border border-outline-variant/5 rounded-xl p-6 flex items-center justify-between cursor-pointer overflow-hidden hover:bg-surface-container transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight uppercase">Visual Identity</h4>
                  <p className="text-[10px] text-on-surface-variant tracking-widest font-medium uppercase mt-1">App Color Palette & Guidelines</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleExport}
                disabled={isBackingUp}
                className="flex flex-col items-center gap-3 p-6 bg-surface-container-low border border-outline-variant/5 rounded-2xl hover:bg-surface-container transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Export Vault</span>
              </button>

              <label className="flex flex-col items-center gap-3 p-6 bg-surface-container-low border border-outline-variant/5 rounded-2xl hover:bg-surface-container transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Import Vault</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">Subscription</h3>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-surface-container-low border border-primary/20 rounded-xl p-5 flex items-center justify-between overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="bg-on-surface w-12 h-8 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight uppercase">Black Card Membership</h4>
                  <p className="text-[10px] text-primary tracking-widest font-medium uppercase mt-1">Status: Active</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-headline text-2xl text-primary mb-4 px-2 italic">Support</h3>
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Help Center</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium tracking-tight">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 text-center">
          <button 
            onClick={handleSignOut}
            className="text-on-surface-variant/40 hover:text-red-400 transition-colors text-xs font-medium tracking-widest uppercase py-4 flex items-center justify-center gap-2 mx-auto"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

function IncomeManager({ profile, onBack, onUpdate }: { profile: Profile | null, onBack: () => void, onUpdate: (updates: Partial<Profile>) => Promise<void> }) {
  const [salary, setSalary] = useState(profile?.monthlySalary?.toString() || '');
  const [day, setDay] = useState(profile?.salaryDay?.toString() || '1');
  const [source, setSource] = useState(profile?.salarySource || '');
  const [walletId, setWalletId] = useState(profile?.salaryWalletId || '');
  const [autoAdd, setAutoAdd] = useState(profile?.autoAddSalary || false);
  const [isSaving, setIsSaving] = useState(false);
  const wallets = useWalletStore(s => s.wallets);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate({
      monthlySalary: parseFloat(salary) || 0,
      salaryDay: parseInt(day) || 1,
      salarySource: source,
      salaryWalletId: walletId,
      autoAddSalary: autoAdd
    });
    setIsSaving(false);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-20"
    >
      <header className="flex items-center justify-between pt-4">
        <button onClick={onBack} className="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-headline text-3xl italic text-on-surface">Income Management</h2>
        <div className="w-10" />
      </header>

      <section className="bg-surface-container-low rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10"></div>
        <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-6 block">Monthly Revenue</label>
        <input
          autoFocus
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="0.00"
          className="w-full bg-transparent border-none p-0 font-headline text-7xl focus:ring-0 text-on-surface placeholder:text-on-surface-variant/10"
        />
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-on-surface-variant italic uppercase tracking-widest">Calculated Annual: {profile?.currency || '$'} {(parseFloat(salary) || 0) * 12}</p>
        </div>
      </section>

      <div className="space-y-6">
        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 px-1">Institutional Logistics (Pro)</h3>

        <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 flex items-center gap-5 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
              <Bank className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 block">Source Name</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Goldman Sachs"
                className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30"
              />
            </div>
          </div>

          <div className="p-5 flex items-center gap-5 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 block">Monthly Receipt Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-on-surface"
              />
            </div>
          </div>

          <div className="p-5 flex items-center gap-5 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 block">Destination Vault</label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-on-surface appearance-none"
              >
                <option value="" className="bg-surface-container-high">Select Wallet</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id} className="bg-surface-container-high">{w.name} ({w.currency})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Auto-Add Transaction</p>
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-0.5">Automated Ledger Entry</p>
              </div>
            </div>
            <div
              onClick={() => setAutoAdd(!autoAdd)}
              className={`w-10 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-colors ${autoAdd ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <motion.div
                layout
                className={`w-4 h-4 rounded-full ${autoAdd ? 'bg-on-primary ml-auto' : 'bg-on-surface-variant'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full metallic-gradient py-5 rounded-2xl text-background font-bold tracking-widest uppercase text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        {isSaving ? 'Synchronizing...' : 'Update Strategy'}
      </button>
    </motion.div>
  );
}
