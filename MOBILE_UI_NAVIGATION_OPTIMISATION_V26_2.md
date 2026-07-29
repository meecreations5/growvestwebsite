# GrowVest v26.2 — Mobile UI and Navigation Optimisation

## Release objective

v26.2 turns the public GrowVest website into a clearer, app-like phone experience without changing public routes, Firestore content structures, permissions, lead flows, the Investor Portal transition, the GrowVest Guide logic or desktop navigation.

The release is deliberately scoped to navigation and fixed-surface behaviour on small screens. The v26.1 performance and cache foundation remains intact.

## Responsive navigation model

| Viewport | Navigation behaviour |
|---|---|
| Phone: below 768px | Persistent five-destination bottom navigation and an above-navigation **More** sheet |
| Tablet: 768px to 1279px | Existing header menu and expandable navigation retained |
| Desktop: 1280px and above | Existing desktop header, dropdowns and CTAs retained |

This breakpoint separation avoids serving two competing menus on phones while preserving the established tablet and desktop interaction models.

## Phone navigation destinations

The persistent phone navigation contains:

1. **Home** — public Homepage
2. **Goals** — preferred `/your-goals` route or the first published item in the CMS-managed goals group
3. **Start** — the CMS-managed primary header CTA, with `/contact` as the safe fallback
4. **Insights** — preferred `/insights` route or the first published item in the CMS-managed insights group
5. **More** — opens the complete navigation sheet above the persistent bar

The navigation is route-aware. Active destinations use a visible selected treatment and appropriate accessibility state. Routes outside Home, Goals, Start and Insights select **More**, helping visitors understand where they are within the wider site structure.

## CMS-aware navigation

`MobileSiteNavigation.jsx` consumes the same published website navigation, settings and social-link data as the existing header and footer.

It supports:

- Firestore-managed navigation groups and display order
- `path` and legacy `href` child-link formats
- managed primary CTA label and destination
- managed Investor Portal label and destination
- managed social-link visibility and mobile-menu placement
- approved static `NAV_GROUPS` and company fallbacks when managed content is unavailable

No duplicate navigation content source was introduced.

## More navigation sheet

The **More** sheet opens above the fixed bottom navigation rather than covering it. It provides:

- direct Investor Portal access
- direct primary CTA access
- expandable published navigation groups
- active child-route styling
- approved social links
- independently scrollable content on short screens
- one-column quick actions on compact phones
- reduced-height navigation and hidden labels in phone landscape mode

The sheet closes after route selection, overlay selection, Escape, a change to tablet width, or opening the GrowVest Guide.

## Accessibility and interaction safeguards

The mobile navigation includes:

- named primary navigation and dialog landmarks
- `aria-current`, `aria-expanded`, `aria-controls` and selected-state support
- at least 44px interactive target height
- focus movement to the sheet close control on opening
- focus restoration to **More** when closing with Escape, overlay or the close control
- background `inert` handling while the sheet is open
- body-scroll locking with previous overflow restoration
- reduced-motion handling
- route-change cleanup
- no hidden phone navigation remaining keyboard-interactive while the GrowVest Guide is open

The dialog is not marked `aria-modal` because the persistent bottom navigation intentionally remains available outside the sheet.

## Fixed-surface coordination

The phone layout now uses one shared safe-area calculation for navigation height and bottom spacing.

This coordinates:

- persistent bottom navigation
- final-page/footer clearance
- anchor and keyboard scroll padding
- GrowVest Guide launcher position
- Guide-open navigation hiding
- cookie-consent position
- cookie consent yielding while the full-screen phone Guide is open
- cookie and Guide hiding while the More sheet is open
- iOS bottom safe area and left/right safe areas
- `100vh` fallback where dynamic viewport units are unsupported

The retired delayed floating mobile action bar and its unused CSS have been removed so they no longer compete with the persistent navigation or Guide launcher. Existing mobile footer clearance keeps the final footer controls above the persistent bar without adding a blank strip after the footer.

## Header behaviour

On phones, the header now keeps a direct 44px Investor Portal shortcut and removes the duplicate hamburger menu. Complete site navigation is available through the persistent bottom bar.

On tablets, the existing hamburger and expandable menu remain available. Desktop header behaviour is unchanged.

## Analytics continuity

Existing analytics attributes are retained for:

- Investor Portal access from the phone header
- Investor Portal access from the More sheet
- primary CTA access from the More sheet

The central Start destination uses the same managed CTA destination and existing route analytics can continue to identify the destination page.

## Files central to this release

- `src/app/components/MobileSiteNavigation.jsx`
- `src/app/components/SiteHeader.jsx`
- `src/app/(website)/layout.jsx`
- `src/app/components/CookieConsent.jsx`
- `src/app/globals.css`
- `scripts/check-mobile-ui-basics.mjs`

The legacy `src/app/components/MobileActionBar.jsx` component has been removed.

## Acceptance test

Test the deployed production or preview URL at 320px, 360px, 390px, 430px, two phone-landscape sizes, 768px, tablet and desktop widths.

1. Confirm the five phone destinations stay visible while scrolling.
2. Confirm active states for Home, a goal route, Contact/primary CTA, Insights and a secondary route.
3. Confirm **More** opens above—not over—the persistent navigation.
4. Confirm every published navigation group and child link appears in the sheet.
5. Confirm Escape, overlay, close control and route selection close the sheet.
6. Confirm keyboard focus enters the sheet and returns to **More**.
7. Confirm the page behind the sheet cannot scroll or receive keyboard focus.
8. Confirm the Guide and More sheet never remain open together.
9. Confirm cookie consent and the Guide launcher never overlap the bottom navigation.
10. Confirm iPhone safe-area spacing, Android navigation spacing and phone landscape mode.
11. Confirm the tablet menu remains available at 768px and desktop navigation remains unchanged at 1280px.
12. Confirm there is no horizontal overflow, clipped CTA text or content hidden behind the fixed navigation.

## Verification commands

```bash
npm install
npm run check:source
npm run lint
npm run build
```

Focused mobile baseline check:

```bash
npm run check:mobile
```
