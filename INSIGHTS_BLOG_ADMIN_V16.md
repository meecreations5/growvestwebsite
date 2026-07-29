# GrowVest v16 — Insights & Blog Admin

## Routes

### Public

- `/insights`
- `/insights/[slug]`
- `/insights/category/[slug]`
- `/insights/tag/[slug]`
- `/insights/author/[slug]`

### Website Admin

- `/admin/login`
- `/admin/dashboard`
- `/admin/insights`
- `/admin/insights/new`
- `/admin/insights/[id]/edit`
- `/admin/insights/categories`
- `/admin/insights/tags`
- `/admin/insights/authors`

The public website and admin remain inside the same Next.js App Router project. The public GrowVest header, footer, animations, cookie banner and analytics are isolated inside the `(website)` route group. Admin pages use a separate productivity-focused layout.

## Authentication

1. The admin signs in through Firebase Authentication using email and password.
2. The Firebase ID token is exchanged through `POST /api/admin/session`.
3. Firebase Admin creates an HTTP-only session cookie.
4. Restricted pages and APIs verify the session cookie and the matching `websiteAdmins/{uid}` document.
5. A Firebase Authentication account without an active `websiteAdmins` document cannot enter the Website Admin.

## Roles

- `super_admin`
- `website_admin`
- `content_editor`
- `content_reviewer`
- `seo_manager`

Publishing, scheduling and approval are enforced on the server. Hiding a button is not treated as a permission check.

## Editorial workflow

- Draft
- In review
- Changes requested
- Approved
- Scheduled
- Published
- Archived

A changed slug creates a record in `websiteRedirects`. The public article route checks this collection and permanently redirects an old article URL to the current one.

## Editor blocks

The first release uses structured, text-safe content blocks rather than arbitrary HTML:

- Lead paragraph
- Heading 2
- Heading 3
- Paragraph
- Quote
- Callout
- Bullet list
- Disclosure

This provides predictable rendering and avoids storing unsanitised rich HTML.

## Firestore collections

- `websiteAdmins`
- `insightsPosts`
- `insightCategories`
- `insightTags`
- `insightAuthors`
- `websiteRedirects`
- `websiteAuditLogs`

The browser does not directly read or write these collections. Public rendering and admin mutations use protected server-side Firebase Admin access.

## Starter content

Website Admins with publishing access can use **Import starter content** from `/admin/insights`. This imports:

- Initial GrowVest categories
- GrowVest Editorial Team author
- Five educational sample Insights imported as drafts

The operation uses fixed document IDs and merge writes, so running it again updates matching starter records instead of creating duplicates.

## Homepage integration

The homepage Insights section now loads the latest published content from the same CMS. When Firebase Admin is not configured, development falls back to local seed content.

## Setup

1. Enable Email/Password sign-in in Firebase Authentication.
2. Create the Firebase Authentication user.
3. Configure Firebase Admin environment variables.
4. Bootstrap the user as a Website Admin:

```bash
npm run bootstrap:website-admin -- --email connect@growvest.info --role super_admin
```

5. Sign in at `/admin/login`.
6. Import starter content or create the first Insight manually.
