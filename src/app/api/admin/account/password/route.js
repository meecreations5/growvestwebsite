import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "../../../../lib/server/adminAuth";
import { getAdminAuth, getAdminDb } from "../../../../lib/server/firebaseAdmin";
import { isValidInitialPassword } from "../../../../lib/server/adminAccountCredentials";
import { adminSessionCookieOptions } from "../../../../lib/server/adminSessionCookie";
import { signInFirebasePassword } from "../../../../lib/server/firebasePasswordSignIn";
import { assertAllowedOrigin, enforceRateLimit, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "");
    if (!admin) return NextResponse.json({ error: "Sign in to change your password." }, { status: 401 });
    if (admin.authMethod !== "password") {
      return NextResponse.json({ error: "This account uses a different sign-in method." }, { status: 403 });
    }

    const body = await readJsonBody(request, 4000);
    const oldPassword = body?.currentPassword;
    const newPassword = body?.newPassword;
    if (typeof oldPassword !== "string" || !oldPassword || oldPassword.length > 256) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    }
    if (!isValidInitialPassword(newPassword, admin.username, admin.email) || newPassword === oldPassword) {
      return NextResponse.json({ error: "Use a different password with 12–128 characters, letters and numbers, without your username or email name." }, { status: 400 });
    }

    const db = getAdminDb();
    await enforceRateLimit({ db, request, scope: "admin_password_change", limit: 10, windowMs: 15 * 60_000 });
    const auth = getAdminAuth();
    const user = await auth.getUser(admin.uid);
    if (user.disabled || !user.email) return NextResponse.json({ error: "Account unavailable." }, { status: 403 });
    const currentToken = await signInFirebasePassword(user.email, oldPassword);
    if (!currentToken) return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    const verified = await auth.verifyIdToken(currentToken, true);
    if (verified.uid !== admin.uid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });

    await auth.updateUser(admin.uid, { password: newPassword });
    await db.collection("websiteAdmins").doc(admin.uid).update({
      requiresPasswordChange: false,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: admin.uid,
    });
    await auth.revokeRefreshTokens(admin.uid);
    await db.collection("websiteAuditLogs").add({
      actorId: admin.uid,
      actorName: admin.displayName,
      actorEmail: admin.email,
      action: "admin.password.changed",
      entityType: "websiteAdmin",
      entityId: admin.uid,
      createdAt: FieldValue.serverTimestamp(),
    }).catch((error) => console.error("Admin password audit write failed", error?.code || "unknown"));

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, "", adminSessionCookieOptions(0));
    return response;
  } catch (error) {
    if (error?.status === 429) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    if ([400, 403, 413, 503].includes(error?.status)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Admin password change failed", error?.code || error?.status || "unknown");
    return NextResponse.json({ error: "Password could not be changed. Please try again." }, { status: 500 });
  }
}
