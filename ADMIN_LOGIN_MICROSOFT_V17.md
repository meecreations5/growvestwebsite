# GrowVest v17 — Admin Login and Microsoft Authentication

## Changes

- Rebuilt `/admin/login` so the login card remains visible at desktop, tablet and mobile widths.
- Replaced the animated full logo on the admin screen with the supplied static GrowVest logo assets.
- Kept only a small static GrowVest symbol as a brand accent in the editorial panel.
- Added `min-width: 0`-safe grid columns to prevent the brand panel from pushing the form outside the viewport.
- Added Microsoft sign-in as the primary admin login method.
- Retained email/password as an optional secondary method.
- Added friendly errors for blocked popups, closed popups, disabled Microsoft authentication and provider conflicts.
- The Firebase identity token from either login method is exchanged for the existing secure HTTP-only admin session cookie.
- Added `NEXT_PUBLIC_MICROSOFT_TENANT_ID` to the environment template.

## Firebase Console requirement

Enable Microsoft under Firebase Authentication > Sign-in method and configure the Microsoft application credentials. Add the production domain and local development domain to Firebase Authorized domains.

The Microsoft account must still have an active Firestore document at:

`websiteAdmins/{uid}`

Example:

```js
{
  email: "connect@growvest.info",
  role: "super_admin",
  isActive: true
}
```

## Recommended login

- URL: `https://growvest.info/admin/login`
- Primary method: Continue with Microsoft
- Approved account: `connect@growvest.info`
