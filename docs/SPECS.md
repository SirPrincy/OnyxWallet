# Design & Technical Specifications

This document outlines the core architectural and aesthetic principles of Onyx Wallet.

## 1. UX Design Philosophy
Onyx Wallet is designed to evoke a sense of exclusivity, security, and premium wealth management.

### Aesthetic Pillars
- **Glassmorphism**: UI elements use semi-transparent backgrounds with backdrop filters (`backdrop-blur-xl`) to create a deep, layered interface.
- **Metallic Gradients**: Primary action buttons and high-tier highlights utilize custom gold and silver gradients.
- **Inclusive Premium**: App terminology shifted to be inclusive (e.g., 'wealth management' vs 'private elite wealth') while maintaining a premium feel.
- **Interactive Feedback**: Every user interaction is enhanced with Framer Motion animations, Capacitor Haptics, and an AudioService for tactile and auditory cues.

### Typography & Spacing
- **Headlines**: Use an italicized headline font for a dynamic and prestigious look.
- **Precision Inputs**: Large, clear input fields (16px minimum font size to prevent mobile zoom) for financial figures.
- **Currency Formatting**: Centralized via `useCurrency.ts`. Uses a space as a thousands separator and includes a space between the currency symbol and the amount (e.g., 'Ar 1 000.00').

## 2. Technical Stack & Requirements

### Core Technologies
- **Frontend**: React 19, Vite 6, Tailwind CSS.
- **Runtime**: Capacitor 8 for native Android/iOS integration.
- **Language**: TypeScript 6.0 (utilizing the `using` keyword pattern for resource management).
- **Date Handling**: Temporal API for robust date and time operations.
- **State Management**: Domain-specific Zustand stores with service-level delegation.

### Data Persistence
- **Local-Only**: Data is stored exclusively on the user's device via `@capacitor-community/sqlite`.
- **Jeep-SQLite**: Web-platform support for SQLite during development.
- **Resource Management**: Uses `Symbol.asyncDispose` in database and transaction services for clean memory management.

### Financial Intelligence
- **Health Score**: Dynamic calculation based on liquidity, debt-to-income ratio, and emergency fund status.
- **Cash Flow Forecasting**: Utilizes linear regression (via `simple-statistics`) to project future balances.
- **True Cost Metric**: Converts transaction amounts into 'hours of work' based on the user's `hourlyRate`.

### AI Integration
- **Google Gemini**: Powered by `@google/genai` (specifically `gemini-1.5-flash`) for portfolio analysis and financial auditing.

## 3. Core Terminology & Logic
- **Vault / Reserve**: Refers to a financial account or wallet.
- **Strategic Path**: The user's financial persona (8 total paths).
- **XP & Tiers**: Measuring financial discipline. Levels scale up to 100 (Onyx Legend).
- **Category Progression**: `STANDARD_CATEGORIES` for tiers 1-3; `ELITE_UPGRADES` automatically unlock at Level 4 (Platinum).

## 4. Onboarding Quiz Logic (3+3+1)
The strategic profiling uses a weighted dimension-based algorithm:
- **Behavior (3 questions)**: Weighted at **1x**. Captures immediate habits.
- **Vision (3 questions)**: Weighted at **2x**. Captures long-term alignment.
- **Tie-Breaker (1 question)**: Weighted at **3x**. Settles conflicts between similar paths.

## 5. Mobile Performance & UX
- **Swipe Gestures**: Right-to-open, left-to-close navigation.
- **Back Button**: Custom Android handling (Home first, then exit).
- **Lazy Loading**: All major routes/modals wrapped in `React.Suspense` to prevent "black screen" bugs.
