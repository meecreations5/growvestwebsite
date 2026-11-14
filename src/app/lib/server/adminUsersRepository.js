import { FieldValue } from "firebase-admin/firestore";
import { ADMIN_ROLES } from "./adminAuth";
import { getAdminAuth, getAdminDb } from "./firebaseAdmin";
import {
  isValidAdminEmail,
  isValidAdminUsername,
  isValidInitialPassword,
  normalizeAdminEmail,
  normalizeAdminUsername,
} from "./adminAccountCredentials";

const COLLECTION = "websiteAdmins";
const USERNAMES = "websiteAdminUsernames";
const AUDIT = "websiteAuditLogs";

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function publicAdmin(doc) {
  const profile = doc.data();
  return {
    uid: doc.id,
    email: profile.email || "",
    username: profile.username || "",
    authMethod: profile.authMethod || "existing",
    displayName: profile.displayName || "",
    role: profile.role || "",
    isActive: profile.isActive !== false,
    requiresPasswordChange: profile.requiresPasswordChange === true,
    updatedAt: profile.updatedAt?.toDate?.().toISOString?.() || null,
  };
}

async function auditAdminChange(db, actor, { action, uid, summary }) {
  // A failed audit write must not turn a successful Firebase provisioning call
  // into an ambiguous HTTP 500 that encourages duplicate account creation.
  try {
    await db.collection(AUDIT).add({
      actorId: actor.uid,
      actorName: actor.displayName,
      actorEmail: actor.email,
      action,
      entityType: "websiteAdmin",
      entityId: uid,
      summary,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Website admin audit write failed", error?.code || "unknown");
  }
}

export async function listAdminUsers() {
  const snapshot = await getAdminDb().collection(COLLECTION).limit(250).get();
  return snapshot.docs.map(publicAdmin).sort((a, b) => a.email.localeCompare(b.email));
}

async function provisionPasswordAdmin({ email, role, displayName, username, password }, actor) {
  const normalizedUsername = normalizeAdminUsername(username);
  if (!isValidAdminUsername(normalizedUsername)) {
    fail("Use a unique username of 3–32 characters, starting with a letter, containing only letters, numbers, dots, dashes or underscores.");
  }
  if (!isValidInitialPassword(password, normalizedUsername, email)) {
    fail("Use an initial password of 12–128 characters with letters and numbers. Do not include the username or email name.");
  }
  if (!String(displayName || "").trim()) fail("Enter the team member's full name.");

  const db = getAdminDb();
  const auth = getAdminAuth();
  const usernameRef = db.collection(USERNAMES).doc(normalizedUsername);
  if ((await usernameRef.get()).exists) fail("This username is already taken. Choose another.", 409);

  const safeName = String(displayName).trim().slice(0, 120);
  let user;
  try {
    user = await auth.createUser({
      email,
      password,
      displayName: safeName,
      emailVerified: false,
      disabled: false,
    });
  } catch (error) {
    if (error?.code === "auth/email-already-exists") {
      fail("This email already has a Firebase account. Choose Add existing account if the person uses Microsoft sign-in.", 409);
    }
    if (error?.code === "auth/invalid-password") fail("The initial password is not accepted by Firebase Authentication.");
    throw error;
  }

  try {
    await db.runTransaction(async (tx) => {
      const usernameSnapshot = await tx.get(usernameRef);
      if (usernameSnapshot.exists) fail("This username is already taken. Choose another.", 409);
      const profileRef = db.collection(COLLECTION).doc(user.uid);
      tx.create(usernameRef, { uid: user.uid, createdAt: FieldValue.serverTimestamp() });
      tx.create(profileRef, {
        email,
        username: normalizedUsername,
        displayName: safeName,
        authMethod: "password",
        requiresPasswordChange: true,
        role,
        isActive: true,
        permissions: [],
        createdBy: actor.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedBy: actor.uid,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    // A Firebase Auth identity must not be left available without its admin
    // profile when the username reservation or Firestore creation fails.
    await auth.deleteUser(user.uid).catch((deleteError) => {
      console.error("Website admin provisioning cleanup failed", deleteError?.code || "unknown");
    });
    throw error;
  }

  await auditAdminChange(db, actor, {
    action: "admin.password_account.created",
    uid: user.uid,
    summary: `Created a password-based ${role} account for ${normalizedUsername}.`,
  });
  return {
    uid: user.uid,
    email,
    username: normalizedUsername,
    displayName: safeName,
    authMethod: "password",
    requiresPasswordChange: true,
    role,
    isActive: true,
  };
}

async function grantExistingUserAccess({ email, role, displayName }, actor) {
  const auth = getAdminAuth();
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      fail("This person must first sign in using Microsoft (or be added in Firebase Authentication). After that, grant access here.", 404);
    }
    throw error;
  }
  if (user.disabled) fail("This Firebase Authentication account is disabled.");
  if (!user.emailVerified) fail("The email is not verified in Firebase Authentication. Verify it before granting access.");
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(user.uid);
  const current = await ref.get();
  if (current.exists) fail("This user already has an admin profile. Update their role below.", 409);
  const safeName = String(displayName || user.displayName || email).trim().slice(0, 120);
  await ref.create({
    email,
    displayName: safeName,
    role,
    authMethod: "existing",
    isActive: true,
    requiresPasswordChange: false,
    permissions: [],
    createdBy: actor.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedBy: actor.uid,
    updatedAt: FieldValue.serverTimestamp(),
  });
  await auditAdminChange(db, actor, {
    action: "admin.access.created",
    uid: user.uid,
    summary: `Granted ${role} website access to existing Firebase user ${email}.`,
  });
  return { uid: user.uid, email, username: "", displayName: safeName, authMethod: "existing", requiresPasswordChange: false, role, isActive: true };
}

export async function addAdminUser({ email, role, displayName, username, password, authMethod }, actor) {
  if (!ADMIN_ROLES.includes(role)) fail("Select an allowed Website Admin role.");
  const normalizedEmail = normalizeAdminEmail(email);
  if (!isValidAdminEmail(normalizedEmail)) fail("Enter a valid email address.");
  if (authMethod === "password") {
    return provisionPasswordAdmin({ email: normalizedEmail, role, displayName, username, password }, actor);
  }
  if (authMethod === undefined || authMethod === "existing") {
    return grantExistingUserAccess({ email: normalizedEmail, role, displayName }, actor);
  }
  fail("Select an available sign-in method.");
}

export async function updateAdminUser(uid, { role, isActive }, actor) {
  if (typeof uid !== "string" || uid.length > 140) fail("Invalid user identifier.");
  if (!ADMIN_ROLES.includes(role) || typeof isActive !== "boolean") fail("Choose a valid role and access status.");
  if (uid === actor.uid) fail("Administrators cannot change their own role or disable their own account.", 403);
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(uid);
  let after;
  await db.runTransaction(async (tx) => {
    const admins = await tx.get(db.collection(COLLECTION).where("role", "==", "super_admin"));
    const current = await tx.get(ref);
    if (!current.exists) fail("This admin profile does not exist.", 404);
    const before = current.data();
    if (before.role === "super_admin" && before.isActive !== false && (role !== "super_admin" || !isActive)) {
      const remaining = admins.docs.filter((item) => item.id !== uid && item.data().isActive !== false).length;
      if (remaining < 1) fail("Cannot remove the final active Super Admin.", 409);
    }
    tx.set(ref, { role, isActive, permissions: [], updatedBy: actor.uid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    after = {
      uid,
      email: before.email || "",
      username: before.username || "",
      displayName: before.displayName || "",
      authMethod: before.authMethod || "existing",
      requiresPasswordChange: before.requiresPasswordChange === true,
      role,
      isActive,
    };
  });
  await auditAdminChange(db, actor, {
    action: "admin.access.updated",
    uid,
    summary: `Changed website admin access for ${after.email} to ${role} (${isActive ? "active" : "inactive"}).`,
  });
  return after;
}
