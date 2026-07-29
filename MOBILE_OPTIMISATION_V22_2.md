# GrowVest v22.2 — Mobile Optimisation

This release improves the GrowVest public website, GrowVest Guide, floating actions, forms, footer and core Admin shell for mobile phones and tablets.

## Public website improvements

- Added safe-area support for iPhone notches and bottom home indicators.
- Added `viewport-fit=cover` through the Next.js viewport configuration.
- Prevented horizontal page overflow caused by wide decorative or content elements.
- Standardised mobile page gutters across older static page sections.
- Reduced oversized section spacing, card padding and large gaps on narrow screens.
- Made primary and secondary CTA buttons full-width on phones.
- Increased form-control height and uses a 16px input font on mobile to prevent Safari zoom.
- Improved mobile comparison sections by stacking both columns below 640px.
- Improved Goal Library statistics by stacking them on phones.
- Improved selected card grids so they use one column on phones and expand progressively.
- Added horizontally scrollable behaviour for genuine data tables.

## Header and navigation

- Uses a consistent 64px mobile header and 60px compact header.
- Increased menu-button touch target to at least 44px.
- Uses `100dvh` for the open mobile menu so browser chrome changes do not cut off links.
- Adds bottom safe-area padding and momentum scrolling to the mobile menu.
- Automatically closes the mobile menu when the viewport returns to desktop size.
- Locks background scrolling while the mobile menu is open.

## GrowVest Guide

- The Guide now opens as a true full-screen mobile dialog.
- Desktop and tablet retain the floating 410px panel.
- Added `role=dialog`, `aria-modal`, Escape-to-close and initial close-button focus.
- Locks page scrolling while the Guide is open.
- Hides the mobile sticky action bar while the Guide is open.
- Uses safe-area padding in the Guide header and composer.
- Uses mobile-sized form controls and prevents iOS input zoom.
- Improves quick-prompt wrapping and WhatsApp handoff field sizing.

## Floating actions and footer

- Improved sticky action-bar width, bottom spacing and small-screen layout.
- Prevented long CTA labels from breaking the action-bar layout.
- Added additional mobile footer space so the Guide launcher does not cover legal links.
- Improved footer columns to use two columns on tablets and one column on phones.

## Admin mobile improvements

- Added safe-area support to the Admin header.
- Reduced Admin page gutters on small phones.
- Made the Admin drawer width responsive instead of fixed.
- Prevented Admin workspace horizontal page overflow.
- Improved mobile form-control sizes and horizontal table scrolling.

## Files updated

- `src/app/layout.jsx`
- `src/app/(website)/layout.jsx`
- `src/app/globals.css`
- `src/app/components/SiteHeader.jsx`
- `src/app/components/SiteFooter.jsx`
- `src/app/components/MobileActionBar.jsx`
- `src/app/components/GrowVestGuide.jsx`
- `src/app/admin/_components/AdminShell.jsx`
- Selected public page views under `src/app/_views/`

## Recommended mobile acceptance widths

Test at 320px, 360px, 390px, 430px, 768px and 1024px. Also test iPhone Safari, Android Chrome and mobile landscape orientation.
