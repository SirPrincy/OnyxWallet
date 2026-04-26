# Design & Technical Specifications

This document outlines the core architectural and aesthetic principles of Onyx Wallet.

## 1. UX Design Philosophy
Onyx Wallet is designed to evoke a sense of exclusivity, security, and premium wealth management.

### Aesthetic Pillars
- **Glassmorphism**: UI elements use semi-transparent backgrounds with backdrop filters (`backdrop-blur-xl`) to create a deep, layered interface that feels modern and high-end.
- **Metallic Gradients**: Primary action buttons and high-tier highlights utilize custom gold and silver gradients (`metallic-gradient`) to represent financial growth and luxury.
- **Interactive Feedback**: Every user interaction is enhanced with Framer Motion animations to provide a tactile, haptic-like experience even on web and mobile.

### Typography & Spacing
- **Headlines**: Use an italicized headline font for a dynamic and prestigious look.
- **Precision Inputs**: Large, clear input fields to ensure visibility and ease of use, especially for financial figures on mobile devices.

## 2. Technical Stack & Requirements

### Data Persistence
- **Local-Only**: Data is stored exclusively on the user's device. No cloud sync is active by default to ensure absolute privacy.
- **Capacitor SQLite**: Uses `@capacitor-community/sqlite` for native-grade performance and reliability on Android and iOS.
- **Jeep-SQLite**: Provides web-platform support for SQLite during development and testing.

### Mobile Permissions
- **Storage Access**: Required to read/write the local SQLite database and store export files.
- **Biometric Authentication**: Can be requested to allow FaceID or Fingerprint access for secure and fast vault entry.

## 3. Core Terminology
To maintain the application's unique identity, specific terms are used throughout the UI and code:
- **Vault / Reserve**: Refers to a financial account or wallet.
- **Strategic Path**: Refers to the user's financial persona (e.g., Investor, Frugal).
- **XP & Tiers**: Used to measure financial discipline and literacy rather than just wealth.

## 4. Onboarding Quiz Logic (3+3+1)
The strategic profiling uses a weighted dimension-based algorithm:
- **Behavior (3 questions)**: Weighted at **1x**. Captures immediate financial habits.
- **Vision (3 questions)**: Weighted at **2x**. Captures long-term alignment and purpose.
- **Tie-Breaker (1 question)**: Weighted at **3x**. Used to settle conflicts between similar paths (e.g., Catalyst vs. Investor).

The path with the highest total weighted score is recommended to the user.

## 5. Development Standards
- **Strict Typing**: All financial operations must use the centralized `Currency` types and formatting hooks.
- **Component Isolation**: Use domain-specific Zustand stores (e.g., `useWalletStore`) to keep business logic separate from UI components.
- **Performance**: Consolidate calculations and use memoization to ensure smooth 60fps animations during heavy data processing.
