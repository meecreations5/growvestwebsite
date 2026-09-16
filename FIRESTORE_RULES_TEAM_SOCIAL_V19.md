# Firestore rules — GrowVest Team and Social Management v19

The public website and Website Admin use protected Next.js server routes with Firebase Admin. Merge these rules into the existing Report Tool rules. Do not replace the complete rules file.

```rules
match /teamMembers/{document=**} {
  allow read, write: if false;
}

match /websiteSocialLinks/{document=**} {
  allow read, write: if false;
}
```

Firebase Admin bypasses Firestore Security Rules. Access is enforced through the Website Admin session, role permissions, origin checks, payload validation and audit logging.

Team photographs use the existing protected `website-media` Storage path from the Insights CMS.
