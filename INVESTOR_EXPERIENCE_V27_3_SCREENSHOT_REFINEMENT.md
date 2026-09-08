# Investor Experience V27.3 - Screenshot Presentation Refinement

## Objective
Refine the GrowVest Investor App showcase so real app screens remain clear, compact, visually balanced and free of mobile status-bar clutter.

## Changes
- Applied a consistent phone viewport height to the primary and connected app screens.
- Reduced the overall showcase height so screenshots no longer dominate the section vertically.
- Cropped only the visible device status-bar area at render time for each app screen.
- Preserved the original screenshots and their content; no blur, redaction or image regeneration was applied.
- Served the supplied screenshot files without Next.js image recompression in this showcase to preserve small UI text and screen clarity.
- Kept the existing Investments, Bucket List & Goals, Reports & Reviews, and Connected Experience interactions intact.
- Maintained the existing GrowVest dark showcase composition and responsive behavior.

## Screen-specific top crop
- Home: 4.25%
- Portfolio: 2.75%
- Bucket List: 4.10%
- Monthly Review: 2.70%

These values visually remove the time, battery, signal and network status areas while retaining the actual GrowVest app header.
