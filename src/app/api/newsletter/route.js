import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COMPANY } from "../../lib/brand";
import { createOrUpdateBrevoContact } from "../../lib/server/brevo";
import { writeCommunicationLog } from "../../lib/server/communications";
import { getAdminDb, isFirebaseAdminConfigured } from "../../lib/server/firebaseAdmin";
import {
  ApiError,
  assertAllowedOrigin,
  cleanText,
  enforceRateLimit,
  getRequestContext,
  hashValue,
  readJsonBody,
} from "../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function apiResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request) {
  let db;
  let subscriberId = "";

  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 8_000);
    const email = cleanText(body.email, 160).toLowerCase();
    const consent = body.consent === true;
    const honeypot = cleanText(body.website, 100);

    if (honeypot) return apiResponse({ ok: true });
    if (!email || !consent || !EMAIL_PATTERN.test(email)) {
      throw new ApiError(400, "Enter a valid email address and accept the consent statement.", "VALIDATION_FAILED");
    }
    if (!isFirebaseAdminConfigured()) {
      throw new ApiError(503, `Newsletter signup is temporarily unavailable. Please email ${COMPANY.email}.`, "FIREBASE_NOT_CONFIGURED");
    }

    db = getAdminDb();
    const rateLimit = await enforceRateLimit({
      db,
      request,
      scope: "newsletter",
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    subscriberId = hashValue(`newsletter:${email}`);
    const subscriberReference = db.collection("newsletterSubscribers").doc(subscriberId);
    const requestContext = getRequestContext(request);

    await subscriberReference.set({
      subscriberId,
      email,
      emailLowercase: email,
      consentAccepted: true,
      consentAcceptedAt: FieldValue.serverTimestamp(),
      source: "growvest_website",
      status: "pending_provider_sync",
      provider: "brevo",
      ipHash: rateLimit.ipHash,
      userAgent: requestContext.userAgent,
      referrer: requestContext.referrer,
      origin: requestContext.origin,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    try {
      await createOrUpdateBrevoContact({
        email,
        listId: process.env.BREVO_NEWSLETTER_LIST_ID,
        attributes: {
          SIGNUP_SOURCE: "GrowVest Website",
        },
      });

      await subscriberReference.set({
        status: "subscribed",
        providerStatus: "synced",
        subscribedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      await writeCommunicationLog(db, {
        subscriberId,
        type: "newsletter_subscription_sync",
        recipient: email,
        status: "sent",
      });
    } catch (error) {
      await subscriberReference.set({
        status: "provider_sync_failed",
        providerStatus: "failed",
        providerCode: error?.providerCode || "BREVO_REQUEST_FAILED",
        lastErrorMessage: cleanText(error?.message, 500),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      await writeCommunicationLog(db, {
        subscriberId,
        type: "newsletter_subscription_sync",
        recipient: email,
        status: "failed",
        providerCode: error?.providerCode,
        errorMessage: error?.message,
      }).catch(() => {});

      throw error;
    }

    return apiResponse({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiResponse({ message: error.message, code: error.code }, error.status);
    }

    const status = Number(error?.status) || 500;
    const publicStatus = status >= 400 && status < 500 ? status : 500;
    return apiResponse({
      message: publicStatus === 503
        ? `Newsletter signup is not fully configured. Please email ${COMPANY.email}.`
        : "We could not complete your subscription. Please try again later.",
      code: error?.providerCode || "NEWSLETTER_FAILED",
    }, publicStatus);
  }
}
