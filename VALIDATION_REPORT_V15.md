# GrowVest v15 Validation Report

## Scope

Firebase Analytics and consent integration for the GrowVest public website Firebase app.

## Completed checks

- Parsed 77 JavaScript, JSX and MJS files with the TypeScript parser.
- No JavaScript or JSX syntax errors were found.
- Checked relative imports in 73 source files.
- No missing local imports were found.
- Confirmed the dedicated website Firebase App ID and measurement ID are present only in public environment configuration.
- Confirmed Firebase Admin, Brevo, SMTP, webhook and cron secrets are not embedded in the packaged source.
- Confirmed the legacy direct Google Analytics script and `NEXT_PUBLIC_GA_ID` are no longer used by active source code.
- Confirmed Firebase Analytics initialization is browser-only and consent-gated.
- Confirmed automatic page-view sending is disabled and App Router page views are tracked manually.
- Confirmed existing CTA, form, scroll-depth, Bucket List and journey events use the shared analytics helper.
- Confirmed changing consent from accepted to declined disables collection for the initialized analytics instance.

## Production build status

`npm install --ignore-scripts --no-audit --no-fund` exceeded the available registry execution window. Therefore, the following commands still need to be completed in the deployment environment:

```bash
npm install
npm run check:env
npm run lint
npm run build
npm start
```

## Required live verification

1. Decline analytics and verify Firebase Analytics DebugView receives no events.
2. Accept analytics and verify one `page_view` event for the current route.
3. Navigate between pages and confirm one page-view event per route.
4. Verify CTA, Investor Portal, scroll-depth, Contact, Newsletter and Bucket List events.
5. Reopen cookie preferences, decline analytics and confirm subsequent events stop.
6. Verify analytics remains disabled for a new visitor until consent is accepted.
