# Firestore Rules — GrowVest Enquiries & Lead Management v21

Merge these collection rules into the existing GrowVest Firestore rules. Do **not** replace the Report Tool, Investor Portal, Insights CMS, Team, Social Media, or Website Content rules.

The public website submits enquiries through protected Next.js server routes. The Website Admin reads and updates lead data through Firebase Admin SDK routes protected by the HTTP-only Admin session and role permissions. Browser clients must not directly access these collections.

```rules
match /websiteLeads/{document=**} {
  allow read, write: if false;
}

match /bucketListLeads/{document=**} {
  allow read, write: if false;
}

match /newsletterSubscribers/{document=**} {
  allow read, write: if false;
}

match /leadActivities/{document=**} {
  allow read, write: if false;
}

match /leadNotes/{document=**} {
  allow read, write: if false;
}

match /leadConversionRequests/{document=**} {
  allow read, write: if false;
}

match /leadNotificationRuns/{document=**} {
  allow read, write: if false;
}

match /communicationLogs/{document=**} {
  allow read, write: if false;
}
```

Firebase Admin SDK operations bypass Firestore Security Rules. Access is enforced through:

- Firebase Admin credentials stored only in the server environment
- HTTP-only Website Admin session cookie
- `websiteAdmins/{uid}` role and permission checks
- same-origin checks for every mutation route
- rate limiting and input validation on public forms
- server-side communication logging
- lead activity and internal-note audit trails

## Role permissions

`super_admin` and `website_admin` receive:

```text
enquiries.read
enquiries.manage
enquiries.assign
enquiries.communicate
enquiries.convert
enquiries.analytics
```

`content_reviewer` receives read-only enquiry access. Other roles can be granted individual enquiry permissions through `websiteAdmins/{uid}.permissions`.

## Acceptance tests

1. A signed-out browser cannot read any lead collection directly.
2. An Investor Portal user cannot access `/admin/enquiries` or its APIs.
3. A read-only Admin can view lead records but cannot edit, communicate, or convert.
4. Website Admin and Super Admin can assign, update, follow up, communicate, and convert.
5. Public Contact and Bucket List forms continue to save even when activity logging is temporarily unavailable.
6. Sensitive Admin credentials and Brevo keys never appear in browser bundles or Firestore documents.
