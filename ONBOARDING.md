# Onyx Wallet Onboarding Process

This document describes the functional steps and design philosophy an Onyx Wallet user goes through during the initial setup.

## 1. Entry Selection: New Vault vs. Restore
Before starting, the user chooses how to enter the application:
- **Create New Vault**: Starts a clean setup for a new user.
- **Restore from Export**: Allows existing users to import their data from a local backup file.

> [!CAUTION]
> **Local Data Warning**: When choosing "Create New Vault", a mandatory warning explains that Onyx Wallet is a **100% local and private** application. There is no cloud storage. If the user loses their device or forgets their passcode, data recovery is impossible without a manual export.

## 2. Introduction Screens (Info)
The onboarding begins with high-level introductory slides highlighting the core values:
- **Welcome to ONYX WALLET**: Precision wealth management interface.
- **Absolute PRIVACY**: Local-only storage, no tracking, secure encryption.

## 3. Identity Establishment (Identity)
The user creates their local identity:
- **Identity Name**: Display name for the profile.
- **Secure Passcode**: The master key for app access.

## 4. Financial Profiling Quiz (Quiz)
A 5-question assessment to determine the user's "Strategic Path".
- **Questions**: Focus, budgeting style, investment preferences, risk tolerance, and wealth philosophy.
- **Paths**: Strategic Investor, Frugal Architect, Wealth Guardian, Legacy Builder, Venture Catalyst, Digital Nomad, Ethical Alchemist.

## 5. Strategic Alignment Result (Path Result)
Displays the recommended path based on the quiz. The path dictates specific passive XP bonuses and mission availability.
- Users can retake the assessment if the result doesn't align with their vision.

## 6. First Deposit & Wallet Initialization (Wallet)
- **Wallet Type**: Bank Account, Credit Card, Cash, Mobile Money, or Crypto.
- **Currency**: Searchable global currencies (USD, EUR, MGA, etc.).
- **Wallet Label**: Custom name (e.g., "Main Reserve").
- **Balance**: Numeric entry or Quantity/Price for Crypto.

## 7. Finalization (Finish)
- **Vault Ready**: Confirmation screen.
- **Launch Dashboard**: Finalizes database insertion and redirects to the main interface.

---

## 8. Post-Onboarding: Next Steps
Upon reaching the dashboard, the user is encouraged to complete their "Strategic Firsts":
1.  **Set First Budget**: Define monthly spending limits to start tracking efficiency.
2.  **Define First Goal**: Create a target (e.g., Emergency Fund) to visualize progress.
3.  **Configure Automated Savings**: Set a percentage of income to be automatically allocated to the "Vault".
4.  **Accept First Mission**: Engage with the gamification system by starting a challenge.

---

## 9. Design & Technical Specifications

### UX Design Philosophy
- **Glassmorphism**: UI elements use semi-transparent backgrounds with backdrop filters for a premium, deep-layered feel.
- **Metallic Gradients**: Primary buttons and highlights use gold/silver gradients (`metallic-gradient`) to evoke wealth and luxury.
- **Interactive Feedback**: All inputs and buttons utilize Framer Motion for smooth transitions and haptic-like visual feedback.

### Mobile Permissions & Requirements
- **Local Storage**: Required to maintain the SQLite database.
- **Capacitor SQLite**: Uses the `@capacitor-community/sqlite` plugin for native performance.
- **Biometrics (Optional)**: Support for FaceID/Fingerprint can be enabled in settings to bypass the manual passcode entry.

### Terminology
- Use "Vault" or "Reserve" instead of simple "Account".
- Use "Strategic Path" instead of "User Type".
- "XP" and "Levels" are used to track financial literacy and discipline growth.
