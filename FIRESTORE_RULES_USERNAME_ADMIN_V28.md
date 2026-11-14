# Add these collection rules to your deployed Firestore rules (if not already denied by default)

The website uses the Firebase Admin SDK on Next.js server routes, so it bypasses
Firestore client security rules. These documents must **not** be readable or
writable through the Firebase browser SDK:

```js
match /websiteAdmins/{document=**} {
  allow read, write: if false;
}

match /websiteAdminUsernames/{document=**} {
  allow read, write: if false;
}

match /websiteAuditLogs/{document=**} {
  allow read, write: if false;
}

match /formRateLimits/{document=**} {
  allow read, write: if false;
}
```

Integrate these **inside your existing `match /databases/{database}/documents`**
block; don't replace your existing application rules. If a broader overlapping
`allow` rule grants access, an explicit deny here does not override it. Review
and tighten broad allowances before deployment. Do not publish the whole snippet
as a standalone file, and don't modify rules for the separate Investor Portal.
