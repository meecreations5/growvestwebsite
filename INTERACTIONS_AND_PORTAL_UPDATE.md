# GrowVest Interaction and Investor Portal Update

## Implemented

- Added **Investor Portal** access in the desktop header, mobile menu and footer.
- Portal destination: `https://insights.growvest.info/investor-login`
- Replaced the temporary logo treatment with the supplied GrowVest long logo and icon assets.
- Added a one-time long-logo entrance and a restrained hover lift.
- Added a path-based animated GrowVest icon in the homepage hero and route loading state.
- Added a calm rotating hero statement rather than a fast typewriter effect.
- Added line-by-line hero entrance motion.
- Added one-time section reveal motion across website routes.
- Added selected desktop parallax depth in the homepage hero, mission/vision, bucket-list canvas and final CTA.
- Added a compact sticky-header state after scrolling.
- Added reduced-motion support and disabled parallax on mobile.
- Updated website certification wording to reflect an individual NISM-Series-V-A certification without presenting GrowVest as AMFI registered.

## Recommended Browser QA

Test the following before production deployment:

1. Desktop header hover from every menu label into its submenu.
2. Investor Portal link in desktop, mobile and footer navigation.
3. Header compact transition after scrolling 24 pixels.
4. Hero rotating copy for at least four cycles.
5. Scroll reveal and parallax in Chrome, Safari, Firefox and Edge.
6. Mobile navigation and motion at 360px and 390px widths.
7. `prefers-reduced-motion` operating-system setting.
8. Keyboard navigation, Escape closing and visible focus states.

## Important Scope Note

This package updates the GrowVest public website and links it to the existing Investor Portal. The UI inside `insights.growvest.info/investor-login` belongs to a separate application and requires that application's source project for direct animation or login-page changes.
