## 2025-05-15 - [Accessibility Pass: Icon-only Buttons & Focus States]
**Learning:** The application's premium dark aesthetic relied heavily on icon-only buttons which lacked screen reader descriptions (ARIA labels) and visible focus indicators for keyboard navigation. Standard interactive patterns in this codebase frequently omit these accessibility essentials.
**Action:** When adding or modifying interactive elements, explicitly include `aria-label` for all icons and implement `focus-visible:ring-2` to ensure the "premium" feel remains accessible to all users.
