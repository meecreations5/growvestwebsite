# GrowVest Development Notes — Version 2

## Platform conversion

- Migrated the supplied Vite/React SPA to Next.js App Router.
- Converted TypeScript/TSX source to ES6 JavaScript and `.jsx`.
- Replaced React Router with `next/link` and `next/navigation`.
- Retained Tailwind CSS v4 and removed the unused prototype component library.
- Added all 17 page routes, metadata, sitemap, robots, loading, error and 404 states.

## Brand and content implementation

- Added the official positioning: **Your Conscious Wealth Partner**.
- Added the official mission: **Fulfill Your Bucket List.**
- Added the official vision: **Experience the Wealth Every Moment.**
- Rebuilt the About page around the approved long-form brand story.
- Replaced placeholder business information with the supplied legal entity, Mumbai office, phone and email.
- Updated proof points to 70+ clients, 15+ reviews and Pan India coverage.
- Added the supplied GrowVest mark to the header, footer, favicon and metadata.

## Regulatory and trust corrections

- Removed the fictitious SEBI registration number and all SEBI-registered claims.
- Added a clear distinction between individual NISM-Series-V-A certification, AMFI registration and SEBI Investment Adviser registration.
- Replaced invented fee packages with the current ₹0 direct-fee position.
- Added transparent wording for possible distribution, referral, platform or partner compensation.
- Removed invented employee identities, prior-employer claims and qualifications.
- Replaced unverified client success stories with clearly labelled illustrative journeys.
- Added regulatory, market-risk, privacy, terms, conflicts and grievance sections.
- Softened personalised-recommendation, tax, insurance and legal claims across service pages.

## Functionality

- Contact requests now use a server API route with validation, consent, honeypot protection, basic rate limiting and Brevo email delivery.
- Preferred contact slots are generated with actual dates and remain subject to confirmation.
- Newsletter signup now uses a Brevo contact-list API route and no longer displays a false success state.
- Bucket List Builder now supports selectable return assumptions, corrected default values, accessible controls and clearer educational-result labels.
- Primary and secondary CTAs have functional destinations.

## UI, UX and accessibility

- Improved mobile typography and horizontal padding.
- Added responsive contact slot layouts and improved dark-section contrast.
- Added a skip link, focus-visible styling and reduced-motion support.
- Added accessible form labels, button names, accordion states and keyboard interaction for key explorers.
- Improved mobile navigation with body-scroll locking, Escape-key handling and route-change closing.
- Simplified the navigation into Services, Who We Help, Goals & Tools and Learn.

## SEO, resilience and security

- Added route-specific metadata, Open Graph/Twitter metadata and organisation structured data.
- Added environment-aware robots handling and a complete sitemap.
- Added App Router error and loading states.
- Added common security headers for content-type sniffing, framing, referrer behaviour and browser permissions.

## Validation performed

- All JavaScript and JSX files passed a TypeScript parser check using `allowJs`.
- All internal relative imports were checked for missing local modules.
- Legacy React Router imports and Vite entry references were removed.
- Old fictitious contact details, fee plans, registration numbers and team claims were searched and removed.

A full `next build` still requires dependency installation in an environment with package-registry access.
