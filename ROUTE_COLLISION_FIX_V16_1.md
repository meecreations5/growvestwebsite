# GrowVest v16.1 — Route Collision Fix

## Error addressed

Next.js reported that both of these files resolved to `/privacy-policy`:

- `src/app/(website)/privacy-policy/page.jsx`
- `src/app/privacy-policy/page.jsx`

The v16 clean package contains only the route-group version. The duplicate normally appears when v16 is extracted over an older GrowVest folder, leaving the earlier public page directories behind.

## Correct route architecture

Public website pages live under:

```text
src/app/(website)/...
```

The route-group name is not included in the public URL. For example:

```text
src/app/(website)/privacy-policy/page.jsx -> /privacy-policy
```

Admin pages live under:

```text
src/app/admin/...
```

## Recommended update method

Do not paste v16 over an existing v15 folder. Extract this release into a new empty folder, then copy only your `.env.local` file into it.

## Fix an existing merged folder

Run:

```bash
npm run cleanup:legacy-routes
rm -rf .next
npm run build
```

Windows PowerShell:

```powershell
npm run cleanup:legacy-routes
Remove-Item -Recurse -Force .next
npm run build
```

The cleanup command removes only known legacy public route copies at `src/app/<route>` when the matching `(website)` route group exists. It does not remove `/admin`, `/api`, shared components, layouts, metadata files, or assets.

## Preventing recurrence

`npm run build` now runs `npm run check:routes` first. If another duplicate URL path is introduced, the build stops with a readable list of the conflicting files.
