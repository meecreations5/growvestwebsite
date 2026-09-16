# GrowVest Backup and Recovery — v23

## Firebase data

Use scheduled Google Cloud Firestore exports to a restricted Cloud Storage bucket. Keep the export bucket separate from public website media and restrict access to approved operations personnel.

Collections requiring particular attention include:

- `websiteAdmins`
- `websitePages`, `websiteSettings`, `websiteNavigation`
- `insightsPosts`, taxonomies, authors and versions
- `teamMembers`, `websiteSocialLinks`
- `investorTestimonials`
- `websiteLeads`, `bucketListLeads`, `newsletterSubscribers`
- `leadActivities`, `leadNotes`, `leadConversionRequests`
- `guideKnowledge`, `guideSettings`, conversations and messages
- `communicationLogs`, audit logs and media metadata

## Firebase Storage

Enable bucket versioning or maintain a scheduled copy of website media. Confirm that deleted or replaced client-approved photographs can be recovered.

## Release artifacts

Retain:

- the verified source ZIP
- the deployment commit SHA
- production environment-variable inventory without secret values
- deployed Firestore and Storage rules
- deployed index configuration
- smoke-test results
- approval record and rollback owner

## Recovery test

At least quarterly:

1. Restore a Firestore export into a non-production project.
2. Verify website content, Insights, media references and Admin records.
3. Confirm private collections remain inaccessible to unauthenticated clients.
4. Record recovery time and unresolved dependencies.

A backup is not considered valid until a restore test succeeds.
