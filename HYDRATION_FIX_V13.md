# GrowVest v13 - Hydration Stability Fix

## Issue
The root `SiteMotionEffects` component was adding reveal and button classes directly to streamed App Router markup. During client-side navigation, this could happen before a route segment completed hydration, producing a React hydration mismatch.

## Fix
- Removed runtime `className` mutation for all page sections.
- Replaced JavaScript section reveal classes with a CSS-only scroll reveal using `animation-timeline: view()` as progressive enhancement.
- Removed eager `gv-mouse-button` class injection.
- Applied button-effect base styles through stable CSS selectors already present in server-rendered markup.
- Kept pointer spotlight state changes event-driven only.
- Delayed parallax calculations until an actual scroll or resize event.
- Added cleanup for temporary pointer and parallax CSS variables.

## Result
Server-rendered and client-rendered `className` attributes remain identical during hydration, including App Router transitions between pages such as `/about`.
