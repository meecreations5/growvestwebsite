# GrowVest v21 — Website Enquiries & Lead Management

## Purpose

GrowVest v21 provides a single Website Admin workspace for website enquiries, discovery-conversation requests, Bucket List leads, newsletter subscribers, manually recorded WhatsApp/referral leads, follow-ups, communication history, and controlled investor handoff.

## Admin routes

```text
/admin/enquiries
/admin/enquiries/contact
/admin/enquiries/bucket-list
/admin/enquiries/newsletter
/admin/enquiries/whatsapp
/admin/enquiries/follow-ups
/admin/enquiries/[leadKey]
```

## Lead sources

The workspace aggregates existing live collections instead of copying records into a second lead table:

```text
websiteLeads
bucketListLeads
newsletterSubscribers
```

Each record receives a stable Admin key:

```text
contact--{documentId}
bucket--{documentId}
newsletter--{documentId}
```

This keeps public submission compatibility and prevents duplicate database records.

## Workflow

```text
New
→ Assigned
→ Contact Attempted
→ Connected
→ Follow-up
→ Qualified
→ Converted
→ Closed
```

Additional outcomes include Not Interested, Duplicate, Invalid, Spam, Submission Error, Subscribed, and Provider Sync Failed.

## Lead detail capabilities

- Contact and source details
- Campaign and source-page attribution
- Bucket List goals and illustrative INR values
- Assignment to active Website Admin users
- Priority, status, next action, tags, and follow-up scheduling
- Internal team notes
- Duplicate detection by normalized email or phone
- Brevo follow-up email
- WhatsApp click-to-chat handoff with communication logging
- Activity timeline
- Communication history
- Controlled investor conversion handoff
- Hourly follow-up and first-response-overdue email digest through the protected cron route

## Investor handoff

v21 does not silently create an Investor Portal login or assume an unknown Report Tool investor schema. Conversion creates:

```text
leadConversionRequests/{conversionId}
```

with status:

```text
pending_ops_profile_creation
```

The lead is marked Converted and linked to the handoff record. The GrowVest Ops/Report Tool module can approve and complete investor-profile creation using its own controlled registration flow.

## Public form enhancements

Contact and Bucket List submissions now also store:

- normalized phone number
- source page
- UTM campaign details
- default priority
- response due timestamp
- lead activity record
- communication logs linked to the Admin lead key

Newsletter subscriptions are included in the same Admin workspace and retain Brevo synchronization status.

## Firestore collections added

```text
leadActivities
leadNotes
leadConversionRequests
leadNotificationRuns
```

Existing `communicationLogs` records now support `leadKey`, entity information, template key, sender, subject, and metadata while remaining backward compatible.

## Scheduled follow-up digest

`/api/cron/enquiry-followups` runs hourly through the Vercel cron configuration and uses the existing `CRON_SECRET`. It sends a digest to `GROWVEST_NOTIFICATION_EMAIL` only when a follow-up is due or a lead has exceeded its first-response target. Each hourly run is deduplicated in `leadNotificationRuns`.
