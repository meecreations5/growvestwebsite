# GrowVest Production Deployment Runbook — v23

## 1. Prepare the release

Use a clean extraction of the v23 ZIP. Do not copy `.next`, `node_modules`, `.env.local` or service-account files from another machine.

```bash
npm install
npm run check:source
```

Configure Preview environment variables with indexing disabled:

```env
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_APP_VERSION=23.0.0
```

Use rotated server credentials only.

## 2. Validate Firebase

- Confirm the browser and Admin project IDs are identical.
- Confirm the Website Admin UID document exists in `websiteAdmins/{uid}`.
- Merge and deploy all approved Firestore and Storage rules.
- Deploy `firestore.indexes.json`.
- Test Firestore, Auth and Storage from `/admin/system-readiness`.

## 3. Validate communications

- Confirm the Brevo sender and reply-to addresses are verified.
- Send one Admin follow-up email.
- Submit one newsletter subscription.
- Confirm internal enquiry notifications.
- Confirm scheduled jobs authenticate using `CRON_SECRET`.

## 4. Preview deployment

Deploy to Vercel Preview and run:

```bash
npm run smoke -- https://your-preview-url.vercel.app
```

Complete functional UAT using an Incognito window and at least one mobile device.

## 5. Production gate

Run locally with the exact production variables:

```bash
npm run readiness
```

The command must complete environment, route, import, syntax, secret, asset, accessibility, security, lint and build checks.

Resolve every red item in `/admin/system-readiness`. Document any accepted warning.

## 6. Promote to production

- Promote the verified Preview build rather than creating an unrelated build.
- Confirm `NEXT_PUBLIC_SITE_URL=https://growvest.info`.
- Confirm `NEXT_PUBLIC_ALLOW_INDEXING=true` only after final approval.
- Confirm the `www` hostname redirects to the canonical domain.

## 7. Post-deployment verification

```bash
npm run smoke -- https://growvest.info
```

Verify:

- `/api/health/live` returns `200`
- `/api/health/ready` returns `200`
- `/robots.txt` allows public pages and excludes `/admin` and `/api`
- `/sitemap.xml` contains public pages and published Insights
- Admin login and logout
- one public form submission
- one Guide conversation
- one email delivery
- analytics consent and page-view event

## 8. Rollback

Rollback immediately when:

- public pages return widespread `5xx` responses
- Admin authentication fails for all approved users
- form submissions are lost
- Firestore permissions expose private records
- incorrect legal or financial claims are published

Use the Vercel deployment history to restore the last verified production deployment. Do not roll back Firestore content blindly; restore content records only from an approved export or version history.
