# GrowVest v15 - Firebase Analytics & Consent Integration

## Firebase application

The public website uses a dedicated Firebase web-app registration within the existing `growvest-reporttool` Firebase project.

- Project ID: `growvest-reporttool`
- Website App ID: `1:712836553685:web:eea8940bdc609156d1bb5c`
- Analytics measurement ID: `G-EB8M6Z12Q5`

The Report Tool and website may share project services while retaining separate web-app registrations and analytics identities.

## Consent behaviour

Firebase Analytics is not initialized during server rendering or before a visitor accepts analytics. The consent choice is stored under `growvest_cookie_consent` in local storage.

- Accept: initializes Firebase Analytics and enables collection.
- Decline: analytics remains unloaded when it has not been initialized.
- Change from accept to decline: disables collection for the active analytics instance.
- Essential website functions remain available without analytics consent.

## Tracked events

The integration records manual App Router page views and the existing GrowVest conversion events, including:

- `page_view`
- `scroll_depth`
- `primary_cta_click`
- `secondary_cta_click`
- `investor_portal_click`
- Contact request events
- Newsletter events
- Bucket List Builder events
- GrowVest Journey step events

Automatic page-view sending is disabled to prevent duplicate route analytics.

## Main files

- `src/app/lib/firebaseClient.js`
- `src/app/lib/analytics.js`
- `src/app/components/SiteAnalytics.jsx`
- `src/app/components/CookieConsent.jsx`
- `src/app/privacy-policy/page.jsx`

## Production verification

1. Copy `.env.example` to `.env.local`.
2. Add rotated Firebase Admin and Brevo server credentials.
3. Run `npm install` to install the Firebase browser SDK.
4. Run `npm run check:env`, `npm run lint`, and `npm run build`.
5. Open the site in a private browser window.
6. Decline analytics and verify no events appear in Firebase Analytics DebugView.
7. Reopen cookie preferences, accept analytics, and verify `page_view` plus CTA events.
8. Navigate between App Router pages and confirm one page-view event per route.
9. Verify Contact, Newsletter and Bucket List events after successful and failed submissions.
