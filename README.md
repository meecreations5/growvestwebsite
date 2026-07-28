# GrowVest Website

Production-oriented GrowVest marketing website built with **Next.js App Router**, **React 19**, **ES6 JavaScript (`.jsx`)**, **Tailwind CSS v4**, **Firebase Analytics**, **Firebase Admin** and **Brevo**.

## Latest release — v15 Firebase Analytics & Consent Integration

This release adds the dedicated GrowVest public website Firebase app while retaining the v14 server-side form processing:

- Consent-gated Firebase Analytics using the GrowVest website App ID and measurement ID
- Separate Firebase web-app registration inside the shared `growvest-reporttool` project
- Manual App Router page-view tracking without duplicate automatic page views
- Existing CTA, form, scroll-depth and journey events routed to Firebase Analytics
- Analytics collection disabled when consent is declined
- Firestore lead storage before email delivery
- Contact request workflow with reference numbers
- Bucket List summary capture and email delivery
- Newsletter subscriber storage and Brevo list sync
- Firestore-backed rate limiting for serverless deployments
- Communication delivery logs
- Same-site origin checking, payload limits, validation and honeypots
- Environment validation script
- Security-rotation and Firestore-rules guidance
- Patched Next.js 15.5 maintenance release

Read:

- `FUNCTIONAL_INTEGRATION_V14.md`
- `ENVIRONMENT_SETUP_V14.md`
- `SECURITY_ROTATION_REQUIRED_V14.md`
- `FIRESTORE_RULES_SNIPPET_V14.md`
- `SEO_LAUNCH_SETUP_V14.md`
- `LAUNCH_CHECKLIST_V14.md`
- `VALIDATION_REPORT_V14_FUNCTIONAL.md`
- `FIREBASE_ANALYTICS_V15.md`
- `VALIDATION_REPORT_V15.md`

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
