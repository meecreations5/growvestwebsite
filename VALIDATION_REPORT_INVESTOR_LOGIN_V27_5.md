# Validation Report - Investor Login Sitewide V27.5

## Passed
- Route collision check: 72 pages, no duplicate URL paths.
- Local import check across 258 source files.
- JavaScript/JSX syntax check across 258 source files.
- Secret scan.
- Public asset check.
- Accessibility baseline check.
- Security configuration check.
- SEO audit: 21 public routes, 0 warnings.
- Performance baseline check.

## Existing unrelated warning
`npm run check:mobile` still reports the pre-existing retired `src/app/components/MobileActionBar.jsx` component. This was present before V27.5 and is not introduced by the Investor Login enablement.

## Production note
If Vercel already has an explicit `NEXT_PUBLIC_SHOW_INVESTOR_PORTAL=false`, change it to `true` and redeploy. If the variable is absent, V27.5 now shows the portal by default.
