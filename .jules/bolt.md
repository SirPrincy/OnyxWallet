## 2025-05-15 - [O(N) Transaction Processing Consolidation]
**Learning:** Multiple time-bound metrics (growth %, spending trend, monthly stats) were being calculated using separate filter/reduce chains, leading to O(N * K) complexity. By consolidating into a single pass with a lookback limit, performance improves significantly as the transaction history grows.
**Action:** Always check if multiple `useMemo` hooks or derived state calculations can share a single iteration over large data sets.

## 2025-05-15 - [Store Selector Optimization]
**Learning:** Using a getter in a Zustand store for a value like `totalLiquidity` meant the calculation ran every time the store was accessed, even if the result was identical.
**Action:** For values derived only from other store state (like `wallets`), pre-calculate and store the value as a primitive to ensure selector stability and avoid redundant compute.
