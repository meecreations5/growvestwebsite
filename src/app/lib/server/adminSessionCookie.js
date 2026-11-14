export const ADMIN_SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5;

export function adminSessionCookieOptions(maxAge = Math.floor(ADMIN_SESSION_DURATION_MS / 1000)) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}
