# Firestore Rules — Website Content Management v20

Merge these collection rules into the existing GrowVest Firestore rules. Do **not** replace the Report Tool, Investor Portal, Insights CMS, Team, or Social Media rules.

The public website and Website Admin read and write managed content through protected Next.js server routes using the Firebase Admin SDK. Browser clients should not directly access these collections.

```rules
match /websitePages/{document=**} {
  allow read, write: if false;
}

match /websiteSettings/{document=**} {
  allow read, write: if false;
}

match /websiteNavigation/{document=**} {
  allow read, write: if false;
}

match /faqs/{document=**} {
  allow read, write: if false;
}

match /goalLibrary/{document=**} {
  allow read, write: if false;
}

match /websiteContentVersions/{document=**} {
  allow read, write: if false;
}
```

`websiteAuditLogs` is already used by the Website Admin modules. Keep it server-only as well:

```rules
match /websiteAuditLogs/{document=**} {
  allow read, write: if false;
}
```

Firebase Admin SDK operations bypass Firestore Security Rules. Access is therefore controlled by:

- Firebase Admin credentials stored only in the server environment
- HTTP-only Website Admin session cookie
- `websiteAdmins/{uid}` role and permission checks
- same-origin protection on mutation routes
- server-side input validation and payload limits
- audit and version records

## Test after merging

1. A signed-out browser cannot read or write the managed collections directly.
2. A normal Investor Portal user cannot access Website Admin APIs.
3. A `content_editor` can only read Website Content unless extra permissions are assigned.
4. `website_admin` and `super_admin` can save and publish managed content.
5. Public pages continue to render through the server and use approved code fallbacks if Firestore is unavailable.
