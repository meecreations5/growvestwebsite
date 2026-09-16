# GrowVest v18 Validation Report

## Scope

Production completion of the Insights & Blog CMS inside the existing GrowVest Website Admin.

## Completed checks

- Parsed 128 JavaScript, JSX and MJS files with the TypeScript parser: **0 syntax failures**.
- Checked 128 source files for local imports: **0 missing local imports**.
- Checked 37 App Router pages: **no duplicate URL paths**.
- Parsed `package.json`, `firestore.indexes.json` and `vercel.json` successfully.
- Scanned active source and configuration files for exposed Firebase Admin, Brevo SMTP/API and previously supplied worker secrets: **no real server credentials found**.
- Confirmed Website Admin and CMS collections are accessed through server routes and Firebase Admin.
- Confirmed scheduled publishing requires a bearer `CRON_SECRET`.
- Confirmed public Insight metrics are aggregate-only and do not store visitor identity.
- Confirmed image upload validation restricts uploads to JPG, PNG, WebP and GIF with a 4 MB limit.
- Confirmed admin preview, version history, related Insights, public pagination and analytics routes resolve without route collisions.

## Production setup still required

- Install dependencies and generate `package-lock.json`.
- Run `npm run check:env`, `npm run lint`, `npm run build` and `npm start` in the deployment environment.
- Configure rotated Firebase Admin and Brevo credentials.
- Configure `FIREBASE_ADMIN_STORAGE_BUCKET`, `GROWVEST_NOTIFICATION_EMAIL` and `CRON_SECRET`.
- Deploy the composite index from `firestore.indexes.json`.
- Merge the supplied Firestore and Storage rules with the existing Investor Portal rules.
- Verify the Firebase Storage bucket and tokenised media delivery.
- Test Brevo review, approval, scheduled and publication notifications.
- Test scheduled publishing through the deployed Vercel Cron endpoint.
- Test Website Admin permissions for Super Admin, Website Admin, Editor, Reviewer and SEO Manager.
- Complete browser, mobile, accessibility, performance and security testing.

## Build limitation

`npm install` exceeded the package-registry execution window in the development environment. Therefore, a complete Next.js production build and live Firebase/Brevo integration test were not executed here.
