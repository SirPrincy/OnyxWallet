import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Shield,
  TrendingUp,
  Target,
  Lock,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  Map,
  Rocket,
  Gem,
  Globe,
  Landmark,
  Clock,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';
import { useAuthStore } from '../store/useAuthStore';
import { Mission } from '../types';
import { ICON_MAP } from '../constants';

export default function MissionBoard() {
  const missions = useGamificationStore(s => s.missions);
  const path = useGamificationStore(s => s.path);
  const updateMission = useGamificationStore(s => s.updateMission);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const activeMissions = missions.filter(m => m.status === 'active' && (!m.path || m.path === 'neutral' || m.path === path));
  const availableMissions = missions.filter(m => m.status === 'available' && (!m.path || m.path === 'neutral' || m.path === path));
  const completedMissions = missions.filter(m => m.status === 'completed');

  const handleAccept = async (mission: Mission) => {
    // Mark as active
    await updateMission(mission.id, 0, mission.total, mission.level, mission.description, 'active');
    setSelectedMission(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-headline text-4xl italic text-on-surface">Tactical Ops</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Mission Board</p>
          </div>
        </div>
      </section>

      {/* Active Objectives */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Active Directives</h3>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold">{activeMissions.length} ONLINE</span>
        </div>
        <div className="grid gap-4">
          {activeMissions.length > 0 ? activeMissions.map(mission => {
            const Icon = ICON_MAP[mission.icon] || Landmark;
            const progress = (mission.progress / mission.total) * 100;
            return (
              <motion.div
                key={mission.id}
                className="p-6 rounded-[2.5rem] bg-surface-container-low border border-white/5 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-on-surface font-headline text-lg">{mission.title}</h4>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">{mission.type} Priority</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-primary font-bold">LVL {mission.level}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">
                    <span>Operational Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-4">
              <p className="text-xs text-on-surface-variant italic font-medium">No active directives. Browse available ops below.</p>
            </div>
          )}
        </div>
      </section>

      {/* Available Missions */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Available Engagements</h3>
        <div className="grid gap-3">
          {availableMissions.map(mission => {
            const Icon = ICON_MAP[mission.icon] || Landmark;
            return (
              <button
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                className="p-5 flex items-center justify-between bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-on-surface font-medium text-sm">{mission.title}</h4>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter">Requires LVL {mission.unlockedAtLevel}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[3rem] z-[160] p-10 border-t border-white/10"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <h3 className="font-headline text-4xl text-on-surface italic">{selectedMission.title}</h3>
                  <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Tactical Briefing</p>
                </div>
                <button onClick={() => setSelectedMission(null)} className="p-3 rounded-full bg-white/5 text-on-surface-variant">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8 pb-8">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-on-surface-variant text-sm leading-relaxed">
                  {selectedMission.description}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-container-highest/30 border border-white/5">
                    <p className="text-[8px] uppercase tracking-widest text-on-surface-variant mb-1">Target</p>
                    <p className="font-headline text-xl text-on-surface">{selectedMission.total.toLocaleString()}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-highest/30 border border-white/5">
                    <p className="text-[8px] uppercase tracking-widest text-on-surface-variant mb-1">Rewards</p>
                    <p className="font-headline text-xl text-primary">+500 XP</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(selectedMission)}
                  className="w-full py-6 bg-primary rounded-3xl text-background font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Accept Mission
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
