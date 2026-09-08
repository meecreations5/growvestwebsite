# Validation Report - Investor Experience V27.1

## Passed

- Route collision check: 72 pages, no duplicate URL paths.
- Local import check: passed across 258 source files.
- JavaScript/JSX source syntax balance check: passed across 258 source files.
- Secret scan: passed.
- Public asset baseline check: passed.
- Accessibility baseline check: passed.
- Security configuration check: passed.
- SEO audit: 21 public routes, 0 advisory warnings.
- Performance baseline check: passed.
- No em dash characters were introduced in the V27.1 page copy.

## Known pre-existing validation item

`npm run check:mobile` continues to flag `src/app/components/MobileActionBar.jsx` as a retired floating action bar component. The same warning is present in the deployed V27 baseline and is unrelated to this release.

## Build note

A dependency-based Next.js production build was not run in this isolated workspace because `node_modules` is not present. The project source validation scripts above do not require installed dependencies and completed successfully.

## Privacy validation

The four campaign screenshots included in the public directory are privacy-safe derivatives of the supplied app screenshots. Identifying names and visible financial values were blurred before publication. The Profile screenshot was excluded from public assets.
