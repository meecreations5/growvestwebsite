# Security rotation required before deployment

The following server-side credentials were shared in a chat message and must be treated as exposed:

- Firebase Admin private key
- Brevo API key
- Brevo SMTP password
- Brevo webhook token
- CRON secret

Before deploying GrowVest v14:

1. Create a new Firebase service-account key or move to an approved workload-identity approach.
2. Replace the key in Vercel Development, Preview and Production environments.
3. Delete or disable the exposed Firebase service-account key.
4. Generate a new Brevo API key and SMTP key, update Vercel, then revoke the exposed keys.
5. Generate new webhook, cron and form-rate-limit secrets.
6. Redeploy and test Contact, Bucket List and Newsletter flows.
7. Never add real credentials to `.env.example`, source control, ZIP files, screenshots or documentation.

This project intentionally contains placeholders only. No provided server secret has been embedded in the source code or packaged output.
