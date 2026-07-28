import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function readAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyValue = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.FIREBASE_ADMIN_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  return {
    projectId,
    clientEmail,
    privateKey: privateKeyValue?.replace(/\\n/g, "\n"),
    storageBucket,
  };
}

export function isFirebaseAdminConfigured() {
  const { projectId, clientEmail, privateKey } = readAdminConfig();
  return Boolean(projectId && ((clientEmail && privateKey) || process.env.GOOGLE_APPLICATION_CREDENTIALS));
}

export function getFirebaseAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const { projectId, clientEmail, privateKey, storageBucket } = readAdminConfig();
  if (!projectId) {
    throw new Error("Firebase Admin is not configured: missing project ID.");
  }

  const credential = clientEmail && privateKey
    ? cert({ projectId, clientEmail, privateKey })
    : applicationDefault();

  return initializeApp({
    credential,
    projectId,
    ...(storageBucket ? { storageBucket } : {}),
  });
}

export function getAdminDb() {
  const db = getFirestore(getFirebaseAdminApp());
  if (!globalThis.__growvestFirestoreSettingsApplied) {
    db.settings({ ignoreUndefinedProperties: true });
    globalThis.__growvestFirestoreSettingsApplied = true;
  }
  return db;
}
