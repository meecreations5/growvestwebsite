# Validation Report — GrowVest v21

## Release

GrowVest v21 — Website Enquiries & Lead Management

## Functional coverage validated

- Unified Admin workspace for Contact, Discovery, Bucket List, Newsletter, WhatsApp and manually captured leads
- Lead filtering, searching, pagination and source-specific queues
- New-enquiry, follow-up, Bucket List and conversion dashboard indicators
- Assignment to active Website Admin, staff or advisor profiles
- Status, priority, tags, next action and follow-up scheduling
- Internal notes and activity timeline
- Duplicate detection using normalized email address and phone number
- Brevo follow-up email and failed-delivery logging
- WhatsApp click-to-chat handoff with communication logging
- Controlled investor handoff through `leadConversionRequests`
- Public Contact and Bucket List source-page and UTM attribution
- Newsletter inclusion in the Admin lead workspace
- Hourly follow-up and first-response-overdue digest

## Automated validation completed

- 188 JavaScript, JSX and MJS files parsed with the TypeScript parser
- 0 syntax errors
- 185 source files checked for relative import resolution
- 0 missing local imports
- 55 App Router pages checked
- 0 duplicate URL paths
- 43 Client Components reviewed for server-only imports
- 0 Client Components importing `lib/server`
- `package.json`, `vercel.json` and `firestore.indexes.json` parsed successfully
- New permissions, routes, lead repository, attribution fields and database collections verified by targeted release checks
- No embedded Firebase Admin private-key or Brevo secret patterns found outside placeholder documentation

## Database collections

Existing collections used:

```text
websiteLeads
bucketListLeads
newsletterSubscribers
communicationLogs
websiteAdmins
users
```

New server-only collections:

```text
leadActivities
leadNotes
leadConversionRequests
leadNotificationRuns
```

## Route validation

New Admin pages:

```text
/admin/enquiries
/admin/enquiries/contact
/admin/enquiries/bucket-list
/admin/enquiries/newsletter
/admin/enquiries/whatsapp
/admin/enquiries/follow-ups
/admin/enquiries/[leadKey]
```

New protected API areas:

```text
/api/admin/enquiries
/api/admin/enquiries/[leadKey]
/api/admin/enquiries/[leadKey]/notes
/api/admin/enquiries/[leadKey]/communications/email
/api/admin/enquiries/[leadKey]/communications/whatsapp
/api/admin/enquiries/[leadKey]/convert
/api/cron/enquiry-followups
```

## Build limitation

A full `npm install`, ESLint run and Next.js production build could not be completed in the execution environment because the package-registry operation exceeded the available timeout. The source-level syntax, local-import, route-collision, server-boundary, JSON and secret checks passed.

Run locally before production deployment:

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:env
npm run check:routes
npm run lint
npm run build
npm run dev
```

## Required production setup

- Merge `FIRESTORE_RULES_ENQUIRIES_V21.md` into the existing Firestore rules
- Keep Firebase Admin and Brevo credentials server-side only
- Configure `CRON_SECRET`
- Confirm `GROWVEST_NOTIFICATION_EMAIL`
- Confirm the Vercel cron for `/api/cron/enquiry-followups`
- Complete one Contact enquiry, one Bucket List enquiry, one manual WhatsApp lead, one email follow-up and one conversion-handoff acceptance test
