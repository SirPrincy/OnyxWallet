# Documentation de la Gestion des Dettes (Liabilities)

Ce document détaille le fonctionnement du système de gestion des dettes dans Onyx Wallet, tant du point de vue utilisateur que technique.

## 1. Parcours Utilisateur (UX)

L'utilisateur accède à la gestion des dettes via l'onglet **Liabilities** dans le menu de navigation.

### Étape 1 : Ajout d'une Dette
L'utilisateur peut enregistrer une nouvelle dette en cliquant sur le bouton **"+"** (Add Liability). Il doit renseigner :
- **Nom/Usage** : (ex: Crédit Immobilier, Prêt Étudiant)
- **Type** : Mortgage, Personal Loan, Student Loan, Credit Card, Leasing, Other.
- **Prêteur (Provider)** : (ex: BNP Paribas, Chase Bank)
- **Montant Total** : Le capital initial emprunté.
- **Montant Restant** : Le capital restant dû à ce jour.
- **Mensualité** : Le montant payé chaque mois.
- **Taux d'intérêt** : Le taux annuel (APR).

### Étape 2 : Visualisation du Portfolio
L'écran affiche :
- Le **Total Indebtedness** (Somme des montants restants).
- Le **Debt-to-Income Ratio** (Ratio d'endettement, calculé par rapport au salaire mensuel du profil).
- Le **Total Capital Repaid** (Part déjà remboursée).
- La **Monthly Service** (Somme des mensualités).

Chaque dette est affichée sous forme de carte avec une barre de progression visuelle.

### Étape 3 : Stratégie de Remboursement
L'application propose actuellement la stratégie **"The Snowball"** (Boule de neige).
- Elle identifie automatiquement la dette avec le **plus petit solde restant**.
- Elle encourage l'utilisateur à rembourser cette dette en priorité pour créer un élan psychologique.
- Un bouton **"Boost Payment"** permet d'effectuer un remboursement exceptionnel sur cette cible.

### Étape 4 : Paiement et Suivi
Lorsqu'un utilisateur effectue un paiement via le modal "Boost Payment" :
1. Il saisit le montant.
2. Il choisit le portefeuille (Wallet) source.
3. Le système crée une transaction de type `expense` catégorie `Debt Repayment`.
4. Le montant restant de la dette est automatiquement déduit.

---

## 2. Architecture Technique

### Schéma de la Base de Données (SQLite)
La table `liabilities` est définie comme suit :
```sql
CREATE TABLE liabilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  totalAmount REAL NOT NULL,
  remainingAmount REAL NOT NULL,
  interestRate REAL NOT NULL,
  monthlyPayment REAL NOT NULL,
  dueDate TEXT NOT NULL,
  provider TEXT NOT NULL,
  profileId TEXT
);
```

### Gestion de l'État (Zustand)
Le store `useFinancialStore.ts` gère la logique métier :
- `liabilities`: Liste réactive des dettes.
- `addLiability()`: Appelle `financialService` et met à jour le store.
- `payLiability()`: Orchestre le paiement. Si un `walletId` est fourni, il crée une transaction via `addTransaction` qui, par effet de bord, mettra à jour la dette.

### Services
- **`financial.service.ts`**: Gère les opérations CRUD brutes sur la table `liabilities`.
- **`transaction.service.ts`**: Contient la logique d'impact. Lorsqu'une transaction possède un `liabilityId`, le service exécute un `UPDATE` sur la table `liabilities` pour réduire le `remainingAmount` dans la même transaction atomique (via `executeSet`).

---

## 3. Idées d'Évolutions (Roadmap)

Voici quelques pistes pour enrichir le module "Debt" :

1.  **Stratégie "Avalanche"** : Ajouter une option pour cibler la dette avec le **taux d'intérêt le plus élevé** (plus optimal financièrement que le Snowball).
2.  **Calcul Réel du Ratio d'Endettement** : Lier le calcul au salaire mensuel configuré dans le profil de l'utilisateur.
3.  **Simulateur de Crédit** : Permettre de voir l'impact d'une augmentation de la mensualité sur la date de fin de crédit et les intérêts économisés.
4.  **Alertes de Relance** : Notifications Capacitor pour les échéances (`dueDate`) approchantes.
5.  **Graphique d'Extinction** : Visualisation temporelle de la décroissance de la dette totale jusqu'à zéro.
6.  **Gestion des Intérêts** : Distinguer le remboursement du capital et le paiement des intérêts dans les transactions.
