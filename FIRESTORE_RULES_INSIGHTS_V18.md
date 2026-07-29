# Firestore rules — GrowVest Insights CMS v18

The public website and Website Admin use protected Next.js server routes with Firebase Admin. Merge the following rules into the existing Report Tool rules. Do not replace the complete rules file.

```rules
match /websiteAdmins/{document=**} {
  allow read, write: if false;
}

match /insightsPosts/{document=**} {
  allow read, write: if false;
}

match /insightCategories/{document=**} {
  allow read, write: if false;
}

match /insightTags/{document=**} {
  allow read, write: if false;
}

match /insightAuthors/{document=**} {
  allow read, write: if false;
}

match /websiteMedia/{document=**} {
  allow read, write: if false;
}

match /insightVersions/{document=**} {
  allow read, write: if false;
}

match /insightMetrics/{document=**} {
  allow read, write: if false;
}

match /websiteRedirects/{document=**} {
  allow read, write: if false;
}

match /websiteAuditLogs/{document=**} {
  allow read, write: if false;
}
```

Firebase Admin bypasses Firestore Security Rules. Access is enforced by the server session, role permissions, origin checks and rate limits.
