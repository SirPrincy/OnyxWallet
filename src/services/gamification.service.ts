import { Mission, Achievement, Transaction, Wallet, SavingsGoal, TierData } from '../types';
import { convertCurrency } from '../utils/currency';
import { getThresholds } from '../constants/thresholds';

export interface GamificationData {
  wallets: Wallet[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  currentLevel: number;
  path?: 'investor' | 'frugal' | 'neutral' | 'guardian' | 'catalyst' | 'alchemist' | 'nomad' | 'legacy';
}

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'earned' | 'earnedDate'>[] = [
  // COMMON
  { id: 'first_10k', title: 'Premier $10k', icon: 'trending-up', rarity: 'common', description: 'Atteindre un capital de 10 000 $' },
  { id: 'saver_initiation', title: 'Initié de l\'Épargne', icon: 'target', rarity: 'common', description: 'Créer votre premier objectif' },
  { id: 'tx_starter', title: 'Explorateur', icon: 'zap', rarity: 'common', description: 'Enregistrer 10 transactions' },
  { id: 'wallet_duo', title: 'Diversificateur Junior', icon: 'wallet', rarity: 'common', description: 'Posséder 2 portefeuilles actifs' },

  // RARE
  { id: 'milestone_50k', title: 'Cap des 50k', icon: 'award', rarity: 'rare', description: 'Atteindre un capital de 50 000 $' },
  { id: 'goal_slayer', title: 'Réalisateur d\'Elite', icon: 'check-circle', rarity: 'rare', description: 'Compléter 3 objectifs d\'épargne' },
  { id: 'global_investor', title: 'Investisseur Global', icon: 'globe', rarity: 'rare', description: 'Posséder des actifs dans 3 devises différentes' },

  // EPIC
  { id: 'six_figure_club', title: 'Club des 6 Chiffres', icon: 'diamond', rarity: 'epic', description: 'Atteindre un capital de 100 000 $' },
  { id: 'luxury_collector', title: 'Collectionneur de Luxe', icon: 'shopping-bag', rarity: 'epic', description: 'Dépenser plus de 10 000 $ dans la catégorie Luxe' },
  { id: 'portfolio_pro', title: 'Portfolio Pro', icon: 'bar-chart', rarity: 'epic', description: 'Avoir 5 types de portefeuilles différents' },
  { id: 'investment_whale', title: 'Baleine d\'Investissement', icon: 'trending-up', rarity: 'epic', description: 'Avoir plus de 50 000 $ en investissements' },

  // LEGENDARY
  { id: 'half_millionaire', title: 'Demi-Millionnaire', icon: 'star', rarity: 'legendary', description: 'Atteindre un capital de 500 000 $' },
  { id: 'onyx_titan', title: 'Titan d\'Onyx', icon: 'crown', rarity: 'legendary', description: 'Atteindre le niveau maximum (Onyx Legend)' },
  { id: 'wealth_architect', title: 'Architecte de Fortune', icon: 'building', rarity: 'legendary', description: 'Avoir un patrimoine net de 1 000 000 $' },
  { id: 'legacy_builder', title: 'Bâtisseur d\'Héritage', icon: 'landmark', rarity: 'legendary', description: 'Posséder des actifs immobiliers' },

  // NEW ACHIEVEMENTS (To reach 25)
  { id: 'early_adopter', title: 'Early Adopter', icon: 'rocket', rarity: 'common', description: 'Utiliser l\'application pendant 7 jours' },
  { id: 'frugal_master', title: 'Maître de la Frugalité', icon: 'shield', rarity: 'rare', description: 'Dépenser moins de 50% de ses revenus ce mois-ci' },
  { id: 'crypto_pioneer', title: 'Pionnier Crypto', icon: 'bitcoin', rarity: 'rare', description: 'Posséder un portefeuille de cryptomonnaies' },
  { id: 'diversified_king', title: 'Roi de la Diversification', icon: 'globe', rarity: 'epic', description: 'Posséder des actifs sur 5 types de portefeuilles différents' },
  { id: 'emergency_proof', title: 'Preuve d\'Urgence', icon: 'shield', rarity: 'rare', description: 'Atteindre son objectif de fonds d\'urgence' },
  { id: 'jet_setter', title: 'Jet Setter', icon: 'plane', rarity: 'epic', description: 'Dépenser plus de 20 000 $ en voyages' },
  { id: 'inflation_fighter', title: 'Combattant de l\'Inflation', icon: 'trending-up', rarity: 'rare', description: 'Avoir un objectif d\'épargne avec ajustement d\'inflation' },
  { id: 'auto_pilot', title: 'Auto-Pilote', icon: 'settings', rarity: 'common', description: 'Activer l\'auto-allocation sur un objectif' },
  { id: 'high_roller', title: 'High Roller', icon: 'diamond', rarity: 'epic', description: 'Effectuer une transaction de plus de 10 000 $' },
  { id: 'philanthropist', title: 'Philanthrope', icon: 'heart', rarity: 'rare', description: 'Faire un don ou un cadeau de plus de 1 000 $' }
];

export const INITIAL_MISSIONS: Omit<Mission, 'id'>[] = [
  { title: 'Security Buffer I', description: 'Initialize 1 month of coverage', progress: 0, total: 3000, icon: 'shield', type: 'short', category: 'growth', level: 1, status: 'active', unlockedAtLevel: 1, path: 'neutral' },
  { title: 'Asset Diversification', description: 'Expand to 3 distinct reserves', progress: 0, total: 3, icon: 'wallet', type: 'medium', category: 'growth', level: 1, status: 'active', unlockedAtLevel: 1, path: 'neutral' },
  { title: 'Positive Momentum', description: 'Maintain net positive monthly flow', progress: 0, total: 1, icon: 'trending-up', type: 'short', category: 'audit', level: 1, status: 'active', unlockedAtLevel: 1, path: 'neutral' },
  { title: 'Capital Foundation', description: 'Accumulate $50,000 in total assets', progress: 0, total: 50000, icon: 'landmark', type: 'long', category: 'growth', level: 1, status: 'active', unlockedAtLevel: 2, path: 'neutral' },

  // Investor Path
  { title: 'Market Ingress', description: 'Deploy $1000 into strategic assets', progress: 0, total: 1000, icon: 'trending-up', type: 'short', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'investor' },
  { title: 'Yield Acquisition', description: 'Secure passive returns of $10', progress: 0, total: 10, icon: 'sparkles', type: 'medium', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'investor' },

  // Frugal Path
  { title: 'Optimization Protocol', description: 'Achieve 3 category efficiencies', progress: 0, total: 3, icon: 'shield', type: 'short', category: 'audit', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'frugal' },
  { title: 'Discipline Master', description: 'Refine monthly outflow by 10%', progress: 0, total: 10, icon: 'target', type: 'medium', category: 'audit', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'frugal' },

  // Guardian Path
  { title: 'Reserve Integrity', description: 'Sustain 6 months of capital runway', progress: 0, total: 6, icon: 'shield', type: 'long', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'guardian' },
  { title: 'Provider Audit', description: 'Authenticate 5 asset custodians', progress: 0, total: 5, icon: 'audit', type: 'medium', category: 'audit', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'guardian' },

  // Catalyst Path
  { title: 'Velocity Target', description: 'Reach 20% portfolio intensity', progress: 0, total: 20, icon: 'zap', type: 'short', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'catalyst' },
  { title: 'Growth Catalysis', description: 'Incorporate 3 high-yield vectors', progress: 0, total: 3, icon: 'rocket', type: 'medium', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'catalyst' },

  // Alchemist Path
  { title: 'Impact Radius', description: 'Commit $5000 to value-aligned goals', progress: 0, total: 5000, icon: 'gem', type: 'long', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'alchemist' },
  { title: 'Ethical Alignment', description: 'Categorize 5 impact-driven events', progress: 0, total: 5, icon: 'leaf', type: 'short', category: 'audit', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'alchemist' },

  // Nomad Path
  { title: 'Global Liquidity', description: 'Diversify across 4 global currencies', progress: 0, total: 4, icon: 'globe', type: 'medium', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'nomad' },
  { title: 'Borderless Flow', description: 'Execute a cross-jurisdiction transfer', progress: 0, total: 1, icon: 'plane', type: 'short', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'nomad' },

  // Legacy Path
  { title: 'Dynasty Blueprint', description: 'Initialize a generational asset', progress: 0, total: 1, icon: 'landmark', type: 'long', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'legacy' },
  { title: 'Perpetual Horizon', description: 'Define a 10-year strategic objective', progress: 0, total: 1, icon: 'clock', type: 'medium', category: 'growth', level: 1, status: 'locked', unlockedAtLevel: 1, path: 'legacy' }
];

const PATH_TITLES: Record<string, Record<number, string>> = {
  investor: {
    1: 'Aspirant Investisseur',
    5: 'Investisseur du Dimanche',
    10: 'Investisseur Débutant',
    20: 'Investisseur Pro',
    30: 'Analyste de Marché',
    40: 'Gestionnaire d\'Actifs',
    50: 'Hedge Fund Investisseur',
    60: 'Visionnaire de Capital',
    70: 'Titan de la Bourse',
    80: 'Obsidian Investor',
    90: 'Master Strategist',
    100: 'Onyx Legend',
  },
  frugal: {
    1: 'Apprenti Économe',
    10: 'Chasseur de Gaspillage',
    20: 'Optimisateur de Budget',
    30: 'Maître de la Discipline',
    40: 'Gardien des Centimes',
    50: 'Architecte Frugal',
    60: 'Minimaliste d\'Élite',
    70: 'Ingénieur de Patrimoine',
    80: 'Obsidian Minimalist',
    90: 'Master of Flow',
    100: 'Onyx Sage',
  },
  guardian: {
    1: 'Vigilant de Réserve',
    10: 'Gardien de Réserve',
    20: 'Protecteur de Capital',
    30: 'Analyste de Risque',
    40: 'Bouclier Financier',
    50: 'Wealth Guardian',
    60: 'Forteresse de Patrimoine',
    70: 'Titan de la Sécurité',
    80: 'Obsidian Shield',
    90: 'Grand Custodian',
    100: 'Onyx Sentinel',
  },
  catalyst: {
    1: 'Explorateur de Risque',
    10: 'Chercheur d\'Opportunité',
    20: 'Catalyseur de Croissance',
    30: 'Disrupteur de Marché',
    40: 'Architecte de Momentum',
    50: 'Venture Catalyst',
    60: 'Visionnaire de Rupture',
    70: 'Moteur de Capital',
    80: 'Obsidian Spark',
    90: 'Master of Velocity',
    100: 'Onyx Engine',
  },
  alchemist: {
    1: 'Initié de l\'Impact',
    10: 'Purificateur de Flux',
    20: 'Alchimiste Social',
    30: 'Visionnaire Éthique',
    40: 'Architecte de Valeur',
    50: 'Ethical Alchemist',
    60: 'Maître de la Résonance',
    70: 'Harmonisateur de Fortune',
    80: 'Obsidian Essence',
    90: 'Master of Balance',
    100: 'Onyx Philosopher',
  },
  nomad: {
    1: 'Voyageur Financier',
    10: 'Nomade de Liquidité',
    20: 'Citoyen du Monde',
    30: 'Explorateur de Devises',
    40: 'Architecte Sans Frontières',
    50: 'Digital Nomad',
    60: 'Maître du Flux Global',
    70: 'Souverain de Mobilité',
    80: 'Obsidian Traveler',
    90: 'Master of Horizons',
    100: 'Onyx Wayfarer',
  },
  legacy: {
    1: 'Bâtisseur Junior',
    10: 'Gardien d\'Héritage',
    20: 'Architecte de Lignée',
    30: 'Visionnaire de Long Terme',
    40: 'Maître de la Transmission',
    50: 'Legacy Builder',
    60: 'Fondateur de Dynastie',
    70: 'Titan de la Durée',
    80: 'Obsidian Anchor',
    90: 'Grand Patriarch',
    100: 'Onyx Founder',
  },
  neutral: {
    1: 'Nouveau Membre',
    10: 'Adepte du Vault',
    20: 'Gestionnaire Averti',
    30: 'Maître de l\'Équilibre',
    40: 'Praticien du Patrimoine',
    50: 'Onyx Associate',
    60: 'Visionnaire de Réserve',
    70: 'Commandeur de Capital',
    80: 'Obsidian Master',
    90: 'Grand Strategist',
    100: 'Onyx Legend',
  }
};

export class GamificationService {
  public isSyncing = false;
  private lastSyncedData: string | null = null;
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;

  private getPathTitle(path: string, level: number): string {
    const titles = PATH_TITLES[path] || PATH_TITLES.neutral;
    const sortedLevels = Object.keys(titles).map(Number).sort((a, b) => b - a);
    const matchedLevel = sortedLevels.find(l => level >= l) || 1;
    return titles[matchedLevel];
  }

  private getTierName(level: number): string {
    if (level <= 10) return 'Bronze';
    if (level <= 20) return 'Silver';
    if (level <= 30) return 'Gold';
    if (level <= 40) return 'Platinum';
    if (level <= 50) return 'Diamond';
    if (level <= 60) return 'Archon';
    if (level <= 70) return 'Emerald';
    if (level <= 90) return 'Obsidian';
    return 'Onyx';
  }

  private getDirtyString(data: GamificationData): string {
    return JSON.stringify({
      w: data.wallets.length,
      t: data.transactions.length,
      g: data.savingsGoals.length,
      b: data.wallets.map(w => w.balance),
      p: data.savingsGoals.map(g => g.current),
      l: data.currentLevel,
      path: data.path
    });
  }

  async sync(
    profileId: string,
    data: GamificationData,
    missions: Mission[],
    achievements: Achievement[],
    actions: {
      updateMission: (id: string, updates: Partial<Mission>) => Promise<void>;
      updateAchievement: (id: string, earned: boolean) => Promise<void>;
      refreshData: () => Promise<{ missions: Mission[], achievements: Achievement[] }>;
      onComplete: () => void;
    }
  ): Promise<void> {
    // 1. Locking
    if (this.isSyncing) return;

    // 2. Dirty Checking
    const dataString = this.getDirtyString(data);
    if (dataString === this.lastSyncedData) return;

    // 3. Debouncing (1000ms)
    if (this.syncTimeout) clearTimeout(this.syncTimeout);

    this.syncTimeout = setTimeout(async () => {
      if (this.isSyncing) return;

      console.count('GamificationSync_Execution');
      console.time('GamificationSync_Process');
      this.isSyncing = true;

      try {
        const missionUpdates = this.evaluateMissions(data, missions);
        const achievementUpdates = await this.evaluateAchievements(data, achievements);

        let needsRefresh = false;
        if (missionUpdates.length > 0) {
          for (const update of missionUpdates) {
            await actions.updateMission(update.id, update);
          }
          needsRefresh = true;
        }
        if (achievementUpdates.length > 0) {
          for (const id of achievementUpdates) {
            await actions.updateAchievement(id, true);
          }
          needsRefresh = true;
        }

        if (needsRefresh) {
          await actions.refreshData();
        }

        this.lastSyncedData = dataString;
      } catch (error) {
        console.error('CRITICAL: Gamification Sync Failure', error);
      } finally {
        this.isSyncing = false;
        actions.onComplete();
        console.timeEnd('GamificationSync_Process');
      }
    }, 1000);
  }

  evaluateMissions(data: GamificationData, currentMissions: Mission[]): (Partial<Mission> & { id: string })[] {
    const { wallets, transactions, currentLevel, path } = data;
    
    const totalLiquidity = wallets.reduce((sum, w) => {
      const signedBalance = w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance;
      return sum + convertCurrency(signedBalance, w.currency || 'USD', 'USD');
    }, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const averageMonthlyIncome = totalIncome > 0 ? Math.max(3000, totalIncome / 3) : 3000;
    
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const currentMonthTransactions = transactions.filter(t => t.timestamp >= startOfMonth);
    const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = Math.abs(currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

    const updates: (Partial<Mission> & { id: string })[] = [];

    currentMissions.forEach(m => {
      let newProgress = m.progress;
      let newTotal = m.total;
      let newLevel = m.level || 1;
      let newDesc = m.description;
      let newStatus = m.status;
      let changed = false;

      // Unlock logic based on level and path
      if (m.status === 'locked' && currentLevel >= m.unlockedAtLevel) {
        if (!m.path || m.path === 'neutral' || m.path === path) {
          newStatus = 'available';
          changed = true;
        }
      }

      if (m.title.includes('Security Buffer') || m.title.includes('Emergency Fund')) {
        const MULTIPLIERS = [1, 1.5, 2, 3, 6];
        const currentMult = MULTIPLIERS[Math.min(newLevel - 1, MULTIPLIERS.length - 1)];
        
        newTotal = averageMonthlyIncome * currentMult;
        newProgress = Math.min(totalLiquidity, newTotal);
        newDesc = `Initialize ${currentMult} month${currentMult > 1 ? 's' : ''} of coverage`;

        if (totalLiquidity >= newTotal && newLevel < MULTIPLIERS.length) {
          newLevel += 1;
          const nextMult = MULTIPLIERS[newLevel - 1];
          newTotal = averageMonthlyIncome * nextMult;
          newProgress = Math.min(totalLiquidity, newTotal);
          newDesc = `Initialize ${nextMult} month${nextMult > 1 ? 's' : ''} of coverage`;
        }
        changed = true;
      } else if (m.title === 'Asset Diversification' || m.title === 'Diversification') {
        newTotal = 3 * newLevel;
        newProgress = wallets.length;
        if (newProgress >= newTotal && newLevel < 3) {
          newLevel += 1;
          newTotal = 3 * newLevel;
        }
        changed = true;
      } else if (m.title === 'Positive Momentum') {
        newTotal = 1;
        newProgress = monthlyIncome > monthlyExpense ? 1 : 0;
        changed = true;
      } else if (m.title === 'Market Ingress') {
        const investmentTotal = wallets
          .filter(w => w.type === 'Investment' || w.type === 'Crypto')
          .reduce((sum, w) => sum + convertCurrency(w.balance, w.currency || 'USD', 'USD'), 0);
        newProgress = Math.min(m.total, investmentTotal);
        changed = true;
      } else if (m.title === 'Reserve Integrity') {
        const runway = totalLiquidity / averageMonthlyIncome;
        newProgress = Math.min(m.total, runway);
        changed = true;
      } else if (m.title === 'Global Liquidity') {
        newProgress = new Set(wallets.map(w => w.currency)).size;
        changed = true;
      } else if (m.title === 'Dynasty Blueprint') {
        newProgress = wallets.some(w => w.type === 'Property') ? 1 : 0;
        changed = true;
      } else if (m.title === 'Growth Catalysis') {
        newProgress = wallets.filter(w => w.type === 'Investment' || w.type === 'Crypto').length;
        changed = true;
      } else if (m.title === 'Capital Foundation') {
        newProgress = Math.min(m.total, totalLiquidity);
        changed = true;
      }

      if (changed && (newProgress !== m.progress || newTotal !== m.total || newLevel !== m.level || newDesc !== m.description || newStatus !== m.status)) {
        updates.push({ id: m.id, progress: newProgress, total: newTotal, level: newLevel, description: newDesc, status: newStatus });
      }
    });

    return updates;
  }

  calculateXP(
    data: GamificationData,
    missions: Mission[],
    achievements: Achievement[],
    profileCurrency: string = 'USD'
  ): { xp: number; tierData: TierData } {
    const { wallets, transactions, savingsGoals, path } = data;

    const totalLiquidity = wallets.reduce((sum, w) => {
      const signedBalance = w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance;
      return sum + convertCurrency(signedBalance, w.currency || 'USD', 'USD');
    }, 0);

    const xpFromLiquidity = Math.max(0, totalLiquidity) / 10;
    const xpFromGoals = savingsGoals.reduce((count, goal) => count + (goal.current >= goal.target ? 1 : 0), 0) * 500;

    let txCount = 0;
    let expenseTxCount = 0;
    let investorBonusCount = 0;
    let totalIncome = 0;

    for (const tx of transactions) {
      txCount++;
      if (tx.type === 'income') totalIncome += tx.amount;
      if (tx.type === 'expense') expenseTxCount++;
      if (tx.category === 'Investment' || (tx.category === 'Transfer' && tx.goalId)) investorBonusCount++;
    }

    let xpFromTx = txCount * 50;

    if (path === 'investor') {
      xpFromTx += investorBonusCount * 25;
    } else if (path === 'frugal') {
      xpFromTx += Math.max(0, (100 - expenseTxCount)) * 10;
    }

    const xp = xpFromLiquidity + xpFromTx + xpFromGoals;

    // Level formula: level = Math.min(100, Math.floor(Math.sqrt(xp / 200)) + 1)
    let level = Math.min(100, Math.floor(Math.sqrt(xp / 200)) + 1);

    // Runway Booster: 1 month -> min Lvl 11, 3 months -> min Lvl 21, 6 months -> min Lvl 31
    const thresholds = getThresholds(profileCurrency);
    const averageMonthlyIncome = totalIncome > 0 ? Math.max(thresholds.avgMonthlyIncome, totalIncome / 3) : thresholds.avgMonthlyIncome;
    const runwayMonths = totalLiquidity / averageMonthlyIncome;

    if (runwayMonths >= 6) level = Math.max(level, 31);
    else if (runwayMonths >= 3) level = Math.max(level, 21);
    else if (runwayMonths >= 1) level = Math.max(level, 11);

    const currentMaterialTier = this.getTierName(level);
    const pathTitle = this.getPathTitle(path || 'neutral', level);

    // Calculate progress to next level
    // XP for level L = 200 * (L-1)^2
    const currentLevelXP = 200 * Math.pow(level - 1, 2);
    const nextLevelXP = 200 * Math.pow(level, 2);

    let progress = 100;
    let left = 0;

    if (level < 100) {
      const range = nextLevelXP - currentLevelXP;
      const progressXP = Math.max(0, xp - currentLevelXP);
      progress = (progressXP / range) * 100;
      left = Math.max(0, nextLevelXP - xp);
    }

    // Find the next material tier transition
    let nextTierDisplay = 'MAX';
    if (level < 100) {
      for (let l = level + 1; l <= 100; l++) {
        const t = this.getTierName(l);
        if (t !== currentMaterialTier) {
          nextTierDisplay = t;
          break;
        }
      }
      // If we are in the last material tier (Onyx) but not yet level 100
      if (nextTierDisplay === 'MAX' && currentMaterialTier !== 'Onyx') {
         nextTierDisplay = 'Onyx';
      }
    }

    return {
      xp,
      tierData: {
        tierName: pathTitle, // Using pathTitle as tierName for "Premium Semantics"
        level: level,
        progressPercent: Math.min(100, Math.max(0, progress)),
        xpLeft: left,
        nextTier: nextTierDisplay
      }
    };
  }

  async evaluateAchievements(data: GamificationData, currentAchievements: Achievement[]): Promise<string[]> {
    const { wallets, transactions, savingsGoals } = data;
    const totalLiquidity = wallets.reduce((sum, w) => {
      const signedBalance = w.type === 'Credit Card' ? -Math.abs(w.balance) : w.balance;
      return sum + convertCurrency(signedBalance, w.currency || 'USD', 'USD');
    }, 0);
    
    const newlyEarnedIds: string[] = [];

    currentAchievements.forEach(a => {
      if (a.earned) return;
      let earned = false;
      
      const luxuryTxs = transactions.filter(t => t.category === 'Luxury Goods');
      const totalLuxurySpent = Math.abs(luxuryTxs.reduce((sum, t) => sum + t.amount, 0));
      const investments = wallets.filter(w => w.type === 'Investment' || w.type === 'Crypto' || w.type === 'Property');
      const totalInvestments = investments.reduce((sum, w) => sum + convertCurrency(w.balance, w.currency || 'USD', 'USD'), 0);

      switch (a.id) {
        case 'first_10k': earned = totalLiquidity >= 10000; break;
        case 'saver_initiation': earned = savingsGoals.length >= 1; break;
        case 'tx_starter': earned = transactions.length >= 10; break;
        case 'wallet_duo': earned = wallets.length >= 2; break;
        case 'milestone_50k': earned = totalLiquidity >= 50000; break;
        case 'goal_slayer': earned = savingsGoals.filter(g => g.isCompleted).length >= 3; break;
        case 'global_investor': earned = new Set(wallets.map(w => w.currency)).size >= 3; break;
        case 'six_figure_club': earned = totalLiquidity >= 100000; break;
        case 'luxury_collector': earned = totalLuxurySpent >= 10000; break;
        case 'portfolio_pro': earned = new Set(wallets.map(w => w.type)).size >= 5; break;
        case 'investment_whale': earned = totalInvestments >= 50000; break;
        case 'half_millionaire': earned = totalLiquidity >= 500000; break;
        case 'onyx_titan': earned = data.currentLevel >= 100; break;
        case 'wealth_architect': earned = totalLiquidity >= 1000000; break;
        case 'legacy_builder': earned = wallets.some(w => w.type === 'Property'); break;

        // NEW EVALUATION LOGIC
        case 'early_adopter': {
          // Use transactions date as proxy for age
          if (transactions.length > 0) {
            const oldestTx = Math.min(...transactions.map(t => t.timestamp));
            earned = (Date.now() - oldestTx) > (7 * 24 * 60 * 60 * 1000);
          }
          break;
        }
        case 'frugal_master': {
          const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
          const currentMonthTxs = transactions.filter(t => t.timestamp >= startOfMonth);
          const income = currentMonthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
          const expense = Math.abs(currentMonthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
          earned = income > 0 && (expense / income) < 0.5;
          break;
        }
        case 'crypto_pioneer': earned = wallets.some(w => w.type === 'Crypto'); break;
        case 'diversified_king': earned = new Set(wallets.map(w => w.type)).size >= 5; break;
        case 'emergency_proof': earned = savingsGoals.some(g => g.category === 'emergency' && g.isCompleted); break;
        case 'jet_setter': {
          const travelSpent = Math.abs(transactions.filter(t => t.category === 'Travel' || t.category === 'Hospitality' || t.category === 'Private Aviation').reduce((sum, t) => sum + t.amount, 0));
          earned = travelSpent >= 20000;
          break;
        }
        case 'inflation_fighter': earned = savingsGoals.some(g => (g.inflationRate || 0) > 0); break;
        case 'auto_pilot': earned = savingsGoals.some(g => (g.autoAllocationPercent || 0) > 0); break;
        case 'high_roller': earned = transactions.some(t => Math.abs(t.amount) >= 10000); break;
        case 'philanthropist': {
          const gifts = transactions.filter(t => t.category === 'Gifts');
          const totalGifts = Math.abs(gifts.reduce((sum, t) => sum + t.amount, 0));
          earned = totalGifts >= 1000;
          break;
        }
      }

      if (earned) {
        newlyEarnedIds.push(a.id);
      }
    });

    return newlyEarnedIds;
  }
}

export const gamificationService = new GamificationService();
