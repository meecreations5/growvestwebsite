# GrowVest v14 — Production Hardening & Functional Integration

## Implemented

### Firebase Admin server integration

The public website now uses Firebase Admin only inside Node.js App Router API routes. No browser component writes directly to Firestore.

New server modules:

- `src/app/lib/server/firebaseAdmin.js`
- `src/app/lib/server/requestSecurity.js`
- `src/app/lib/server/brevo.js`
- `src/app/lib/server/communications.js`

### Contact workflow

`POST /api/contact` now:

1. Verifies same-site or configured origin.
2. Enforces a request-size limit.
3. Validates and sanitises submitted data.
4. Uses a Firestore transaction-backed rate limiter.
5. Creates `websiteLeads/{requestId}` before sending email.
6. Sends the GrowVest team notification through Brevo.
7. Sends the visitor acknowledgement through Brevo.
8. Writes provider outcomes to `communicationLogs`.
9. Updates delivery states on the lead document.
10. Keeps the lead even when email delivery fails.

### Bucket List conversion workflow

The Bucket List Builder now includes **Email My Goal Summary**.

`POST /api/bucket-list` stores:

- Contact details and consent
- Selected goals
- Goal amounts and timelines
- Assumed annual return
- Estimated monthly investment
- Total value of selected goals
- Brevo delivery states

The API creates `bucketListLeads/{requestId}`, sends an educational summary, notifies GrowVest and records communication logs.

### Newsletter workflow

`POST /api/newsletter` now:

1. Validates email and consent.
2. Uses Firestore-backed rate limiting.
3. Creates or updates `newsletterSubscribers/{subscriberId}`.
4. Syncs the address to the configured Brevo list.
5. Records successful and failed provider syncs.

A numeric `BREVO_NEWSLETTER_LIST_ID` is required.

### Security hardening

- Firebase Admin and Brevo remain server-only.
- Form origins are checked.
- Honeypot fields remain active.
- Payload size limits are enforced.
- Raw IP addresses are not stored; a salted hash is stored instead.
- Firestore rate limits work across serverless instances.
- Sensitive Firestore collections are intended to deny all browser access.
- Real credentials are excluded from the project and ZIP.
- Node.js 22 is configured for the Firebase Admin runtime.
- `firebase-admin` is externalised from the Next.js server bundle.

## Firestore collections

- `websiteLeads`
- `bucketListLeads`
- `newsletterSubscribers`
- `communicationLogs`
- `formRateLimits`

## Required deployment steps

1. Rotate every exposed server credential.
2. Add the rotated values to Vercel environment variables.
3. Merge `FIRESTORE_RULES_SNIPPET_V14.md` into the existing report-tool rules.
4. Enable TTL on `formRateLimits.expiresAt`.
5. Configure `BREVO_NEWSLETTER_LIST_ID`.
6. Run `npm run check:env` in a production-like environment.
7. Run `npm run verify`.
8. Test all three live submission flows.
