import { FieldValue } from "firebase-admin/firestore";

export async function writeCommunicationLog(db, {
  requestId,
  subscriberId,
  channel = "email",
  type,
  direction = "outbound",
  recipient,
  status,
  provider = "brevo",
  providerMessageId,
  providerCode,
  errorMessage,
}) {
  await db.collection("communicationLogs").add({
    requestId: requestId || null,
    subscriberId: subscriberId || null,
    channel,
    type,
    direction,
    recipient,
    status,
    provider,
    providerMessageId: providerMessageId || null,
    providerCode: providerCode || null,
    errorMessage: errorMessage ? String(errorMessage).slice(0, 500) : null,
    createdAt: FieldValue.serverTimestamp(),
  });
}
