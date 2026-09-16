# Firestore Rules — GrowVest v25 Enquiry, Conversion & Communication Completion

Merge these rules into the existing GrowVest rules. Do not replace Report Tool, Investor Portal, Insights, Team, Website Content, Guide, or Testimonial rules.

The public website and Website Admin use protected Next.js server routes. Firebase Admin SDK bypasses Firestore rules, while browser clients are denied direct access to sensitive lead and communication data.

```rules
match /enquiryDirectory/{document=**} {
  allow read, write: if false;
}

match /leadConversionRequests/{document=**} {
  allow read, write: if false;
}

match /communicationTemplates/{document=**} {
  allow read, write: if false;
}

match /communicationTemplateVersions/{document=**} {
  allow read, write: if false;
}

match /communicationLogs/{document=**} {
  allow read, write: if false;
}

match /communicationWebhookEvents/{document=**} {
  allow read, write: if false;
}

match /communicationDeliveryEvents/{document=**} {
  allow read, write: if false;
}

match /leadActivities/{document=**} {
  allow read, write: if false;
}

match /leadNotes/{document=**} {
  allow read, write: if false;
}

match /leadNotificationRuns/{document=**} {
  allow read, write: if false;
}
```

## v25 permissions

```text
enquiries.read
enquiries.manage
enquiries.assign
enquiries.communicate
enquiries.convert
enquiries.analytics
communicationTemplates.read
communicationTemplates.manage
```

`super_admin` and `website_admin` receive all permissions. Other Website Admin profiles should receive only the permissions required for their responsibilities.

## Required deployment

```bash
firebase deploy --only firestore:indexes
```

The v25 directory index is rebuilt from `/admin/enquiries` using **Rebuild index**. Existing source collections remain the system of record; `enquiryDirectory` is a normalized query index for search, filtering, cursor pagination and analytics.
