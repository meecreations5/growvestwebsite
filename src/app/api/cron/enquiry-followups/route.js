import { timingSafeEqual } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COMPANY } from "../../../lib/brand";
import { sendTransactionalEmail } from "../../../lib/server/brevo";
import { writeCommunicationLog } from "../../../lib/server/communications";
import { listEnquiries } from "../../../lib/server/enquiriesRepository";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validSecret(request) {
  const expected = process.env.CRON_SECRET || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function rows(items, baseUrl, label) {
  if (!items.length) return `<p>No ${escapeHtml(label.toLowerCase())}.</p>`;
  return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px"><thead><tr><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Name</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Type</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Due</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Open</th></tr></thead><tbody>${items.map((item) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.fullName)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.sourceLabel)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(formatDate(item.followUpAt || item.firstResponseDueAt))}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb"><a href="${escapeHtml(`${baseUrl}/admin/enquiries/${encodeURIComponent(item.leadKey)}`)}">View lead</a></td></tr>`).join("")}</tbody></table>`;
}

export async function GET(request) {
  if (!validSecret(request)) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  if (!isFirebaseAdminConfigured()) return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 503 });

  try {
    const db = getAdminDb();
    const hourKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false }).format(new Date()).replace(/[^0-9]/g, "");
    const runReference = db.collection("leadNotificationRuns").doc(`followup-${hourKey}`);
    const previousRun = await runReference.get();
    if (previousRun.exists) return NextResponse.json({ ok: true, skipped: true, reason: "This hourly digest was already processed." });

    const [dueResult, allResult] = await Promise.all([
      listEnquiries({ followUp: "due", pageSize: 100 }),
      listEnquiries({ pageSize: 100 }),
    ]);
    const now = Date.now();
    const responseOverdue = allResult.items.filter((item) => item.firstResponseDueAt && !item.firstContactAt && !["converted", "closed", "not_interested", "duplicate", "invalid", "spam"].includes(item.status) && new Date(item.firstResponseDueAt).getTime() <= now);

    if (!dueResult.items.length && !responseOverdue.length) {
      await runReference.set({ status: "no_action", dueFollowUps: 0, responseOverdue: 0, checkedAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ ok: true, sent: false, dueFollowUps: 0, responseOverdue: 0 });
    }

    const recipient = process.env.GROWVEST_NOTIFICATION_EMAIL || COMPANY.email;
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://growvest.info").replace(/\/$/, "");
    const subject = `GrowVest lead follow-up digest: ${dueResult.items.length} follow-up${dueResult.items.length === 1 ? "" : "s"} due`;
    const result = await sendTransactionalEmail({
      to: { email: recipient, name: "GrowVest Team" },
      subject,
      htmlContent: `<h2>GrowVest enquiry follow-up digest</h2><p><strong>${dueResult.items.length}</strong> scheduled follow-up${dueResult.items.length === 1 ? " is" : "s are"} due and <strong>${responseOverdue.length}</strong> lead${responseOverdue.length === 1 ? " has" : "s have"} exceeded the first-response target.</p><h3>Follow-ups due</h3>${rows(dueResult.items, baseUrl, "Follow-ups due")}<h3>First response overdue</h3>${rows(responseOverdue, baseUrl, "First responses overdue")}<p>Open the <a href="${escapeHtml(`${baseUrl}/admin/enquiries/follow-ups`)}">GrowVest lead workspace</a> to update assignments and next actions.</p>`,
    });

    await writeCommunicationLog(db, {
      entityType: "leadDigest",
      entityId: runReference.id,
      channel: "email",
      type: "lead_follow_up_digest",
      recipient,
      status: "sent",
      providerMessageId: result?.messageId,
      subject,
      metadata: { dueFollowUps: dueResult.items.length, responseOverdue: responseOverdue.length },
    });
    await runReference.set({ status: "sent", recipient, dueFollowUps: dueResult.items.length, responseOverdue: responseOverdue.length, providerMessageId: result?.messageId || null, sentAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true, sent: true, dueFollowUps: dueResult.items.length, responseOverdue: responseOverdue.length });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to send the enquiry follow-up digest." }, { status: error?.status || 500 });
  }
}
