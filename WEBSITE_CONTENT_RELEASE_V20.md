# GrowVest v20 Release Summary

GrowVest v20 introduces direct database-backed Website Content Management inside the existing Website Admin.

## Included

- Homepage content management
- About GrowVest content management
- Global company and disclosure settings
- Header navigation and footer management
- FAQ management
- Goal Library management
- Direct approved-content import to Firestore
- Draft, published and archived states
- Dynamic public rendering
- Dynamic Homepage and About SEO metadata
- Server-side content validation
- Content versions and audit logs
- Next.js tag revalidation
- Safe code fallbacks for public pages
- Website role permissions
- Firestore rules guidance

## Admin starting point

```text
/admin/website
```

Use **Push content to database** after Firebase Admin is configured. The import skips existing records unless the Super Admin explicitly chooses **Replace with approved defaults**.
