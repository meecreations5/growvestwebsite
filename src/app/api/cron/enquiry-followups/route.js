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

function rows(items, baseUrl) {
  if (!items.length) return "<p>No items.</p>";
  return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px"><thead><tr><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Name</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Type</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Due</th><th style="padding:8px;text-align:left;border-bottom:2px solid #1F4ED8">Open</th></tr></thead><tbody>${items.map((item) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.fullName)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.sourceLabel)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(formatDate(item.followUpAt || item.firstResponseDueAt))}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb"><a href="${escapeHtml(`${baseUrl}/admin/enquiries/${encodeURIComponent(item.leadKey)}`)}">View lead</a></td></tr>`).join("")}</tbody></table>`;
}

function recipientKey(item) {
  return item.assignedToEmail || process.env.GROWVEST_NOTIFICATION_EMAIL || COMPANY.email;
}

async function loadAll(params) {
  const items = [];
  let cursor = "";
  do {
    const result = await listEnquiries({ ...params, cursor, pageSize: 100 });
    items.push(...result.items);
    cursor = result.nextCursor || "";
  } while (cursor && items.length < 2000);
  return items;
}

export async function GET(request) {
  if (!validSecret(request)) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  if (!isFirebaseAdminConfigured()) return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 503 });

  try {
    const db = getAdminDb();
    const hourKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false }).format(new Date()).replace(/[^0-9]/g, "");
    const runReference = db.collection("leadNotificationRuns").doc(`followup-${hourKey}`);
    const previousRun = await runReference.get();
    if (previousRun.exists) return NextResponse.json({ ok: true, skipped: true, reason: "This hourly notification run was already processed." });

    const [dueFollowUps, openLeads] = await Promise.all([
      loadAll({ followUp: "due" }),
      loadAll({}),
    ]);
    const now = Date.now();
    const responseOverdue = openLeads.filter((item) => item.firstResponseDueAt && !item.firstContactAt && !["converted", "closed", "not_interested", "duplicate", "invalid", "spam"].includes(item.status) && new Date(item.firstResponseDueAt).getTime() <= now);
    const combined = new Map();
    for (const item of [...dueFollowUps, ...responseOverdue]) combined.set(item.leadKey, item);

    if (!combined.size) {
      await runReference.set({ status: "no_action", dueFollowUps: 0, responseOverdue: 0, checkedAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ ok: true, sent: false, dueFollowUps: 0, responseOverdue: 0 });
    }

    const groups = new Map();
    for (const item of combined.values()) {
      const recipient = recipientKey(item);
      if (!groups.has(recipient)) groups.set(recipient, { recipient, name: item.assignedToName || "GrowVest Team", due: [], response: [] });
      const group = groups.get(recipient);
      if (dueFollowUps.some((entry) => entry.leadKey === item.leadKey)) group.due.push(item);
      if (responseOverdue.some((entry) => entry.leadKey === item.leadKey)) group.response.push(item);
    }

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://growvest.info").replace(/\/$/, "");
    const results = [];
    for (const group of groups.values()) {
      const subject = `GrowVest follow-ups: ${group.due.length} due, ${group.response.length} response overdue`;
      try {
        const sent = await sendTransactionalEmail({
          to: { email: group.recipient, name: group.name },
          subject,
          htmlContent: `<h2>Your GrowVest enquiry actions</h2><p><strong>${group.due.length}</strong> scheduled follow-up${group.due.length === 1 ? " is" : "s are"} due and <strong>${group.response.length}</strong> lead${group.response.length === 1 ? " has" : "s have"} exceeded the first-response target.</p><h3>Follow-ups due</h3>${rows(group.due, baseUrl)}<h3>First responses overdue</h3>${rows(group.response, baseUrl)}<p>Open the <a href="${escapeHtml(`${baseUrl}/admin/enquiries/follow-ups`)}">GrowVest lead workspace</a>.</p>`,
        });
        await writeCommunicationLog(db, {
          entityType: "leadDigest",
          entityId: runReference.id,
          channel: "email",
          type: "assignee_lead_follow_up_digest",
          recipient: group.recipient,
          status: "sent",
          providerMessageId: sent?.messageId,
          subject,
          metadata: { dueFollowUps: group.due.length, responseOverdue: group.response.length },
        });
        results.push({ recipient: group.recipient, sent: true, due: group.due.length, response: group.response.length });
      } catch (error) {
        await writeCommunicationLog(db, {
          entityType: "leadDigest",
          entityId: runReference.id,
          channel: "email",
          type: "assignee_lead_follow_up_digest",
          recipient: group.recipient,
          status: "failed",
          providerCode: error?.providerCode,
          errorMessage: error?.message,
          subject,
        }).catch(() => {});
        results.push({ recipient: group.recipient, sent: false, error: error?.message || "Delivery failed." });
      }
    }

    await runReference.set({ status: results.some((item) => item.sent) ? "sent" : "failed", dueFollowUps: dueFollowUps.length, responseOverdue: responseOverdue.length, recipients: results, processedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true, sent: results.filter((item) => item.sent).length, failed: results.filter((item) => !item.sent).length, dueFollowUps: dueFollowUps.length, responseOverdue: responseOverdue.length });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to process enquiry follow-up notifications." }, { status: error?.status || 500 });
  }
}
