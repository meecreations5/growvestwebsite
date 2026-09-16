# GrowVest v22.2 Validation Report

## Completed checks

- Next.js route collision check: passed, 59 pages and no duplicate URL paths.
- JavaScript and MJS syntax check using Node.js: passed.
- JSX and JavaScript parse check using the TypeScript compiler with JSX preservation: passed.
- CSS parse check using `tinycss2`: passed with zero parse errors.
- Changed-file review against the v22.1 baseline: completed.
- Full and patch ZIP integrity: to be verified during packaging.

## Build limitation

A complete `npm install` could not be completed in the available registry window, so `npm run lint` and `npm run build` must still be run locally before deployment.

## Local verification commands

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:routes
npm run lint
npm run build
npm run dev
```

## Manual acceptance checklist

1. Open every public page at 320px and confirm no horizontal scrolling.
2. Open and close the mobile navigation and confirm background scrolling is locked.
3. Scroll until the sticky action bar appears and confirm both actions remain readable.
4. Open GrowVest Guide and confirm the sticky bar hides.
5. Focus the Guide input and confirm the virtual keyboard does not cover the composer.
6. Scroll to the footer and confirm the Guide launcher does not cover legal links.
7. Test contact, Bucket List and Guide handoff inputs on iPhone Safari.
8. Open Admin on mobile and confirm the drawer, forms and tables remain usable.
9. Test portrait and landscape orientation.
10. Run Lighthouse mobile checks after the production build.
