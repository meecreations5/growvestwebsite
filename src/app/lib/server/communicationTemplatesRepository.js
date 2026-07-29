import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";

const COLLECTION = "communicationTemplates";
const VERSIONS_COLLECTION = "communicationTemplateVersions";
const STATUSES = new Set(["draft", "review", "approved", "archived"]);
const CHANNELS = new Set(["email", "whatsapp"]);

function cleanText(value, max = 12000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanKey(value) {
  return cleanText(value, 120)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanArray(value, maxItems = 30) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanText(item, 100)).filter(Boolean))).slice(0, maxItems);
}

function toIso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function serialize(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    key: data.key || snapshot.id,
    name: data.name || data.key || snapshot.id,
    description: data.description || "",
    channel: data.channel || "email",
    module: data.module || "enquiries",
    trigger: data.trigger || "manual",
    subject: data.subject || "",
    body: data.body || "",
    variables: Array.isArray(data.variables) ? data.variables : [],
    status: data.status || "draft",
    isEnabled: data.isEnabled !== false,
    version: Number(data.version || 1),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    approvedAt: toIso(data.approvedAt),
    approvedByName: data.approvedByName || "",
  };
}

function normalizeInput(input = {}) {
  const channel = CHANNELS.has(input.channel) ? input.channel : "email";
  const status = STATUSES.has(input.status) ? input.status : "draft";
  const key = cleanKey(input.key || input.name);
  const name = cleanText(input.name, 180);
  const body = cleanText(input.body, 20_000);
  const subject = channel === "email" ? cleanText(input.subject, 180) : "";
  if (!key || !name || !body) {
    const error = new Error("Template key, name and message body are required.");
    error.status = 400;
    throw error;
  }
  if (channel === "email" && !subject) {
    const error = new Error("Email templates require a subject line.");
    error.status = 400;
    throw error;
  }
  return {
    key,
    name,
    description: cleanText(input.description, 600),
    channel,
    module: cleanKey(input.module || "enquiries") || "enquiries",
    trigger: cleanKey(input.trigger || "manual") || "manual",
    subject,
    body,
    variables: cleanArray(input.variables),
    status,
    isEnabled: input.isEnabled !== false,
  };
}

async function saveVersion(db, snapshot, actor) {
  if (!snapshot?.exists) return;
  const data = snapshot.data();
  await db.collection(VERSIONS_COLLECTION).add({
    templateId: snapshot.id,
    templateKey: data.key || snapshot.id,
    version: Number(data.version || 1),
    snapshot: data,
    createdBy: actor?.uid || "system",
    createdByName: actor?.displayName || "System",
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function listCommunicationTemplates({ channel = "all", status = "all", search = "" } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(COLLECTION).orderBy("updatedAt", "desc").limit(250).get().catch(async () => getAdminDb().collection(COLLECTION).limit(250).get());
  const query = cleanText(search, 180).toLowerCase();
  return snapshot.docs
    .map(serialize)
    .filter((item) => channel === "all" || item.channel === channel)
    .filter((item) => status === "all" || item.status === status)
    .filter((item) => !query || [item.name, item.key, item.description, item.trigger].join(" ").toLowerCase().includes(query));
}

export async function getCommunicationTemplate(id) {
  if (!isFirebaseAdminConfigured()) return null;
  const snapshot = await getAdminDb().collection(COLLECTION).doc(cleanText(id, 180)).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createCommunicationTemplate(input, actor) {
  const db = getAdminDb();
  const normalized = normalizeInput(input);
  const reference = db.collection(COLLECTION).doc(normalized.key);
  const existing = await reference.get();
  if (existing.exists) {
    const error = new Error("A communication template with this key already exists.");
    error.status = 409;
    throw error;
  }
  const now = FieldValue.serverTimestamp();
  await reference.set({
    ...normalized,
    version: 1,
    createdBy: actor.uid,
    createdByName: actor.displayName,
    createdAt: now,
    updatedBy: actor.uid,
    updatedByName: actor.displayName,
    updatedAt: now,
    ...(normalized.status === "approved" ? { approvedBy: actor.uid, approvedByName: actor.displayName, approvedAt: now } : {}),
  });
  return getCommunicationTemplate(reference.id);
}

export async function updateCommunicationTemplate(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(COLLECTION).doc(cleanText(id, 180));
  const existing = await reference.get();
  if (!existing.exists) {
    const error = new Error("This communication template could not be found.");
    error.status = 404;
    throw error;
  }
  await saveVersion(db, existing, actor);
  const normalized = normalizeInput({ ...existing.data(), ...input, key: existing.data().key || existing.id });
  const nextVersion = Number(existing.data().version || 1) + 1;
  const now = FieldValue.serverTimestamp();
  await reference.set({
    ...normalized,
    version: nextVersion,
    updatedBy: actor.uid,
    updatedByName: actor.displayName,
    updatedAt: now,
    approvedBy: normalized.status === "approved" ? actor.uid : null,
    approvedByName: normalized.status === "approved" ? actor.displayName : "",
    approvedAt: normalized.status === "approved" ? now : null,
  }, { merge: true });
  return getCommunicationTemplate(reference.id);
}

export async function archiveCommunicationTemplate(id, actor) {
  return updateCommunicationTemplate(id, { status: "archived", isEnabled: false }, actor);
}

export async function getApprovedCommunicationTemplate(key, channel) {
  if (!isFirebaseAdminConfigured()) return null;
  const id = cleanKey(key);
  if (!id) return null;
  const snapshot = await getAdminDb().collection(COLLECTION).doc(id).get();
  if (!snapshot.exists) return null;
  const item = serialize(snapshot);
  if (item.status !== "approved" || item.isEnabled === false || (channel && item.channel !== channel)) return null;
  return item;
}

export function renderCommunicationTemplate(template, variables = {}) {
  const replace = (value) => String(value || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => String(variables[key] ?? ""));
  return {
    subject: replace(template?.subject || ""),
    body: replace(template?.body || ""),
  };
}

export async function listCommunicationTemplateVersions(templateId) {
  if (!isFirebaseAdminConfigured()) return [];
  const id = cleanText(templateId, 180);
  const snapshot = await getAdminDb().collection(VERSIONS_COLLECTION)
    .where("templateId", "==", id)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get()
    .catch(async () => getAdminDb().collection(VERSIONS_COLLECTION).where("templateId", "==", id).limit(50).get());
  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      templateId: data.templateId || id,
      templateKey: data.templateKey || "",
      version: Number(data.version || 1),
      createdByName: data.createdByName || "System",
      createdAt: toIso(data.createdAt),
      snapshot: {
        name: data.snapshot?.name || "",
        description: data.snapshot?.description || "",
        channel: data.snapshot?.channel || "email",
        module: data.snapshot?.module || "enquiries",
        trigger: data.snapshot?.trigger || "manual",
        subject: data.snapshot?.subject || "",
        body: data.snapshot?.body || "",
        variables: Array.isArray(data.snapshot?.variables) ? data.snapshot.variables : [],
        status: data.snapshot?.status || "draft",
        isEnabled: data.snapshot?.isEnabled !== false,
      },
    };
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function restoreCommunicationTemplateVersion(templateId, versionId, actor) {
  const db = getAdminDb();
  const id = cleanText(templateId, 180);
  const versionReference = db.collection(VERSIONS_COLLECTION).doc(cleanText(versionId, 180));
  const [templateSnapshot, versionSnapshot] = await Promise.all([db.collection(COLLECTION).doc(id).get(), versionReference.get()]);
  if (!templateSnapshot.exists || !versionSnapshot.exists || versionSnapshot.data().templateId !== id) {
    const error = new Error("This communication-template version could not be found.");
    error.status = 404;
    throw error;
  }
  await saveVersion(db, templateSnapshot, actor);
  const normalized = normalizeInput({
    ...versionSnapshot.data().snapshot,
    key: templateSnapshot.data().key || templateSnapshot.id,
  });
  const now = FieldValue.serverTimestamp();
  await templateSnapshot.ref.set({
    ...normalized,
    version: Number(templateSnapshot.data().version || 1) + 1,
    updatedBy: actor.uid,
    updatedByName: actor.displayName,
    updatedAt: now,
    restoredFromVersion: Number(versionSnapshot.data().version || 1),
    approvedBy: normalized.status === "approved" ? actor.uid : null,
    approvedByName: normalized.status === "approved" ? actor.displayName : "",
    approvedAt: normalized.status === "approved" ? now : null,
  }, { merge: true });
  return getCommunicationTemplate(id);
}

export const DEFAULT_COMMUNICATION_TEMPLATES = [
  {
    key: "enquiry_assignment",
    name: "Lead assignment notification",
    description: "Sent to a team member when an enquiry is assigned or reassigned.",
    channel: "email",
    module: "enquiries",
    trigger: "lead_assigned",
    subject: "GrowVest enquiry assigned: {{leadName}}",
    body: "Hello {{assigneeName}},\n\nA GrowVest enquiry has been assigned to you.\n\nLead: {{leadName}}\nType: {{leadType}}\nPriority: {{priority}}\nReference: {{leadReference}}\n\nOpen: {{leadUrl}}\n\nRegards,\nGrowVest",
    variables: ["assigneeName", "leadName", "leadType", "priority", "leadReference", "leadUrl"],
    status: "approved",
    isEnabled: true,
  },
  {
    key: "enquiry_qualified_notification",
    name: "Qualified lead notification",
    description: "Sent to the assigned team member when a lead becomes qualified.",
    channel: "email",
    module: "enquiries",
    trigger: "lead_qualified",
    subject: "GrowVest lead qualified: {{leadName}}",
    body: "Hello {{assigneeName}},\n\n{{leadName}} has been marked Qualified and is ready for conversion review.\n\nType: {{leadType}}\nReference: {{leadReference}}\n\nOpen: {{leadUrl}}\n\nRegards,\nGrowVest",
    variables: ["assigneeName", "leadName", "leadType", "leadReference", "leadUrl"],
    status: "approved",
    isEnabled: true,
  },
  {
    key: "enquiry_follow_up",
    name: "Lead follow-up email",
    description: "Approved manual follow-up template for enquiry communications.",
    channel: "email",
    module: "enquiries",
    trigger: "manual_follow_up",
    subject: "Following up on your GrowVest conversation",
    body: "Dear {{leadName}},\n\nThank you for speaking with GrowVest. We are following up on your enquiry regarding {{goal}}.\n\n{{message}}\n\nRegards,\n{{advisorName}}\nGrowVest",
    variables: ["leadName", "goal", "message", "advisorName"],
    status: "approved",
    isEnabled: true,
  },
  {
    key: "enquiry_whatsapp_follow_up",
    name: "Lead WhatsApp follow-up",
    description: "Approved WhatsApp follow-up wording.",
    channel: "whatsapp",
    module: "enquiries",
    trigger: "manual_whatsapp_follow_up",
    subject: "",
    body: "Hello {{leadName}}, this is {{advisorName}} from GrowVest. I am following up on your enquiry about {{goal}}. Please share a convenient time to connect.",
    variables: ["leadName", "advisorName", "goal"],
    status: "approved",
    isEnabled: true,
  },
];

export async function seedCommunicationTemplates(actor, { replace = false } = {}) {
  const db = getAdminDb();
  const results = { created: 0, updated: 0, skipped: 0 };
  for (const template of DEFAULT_COMMUNICATION_TEMPLATES) {
    const reference = db.collection(COLLECTION).doc(template.key);
    const snapshot = await reference.get();
    if (snapshot.exists && !replace) {
      results.skipped += 1;
      continue;
    }
    if (snapshot.exists) {
      await saveVersion(db, snapshot, actor);
      results.updated += 1;
    } else {
      results.created += 1;
    }
    const now = FieldValue.serverTimestamp();
    await reference.set({
      ...template,
      version: snapshot.exists ? Number(snapshot.data().version || 1) + 1 : 1,
      createdBy: snapshot.data()?.createdBy || actor.uid,
      createdByName: snapshot.data()?.createdByName || actor.displayName,
      createdAt: snapshot.data()?.createdAt || now,
      updatedBy: actor.uid,
      updatedByName: actor.displayName,
      updatedAt: now,
      approvedBy: actor.uid,
      approvedByName: actor.displayName,
      approvedAt: now,
    }, { merge: true });
  }
  return results;
}
