import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth, getAdminDb } from "./firebaseAdmin";

export const ADMIN_SESSION_COOKIE = "growvest_admin_session";
export const ADMIN_ROLES = [
  "super_admin",
  "website_admin",
  "content_editor",
  "content_reviewer",
  "seo_manager",
];

const ROLE_PERMISSIONS = {
  super_admin: ["insights.read", "insights.create", "insights.update", "insights.review", "insights.publish", "insights.delete", "insights.versions", "insights.analytics", "media.manage", "taxonomy.manage", "authors.manage", "team.read", "team.manage", "testimonials.read", "testimonials.manage", "social.read", "social.manage", "website.read", "website.manage", "website.publish", "enquiries.read", "enquiries.manage", "enquiries.assign", "enquiries.communicate", "enquiries.convert", "enquiries.analytics", "guide.read", "guide.manage", "guide.conversations", "seo.read", "seo.manage", "system.read", "admins.manage"],
  website_admin: ["insights.read", "insights.create", "insights.update", "insights.review", "insights.publish", "insights.delete", "insights.versions", "insights.analytics", "media.manage", "taxonomy.manage", "authors.manage", "team.read", "team.manage", "testimonials.read", "testimonials.manage", "social.read", "social.manage", "website.read", "website.manage", "website.publish", "enquiries.read", "enquiries.manage", "enquiries.assign", "enquiries.communicate", "enquiries.convert", "enquiries.analytics", "guide.read", "guide.manage", "guide.conversations", "seo.read", "seo.manage"],
  content_editor: ["insights.read", "insights.create", "insights.update", "insights.versions", "media.manage", "website.read", "testimonials.read", "guide.read", "guide.manage"],
  content_reviewer: ["insights.read", "insights.update", "insights.review", "insights.publish", "insights.versions", "insights.analytics", "website.read", "testimonials.read", "enquiries.read", "guide.read", "guide.conversations", "seo.read"],
  seo_manager: ["insights.read", "insights.update", "insights.analytics", "media.manage", "website.read", "website.manage", "seo.read", "seo.manage"],
};

function normalizeAdmin(uid, authClaims, profile = {}) {
  const role = profile.role || authClaims.role || "content_editor";
  return {
    uid,
    email: profile.email || authClaims.email || "",
    displayName: profile.displayName || authClaims.name || authClaims.email || "GrowVest Admin",
    role,
    permissions: Array.from(new Set([
      ...(ROLE_PERMISSIONS[role] || []),
      ...(Array.isArray(profile.permissions) ? profile.permissions : []),
    ])),
    isActive: profile.isActive !== false,
  };
}

export async function verifyAdminSessionCookie(sessionCookie) {
  if (!sessionCookie) return null;
  try {
    const authClaims = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const profileSnapshot = await getAdminDb().collection("websiteAdmins").doc(authClaims.uid).get();
    if (!profileSnapshot.exists) return null;
    const admin = normalizeAdmin(authClaims.uid, authClaims, profileSnapshot.data());
    return admin.isActive && ADMIN_ROLES.includes(admin.role) ? admin : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value || "");
}

export async function requireAdminPage(permission = "insights.read") {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  if (permission && !admin.permissions.includes(permission)) redirect("/admin/access-denied");
  return admin;
}

export async function requireAdminRequest(request, permission = "insights.read") {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  const admin = await verifyAdminSessionCookie(sessionCookie);
  if (!admin) {
    const error = new Error("Your admin session is unavailable or has expired.");
    error.status = 401;
    error.code = "ADMIN_UNAUTHENTICATED";
    throw error;
  }
  if (permission && !admin.permissions.includes(permission)) {
    const error = new Error("You do not have permission to complete this action.");
    error.status = 403;
    error.code = "ADMIN_FORBIDDEN";
    throw error;
  }
  return admin;
}
