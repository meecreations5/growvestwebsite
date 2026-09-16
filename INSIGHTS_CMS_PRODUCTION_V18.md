# GrowVest v18 — Insights CMS Production Completion

This release completes the production-oriented Insights & Blog workflow inside `growvest.info/admin`.

## Admin capabilities

- Structured article editor with lead, paragraph, H2, H3, quote, callout, list, image, table, CTA, video, divider and disclosure blocks
- Firebase Storage media uploads with file-type signature checks and a 4 MB limit
- Reusable Media Library at `/admin/media`
- Featured-image focal-point controls for responsive cropping
- Alternative-text validation before approval, scheduling or publishing
- Draft preview at `/admin/insights/[id]/preview`
- Version history and safe restore-to-draft workflow
- Draft, review, changes requested, approved, scheduled, published and archived statuses
- Workflow email notifications through Brevo for important status changes
- Scheduled publishing through `/api/cron/publish-insights`
- Exclusive public Featured Insight handling
- Source-reference management
- SEO and social preview controls
- Consent-based Insight analytics dashboard

## Public Insights improvements

- Featured-image support on cards and articles
- Search and category URLs remain shareable
- Real page-based navigation instead of an unbounded Load More list
- Related Insights on article pages
- Share action and Begin Your Journey CTA tracking after analytics consent
- Aggregate Insight metrics stored without visitor identity data

## New collections

```text
websiteMedia
insightVersions
insightMetrics
```

Existing collections remain:

```text
insightsPosts
insightCategories
insightTags
insightAuthors
websiteRedirects
websiteAuditLogs
communicationLogs
formRateLimits
```

## Scheduled publishing

Vercel Cron calls:

```text
GET /api/cron/publish-insights
Authorization: Bearer <CRON_SECRET>
```

The endpoint:

1. Finds due documents where `status == scheduled` and `scheduledAt <= now`.
2. Preserves a version snapshot.
3. Changes the status to `published`.
4. Applies Featured Insight exclusivity when needed.
5. Writes an audit record.
6. Sends a workflow notification when Brevo is configured.

Deploy the index from `firestore.indexes.json` before testing scheduled publishing.

## Media security

- Uploads are accepted only through a protected Website Admin API.
- Only JPG, PNG, WebP and GIF are allowed.
- The server validates both MIME type and file signature.
- SVG uploads are intentionally excluded.
- Media metadata and administrative actions are logged.
- Published download URLs use Firebase Storage download tokens.

## Production environment additions

```env
FIREBASE_ADMIN_STORAGE_BUCKET=
CRON_SECRET=
```

The existing Brevo and Firebase Admin variables remain required.
