import { createHash } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";

export class ApiError extends Error {
  constructor(status, message, code = "REQUEST_FAILED") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function cleanText(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function escapeHtml(value, maxLength = 2000) {
  return cleanText(value, maxLength)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function getRequestContext(request) {
  return {
    userAgent: cleanText(request.headers.get("user-agent"), 500),
    referrer: cleanText(request.headers.get("referer"), 500),
    origin: cleanText(request.headers.get("origin"), 250),
  };
}

export function hashValue(value) {
  const salt = process.env.FORM_RATE_LIMIT_SALT
    || process.env.FIREBASE_ADMIN_PROJECT_ID
    || "growvest-local-development";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function normalizedOrigin(value) {
  const cleaned = cleanText(value, 300);
  if (!cleaned) return "";
  try {
    const candidate = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    return new URL(candidate).origin;
  } catch {
    return "";
  }
}

function allowedOrigins(request) {
  const forwardedHost = request?.headers?.get("x-forwarded-host") || request?.headers?.get("host");
  const forwardedProtocol = request?.headers?.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
  const requestHostOrigin = forwardedHost ? normalizedOrigin(`${forwardedProtocol}://${forwardedHost}`) : "";

  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    ...(process.env.ALLOWED_ORIGINS || "").split(","),
    ...(process.env.ALLOWED_FORM_ORIGINS || "").split(","),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "",
    requestHostOrigin,
  ]
    .map((value) => normalizedOrigin(value))
    .filter(Boolean);

  const canonical = normalizedOrigin(process.env.NEXT_PUBLIC_SITE_URL || "https://growvest.info");
  if (canonical) {
    configured.push(canonical);
    const url = new URL(canonical);
    configured.push(url.hostname.startsWith("www.")
      ? `${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ""}`
      : `${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ""}`);
  }

  if (process.env.NODE_ENV !== "production") {
    configured.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return new Set(configured);
}

export function assertAllowedOrigin(request) {
  const originHeader = request.headers.get("origin");
  let suppliedOrigin = normalizedOrigin(originHeader);

  if (!suppliedOrigin) {
    suppliedOrigin = normalizedOrigin(request.headers.get("referer"));
  }

  // Non-browser server-to-server calls may not send either header. Authentication,
  // webhook tokens and cron secrets remain responsible for those routes.
  if (!suppliedOrigin) return;

  if (!allowedOrigins(request).has(suppliedOrigin)) {
    throw new ApiError(403, "This request could not be verified.", "ORIGIN_NOT_ALLOWED");
  }
}

export async function readJsonBody(request, maxBytes = 24_000) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    throw new ApiError(413, "The submitted form is too large.", "PAYLOAD_TOO_LARGE");
  }

  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "The submitted form could not be read.", "INVALID_JSON");
  }
}

export async function enforceRateLimit({
  db,
  request,
  scope,
  limit,
  windowMs,
}) {
  const ipHash = hashValue(getClientIp(request));
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const documentId = `${scope}_${ipHash}_${windowStart}`;
  const reference = db.collection("formRateLimits").doc(documentId);

  const result = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const currentCount = snapshot.exists ? Number(snapshot.data()?.count || 0) : 0;

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, ipHash };
    }

    transaction.set(reference, {
      scope,
      ipHash,
      windowStart: Timestamp.fromMillis(windowStart),
      count: currentCount + 1,
      expiresAt: Timestamp.fromMillis(windowStart + windowMs * 2),
      updatedAt: Timestamp.now(),
    }, { merge: true });

    return { allowed: true, remaining: Math.max(0, limit - currentCount - 1), ipHash };
  });

  if (!result.allowed) {
    throw new ApiError(429, "Too many requests. Please try again later.", "RATE_LIMITED");
  }

  return result;
}
