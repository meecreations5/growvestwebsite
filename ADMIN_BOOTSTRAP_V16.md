# Bootstrap the first GrowVest Website Admin

## Prerequisites

- Email/Password sign-in is enabled in Firebase Authentication.
- The user already exists in Firebase Authentication.
- Firebase Admin environment variables are configured locally.

## Command

```bash
npm run bootstrap:website-admin -- --email connect@growvest.info --role super_admin
```

Supported roles:

- `super_admin`
- `website_admin`
- `content_editor`
- `content_reviewer`
- `seo_manager`

The script creates or updates `websiteAdmins/{uid}`. It does not create a password or reveal credentials.

## Disable access

Set the admin document field:

```text
isActive: false
```

The next session verification will deny access. For urgent access removal, also disable the Firebase Authentication user and revoke refresh tokens.
