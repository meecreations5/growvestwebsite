# Firestore Rules — Investor Testimonials v22.4

Merge this collection rule into the existing GrowVest Firestore rules. Do **not** replace the Report Tool, Investor Portal, Insights, Website Content, Team, Social, Enquiries, or GrowVest Guide rules.

The public website and Website Admin access investor testimonials only through protected Next.js server code using the Firebase Admin SDK. Browser clients should not directly read or write this collection.

```rules
match /investorTestimonials/{document=**} {
  allow read, write: if false;
}
```

Keep the existing `websiteAuditLogs` collection server-only:

```rules
match /websiteAuditLogs/{document=**} {
  allow read, write: if false;
}
```

Firebase Admin bypasses Firestore Security Rules. Access is controlled through:

- HTTP-only Website Admin session cookies
- `websiteAdmins/{uid}` role and permission checks
- `testimonials.read` and `testimonials.manage` permissions
- same-origin checks for create, update, and archive requests
- server-side payload validation and size limits
- mandatory consent confirmation before publication
- public filtering by `published` status, consent, and selected website location
- audit records for every create, update, and archive action

## Acceptance checks

1. A signed-out browser cannot read or write `investorTestimonials` directly.
2. A normal Investor Portal user cannot call Website Admin testimonial APIs.
3. A read-only Website Admin can view testimonials but cannot create, update, publish, or archive them.
4. A testimonial without recorded consent cannot be published.
5. An archived testimonial disappears from every public website location.
6. Only published, consented testimonials are rendered publicly.
