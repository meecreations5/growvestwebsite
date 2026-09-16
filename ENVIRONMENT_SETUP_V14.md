# GrowVest v14 environment setup

## Important security action

The Firebase Admin private key, Brevo API key, SMTP password, webhook token and other server secrets previously shared in chat must be treated as exposed. Rotate them before deployment. Do not place those exposed values in this project.

## Vercel environments

Configure variables separately for Development, Preview and Production.

### Public variables

- `NEXT_PUBLIC_SITE_URL=https://growvest.info`
- `NEXT_PUBLIC_INVESTOR_PORTAL_URL=https://insights.growvest.info/investor-login`
- `NEXT_PUBLIC_ALLOW_INDEXING=false` for Development and Preview
- `NEXT_PUBLIC_ALLOW_INDEXING=true` only for approved Production
- `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDWXqIeasc3hpqep50tpRFlXxc5kh8uzc4`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=growvest-reporttool.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=growvest-reporttool`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=growvest-reporttool.firebasestorage.app`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=712836553685`
- `NEXT_PUBLIC_FIREBASE_APP_ID=1:712836553685:web:eea8940bdc609156d1bb5c`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-EB8M6Z12Q5`

### Firebase Admin variables

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `FIREBASE_ADMIN_STORAGE_BUCKET`
- `FORM_RATE_LIMIT_SALT`

Paste the private key as one environment value containing `\n` line breaks. The server code converts escaped newlines at runtime.

### Brevo variables

- `BREVO_API_KEY`
- `BREVO_DEFAULT_SENDER_NAME`
- `BREVO_DEFAULT_SENDER_EMAIL`
- `BREVO_REPLY_TO_EMAIL`
- `GROWVEST_NOTIFICATION_EMAIL`
- `BREVO_NEWSLETTER_LIST_ID`

The newsletter route remains unavailable until a numeric Brevo list ID is configured.

## Firestore collections created automatically

- `websiteLeads`
- `bucketListLeads`
- `newsletterSubscribers`
- `communicationLogs`
- `formRateLimits`

## Production verification

1. Submit the Contact form.
2. Confirm a `websiteLeads/{requestId}` document is created.
3. Confirm team and visitor email statuses are updated.
4. Confirm two related `communicationLogs` records are created.
5. Submit the Bucket List summary form and verify `bucketListLeads`.
6. Submit newsletter consent and verify `newsletterSubscribers` and Brevo list membership.
7. Test rate limiting from a non-production test IP.
8. Confirm Preview deployments remain `noindex`.
