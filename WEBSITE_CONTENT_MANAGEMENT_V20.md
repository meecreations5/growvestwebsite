# GrowVest v20 — Website Content Management

GrowVest v20 adds a managed public-content workspace inside the existing Next.js project at:

```text
/admin/website
```

The module pushes approved content directly into the shared `growvest-reporttool` Firestore database through protected server APIs.

## Admin areas

```text
/admin/website
/admin/website/home
/admin/website/about
/admin/website/settings
/admin/website/navigation
/admin/faqs
/admin/goal-library
```

## Managed content

### Homepage

- Hero headline, supporting copy and CTA links
- Trust indicators and disclosure link
- Brand-belief section
- Vision and Mission
- Final conversion section
- Page SEO title, description and indexing status
- Draft, published and archived state

### About GrowVest

- Hero content and CTAs
- Master Brand Story
- Vision and Mission
- Brand principles
- Team section introduction
- Final CTA
- Page SEO controls

### Global settings

- Brand and legal entity names
- Positioning, Mission and Vision
- Phone, email, address and office hours
- Verified client, review and coverage indicators
- Certification and regulatory wording
- Direct-fee wording
- Investor Portal URL
- Footer description and disclosures

### Navigation and footer

- Header Home label
- Menu groups and submenu links
- Header CTA
- Investor Portal label
- Footer columns
- Legal links

### FAQs

- Question and approved answer
- Category and display order
- Draft, published and archived state
- Public visibility

### Goal Library

- Goal name, slug, icon key and accent colour
- Horizon, illustrative range and monthly estimate text
- Description, purpose, key steps and watch-outs
- Display order, publication state and visibility

## Direct database import

Open:

```text
/admin/website
```

Choose **Push content to database** to import the approved GrowVest starter content into Firestore.

The default action imports only missing records. **Replace with approved defaults** is available to Super Admins and replaces current managed pages, FAQs and Goal Library entries after confirmation.

Collections created or updated:

```text
websitePages
websiteSettings
websiteNavigation
faqs
goalLibrary
websiteContentVersions
websiteAuditLogs
```

## Publishing and public rendering

- Public pages read only content marked `published`.
- Draft and archived records remain hidden from the public website.
- Every managed page retains an approved code fallback.
- Firestore read failures do not prevent the public Homepage, About page, FAQs or Goal Library from rendering.
- Saves trigger Next.js tag revalidation so published changes become available without a full redeploy.
- Existing records are copied into `websiteContentVersions` before updates.
- Every change is recorded in `websiteAuditLogs`.

## Roles

- `super_admin`: full management and publishing
- `website_admin`: full management and publishing
- `content_editor`: read-only Website Content access by default
- `content_reviewer`: read-only Website Content access by default
- `seo_manager`: read-only Website Content access by default

Additional permissions can be assigned through the Website Admin profile when required.

## Required environment

The module reuses the existing server-side Firebase Admin variables:

```env
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

No Firebase Admin or Brevo credential is embedded in the project.

## Acceptance test

1. Sign in as `super_admin`.
2. Open `/admin/website`.
3. Push approved content to Firestore.
4. Confirm the six managed collections are created.
5. Update a Homepage field and save it as draft; public content must remain unchanged.
6. Change the page to published and save; the public Homepage should update.
7. Add and publish an FAQ; confirm it appears on `/faqs`.
8. Add and publish a Goal Library item; confirm it appears on `/goal-library`.
9. Update navigation or footer links and confirm desktop and mobile layouts.
10. Temporarily remove Firebase Admin configuration in a local test and confirm approved fallback content still renders.
