# GrowVest v17 Validation Report

## Scope

Admin login UI correction and Microsoft authentication support.

## Completed checks

- Parsed 111 JavaScript, JSX and MJS files with the TypeScript parser.
- Checked all local relative imports.
- Checked 33 page routes for URL collisions.
- Confirmed no real Firebase Admin private key, Brevo API key, SMTP password or webhook token is embedded in source.
- Confirmed the admin login uses the existing secure HTTP-only server session exchange.

## UI corrections

- Static full GrowVest logo used in the admin login and admin sidebar.
- Login card remains in the viewport at desktop, tablet and mobile widths.
- Grid columns use `minmax(0, …)` and both panels use `min-w-0` to prevent horizontal overflow.
- Microsoft login is the primary action; email/password remains available as a secondary option.

## External setup still required

- Enable Microsoft provider in Firebase Authentication.
- Configure the Microsoft application client ID and client secret in Firebase.
- Add local and production domains to Firebase Authorized domains.
- Ensure the signed-in Firebase UID has an active `websiteAdmins/{uid}` document.
- Run `npm install`, `npm run lint` and `npm run build` locally. Package installation timed out in the build environment.
