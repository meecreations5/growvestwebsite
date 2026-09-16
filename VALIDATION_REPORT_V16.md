# GrowVest v16 validation report

## Completed static validation

- 109 JavaScript, JSX and MJS files parsed successfully
- 107 source files checked for relative imports
- 0 missing relative imports
- 33 page routes identified
- 0 duplicate route conflicts after introducing the `(website)` route group
- 0 embedded Firebase Admin, Brevo API or SMTP secrets detected
- Public and admin route layouts are separated
- Server-side role enforcement is applied to approval, scheduling, publishing and archive actions
- Admin routes are excluded from the sitemap
- `/admin/` is excluded from production robots rules
- Public article rendering uses structured text blocks rather than arbitrary stored HTML

## Pending environment validation

The following require real project credentials and a completed dependency installation:

- `npm run check:env`
- `npm run lint`
- `npm run build`
- Firebase Email/Password sign-in
- Website Admin session-cookie creation and revocation
- Firestore CRUD and starter-content import
- Public article rendering from Firestore
- Old-slug redirect behaviour
- Cross-browser admin editor QA

Dependency installation exceeded the available registry execution window in the development environment, so a complete Next.js production build was not executed here.

## Production test sequence

1. Create a Website Super Admin.
2. Sign in through `/admin/login`.
3. Import starter content as drafts.
4. Create a new draft.
5. Submit it for review using an editor account.
6. Approve and publish using a reviewer or admin account.
7. Confirm the article appears at `/insights/[slug]` and on the homepage.
8. Change the slug and confirm the old URL permanently redirects.
9. Archive the article and confirm it disappears publicly.
10. Verify the audit records in `websiteAuditLogs`.
