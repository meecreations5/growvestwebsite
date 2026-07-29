# Validation Report — GrowVest v22.4 Investor Testimonials

## Scope validated

- Consent-controlled Investor Testimonials repository and API routes
- Website Admin list, create, edit, publish, placement, and archive flow
- Public rendering on Homepage, Insights, and About GrowVest
- Insights placement between Featured Insight and Explore the Library
- Role permissions and Admin navigation
- Firestore rules guidance and audit logging
- Mobile-responsive public and Admin layouts

## Automated checks completed

- Node syntax validation passed for all JavaScript and MJS files.
- TypeScript parser validation passed for **214 JavaScript, JSX, and MJS files**.
- Local import validation passed for **210 source files**.
- Client/server boundary validation passed; no Client Component directly imports a server-only repository.
- App Router collision validation passed for **62 pages** with no duplicate URL paths.
- No `.next`, `node_modules`, `.env.local`, or production environment files are included.
- No real Firebase Admin, Brevo, SMTP, password, or private-key credentials were embedded. `.env.example` contains placeholders only.

## Functional safeguards verified in code

- A testimonial requires approved quote content.
- `published` status requires written-consent confirmation.
- `published` status requires at least one selected website location.
- A used investor photograph requires alternative text before publication.
- Public queries return only `published` and consent-confirmed records.
- Archive removes the testimonial from Homepage, Insights, and About placements.
- Every create, update, and archive action writes to `websiteAuditLogs`.
- No fictional testimonial records are seeded by this release.

## Build limitation

A complete dependency installation and production build could not be executed in this environment because `npm install` exceeded the available registry timeout. Run the final local checks:

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:routes
npm run lint
npm run build
npm run dev
```

## Required acceptance test

1. Merge `FIRESTORE_RULES_INVESTOR_TESTIMONIALS_V22_4.md` into the existing Firestore rules.
2. Open `/admin/testimonials` as Super Admin or Website Admin.
3. Create a draft testimonial using approved investor wording.
4. Verify publishing is blocked until consent is confirmed.
5. Confirm consent, select Insights, and publish.
6. Verify the section appears between Featured Insight and Explore the Library.
7. Test Homepage and About placement independently.
8. Archive the testimonial and confirm it disappears from every public location.
9. Test at 320px, 360px, 390px, 430px, 768px, and desktop widths.
