# GrowVest v18.2 - Microsoft Popup Authentication Fix

## Root cause

The website sent this response header on every route:

```text
Cross-Origin-Opener-Policy: same-origin
```

That isolates cross-origin popups from the page that opened them. Firebase popup authentication needs the opener and Microsoft/Firebase popup to retain the communication channel until the OAuth result is returned. The browser therefore closed or detached the popup from Firebase's point of view, producing:

```text
auth/popup-closed-by-user
```

even when the user selected an account.

## Correction

`next.config.mjs` now sends:

```text
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

This preserves the OAuth popup relationship while retaining a stricter opener policy than omitting COOP entirely.

The latest `AdminLogin.jsx` and Admin session route fixes are also included.

## Required local restart

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

Then open a fresh Incognito window and retry Microsoft sign-in.
