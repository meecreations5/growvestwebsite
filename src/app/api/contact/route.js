import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COMPANY } from "../../lib/brand";
import { sendTransactionalEmail } from "../../lib/server/brevo";
import { writeCommunicationLog } from "../../lib/server/communications";
import { getAdminDb, isFirebaseAdminConfigured } from "../../lib/server/firebaseAdmin";
import { createLeadActivityForPublicSubmission, normalizePhone } from "../../lib/server/enquiriesRepository";
import {
  ApiError,
  assertAllowedOrigin,
  cleanText,
  enforceRateLimit,
  escapeHtml,
  getRequestContext,
  readJsonBody,
} from "../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\-\s0-9]{7,20}$/;

function apiResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function validateForm(body) {
  const form = {
    name: cleanText(body.name, 100),
    email: cleanText(body.email, 160).toLowerCase(),
    phone: cleanText(body.phone, 40),
    service: cleanText(body.service, 140),
    slot: cleanText(body.slot, 100),
    message: cleanText(body.message, 1200),
    consent: body.consent === true,
    website: cleanText(body.website, 100),
    sourcePage: cleanText(body.sourcePage, 400),
    campaign: {
      source: cleanText(body.campaign?.source, 120),
      medium: cleanText(body.campaign?.medium, 120),
      campaign: cleanText(body.campaign?.campaign, 180),
      term: cleanText(body.campaign?.term, 180),
      content: cleanText(body.campaign?.content, 180),
    },
  };

  if (form.website) return { honeypot: true, form };
  if (!form.name || !form.email || !form.phone || !form.slot || !form.consent) {
    throw new ApiError(400, "Please complete all required fields and accept the consent statement.", "VALIDATION_FAILED");
  }
  if (!EMAIL_PATTERN.test(form.email)) {
    throw new ApiError(400, "Please enter a valid email address.", "INVALID_EMAIL");
  }
  if (!PHONE_PATTERN.test(form.phone)) {
    throw new ApiError(400, "Please enter a valid phone number.", "INVALID_PHONE");
  }

  return { honeypot: false, form };
}

export async function POST(request) {
  let requestId = "";
  let db;

  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request);
    const { honeypot, form } = validateForm(body);
    if (honeypot) return apiResponse({ ok: true });

    if (!isFirebaseAdminConfigured()) {
      throw new ApiError(
        503,
        `Online submission is temporarily unavailable. Please email ${COMPANY.email} or call ${COMPANY.phoneDisplay}.`,
        "FIREBASE_NOT_CONFIGURED",
      );
    }

    db = getAdminDb();
    const rateLimit = await enforceRateLimit({
      db,
      request,
      scope: "contact",
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    requestId = `GV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const requestContext = getRequestContext(request);
    const leadReference = db.collection("websiteLeads").doc(requestId);

    await leadReference.set({
      requestId,
      fullName: form.name,
      email: form.email,
      emailLowercase: form.email,
      phone: form.phone,
      phoneNormalized: normalizePhone(form.phone),
      enquiryType: "discovery_conversation",
      serviceArea: form.service || "not_selected",
      preferredSlot: form.slot,
      timezone: "Asia/Kolkata",
      message: form.message || "",
      consentAccepted: true,
      consentAcceptedAt: FieldValue.serverTimestamp(),
      source: "growvest_website",
      sourcePage: form.sourcePage || "/contact",
      campaign: form.campaign,
      status: "new",
      priority: "normal",
      assignedTo: null,
      assignedToName: "",
      assignedToEmail: "",
      firstResponseDueAt: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
      emailStatus: {
        teamNotification: "pending",
        visitorAcknowledgement: "pending",
      },
      ipHash: rateLimit.ipHash,
      userAgent: requestContext.userAgent,
      referrer: requestContext.referrer,
      origin: requestContext.origin,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const leadKey = `contact--${requestId}`;
    await createLeadActivityForPublicSubmission({
      leadKey,
      summary: "Received a new discovery-conversation request from the website.",
      details: { sourcePage: form.sourcePage || "/contact", serviceArea: form.service || "not_selected" },
    }).catch(() => {});

    const notificationEmail = process.env.GROWVEST_NOTIFICATION_EMAIL || COMPANY.email;
    const detailsHtml = `
      <h2>New GrowVest website enquiry</h2>
      <p><strong>Reference:</strong> ${escapeHtml(requestId)}</p>
      <p><strong>Name:</strong> ${escapeHtml(form.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(form.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(form.phone)}</p>
      <p><strong>Area:</strong> ${escapeHtml(form.service || "Not selected")}</p>
      <p><strong>Preferred slot:</strong> ${escapeHtml(form.slot)}</p>
      <p><strong>Message:</strong><br>${escapeHtml(form.message || "No message provided").replaceAll("\n", "<br>")}</p>
      <p><strong>Consent:</strong> Accepted</p>
    `;

    const teamResult = await sendTransactionalEmail({
      to: { email: notificationEmail, name: "GrowVest Team" },
      replyTo: { email: form.email, name: form.name },
      subject: `Website enquiry ${requestId}: ${form.name}`,
      htmlContent: detailsHtml,
    }).then(async (result) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "contact_team_notification",
        recipient: notificationEmail,
        status: "sent",
        providerMessageId: result?.messageId,
      });
      return { status: "sent", messageId: result?.messageId || null };
    }).catch(async (error) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "contact_team_notification",
        recipient: notificationEmail,
        status: "failed",
        providerCode: error?.providerCode,
        errorMessage: error?.message,
      }).catch(() => {});
      return { status: "failed", error };
    });

    const visitorResult = await sendTransactionalEmail({
      to: { email: form.email, name: form.name },
      subject: `GrowVest enquiry received - ${requestId}`,
      htmlContent: `
        <p>Dear ${escapeHtml(form.name)},</p>
        <p>Thank you for contacting GrowVest. We have received your request and will review it during business hours.</p>
        <p><strong>Your preferred slot:</strong> ${escapeHtml(form.slot)}</p>
        <p>Please note that the time remains subject to confirmation by the GrowVest team.</p>
        <p><strong>Reference:</strong> ${escapeHtml(requestId)}</p>
        <p>Regards,<br>GrowVest<br>${escapeHtml(COMPANY.positioning)}</p>
      `,
    }).then(async (result) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "contact_visitor_acknowledgement",
        recipient: form.email,
        status: "sent",
        providerMessageId: result?.messageId,
      });
      return { status: "sent", messageId: result?.messageId || null };
    }).catch(async (error) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "contact_visitor_acknowledgement",
        recipient: form.email,
        status: "failed",
        providerCode: error?.providerCode,
        errorMessage: error?.message,
      }).catch(() => {});
      return { status: "failed", error };
    });

    await leadReference.update({
      emailStatus: {
        teamNotification: teamResult.status,
        visitorAcknowledgement: visitorResult.status,
      },
      notificationMessageId: teamResult.messageId || null,
      acknowledgementMessageId: visitorResult.messageId || null,
      status: teamResult.status === "sent" ? "new" : "new_email_attention_required",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return apiResponse({
      ok: true,
      requestId,
      teamNotified: teamResult.status === "sent",
      acknowledgementSent: visitorResult.status === "sent",
    });
  } catch (error) {
    if (requestId && db) {
      await db.collection("websiteLeads").doc(requestId).set({
        status: "submission_error",
        lastErrorCode: error?.code || error?.providerCode || "UNEXPECTED_ERROR",
        lastErrorMessage: cleanText(error?.message, 500),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true }).catch(() => {});
    }

    if (error instanceof ApiError) {
      return apiResponse({ message: error.message, code: error.code }, error.status);
    }

    return apiResponse({
      message: "We could not process your request. Please try again or contact GrowVest directly.",
      code: "UNEXPECTED_ERROR",
    }, 500);
  }
}
