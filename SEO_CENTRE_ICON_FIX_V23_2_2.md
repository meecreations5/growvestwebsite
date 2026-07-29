# GrowVest v23.2.2 - SEO Centre icon compatibility fix

## Issue

The SEO Centre imported `Sitemap` from `lucide-react`. The project pins `lucide-react` 0.487.0, where that named component is not available in the installed build. React therefore received `undefined` as an element type and stopped rendering the page.

## Correction

- Replaced the unavailable `Sitemap` icon with the supported `Network` icon.
- Updated both the production-indexing card and the sitemap link.
- No SEO logic, routes, Firestore data, permissions, or environment settings were changed.
