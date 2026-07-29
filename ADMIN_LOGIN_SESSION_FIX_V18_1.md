# GrowVest v18.1 - Admin Login and Session Diagnostics Fix

## Updated files

- `src/app/admin/login/AdminLogin.jsx`
- `src/app/api/admin/session/route.js`

## Client login improvements

- Clears a previous Microsoft error before opening a new popup.
- Uses an immediate `useRef` popup lock to prevent duplicate popup requests.
- Shows an in-progress message while the Microsoft account window is open.
- Normalizes Firebase, browser, and API errors into readable values.
- Uses `console.warn` in local development instead of `console.error`, preventing expected sign-in failures from opening the Next.js error overlay.
- Parses the Admin session API response safely even when it is not valid JSON.
- Exposes the exact session error code returned by the server.
- Keeps the secure HTTP-only server session while clearing the temporary browser Firebase session.
- Redirects with `window.location.replace()` after session creation.

## Server session improvements

The session endpoint now returns stable error codes:

- `FIREBASE_ID_TOKEN_REQUIRED`
- `FIREBASE_ID_TOKEN_EXPIRED`
- `FIREBASE_ID_TOKEN_INVALID`
- `FIREBASE_RECENT_LOGIN_REQUIRED`
- `ADMIN_ACCESS_NOT_FOUND`
- `ADMIN_ACCESS_INACTIVE`
- `ADMIN_ROLE_INVALID`
- `ADMIN_SESSION_FAILED`

The endpoint validates that the Firestore `websiteAdmins/{uid}` record:

- exists;
- is active; and
- contains one of the supported Website Admin roles.

## Retest

1. Clear the Next.js cache.
2. Start the local application.
3. Open `/admin/login` in an Incognito window.
4. Choose **Continue with Microsoft**.
5. Select the approved GrowVest Microsoft account.
6. If sign-in fails, read the red UI message and the single console warning. The warning includes the stage, code, status, and message without exposing an ID token.

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
