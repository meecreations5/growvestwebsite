# Validation report — GrowVest v19

## Scope validated

- Team and hierarchy repository, Admin APIs, Admin pages and public About integration
- Social-media repository, Admin APIs, Admin page and public website placements
- Role permissions and Website Admin navigation
- Dynamic structured data and public cache invalidation
- Firestore rules guidance and release documentation

## Static validation completed

- 143 JavaScript, JSX and MJS files parsed with the TypeScript parser
- 0 JavaScript or JSX syntax errors
- 0 missing relative imports
- 41 App Router pages checked
- 0 duplicate URL routes
- No Client Component imports a server-only repository
- No embedded Firebase Admin private key, Brevo API key, SMTP password or webhook token detected in active source files

## Public behaviour

- Unpublished or hidden team profiles are excluded from `/about`
- Empty team departments do not render
- If no team profiles are published, the entire team section remains hidden
- Social accounts render only in locations selected by the Website Admin
- Published social URLs are included in Organization `sameAs` structured data
- Public team and social content uses five-minute server caching with immediate tag invalidation after Admin updates

## Production build status

`npm install` exceeded the available package-registry execution window, so the complete Next.js build, ESLint run and browser rendering test could not be completed in this environment.

Run locally before deployment:

```bash
npm install
npm run check:env
npm run check:routes
npm run lint
npm run build
npm start
```

## Required Firebase action

Merge `FIRESTORE_RULES_TEAM_SOCIAL_V19.md` into the existing Firestore rules without replacing the Investor Portal or Insights CMS rules.
