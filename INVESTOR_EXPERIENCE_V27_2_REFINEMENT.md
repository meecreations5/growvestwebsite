# Investor Experience V27.2 - UI/UX Refinement

## Scope
This refinement addresses the observations after V27.1 deployment review.

## Changes

### Hero
- Removed the curved white transition at the bottom of the hero.
- Hero now ends with a straight edge into the next section.

### Actual Investor App screenshots
- Replaced privacy-sanitised campaign images with the exact supplied Investor App screenshots for Home, Portfolio, Bucket List and Monthly Review.
- No blur or masking is applied to the supplied screenshots.
- Profile screenshot remains unused in the public campaign composition.

### Life Architecture Model
- Replaced the IntersectionObserver-only step logic with viewport-position based scroll tracking for more stable active-stage highlighting.
- Current stage is visually distinct from completed stages.
- Progress line now advances from the first stage to the active stage instead of starting partially filled.
- Added the stage icon to the top step selector and each stage heading.
- Completed steps receive a subtle completed state while the current stage retains the primary highlight.
- Clicking a stage updates the active state immediately and smoothly scrolls it into position.

### GrowVest Investor App showcase
- Reworked the showcase so each feature segment presents multiple real app screens rather than a single generic screen state.
- Investments: Portfolio + Home.
- Bucket List & Goals: Bucket List + Home.
- Reports & Reviews: Monthly Review + Home.
- Connected Experience: Home + Monthly Review.
- Desktop and mobile both use paired real-screen compositions.
- Updated supporting note to clarify these are actual GrowVest Investor App views available to existing investors.

## Existing campaign behaviour retained
- Start a Conversation conversion flow.
- WhatsApp action.
- UTM persistence.
- Existing analytics events.
- SEO metadata and schema.
- Existing GrowVest header, footer and design system.
