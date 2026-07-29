# GrowVest v25 Validation Report

## Automated checks completed

- 69 App Router pages checked
- No duplicate URL routes found
- 246 JavaScript/JSX source files passed syntax validation
- 246 source files passed local-import validation
- Server JavaScript and MJS files passed `node --check`
- Secret scan passed
- Required public asset check passed
- Accessibility baseline check passed
- Security configuration check passed
- SEO audit passed for 20 public routes
- `firestore.indexes.json` passed JSON validation

## Package installation limitation

A full dependency installation and production build could not run in this environment because the available package registry returned HTTP 404 for `@tailwindcss/postcss@4.1.12`.

Run locally before deployment:

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:source
npm run lint
npm run build
```

## Required functional UAT

- Rebuild the enquiry directory and verify record counts
- Test search and next/previous cursor pagination
- Match a previous enquiry by email and mobile
- Match an existing investor
- Assign and reassign a lead and verify notification logs
- Mark a lead Qualified and verify the assignee notification
- Confirm conversion is blocked until all eligibility checks pass
- Approve, send to onboarding and complete a conversion
- Create, edit, approve, archive and restore a communication template version
- Send a Brevo email and verify sent → delivered/opened/clicked status progression
- Verify bounce and unsubscribe events update the correct communication only
- Test date-range analytics and CSV export
- Confirm role-specific actions are hidden and rejected by the API
