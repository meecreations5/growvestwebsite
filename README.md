# GrowVest Website

Production-oriented GrowVest marketing website built with **Next.js App Router**, **React 19**, **ES6 JavaScript (`.jsx`)**, **Tailwind CSS v4**, **Firebase Analytics**, **Firebase Admin** and **Brevo**.

## Latest release — v19 Team Hierarchy and Social Media Management

This release extends the protected Website Admin inside the same GrowVest Next.js project:

- Dynamic team hierarchy at `/admin/team`
- Verified team profiles, departments, hierarchy levels and public visibility
- Team photographs through the existing Firebase Storage Media Library
- Dynamic public team section on `/about`
- Social account management at `/admin/social-media`
- Independent placement controls for the footer, About page, Contact page and mobile navigation
- Organization `sameAs` structured data from published social accounts
- Server-only Firestore access, role permissions, audit logs and cache invalidation
- Existing Insights CMS, Microsoft Admin login, Firebase Analytics, lead processing and Brevo features retained

Read:

- `TEAM_SOCIAL_MANAGEMENT_V19.md`
- `FIRESTORE_RULES_TEAM_SOCIAL_V19.md`
- `VALIDATION_REPORT_V19.md`
- `INSIGHTS_CMS_PRODUCTION_V18.md`
- `FUNCTIONAL_INTEGRATION_V14.md`

## Brand foundation

- **Positioning:** Your Conscious Wealth Partner
- **Mission:** Fulfill Your Bucket List.
- **Vision:** Experience the Wealth Every Moment.
- **Legal entity:** Growvest Advisors PVT LTD
- **Current status:** a team member holds a valid NISM-Series-V-A Mutual Fund Distributors Certification; GrowVest is not registered with SEBI as an Investment Adviser
- **Coverage:** Pan India
- **Current direct GrowVest advisory fee:** no direct advisory fee currently charged

Central business details are stored in `src/app/lib/brand.js`. Central search metadata is stored in `src/app/lib/seo.js`.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run check:env
npm run dev
```

Open `http://localhost:3000`.

## Production verification

```bash
npm run check:env
npm run lint
npm run build
npm start
```

Node.js 22 or later is recommended for this release.

Bootstrap the first Website Admin after creating the Firebase Authentication user:

```bash
npm run bootstrap:website-admin -- --email connect@growvest.info --role super_admin
```

## Indexing safety

Indexing is disabled unless explicitly enabled:

```env
NEXT_PUBLIC_ALLOW_INDEXING=true
```

Keep it `false` for local, preview, staging and pre-launch deployments. Changing it requires a rebuild and redeploy.

## Main environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical public website URL |
| `NEXT_PUBLIC_INVESTOR_PORTAL_URL` | Secure Investor Portal login URL |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Explicit production indexing switch |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public GrowVest website Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Shared Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Shared Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Dedicated GrowVest website Firebase App ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin service-account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Rotated server-only private key |
| `FIREBASE_ADMIN_STORAGE_BUCKET` | Firebase Storage bucket |
| `FORM_RATE_LIMIT_SALT` | Stable random salt used for request hashing |
| `ALLOWED_FORM_ORIGINS` | Optional comma-separated additional form origins |
| `BREVO_API_KEY` | Rotated Brevo server API key |
| `BREVO_DEFAULT_SENDER_EMAIL` | Verified Brevo sender |
| `BREVO_REPLY_TO_EMAIL` | Reply-to address |
| `GROWVEST_NOTIFICATION_EMAIL` | Internal enquiry recipient |
| `BREVO_NEWSLETTER_LIST_ID` | Numeric Brevo newsletter list ID |

## Website Admin endpoints

- `GET, POST /api/admin/session`
- `DELETE /api/admin/session`
- `GET, POST /api/admin/insights`
- `GET, PATCH, DELETE /api/admin/insights/[id]`
- `GET, POST /api/admin/taxonomy/[type]`
- `POST /api/admin/seed`
- `GET, POST /api/admin/team`
- `GET, PATCH, DELETE /api/admin/team/[id]`
- `GET, POST /api/admin/social-media`
- `GET, PATCH, DELETE /api/admin/social-media/[id]`

## Functional endpoints

- `POST /api/contact`
- `POST /api/bucket-list`
- `POST /api/newsletter`
- `GET /api/health`

## SEO and launch endpoints

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- `/opengraph-image.png`
- `/twitter-image.png`
- `/privacy-policy`
- `/terms-of-use`

## Important launch checks

1. Rotate all server credentials that have been shared outside the deployment environment.
2. Merge the provided collection-deny rules into the existing Firestore rules without replacing Investor Portal rules.
3. Configure the Brevo newsletter list ID and verify the sender domain.
4. Test Contact, Bucket List and Newsletter flows end to end.
5. Review Privacy Policy, Terms, compensation and service statements with qualified legal/compliance professionals.
6. Complete production build, browser, mobile, accessibility and Lighthouse testing.
7. Enable indexing only after final approval.

## Route-group migration note (v16.1)

Public pages now live inside `src/app/(website)`. Extract this release into a clean folder rather than merging it over an older version. If an older project was already merged and Next.js reports two pages resolving to the same path, run:

```bash
npm run cleanup:legacy-routes
```

Then delete `.next` and rebuild. Use `npm run check:routes` at any time to detect duplicate App Router URL paths.

## Website Content Management — v20

GrowVest v20 adds direct Firestore-backed content management at `/admin/website`.

Admin routes:

- `/admin/website`
- `/admin/website/home`
- `/admin/website/about`
- `/admin/website/settings`
- `/admin/website/navigation`
- `/admin/faqs`
- `/admin/goal-library`

Use **Push content to database** on `/admin/website` to import the approved GrowVest Homepage, About content, settings, navigation, FAQs and Goal Library into the shared Firestore database. Public pages read published records and use safe approved fallbacks when managed content is missing or Firestore is temporarily unavailable.

New server endpoints:

- `GET, PATCH /api/admin/website/pages/[key]`
- `GET, PATCH /api/admin/website/settings`
- `GET, PATCH /api/admin/website/navigation`
- `POST /api/admin/website/seed`
- `GET, POST /api/admin/faqs`
- `GET, PATCH, DELETE /api/admin/faqs/[id]`
- `GET, POST /api/admin/goal-library`
- `GET, PATCH, DELETE /api/admin/goal-library/[id]`

Merge `FIRESTORE_RULES_WEBSITE_CONTENT_V20.md` into the existing Firestore rules before production deployment. See `WEBSITE_CONTENT_MANAGEMENT_V20.md` for the full workflow and acceptance checklist.

## Approved Content Import — v20.1

The Website Content dashboard now imports the approved static website content together with the existing GrowVest Insights and Blog content into the shared Firestore database.

Open `/admin/website` to preview the import, push only missing records, or replace approved defaults with Super Admin confirmation. The import includes all 12 original static Insight previews, 6 categories, 19 tags and the GrowVest Editorial Team author. Existing Admin-edited records are preserved during the normal missing-content import.

See `APPROVED_CONTENT_IMPORT_V20_1.md` for the migration behaviour and safeguards.

## v21 — Website Enquiries & Lead Management

The Website Admin now includes a unified lead workspace at `/admin/enquiries` for Contact, Discovery, Bucket List, Newsletter, WhatsApp/manual leads, assignment, follow-ups, duplicate checks, internal notes, Brevo email, WhatsApp handoff, activity history, and controlled investor conversion requests.

Merge `FIRESTORE_RULES_ENQUIRIES_V21.md` into the existing Firestore rules before production testing. See `ENQUIRIES_LEAD_MANAGEMENT_V21.md` for the data model and acceptance flow.

The protected `/api/cron/enquiry-followups` route sends an hourly digest for scheduled follow-ups and overdue first responses. It uses the existing `CRON_SECRET` and writes deduplication records to `leadNotificationRuns`.

## v22 — GrowVest Guide & WhatsApp

GrowVest v22 adds a controlled public website assistant and WhatsApp handoff. The Guide searches only published GrowVest answers, FAQs, Goal Library records and Insights; captures unanswered questions; applies a personalised-advice boundary; and creates compatible Website Lead records when a visitor continues to WhatsApp.

Admin routes:

- `/admin/growvest-guide`
- `/admin/growvest-guide/knowledge`
- `/admin/growvest-guide/conversations`
- `/admin/growvest-guide/settings`

Public endpoints:

- `POST /api/growvest-guide/chat`
- `POST /api/growvest-guide/whatsapp`

Merge `FIRESTORE_RULES_GROWVEST_GUIDE_V22.md` and deploy the updated `firestore.indexes.json` before production testing. See `GROWVEST_GUIDE_WHATSAPP_V22.md` for the complete workflow, data model, guardrails and acceptance checklist.

## v22.1 - GrowVest Guide launcher correction

The floating Guide launcher now uses dedicated alignment styles, safe-area spacing, footer visibility detection, a high-contrast footer state, and a z-index above the mobile action bar. See `GROWVEST_GUIDE_LAUNCHER_FIX_V22_1.md`.

## v22.3 Mobile Wealth Guidance Grid Fix

Corrected the mobile bento grid on the Homepage and Wealth Guidance page. Featured cards no longer span two columns below the `sm` breakpoint, preventing service cards and headings from collapsing into a one-character-wide column.

## v22.4 — Investor Testimonials

GrowVest v22.4 adds a consent-controlled Investor Experiences module at `/admin/testimonials`. Website Admins can create, review, publish, place and archive genuine investor testimonials with optional anonymised names, initials, approved photographs, journey labels and internal consent references.

Published records can appear on the Homepage, Insights page and About GrowVest page. The Insights section is positioned between Featured Insight and Explore the Library. The public section stays hidden until at least one genuine, consented testimonial is published; this release does not seed fictional investor feedback.

Merge `FIRESTORE_RULES_INVESTOR_TESTIMONIALS_V22_4.md` before production testing. See `INVESTOR_TESTIMONIALS_V22_4.md` for the complete workflow and safeguards.

## v22.5 — Investor Testimonial Design Update

The public Investor Experiences component now uses a lighter premium editorial layout, improved mobile card scrolling, clearer identity hierarchy and a refined verified-consent treatment. See `TESTIMONIAL_DESIGN_UPDATE_V22_5.md`.

## v22.7 — Investor Experience UX & Navigation Editor

- Redesigned the dedicated Investor Experiences page and website testimonial preview.
- Long testimonials no longer create narrow, over-tall cards.
- Featured testimonials are not duplicated in the gallery.
- Replaced the pipe-separated navigation editor with visual nested fields.
- Added a one-click Investor Experiences header/footer navigation action.
- Added backward compatibility for navigation links stored using `href`.

See `INVESTOR_EXPERIENCE_UX_NAVIGATION_V22_7.md` and `VALIDATION_REPORT_V22_7.md`.


## v22.8 — Simple Investor Experience Design

Investor testimonial cards and the dedicated Investor Experiences page now use the same simple card language as the rest of the GrowVest website. See `TESTIMONIAL_SIMPLE_DESIGN_V22_8.md`.
