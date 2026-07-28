# GrowVest v19 — Team Hierarchy and Social Media Management

## Admin routes

- `/admin/team`
- `/admin/team/new`
- `/admin/team/[id]/edit`
- `/admin/social-media`

## Public integration

Published team profiles appear on `/about` in this controlled hierarchy:

1. Leadership
2. Client Relationships
3. Operations and Experience
4. Technology and Insights

Only profiles with `status: published` and `isVisible: true` are public. Empty departments are not rendered. If no profiles are published, the complete team section remains hidden.

Social links can be placed independently in:

- Footer
- About page
- Contact page
- Mobile navigation

Only active accounts should be published.

## Collections

### `teamMembers`

Key fields:

- `fullName`
- `designation`
- `department`
- `hierarchyLevel`
- `displayOrder`
- `shortBio`
- `bio`
- `photo`
- `qualifications`
- `certifications`
- `linkedinUrl`
- `publicEmail`
- `status`
- `isVisible`

### `websiteSocialLinks`

Key fields:

- `platform`
- `label`
- `handle`
- `url`
- `displayOrder`
- `isVisible`
- `openInNewTab`
- `locations`

## Permissions

- `team.read`
- `team.manage`
- `social.read`
- `social.manage`

`super_admin` and `website_admin` receive all four permissions. Other roles do not receive access unless permissions are explicitly added to their Website Admin profile.

## Publishing safeguards

- Publish only verified names, positions, qualifications and certification details.
- Do not use regulated titles unless the relevant registration is independently verified.
- A photograph with a public URL requires meaningful alternative text before publication.
- Archiving a team profile removes it from the public website while retaining the record and audit trail.
- Social accounts should be official, active and owned or controlled by GrowVest.

## Cache behaviour

Public team and social content is cached for up to five minutes and invalidated immediately after successful Admin changes.
