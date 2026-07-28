# Validation Report — GrowVest v22

## Release

**GrowVest v22 — GrowVest Guide & WhatsApp**

## Validation completed

### Source parsing

- 200 JavaScript, JSX and MJS source files parsed with the TypeScript parser.
- No syntax or JSX parse failures were found.
- All new API route JavaScript files passed `node --check`.

### Local imports

- 200 source files were checked for local relative imports.
- No missing local modules were found.
- No Client Component imports a `lib/server` module or `firebase-admin`.

### App Router

- `npm run check:routes` completed successfully.
- 59 App Router pages were detected.
- No duplicate URL paths were found.

### GrowVest Guide scope

Validated that the release includes:

- public GrowVest Guide widget in the website layout
- approved quick prompts
- published-content matching across Guide answers, FAQs, Goal Library and Insights
- educational boundary for personalised recommendation requests
- source links and public disclaimer
- unanswered-question capture
- WhatsApp click-to-chat handoff
- compatible Website Lead and communication-log creation
- Admin dashboard, answer management, conversations and settings
- granular Guide permissions
- Firestore rules documentation
- required Firestore composite indexes

### Data safeguards

- Public chat and WhatsApp routes use same-origin validation.
- Public routes enforce Firestore-backed rate limits when Firebase Admin is configured.
- Request payloads and field lengths are limited.
- Guide collections are designed for server-only access.
- WhatsApp handoff records status `prepared`; the UI does not claim sent, delivered or read status.
- No external generative-AI provider or API key is required.
- No real Firebase Admin, Brevo, SMTP or user password secret was added.
- `.env.example` contains placeholders only.

### Package installation and production build

A complete dependency installation was attempted with:

```bash
npm install --ignore-scripts --no-audit --no-fund
```

The package-registry operation exceeded the available execution window and timed out before `node_modules` was created. Therefore, full `npm run lint` and `npm run build` execution must still be completed locally.

## Required local verification

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:env
npm run check:routes
npm run lint
npm run build
npm run dev
```

## Required Firebase deployment

1. Merge `FIRESTORE_RULES_GROWVEST_GUIDE_V22.md` into the existing Firestore rules.
2. Deploy the updated `firestore.indexes.json`.
3. Open `/admin/growvest-guide/knowledge` and push approved defaults.
4. Review the WhatsApp number and disclaimer under `/admin/growvest-guide/settings`.
5. Complete the acceptance tests in `GROWVEST_GUIDE_WHATSAPP_V22.md`.

## Artifact integrity

- Complete-project ZIP integrity check passed.
- Updated-files ZIP integrity check passed.
- The complete package does not contain `.env.local`, `.next` or `node_modules`.
