# GrowVest v23 — Final Production Readiness

GrowVest v23 adds the operational controls required to evaluate a release before it is promoted to `growvest.info`. It does not automatically declare a deployment safe: the Admin readiness dashboard, local validation commands, Preview smoke test and manual launch approvals must all be completed.

## New Admin workspace

Open:

```text
/admin/system-readiness
```

Only a `super_admin` receives the `system.read` permission by default.

The dashboard checks:

- canonical URL and indexing state
- Firebase browser and Admin configuration
- Firebase project consistency
- Firestore, Firebase Auth and Storage runtime access
- rate-limit and cron secret strength
- Brevo sender and notification configuration
- Microsoft tenant configuration
- newsletter list mapping
- optional observability delivery
- release version, environment and commit identity

No private key, API key or secret value is returned to the browser.

## Operational endpoints

```text
GET /api/health
GET /api/health/live
GET /api/health/ready
GET /api/admin/system/readiness
```

- `live` proves that the Next.js service is responding.
- `ready` checks Firebase runtime dependencies and returns HTTP `503` when a critical dependency is blocked.
- the protected Admin endpoint returns the complete check list without exposing secret values.

## Security hardening

`next.config.mjs` now includes:

- Content Security Policy
- HSTS in production
- clickjacking protection
- MIME-sniffing protection
- strict referrer policy
- restricted browser capabilities
- OAuth-compatible opener policy
- no-store and no-index headers for Admin and API routes
- immutable caching for application icons

A request correlation ID and release header are added through `src/middleware.js`.

## Monitoring and diagnostics

`src/instrumentation.js` records structured server errors with:

- release
- environment
- request ID
- route and request method
- error digest
- safe error message

Logs remain available in the deployment platform. An optional HTTPS webhook can be configured through:

```env
GROWVEST_OBSERVABILITY_WEBHOOK_URL=
GROWVEST_OBSERVABILITY_TOKEN=
```

The public website also records consent-controlled Web Vitals through the existing Firebase Analytics integration.

## Release commands

Source-only validation:

```bash
npm run check:source
```

Full production gate:

```bash
npm run readiness
```

Preview or production smoke test:

```bash
npm run smoke -- https://your-preview-url.vercel.app
```

Complete verification:

```bash
SMOKE_TEST_BASE_URL=https://growvest.info npm run release:verify
```

## Manual approvals still required

Before enabling indexing, confirm all of the following:

1. Legal, disclosure, compensation and certification wording is approved.
2. All exposed credentials have been rotated.
3. Firestore rules, Storage rules and indexes are deployed without replacing Investor Portal rules.
4. Contact, Bucket List, Newsletter, GrowVest Guide and WhatsApp handoff flows pass end-to-end testing.
5. Admin login, permissions, content publishing, media upload and scheduled publishing pass UAT.
6. Mobile Safari, Android Chrome, desktop Chrome, Edge and Firefox pass visual testing.
7. Backup, restore and rollback responsibilities are assigned.
8. Analytics consent and production events are verified.
9. `NEXT_PUBLIC_ALLOW_INDEXING=true` is enabled only in the approved production environment.

## Known functional completion gate

The production-readiness framework does not silently complete previously identified v21.1 lead-management enhancements. Full investor matching, a conversion approval workspace, provider delivery webhooks and large-scale cursor pagination should be completed before launch when those capabilities are required from day one. See `PRODUCTION_DEPLOYMENT_RUNBOOK_V23.md` for the launch decision process.
