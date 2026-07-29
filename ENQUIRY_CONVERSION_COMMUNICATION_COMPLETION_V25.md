# GrowVest v25 — Enquiry, Conversion & Communication Completion

## Completed workflow

```text
Website / Guide enquiry
→ Normalized enquiry directory
→ Duplicate and investor matching
→ Team assignment and notification
→ Contact, follow-up and communication tracking
→ Qualified lead
→ Conversion eligibility check
→ Conversion review and approval
→ Investor onboarding request
→ Link or create investor profile
→ Complete conversion
```

## Admin areas

```text
/admin/enquiries
/admin/enquiries/analytics
/admin/enquiries/conversions
/admin/enquiries/conversions/[id]
/admin/communication-templates
```

## Enquiry production completion

- Cursor-based lead pagination backed by `enquiryDirectory`
- Search tokens and Firestore filters
- Rebuildable directory index while original lead collections remain the source of truth
- Existing-investor matching across approved investor/client collections
- Previous-enquiry duplicate matching by normalized email and mobile
- Ordered activities, notes and communication history
- Granular manage, assign, communicate, convert and analytics permissions
- Consent recording and withdrawal audit fields
- Structured before/after change details in lead activities
- Assignee notification on assignment, reassignment and qualification
- Assignee-specific overdue follow-up and first-response digests

## Controlled conversion workflow

A conversion request requires:

- Lead status is `qualified`
- A GrowVest team member is assigned
- Valid email or mobile is available
- Contact consent is recorded
- Duplicate and existing-investor review is completed
- Conversion notes are entered
- Preferred communication method is recorded

Conversion states:

```text
pending_review
→ approved or rejected
→ onboarding_requested
→ completed
```

The lead is marked `converted` only after onboarding has been requested and an Investor Profile ID or verified existing-investor reference is recorded.

## Communication templates

Templates support:

- Email and WhatsApp channels
- Stable key, module and trigger mapping
- Allowed variables
- Draft, Review, Approved and Archived states
- Enabled or disabled state
- Version snapshots before every edit
- Version-history review and restore
- Approved starter templates for assignment, qualification, email follow-up and WhatsApp follow-up

Collections:

```text
communicationTemplates
communicationTemplateVersions
```

## Brevo delivery tracking

Endpoint:

```text
POST /api/webhooks/brevo
```

Configure `BREVO_WEBHOOK_TOKEN` as a Bearer token or `x-brevo-webhook-token` header. The webhook updates the matched `communicationLogs` entry by Brevo message ID and records a sanitized event history in:

```text
communicationDeliveryEvents
```

Unmatched sanitized events are stored in:

```text
communicationWebhookEvents
```

Tracked states include sent, delivered, opened, clicked, deferred, soft bounce, hard bounce, blocked, invalid email, spam complaint, unsubscribe and failure.

## Analytics and export

The analytics dashboard includes:

- Total enquiries and overall conversion
- Average first-response time
- Monthly enquiry trend
- Lead status funnel
- Source, team member, goal, page and campaign distribution
- Conversion by source
- Conversion by assigned team member
- Guide conversion rate
- WhatsApp conversion rate
- Date-range filters
- Date-range-aware CSV export

## Firestore collections

Original sources remain authoritative:

```text
websiteLeads
bucketListLeads
newsletterSubscribers
```

New or expanded operational collections:

```text
enquiryDirectory
leadActivities
leadNotes
leadConversionRequests
communicationLogs
communicationDeliveryEvents
communicationWebhookEvents
communicationTemplates
communicationTemplateVersions
leadNotificationRuns
```

## Deployment

1. Merge `FIRESTORE_RULES_ENQUIRY_COMMUNICATIONS_V25.md` into the existing rules.
2. Deploy `firestore.indexes.json`.
3. Configure `BREVO_WEBHOOK_TOKEN` and the conversion notification recipient.
4. Open `/admin/enquiries` and run **Rebuild index** once.
5. Open `/admin/communication-templates` and add the approved defaults.
6. Configure Brevo transactional webhooks to call `/api/webhooks/brevo`.

```bash
firebase deploy --only firestore:indexes
npm run check:source
npm run lint
npm run build
```
