import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./firebaseAdmin";

const METRICS_COLLECTION = "insightMetrics";
const EVENT_FIELDS = { view: "views", cta_click: "ctaClicks", share: "shares" };

export async function recordInsightMetric({ postId, eventType }) {
  const field = EVENT_FIELDS[eventType];
  if (!postId || !field) throw Object.assign(new Error("Unsupported Insight metric."), { status: 400 });
  const reference = getAdminDb().collection(METRICS_COLLECTION).doc(postId);
  await reference.set({
    postId,
    [field]: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
    ...(eventType === "view" ? { lastViewedAt: FieldValue.serverTimestamp() } : {}),
  }, { merge: true });
}

export async function listInsightMetrics(limit = 100) {
  const snapshot = await getAdminDb().collection(METRICS_COLLECTION).limit(Math.min(300, Number(limit) || 100)).get();
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}
