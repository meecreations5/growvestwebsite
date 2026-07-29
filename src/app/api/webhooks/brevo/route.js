import { timingSafeEqual } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_STATUS = {
  request: "sent",
  sent: "sent",
  delivered: "delivered",
  opened: "opened",
  unique_opened: "opened",
  proxy_open: "opened",
  unique_proxy_open: "opened",
  click: "clicked",
  clicked: "clicked",
  deferred: "deferred",
  soft_bounce: "soft_bounced",
  hard_bounce: "hard_bounced",
  blocked: "blocked",
  invalid_email: "invalid",
  spam: "spam_complaint",
  complaint: "spam_complaint",
  unsubscribed: "unsubscribed",
  error: "failed",
};

function clean(value, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validToken(request) {
  const expected = process.env.BREVO_WEBHOOK_TOKEN || "";
  if (!expected) return process.env.NODE_ENV !== "production";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || request.headers.get("x-brevo-webhook-token") || "";
  if (!supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function eventTimestamp(payload) {
  const milliseconds = Number(payload.ts_epoch || 0);
  if (milliseconds > 0) return Timestamp.fromMillis(milliseconds > 10_000_000_000 ? milliseconds : milliseconds * 1000);
  const seconds = Number(payload.ts_event || payload.ts || 0);
  if (seconds > 0) return Timestamp.fromMillis(seconds * 1000);
  return Timestamp.now();
}

function payloadSummary(payload, event, providerMessageId, email) {
  return {
    event,
    email,
    subject: clean(payload?.subject, 180),
    providerMessageId,
    reason: clean(payload?.reason || payload?.message, 500),
    link: clean(payload?.link, 1000),
    tag: clean(payload?.tag, 180),
  };
}

export async function POST(request) {
  if (!validToken(request)) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  if (!isFirebaseAdminConfigured()) return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 503 });
  try {
    const payload = await request.json();
    const event = clean(payload?.event, 80).toLowerCase().replaceAll(" ", "_");
    const status = EVENT_STATUS[event] || event || "received";
    const providerMessageId = clean(payload?.["message-id"] || payload?.messageId, 300);
    const email = clean(payload?.email, 180).toLowerCase();
    const subject = clean(payload?.subject, 180);
    const db = getAdminDb();
    let matchedDocuments = [];

    if (providerMessageId) {
      const snapshot = await db.collection("communicationLogs").where("providerMessageId", "==", providerMessageId).limit(10).get();
      matchedDocuments = snapshot.docs;
    } else if (email) {
      const snapshot = await db.collection("communicationLogs").where("recipient", "==", email).orderBy("createdAt", "desc").limit(10).get().catch(() => ({ docs: [] }));
      matchedDocuments = subject
        ? snapshot.docs.filter((document) => clean(document.data().subject, 180) === subject).slice(0, 1)
        : snapshot.docs.slice(0, 1);
    }

    const occurredAt = eventTimestamp(payload);
    const summary = payloadSummary(payload, event, providerMessageId, email);
    const update = {
      status,
      lastProviderEvent: event,
      lastProviderEventAt: occurredAt,
      providerPayloadSummary: summary,
      updatedAt: FieldValue.serverTimestamp(),
      ...(status === "delivered" ? { deliveredAt: occurredAt } : {}),
      ...(status === "opened" ? { openedAt: occurredAt } : {}),
      ...(status === "clicked" ? { clickedAt: occurredAt } : {}),
      ...(["soft_bounced", "hard_bounced", "blocked", "invalid", "spam_complaint", "unsubscribed", "failed"].includes(status) ? { failedAt: occurredAt } : {}),
    };

    const batch = db.batch();
    for (const document of matchedDocuments) {
      batch.set(document.ref, update, { merge: true });
      const eventReference = db.collection("communicationDeliveryEvents").doc();
      batch.set(eventReference, {
        communicationLogId: document.id,
        leadKey: document.data().leadKey || null,
        provider: "brevo",
        event,
        status,
        providerMessageId: providerMessageId || document.data().providerMessageId || null,
        recipient: email || document.data().recipient || null,
        summary,
        occurredAt,
        receivedAt: FieldValue.serverTimestamp(),
      });
    }

    if (!matchedDocuments.length) {
      const unmatchedReference = db.collection("communicationWebhookEvents").doc();
      batch.set(unmatchedReference, {
        provider: "brevo",
        event,
        status,
        providerMessageId: providerMessageId || null,
        email: email || null,
        summary,
        occurredAt,
        receivedAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
    return NextResponse.json({ ok: true, matched: matchedDocuments.length, status });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to process Brevo webhook." }, { status: 500 });
  }
}
