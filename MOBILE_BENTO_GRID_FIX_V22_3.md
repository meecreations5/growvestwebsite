# GrowVest v22.3 - Mobile Wealth Guidance Grid Fix

## Issue

On phone-width screens, the Wealth Guidance bento grid could create an implicit second CSS Grid column. The featured card always used `col-span-2` even when the grid had only one explicit mobile column. This compressed later service cards into a very narrow column and caused titles such as "Wealth Diversification Review" to render one letter per line.

## Fix

Updated both public implementations:

- `src/app/_views/Home.jsx`
- `src/app/_views/WealthGuidance.jsx`

Changes:

- Featured bento card now uses one column/row on mobile.
- Two-column/two-row span starts only at the `sm` breakpoint.
- Standard service cards use `min-w-0` so they cannot force or inherit invalid grid widths.
- Service headings use normal word wrapping.

## Responsive result

- Mobile below 640px: one full-width card per row.
- Tablet from 640px: two-column bento layout.
- Desktop from 1024px: four-column bento layout.
