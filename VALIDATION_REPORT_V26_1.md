# GrowVest v26.1 Validation Report

## Completed validation

- Route collision check: passed — 70 App Router pages, no duplicate paths
- Local import check: passed — 252 source files
- JavaScript/JSX structural syntax check: passed — 252 source files
- TypeScript parser validation for JS/JSX/MJS sources: passed
- Secret scan: passed
- Required public assets: passed
- Accessibility baseline: passed
- Security configuration baseline: passed
- SEO baseline: passed — 20 public routes
- Performance foundation check: passed
- `next.config.mjs` syntax: passed

## Performance checks added

`npm run check:performance` verifies that:

- public website routes do not use `force-dynamic`
- the shared website layout has timed revalidation
- non-critical website features use deferred imports
- public Firestore repositories use tagged caching
- Insights use server-driven pagination
- optimized image formats and remote patterns are configured
- the shared optimized-image component is present

The performance check is included in `npm run check:source`.

## Build status

A complete `npm install`, ESLint run and Next.js production build could not be completed in this environment. The available package registry returned HTTP 404 for `@tailwindcss/postcss@4.1.12`, and therefore `next` was not installed in the workspace.

The final production build must be run locally or in Vercel CI:

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:source
npm run lint
npm run build
```

## Measurement limitation

No Lighthouse or field Core Web Vitals score is claimed by this report. Those measurements depend on the deployed domain, network, device, content images, third-party scripts and real-user traffic. Validate through Vercel Speed Insights and production Lighthouse testing after deployment.
