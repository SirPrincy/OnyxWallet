# Debt Management (Liabilities) Documentation

This document details the functioning of the debt management system in Onyx Wallet, from both user experience (UX) and technical perspectives.

## 1. User Experience (UX)

Users access debt management via the **Liabilities** tab in the navigation menu.

### Step 1: Adding a Debt
Users can register a new debt by clicking the **"+"** (Add Liability) button. The following information is required:
- **Name/Purpose**: (e.g., Mortgage, Student Loan)
- **Type**: Mortgage, Personal Loan, Student Loan, Credit Card, Leasing, Other.
- **Provider**: (e.g., Chase Bank, HSBC)
- **Total Amount**: The initial borrowed principal.
- **Remaining Amount**: The current balance owed.
- **Monthly Payment**: The amount paid each month.
- **Interest Rate**: The annual percentage rate (APR).

### Step 2: Portfolio Visualization
The screen displays key financial health metrics:
- **Total Indebtedness**: Sum of all remaining amounts.
- **Debt-to-Income Ratio (DTI)**: Calculated based on the profile's monthly salary.
- **Total Capital Repaid**: The portion of the principal already paid off.
- **Total Interest Paid**: Cumulative interest paid across all liabilities.
- **Monthly Service**: Sum of all monthly payments.

Each debt is shown as a card with a visual progress bar indicating how much has been repaid.

### Step 3: Repayment Strategy
The application currently implements **"The Snowball"** strategy.
- It automatically identifies the debt with the **smallest remaining balance**.
- It encourages users to pay off this debt first to build psychological momentum.
- A **"Boost Payment"** button allows for making extra payments toward this specific target.

### Step 4: Payment and Tracking
When a user makes a payment (via "Boost Payment" or the debt card):
1. They enter the amount and select the source **Wallet**.
2. The system automatically calculates the **Interest Portion** of the payment based on the current balance and APR.
3. An `expense` transaction is created with the category `Debt Repayment`.
4. The debt's `remainingAmount` is reduced by the capital portion (Total - Interest), and `totalInterestPaid` is updated.

---

## 2. Technical Architecture

### Database Schema (SQLite)
The `liabilities` table is defined as follows:
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
  totalInterestPaid REAL DEFAULT 0,
  profileId TEXT
);
```

### State Management (Zustand)
The `useFinancialStore.ts` handles business logic:
- `liabilities`: Reactive list of debts.
- `addLiability()`: Calls `financialService` and schedules local notifications.
- `payLiability()`: Orchestrates the payment. It creates a transaction via `transactionService`, which triggers an atomic update of the liability balance.

### Services
- **`financial.service.ts`**: Handles raw CRUD operations on the `liabilities` table.
- **`transaction.service.ts`**: Manages the impact of transactions. When a transaction has a `liabilityId`, it executes an `UPDATE` on the `liabilities` table to adjust the `remainingAmount` and `totalInterestPaid` in a single transaction.
- **`notification.service.ts`**: Uses Capacitor Local Notifications to schedule reminders 24 hours before and on the day of the `dueDate`.

---

## 3. Roadmap (Future Enhancements)

Planned features to enrich the Debt module:

1.  **"Avalanche" Strategy**: Add an option to target the debt with the **highest interest rate** (mathematically optimal for saving money).
2.  **Credit Simulator**: Visualize the impact of increasing monthly payments on the payoff date and total interest saved.
3.  **Extinction Chart**: A temporal visualization of total debt decreasing to zero over time.
4.  **Amortization Tables**: Generate a full schedule of future payments showing interest vs. principal breakdown.
5.  **Debt Consolidation Insights**: AI-powered suggestions for consolidating high-interest debts into lower-interest options.
