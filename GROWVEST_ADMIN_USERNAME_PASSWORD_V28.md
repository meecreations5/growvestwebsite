# GrowVest Website Admin — Username & Password Release V28

**Base:** GrowVest_FAQs_All_Pages_Admin_Update.zip (the latest FAQ-for-all-pages package supplied in this conversation).

## What has been implemented

1. **User Management (`/admin/users`)**: a Super Admin can provision a new Firebase email/password identity with a unique username, display name, email address, role, and initial password. There is a secure browser-generated-password option. The role directory continues to support granting access to existing verified Microsoft/Firebase accounts without changing their existing sign-in method.
2. **Sign-in (`/admin/login`)**: accepts either a username or an email address alongside a password, plus the original Microsoft sign-in. Username sign-in resolves the account on the server, verifies the password with Firebase Authentication's Identity Toolkit REST API, verifies the resulting Firebase ID token, checks the website admin profile, and issues the same HttpOnly five-day admin session cookie as the existing login flow. No public username-to-email lookup endpoint exists.
3. **Mandatory first-login password change**: new username users must replace the initial password at `/admin/change-password` before viewing any protected admin page or calling protected admin APIs. The old password is verified with Firebase, the new password is written with the Admin SDK, refresh tokens are revoked, and the session is cleared. Users then sign in again using the new password.
4. **Permissions and access**: new `viewer` role with read-only access to Insights, the website content overview and SEO Centre. Existing `seo_manager` role retains the ability to edit page metadata, page FAQs and appropriate content without access to investor enquiries or user management. Deactivated accounts remain blocked from accessing new page or API requests, including when holding an old session cookie.
5. **Security and audit**: 15 username sign-in attempts per client IP and 15-minute window through the existing Firestore-based limiter; server-side role gating; reserved username validation; password length and content validation; unique username mapping created in a Firestore transaction; creation/update/login/password-change audit records with **no passwords**; no open signup route. The public Firebase API key is not a secret; Firebase Admin credentials must remain server-only.
6. **Previous functionality retained**: all-page FAQs, SEO editors, existing admin accounts, Microsoft OAuth, existing email/password sign-in, read-only/dashboard views and public website routes.

## Firebase deployment prerequisites

- **Enable Email/Password** in Firebase Console → Authentication → Sign-in method on the **same Firebase project** already used by the website. Keep the Microsoft provider enabled. Ensure the provider is allowed by your organisation's security policy (the Firebase project may be shared by other GrowVest apps).
- Keep the existing `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and the project's Firebase Admin SDK environment values. The username server-side verification flow uses the public API key to call Firebase Auth's official REST endpoint. Do not move Admin service-account keys to browser variables.
- Use the existing Firestore database. The new collection `websiteAdminUsernames` maps case-normalized username to the Firebase UID; `websiteAdmins/{uid}` stores `username`, `authMethod` and `requiresPasswordChange` with the existing role and status fields. **Never store passwords in Firestore**.
- Ensure Firestore client rules deny reads and writes to `websiteAdminUsernames`, `websiteAdmins`, `websiteAuditLogs` and `formRateLimits`. Incorporate `FIRESTORE_RULES_USERNAME_ADMIN_V28.md` into the actual rules. Do not overwrite your other deployed Firestore rules or assume an explicit deny overrides a broader allow.
- Maintain HTTPS, authorized Firebase Auth domains, and the existing trusted Microsoft OAuth configuration. Consider a production WAF and MFA policy before enabling many password accounts.

## How to create an SEO team username

1. Sign in as the existing **Super Admin** using Microsoft or your existing authentication method. The existing Super Admin user must already have a `websiteAdmins` document. Do not run the bootstrap script on a different Firebase project.
2. Open **Admin → User Management → Create username & password**.
3. Enter a full name, a working recovery email, and a unique username such as `rahul.seo` (3–32 characters, lowercased automatically).
4. Generate or enter a strong password of at least 12 characters and choose **SEO Manager**. Privately copy the initial password *before* clicking Create. The UI clears it after account creation and it cannot be retrieved later.
5. Click **Create user**. Share the username, initial password and `/admin/login` address using an approved secure channel. The team member signs in, sets a new password immediately, and signs in again.
6. The SEO Manager can now edit FAQs via **Website Content → FAQs by Page** and page metadata via **All Website Pages**. They cannot create/deactivate admins or access investor enquiries.

To add someone who already has Microsoft login, choose **Add existing Microsoft/Firebase user**, enter their verified email and assign the role. This does **not** create a second password account.

## Password recovery and deactivation

- On `/admin/login`, enter the user's **email** (not their username), then choose **Reset password**. Firebase delivers the reset link only when its email/password configuration and authorized domain are valid. This does not require a Super Admin to know or recover the password.
- If a user resets their password before completing initial rotation, the first-login rotation flag remains set. They can sign in with the reset password, then set their permanent password on the required change screen.
- In User Management, clear **Active** and save to block further website admin requests for the account. For immediate off-platform account revocation or compromise response, a Firebase project administrator can additionally disable or revoke the user's Firebase Authentication identity; doing that to a shared Microsoft identity may also affect other apps.
- Roles can be changed by Super Admin. Self-demotion is blocked, and the final active Super Admin cannot be removed.

## Validation and staging acceptance

Ran `npm run check:source` (route collision, imports, JS/JSX parse, secrets, public assets, accessibility, security headers, SEO, performance, mobile, CMS, FAQs, and username/password wiring), plus five password/username validation unit tests. These **passed**, parsing 279 source files with no syntax errors.

**Not performed:** `npm run lint`, a full Next production build, deployed Firebase Auth/Firestore integration, real Microsoft sign-in, real emails, browser UI test or staging end-to-end authentication. Dependencies could not be installed using the offline npm cache (`ENOTCACHED`). Live service credentials were not accessed and no Firebase users or collections were changed by this package.

In a connected development/staging environment run:

```bash
npm ci
npm run check:source
npm run lint
npm run build
npm run dev
```

**Staging checks before production deployment:**

- Existing Microsoft Super Admin can still sign in and navigate all former features.
- Create `seo.manager.test` with a valid, controlled recovery email, assign SEO Manager and log in with the username.
- Confirm the initial password change screen blocks `/admin/dashboard` and all protected APIs until rotation.
- Confirm first password change invalidates the old login, and new password succeeds.
- Verify SEO Manager can update content/FAQ on a test page and cannot access `/admin/users` or `/api/admin/users`, investor enquiries, or system settings.
- Verify viewer's edit/publish controls are hidden and server API writes are denied.
- Disable a test admin and confirm a previously valid session no longer grants page/API access.
- Test password reset via email, invalid username/password handling, and username duplication.
- Verify all public page FAQs render and no published page design changed.

**Rollback:** Keep the previous package and a Firestore/Auth snapshot. Re-deploy the previous build if needed; do **not** delete password-created Firebase users and their username mappings without separately planning the data rollback. Newly created username accounts require this build's login path.

## Source-level changes

- `src/app/admin/login/AdminLogin.jsx`, `src/app/admin/login/page.jsx`
- `src/app/admin/change-password/page.jsx`, `src/app/admin/change-password/InitialPasswordChange.jsx`
- `src/app/admin/_components/AdminUsersManager.jsx`, `src/app/admin/_components/AdminShell.jsx`, `src/app/admin/_components/InsightsTable.jsx`
- `src/app/admin/(protected)/insights/page.jsx`, `src/app/admin/(protected)/dashboard/page.jsx`
- `src/app/api/admin/login/password/route.js`, `src/app/api/admin/account/password/route.js`, `src/app/api/admin/session/route.js`
- `src/app/lib/server/adminAccountCredentials.js`, `adminSessionCookie.js`, `firebasePasswordSignIn.js`, `adminUsersRepository.js`, `adminAuth.js`
- `tests/adminAccountCredentials.test.mjs`, `scripts/check-admin-password-auth.mjs`, `package.json`
- `FIRESTORE_RULES_USERNAME_ADMIN_V28.md`, this release guide.

## Reference

Firebase REST email/password sign-in: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
Firebase Admin session cookies: https://firebase.google.com/docs/auth/admin/manage-cookies
