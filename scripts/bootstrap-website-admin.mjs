import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function value(name) { return process.env[name]?.replace(/\\n/g, "\n"); }
function argument(name) { const index = process.argv.indexOf(`--${name}`); return index >= 0 ? process.argv[index + 1] : ""; }

const projectId = value("FIREBASE_ADMIN_PROJECT_ID") || value("FIREBASE_PROJECT_ID");
const clientEmail = value("FIREBASE_ADMIN_CLIENT_EMAIL") || value("FIREBASE_CLIENT_EMAIL");
const privateKey = value("FIREBASE_ADMIN_PRIVATE_KEY") || value("FIREBASE_PRIVATE_KEY");
const email = argument("email");
const role = argument("role") || "super_admin";

if (!projectId || !email) {
  console.error("Usage: npm run bootstrap:website-admin -- --email admin@growvest.info --role super_admin");
  process.exit(1);
}

const credential = clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault();
const app = getApps()[0] || initializeApp({ credential, projectId });
const auth = getAuth(app);
const db = getFirestore(app);

try {
  const user = await auth.getUserByEmail(email);
  await db.collection("websiteAdmins").doc(user.uid).set({
    email: user.email,
    displayName: user.displayName || user.email?.split("@")[0] || "GrowVest Admin",
    role,
    permissions: [],
    isActive: true,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log(`Website Admin access enabled for ${email} with role ${role}.`);
} catch (error) {
  console.error(error?.message || error);
  console.error("Create the Firebase Authentication user first, then run this command again.");
  process.exit(1);
}
