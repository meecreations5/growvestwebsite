# Firestore rules snippet for GrowVest website collections

The GrowVest public website writes through Firebase Admin in protected Next.js API routes. The browser does not need direct access to these collections.

Merge the following match blocks into the existing `firestore.rules` file for the `growvest-reporttool` project. **Do not replace the report tool's existing rules with a blanket deny rule.**

```rules
match /websiteLeads/{leadId} {
  allow read, write: if false;
}

match /bucketListLeads/{leadId} {
  allow read, write: if false;
}

match /newsletterSubscribers/{subscriberId} {
  allow read, write: if false;
}

match /communicationLogs/{logId} {
  allow read, write: if false;
}

match /formRateLimits/{limitId} {
  allow read, write: if false;
}
```

Firebase Admin bypasses Firestore Security Rules, so the server routes can still create and update these records.

## Recommended TTL cleanup

Enable Firestore TTL for the `formRateLimits` collection using the `expiresAt` field. This removes expired rate-limit records automatically.
