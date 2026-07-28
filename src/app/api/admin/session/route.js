import { NextResponse } from "next/server";
import {
  ADMIN_ROLES,
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionCookie,
} from "../../../lib/server/adminAuth";
import { getAdminAuth, getAdminDb } from "../../../lib/server/firebaseAdmin";
import { assertAllowedOrigin, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5;

function cookieOptions(maxAge = Math.floor(SESSION_DURATION_MS / 1000)) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

function errorResponse(status, error, code = "ADMIN_SESSION_FAILED") {
  return NextResponse.json(
    {
      error,
      code,
    },
    { status },
  );
}

function normalizeServerError(error) {
  const firebaseCode = typeof error?.code === "string" ? error.code : "";

  if (firebaseCode.includes("id-token-expired")) {
    return {
      status: 401,
      code: "FIREBASE_ID_TOKEN_EXPIRED",
      message: "Your Firebase sign-in token expired. Please sign in again.",
    };
  }

  if (firebaseCode.includes("argument-error") || firebaseCode.includes("invalid-id-token")) {
    return {
      status: 401,
      code: "FIREBASE_ID_TOKEN_INVALID",
      message: "The Firebase sign-in token could not be verified.",
    };
  }

  return {
    status: Number(error?.status || 401),
    code: error?.code || "ADMIN_SESSION_FAILED",
    message: error?.message || "Unable to start the admin session.",
  };
}

export async function GET(request) {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  const admin = await verifyAdminSessionCookie(sessionCookie);

  if (!admin) {
    return errorResponse(401, "The Website Admin session is unavailable or has expired.", "ADMIN_UNAUTHENTICATED");
  }

  return NextResponse.json({ authenticated: true, admin });
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);

    const { idToken } = await readJsonBody(request, 12_000);
    if (!idToken) {
      return errorResponse(400, "Firebase ID token is required.", "FIREBASE_ID_TOKEN_REQUIRED");
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(String(idToken), true);
    const authenticationAgeSeconds = Math.floor(Date.now() / 1000) - Number(decoded.auth_time || 0);

    if (authenticationAgeSeconds > 5 * 60) {
      return errorResponse(
        401,
        "Please sign in again before starting an admin session.",
        "FIREBASE_RECENT_LOGIN_REQUIRED",
      );
    }

    const adminSnapshot = await getAdminDb().collection("websiteAdmins").doc(decoded.uid).get();

    if (!adminSnapshot.exists) {
      return errorResponse(
        403,
        "This Firebase user is not listed in the GrowVest Website Admin directory.",
        "ADMIN_ACCESS_NOT_FOUND",
      );
    }

    const adminProfile = adminSnapshot.data() || {};

    if (adminProfile.isActive === false) {
      return errorResponse(
        403,
        "This GrowVest Website Admin account is inactive.",
        "ADMIN_ACCESS_INACTIVE",
      );
    }

    if (!ADMIN_ROLES.includes(adminProfile.role)) {
      return errorResponse(
        403,
        "This GrowVest Website Admin account does not have a valid admin role.",
        "ADMIN_ROLE_INVALID",
      );
    }

    const sessionCookie = await auth.createSessionCookie(String(idToken), {
      expiresIn: SESSION_DURATION_MS,
    });

    const response = NextResponse.json({
      ok: true,
      admin: {
        uid: decoded.uid,
        email: adminProfile.email || decoded.email || "",
        role: adminProfile.role,
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, cookieOptions());
    return response;
  } catch (error) {
    const normalized = normalizeServerError(error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[GrowVest Admin Session] code=${normalized.code} status=${normalized.status} message=${normalized.message}`,
      );
    }

    return errorResponse(normalized.status, normalized.message, normalized.code);
  }
}

export async function DELETE(request) {
  try {
    assertAllowedOrigin(request);
  } catch {
    // Clearing an HTTP-only cookie remains safe when the Origin header is absent.
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", cookieOptions(0));
  return response;
}
