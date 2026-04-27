# Onyx Wallet Onboarding Process

This document describes the functional steps and design philosophy an Onyx Wallet user goes through during the initial setup.

## 1. Entry Selection: New Vault vs. Restore
Before starting, the user chooses how to enter the application:
- **Create New Vault**: Starts a clean setup for a new user.
- **Restore from Export**: Allows existing users to import their data from a local backup file.

> [!CAUTION]
> **Local Data Warning**: When choosing "Create New Vault", a mandatory warning explains that Onyx Wallet is a **100% local and private** application. There is no cloud storage. If the user loses their device or forgets their passcode, data recovery is impossible without a manual export.

## 2. Privacy Commitment (Commitment Step)
Onyx Wallet enforces a clear privacy-first stance. A dedicated "Commitment to Privacy" screen ensures the user understands that the app is 100% offline, with no servers or tracking involved. This builds trust before any financial data is entered.

## 3. Introduction Screens (Info)
The onboarding begins with high-level introductory slides highlighting the core values:
- **Welcome to ONYX WALLET**: Precision wealth management interface.
- **Absolute PRIVACY**: Local-only storage, no tracking, secure encryption.

## 4. Identity Establishment (Identity)
The user creates their local identity:
- **Identity Name**: Display name for the profile.
- **Secure Passcode**: The master key for app access.
- **Avatar/Identity Setup**: Personalized setup for the user's digital presence in the vault.

## 5. Financial Profiling Quiz (Quiz)
A 7-question assessment organized in a **"3+3+1" structure** to determine the user's "Strategic Path" with high precision:

- **Behavior (3 Questions)**: Focuses on spending habits, handling opportunities, and crisis preparation.
- **Vision (3 Questions)**: Explores long-term purpose, preferred market environments, and financial legacy.
- **Tie-Breaker (1 Question)**: A final targeted question to distinguish between similar profiles (e.g., Investor vs. Catalyst).

## 6. Strategic Alignment Result (Path Result)
Displays the recommended path based on the quiz. The path dictates specific passive XP bonuses and mission availability.
- **The Strategic Investor**: Market growth and passive income.
- **The Frugal Architect**: Discipline and budget optimization.
- **The Balanced Path (Neutral)**: Versatile balance between growth and security.
- **Wealth Guardian**: Capital preservation and stability.
- **Venture Catalyst**: High-risk, disruptive opportunities.
- **Ethical Alchemist**: Social and environmental impact.
- **Digital Nomad**: Global mobility and borderless finance.
- **Legacy Builder**: Generational wealth and estate planning.

- Users can retake the assessment if the result doesn't align with their vision.

## 7. First Deposit & Wallet Initialization (Wallet)
- **Wallet Type**: Bank Account, Credit Card, Cash, Mobile Money, Crypto, Investment, or Property.
- **Currency**: Searchable global currencies (USD, EUR, MGA, etc.).
- **Wallet Label**: Custom name (e.g., "Main Reserve").
- **Balance**: Numeric entry or Quantity/Price for Crypto.

## 8. Finalization (Finish)
- **Vault Ready**: Confirmation screen.
- **Launch Dashboard**: Finalizes database insertion and redirects to the main interface.

---

## 9. Guided First Acts (Tutorial)
After the final setup, a dedicated screen guides the user through their first strategic actions using specialized Wizards:
1.  **Set First Budget**: Launch `BudgetWizard.tsx` to define monthly spending limits.
2.  **Define First Goal**: Launch `GoalWizard.tsx` to create a target (e.g., Emergency Fund).
3.  **Launch AI Audit**: Introduce the AI assistant for portfolio analysis.
4.  **Accept First Mission**: Engage with the `MissionBoard.tsx` to start a challenge.

---
