# GrowVest v23 Updated Files

This patch is designed for the v22.8 baseline. Extract it at the project root and preserve the folder structure.

## Configuration and documentation

- `.env.example`
- `package.json`
- `next.config.mjs`
- `README.md`
- `PRODUCTION_READINESS_V23.md`
- `PRODUCTION_DEPLOYMENT_RUNBOOK_V23.md`
- `BACKUP_RECOVERY_V23.md`
- `VALIDATION_REPORT_V23.md`

## Validation and deployment scripts

- `scripts/validate-env.mjs`
- `scripts/check-route-collisions.mjs` remains unchanged and is reused
- `scripts/check-local-imports.mjs`
- `scripts/check-jsx-balance.mjs`
- `scripts/check-secrets.mjs`
- `scripts/check-public-assets.mjs`
- `scripts/check-accessibility-basics.mjs`
- `scripts/check-security-config.mjs`
- `scripts/smoke-test.mjs`

## Runtime, security and monitoring

- `src/middleware.js`
- `src/instrumentation.js`
- `src/app/global-error.jsx`
- `src/app/error.jsx`
- `src/app/components/WebVitalsReporter.jsx`
- `src/app/(website)/layout.jsx`
- `src/app/lib/server/productionReadiness.js`
- `src/app/api/health/route.js`
- `src/app/api/health/live/route.js`
- `src/app/api/health/ready/route.js`

## Admin System Readiness

- `src/app/admin/(protected)/system-readiness/page.jsx`
- `src/app/admin/_components/SystemReadinessDashboard.jsx`
- `src/app/api/admin/system/readiness/route.js`
- `src/app/admin/_components/AdminShell.jsx`
- `src/app/lib/server/adminAuth.js`

## External-link safety corrections

- `src/app/admin/(protected)/testimonials/page.jsx`
- `src/app/admin/_components/InsightEditor.jsx`
- `src/app/admin/_components/InsightsTable.jsx`
- `src/app/admin/_components/WebsiteNavigationEditor.jsx`

After applying the patch, delete `.next`, install dependencies, and run:

```bash
npm run check:source
npm run check:env -- --production
npm run lint
npm run build
```
