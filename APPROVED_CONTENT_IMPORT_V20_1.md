# GrowVest v20.1 — Approved Content Database Import

The Website Admin database import now pushes both managed website content and the existing static Insights and Blog content into the shared Firestore database.

## Included content

- Website pages currently managed in v20
- Global business and brand settings
- Header navigation and footer links
- FAQs
- Goal Library
- Existing static GrowVest Insights
- Insight categories
- Insight tags
- GrowVest Editorial Team author

## Admin flow

Open `/admin/website` and use:

1. **Preview import** — see records that will be added or skipped.
2. **Push missing content** — create only missing records and preserve Admin-edited records.
3. **Preview replacement** — see records that will be replaced.
4. **Replace approved defaults** — Super Admin-only destructive replacement with confirmation.

Existing public Insights retain their published state during migration so the public website does not lose currently visible content. Imported records are marked with `importedFromStaticWebsite`, `importSource`, and `importVersion`.

When replacing an existing Insight, a version snapshot is created before the approved default is applied. Every import writes an Admin audit event.

## Legacy Insights coverage

The import includes all 12 Insight previews that existed on the static website. Five records include the fuller editorial content already developed in the CMS seed. The remaining legacy preview records retain their original title, excerpt, category, date, reading time and tag, and are marked with `legacyPreviewOnly: true` so the editorial team can identify and expand them later.
