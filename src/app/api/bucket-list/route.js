import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COMPANY } from "../../lib/brand";
import { sendTransactionalEmail } from "../../lib/server/brevo";
import { writeCommunicationLog } from "../../lib/server/communications";
import { getAdminDb, isFirebaseAdminConfigured } from "../../lib/server/firebaseAdmin";
import { createLeadActivityForPublicSubmission, normalizePhone, syncEnquiryDirectory } from "../../lib/server/enquiriesRepository";
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\-\s0-9]{7,20}$/;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function apiResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function validNumber(value, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) return null;
  return Math.round(number);
}

function formatInr(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function validatePayload(body) {
  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 160).toLowerCase();
  const phone = cleanText(body.phone, 40);
  const consent = body.consent === true;
  const website = cleanText(body.website, 100);
  const assumedRate = Number(body.assumedRate);
  const rawGoals = Array.isArray(body.goals) ? body.goals.slice(0, 10) : [];
  const sourcePage = cleanText(body.sourcePage, 400);
  const campaign = {
    source: cleanText(body.campaign?.source, 120),
    medium: cleanText(body.campaign?.medium, 120),
    campaign: cleanText(body.campaign?.campaign, 180),
    term: cleanText(body.campaign?.term, 180),
    content: cleanText(body.campaign?.content, 180),
  };

  if (website) return { honeypot: true };
  if (!name || !email || !consent || !EMAIL_PATTERN.test(email)) {
    throw new ApiError(400, "Enter your name and a valid email address, then accept the consent statement.", "VALIDATION_FAILED");
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    throw new ApiError(400, "Please enter a valid phone number or leave it blank.", "INVALID_PHONE");
  }
  if (!Number.isFinite(assumedRate) || assumedRate < 0.01 || assumedRate > 0.25) {
    throw new ApiError(400, "The selected return assumption is not valid.", "INVALID_ASSUMPTION");
  }
  if (!rawGoals.length) {
    throw new ApiError(400, "Add at least one goal before requesting a summary.", "NO_GOALS");
  }

  const goals = rawGoals.map((goal, index) => {
    const label = cleanText(goal.label, 100);
    const goalId = cleanText(goal.goalId, 80) || `goal-${index + 1}`;
    const corpus = validNumber(goal.corpus, 1, 1_000_000_000);
    const years = validNumber(goal.years, 1, 60);
    const monthly = validNumber(goal.monthly, 0, 100_000_000);

    if (!label || corpus === null || years === null || monthly === null) {
      throw new ApiError(400, "One or more goal details are invalid.", "INVALID_GOAL_DATA");
    }

    return { goalId, label, corpus, years, monthly };
  });

  return {
    honeypot: false,
    name,
    email,
    phone,
    consent,
    assumedRate,
    goals,
    totalMonthly: goals.reduce((sum, goal) => sum + goal.monthly, 0),
    totalGoalValue: goals.reduce((sum, goal) => sum + goal.corpus, 0),
    sourcePage,
    campaign,
  };
}

function goalRowsHtml(goals) {
  return goals.map((goal) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(goal.label)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb">${formatInr(goal.corpus)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb">${goal.years} year${goal.years === 1 ? "" : "s"}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb">${formatInr(goal.monthly)}/month</td>
    </tr>
  `).join("");
}

export async function POST(request) {
  let db;
  let requestId = "";

  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 32_000);
    const payload = validatePayload(body);
    if (payload.honeypot) return apiResponse({ ok: true });

    if (!isFirebaseAdminConfigured()) {
      throw new ApiError(503, `Summary requests are temporarily unavailable. Please email ${COMPANY.email}.`, "FIREBASE_NOT_CONFIGURED");
    }

    db = getAdminDb();
    const rateLimit = await enforceRateLimit({
      db,
      request,
      scope: "bucket_list",
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    requestId = `GV-BL-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const requestContext = getRequestContext(request);
    const reference = db.collection("bucketListLeads").doc(requestId);

    await reference.set({
      requestId,
      fullName: payload.name,
      email: payload.email,
      emailLowercase: payload.email,
      phone: payload.phone || "",
      phoneNormalized: normalizePhone(payload.phone),
      goals: payload.goals,
      assumedAnnualReturn: payload.assumedRate,
      estimatedMonthlyInvestment: payload.totalMonthly,
      totalValueOfSelectedGoals: payload.totalGoalValue,
      currency: "INR",
      consentAccepted: true,
      consentAcceptedAt: FieldValue.serverTimestamp(),
      source: "growvest_bucket_list_builder",
      sourcePage: payload.sourcePage || "/bucket-list-builder",
      campaign: payload.campaign,
      status: "new",
      priority: "high",
      assignedTo: null,
      assignedToName: "",
      assignedToEmail: "",
      firstResponseDueAt: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
      emailStatus: {
        teamNotification: "pending",
        visitorSummary: "pending",
      },
      ipHash: rateLimit.ipHash,
      userAgent: requestContext.userAgent,
      referrer: requestContext.referrer,
      origin: requestContext.origin,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const leadKey = `bucket--${requestId}`;
    await createLeadActivityForPublicSubmission({
      leadKey,
      summary: "Received a new Bucket List summary request.",
      details: { sourcePage: payload.sourcePage || "/bucket-list-builder", goalCount: payload.goals.length, estimatedMonthlyInvestment: payload.totalMonthly },
    }).catch(() => {});

    const table = `
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #1F4ED8">Goal</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #1F4ED8">Target</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #1F4ED8">Timeline</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #1F4ED8">Estimate</th>
          </tr>
        </thead>
        <tbody>${goalRowsHtml(payload.goals)}</tbody>
      </table>
    `;

    const notificationEmail = process.env.GROWVEST_NOTIFICATION_EMAIL || COMPANY.email;
    const teamResult = await sendTransactionalEmail({
      to: { email: notificationEmail, name: "GrowVest Team" },
      replyTo: { email: payload.email, name: payload.name },
      subject: `Bucket List summary request ${requestId}: ${payload.name}`,
      htmlContent: `
        <h2>New Bucket List summary request</h2>
        <p><strong>Reference:</strong> ${escapeHtml(requestId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone || "Not provided")}</p>
        <p><strong>Assumed annual return:</strong> ${(payload.assumedRate * 100).toFixed(0)}%</p>
        ${table}
        <p><strong>Estimated monthly total:</strong> ${formatInr(payload.totalMonthly)}</p>
        <p><strong>Total value of selected goals:</strong> ${formatInr(payload.totalGoalValue)}</p>
      `,
    }).then(async (result) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "bucket_list_team_notification",
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
        type: "bucket_list_team_notification",
        recipient: notificationEmail,
        status: "failed",
        providerCode: error?.providerCode,
        errorMessage: error?.message,
      }).catch(() => {});
      return { status: "failed", error };
    });

    const visitorResult = await sendTransactionalEmail({
      to: { email: payload.email, name: payload.name },
      subject: `Your GrowVest Bucket List estimate - ${requestId}`,
      htmlContent: `
        <p>Dear ${escapeHtml(payload.name)},</p>
        <p>Here is the illustrative Bucket List estimate you requested.</p>
        ${table}
        <p><strong>Estimated monthly investment:</strong> ${formatInr(payload.totalMonthly)}</p>
        <p><strong>Total value of selected goals:</strong> ${formatInr(payload.totalGoalValue)}</p>
        <p><strong>Assumed annual return:</strong> ${(payload.assumedRate * 100).toFixed(0)}%</p>
        <p>This is an educational estimate using month-end contributions. Actual outcomes depend on inflation, taxes, costs, timing and market conditions.</p>
        <p><strong>Reference:</strong> ${escapeHtml(requestId)}</p>
        <p>Regards,<br>GrowVest<br>${escapeHtml(COMPANY.positioning)}</p>
      `,
    }).then(async (result) => {
      await writeCommunicationLog(db, {
        requestId,
        leadKey,
        entityType: "websiteLead",
        entityId: requestId,
        type: "bucket_list_visitor_summary",
        recipient: payload.email,
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
        type: "bucket_list_visitor_summary",
        recipient: payload.email,
        status: "failed",
        providerCode: error?.providerCode,
        errorMessage: error?.message,
      }).catch(() => {});
      return { status: "failed", error };
    });

    await reference.update({
      emailStatus: {
        teamNotification: teamResult.status,
        visitorSummary: visitorResult.status,
      },
      notificationMessageId: teamResult.messageId || null,
      visitorSummaryMessageId: visitorResult.messageId || null,
      status: teamResult.status === "sent" ? "new" : "new_email_attention_required",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await syncEnquiryDirectory(leadKey).catch(() => null);

    return apiResponse({
      ok: true,
      requestId,
      summarySent: visitorResult.status === "sent",
    });
  } catch (error) {
    if (requestId && db) {
      await db.collection("bucketListLeads").doc(requestId).set({
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
      message: "We could not save your summary request. Please try again later.",
      code: error?.providerCode || "BUCKET_LIST_REQUEST_FAILED",
    }, 500);
  }
}
