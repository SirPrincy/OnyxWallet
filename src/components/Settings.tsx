import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Diamond, Landmark, ScanFace, ShieldCheck, Key, 
  Banknote, Globe, Moon, CreditCard, HelpCircle, Shield, 
  ChevronRight, ArrowUpRight, Lock, Plus, Edit3, Trash2, X,
  ShoppingBag, LayoutGrid
} from 'lucide-react';
import { useTransactions } from '../context/useTransactions';
import CategoryManager from './CategoryManager';
import ColorLibrary from './ColorLibrary';
import { Palette } from 'lucide-react';

interface SettingsProps {
  profile: any;
  onLogout?: () => void;
}

export default function Settings({ profile, onLogout }: SettingsProps) {
  const { 
    isPasscodeEnabled, 
    setIsPasscodeEnabled
  } = useTransactions();

  const [showCategoryHub, setShowCategoryHub] = useState(false);
  const [showColorLibrary, setShowColorLibrary] = useState(false);

  if (showCategoryHub) {
    return <CategoryManager onBack={() => setShowCategoryHub(false)} />;
  }

  if (showColorLibrary) {
    return <ColorLibrary onBack={() => setShowColorLibrary(false)} />;
  }

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
                <ScanFace className="w-5 h-5 text-on-surface-variant" />
                <span className="text-sm font-medium tracking-tight">Face ID / Biometrics</span>
              </div>
              <div className="w-10 h-5 bg-surface-container-highest/50 rounded-full relative flex items-center px-0.5 opacity-50">
                <div className="w-4 h-4 bg-on-surface-variant/50 rounded-full"></div>
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
