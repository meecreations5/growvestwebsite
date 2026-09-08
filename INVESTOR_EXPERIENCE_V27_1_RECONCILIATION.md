# Investor Experience V27.1 - Final Campaign Experience Reconciliation

## Scope

This release reconciles the original Investor Experience campaign brief, the V27 landing page, the UI/UX review, the Portfolio vs Purpose concern, and the actual GrowVest Investor App screenshots supplied for the campaign.

## Final page narrative

1. Hero: life first, with a subtle real Investor App glimpse.
2. Portfolio vs Purpose: direct transformation from what the investor owns to what they are building towards.
3. Bucket List: interactive signature section with life-led milestone stories.
4. GrowVest Approach: scroll-driven Discover, Define, Design, Track, Celebrate timeline.
5. Investor App: privacy-safe real app screens for Home, Portfolio, Bucket List and Monthly Review.
6. Why GrowVest: Clarity, Purpose and Connection.
7. Trust: approved public company facts plus one published, consent-confirmed investor testimonial when available.
8. Conversion: clarity choice first, contact details second, with WhatsApp as a secondary action.
9. Thank-you: clear next-step journey plus Insights and Bucket List actions.

## UX changes

- Replaced the four-corner Portfolio vs Purpose diagram with a compact Portfolio -> Purpose bridge.
- Rebuilt the Bucket List section as an interactive campaign signature moment.
- Rebuilt the Life Architecture Model as a connected vertical timeline with active scroll state.
- Replaced illustrative app UI with privacy-safe derivatives of the actual supplied Investor App screens.
- App feature selection now visually emphasizes the related screen.
- Lead form dropdown replaced with selectable clarity cards.
- Mobile sticky CTA now appears after roughly 20% scroll and hides when the form or footer is visible.
- Added `bucket_list_section_view` tracking.
- Thank-you page now explains what happens next.

## Privacy handling for app screenshots

Only privacy-safe derivatives are published in `public/campaign/investor-experience/`. Investor name, personal relationship-manager details and financial values visible in the supplied screenshots are blurred before inclusion. The Profile screen is not used publicly.

## Files changed or added

- `src/app/_views/InvestorExperience.jsx`
- `src/app/(website)/investor-experience/page.jsx`
- `src/app/(website)/thank-you/page.jsx`
- `public/campaign/investor-experience/home.jpg`
- `public/campaign/investor-experience/portfolio.jpg`
- `public/campaign/investor-experience/bucket-list.jpg`
- `public/campaign/investor-experience/monthly-review.jpg`
- `INVESTOR_EXPERIENCE_V27_1_RECONCILIATION.md`
- `VALIDATION_REPORT_INVESTOR_EXPERIENCE_V27_1.md`
