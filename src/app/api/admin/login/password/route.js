import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { ADMIN_ROLES, ADMIN_SESSION_COOKIE } from "../../../../lib/server/adminAuth";
import { getAdminAuth, getAdminDb } from "../../../../lib/server/firebaseAdmin";
import { normalizeAdminUsername, isValidAdminUsername } from "../../../../lib/server/adminAccountCredentials";
import { adminSessionCookieOptions, ADMIN_SESSION_DURATION_MS } from "../../../../lib/server/adminSessionCookie";
import { signInFirebasePassword } from "../../../../lib/server/firebasePasswordSignIn";
import { assertAllowedOrigin, enforceRateLimit, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID_CREDENTIALS = "The username or password is not correct.";
const invalidCredentials = () => NextResponse.json({ error: INVALID_CREDENTIALS, code: "INVALID_CREDENTIALS" }, { status: 401 });

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 4000);
    const username = normalizeAdminUsername(body?.username);
    const password = body?.password;
    if (!isValidAdminUsername(username) || typeof password !== "string" || password.length > 256 || !password) {
      return invalidCredentials();
    }

    const db = getAdminDb();
    // Durable, cross-instance rate limiting. Firebase also applies its own
    // password sign-in abuse controls.
    await enforceRateLimit({ db, request, scope: "admin_username_signin", limit: 15, windowMs: 15 * 60_000 });

    const usernameDoc = await db.collection("websiteAdminUsernames").doc(username).get();
    if (!usernameDoc.exists) return invalidCredentials();
    const uid = usernameDoc.data()?.uid;
    if (typeof uid !== "string" || !uid) return invalidCredentials();

    const adminDoc = await db.collection("websiteAdmins").doc(uid).get();
    const profile = adminDoc.data();
    if (!profile || profile.isActive === false || !ADMIN_ROLES.includes(profile.role) || profile.authMethod !== "password" || profile.username !== username) {
      return invalidCredentials();
    }

    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    if (user.disabled || !user.email) return invalidCredentials();

    const idToken = await signInFirebasePassword(user.email, password);
    if (!idToken) return invalidCredentials();
    const decoded = await auth.verifyIdToken(idToken, true);
    if (decoded.uid !== uid) return invalidCredentials();
    const age = Math.floor(Date.now() / 1000) - Number(decoded.auth_time || 0);
    if (age < 0 || age > 5 * 60) return invalidCredentials();

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ADMIN_SESSION_DURATION_MS });
    const requiresPasswordChange = profile.requiresPasswordChange === true;
    const response = NextResponse.json({
      ok: true,
      requiresPasswordChange,
      redirectTo: requiresPasswordChange ? "/admin/change-password" : "/admin/dashboard",
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, adminSessionCookieOptions());

    await db.collection("websiteAuditLogs").add({
      actorId: uid,
      actorName: profile.displayName || username,
      actorEmail: profile.email || user.email,
      action: "admin.username_login.success",
      entityType: "websiteAdmin",
      entityId: uid,
      createdAt: FieldValue.serverTimestamp(),
    }).catch((error) => console.error("Admin login audit write failed", error?.code || "unknown"));
    return response;
  } catch (error) {
    if (error?.status === 429) {
      return NextResponse.json({ error: "Too many sign-in attempts. Please try again later." }, { status: 429 });
    }
    if (error?.status === 400 || error?.status === 403 || error?.status === 413) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Username sign-in could not be completed", error?.code || error?.status || "unknown");
    return NextResponse.json({ error: "Unable to complete sign-in. Please try again later." }, { status: 503 });
  }
}
