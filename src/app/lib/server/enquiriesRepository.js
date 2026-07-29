import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";
import { sendTransactionalEmail } from "./brevo";
import { writeCommunicationLog } from "./communications";

export const ENQUIRY_SOURCES = {
  contact: { collection: "websiteLeads", label: "Contact & Discovery", type: "discovery_conversation" },
  bucket: { collection: "bucketListLeads", label: "Bucket List", type: "bucket_list" },
  newsletter: { collection: "newsletterSubscribers", label: "Newsletter", type: "newsletter" },
  whatsapp: { collection: "websiteLeads", label: "WhatsApp", type: "whatsapp" },
  manual: { collection: "websiteLeads", label: "Manual Lead", type: "manual" },
};

export const LEAD_STATUSES = [
  "new",
  "new_email_attention_required",
  "assigned",
  "contact_attempted",
  "connected",
  "follow_up",
  "qualified",
  "converted",
  "closed",
  "not_interested",
  "duplicate",
  "invalid",
  "spam",
  "submission_error",
  "subscribed",
  "pending_provider_sync",
  "provider_sync_failed",
];

export const LEAD_PRIORITIES = ["low", "normal", "high", "urgent"];

const SOURCE_CONFIGS = [
  { key: "contact", collection: "websiteLeads" },
  { key: "bucket", collection: "bucketListLeads" },
  { key: "newsletter", collection: "newsletterSubscribers" },
];

const CLOSED_STATUSES = new Set(["converted", "closed", "not_interested", "duplicate", "invalid", "spam"]);

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeEmail(value) {
  return cleanText(value, 180).toLowerCase();
}

export function normalizePhone(value) {
  const raw = cleanText(value, 40);
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7) return "";
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits.slice(-15);
}

function cleanStringArray(value, maxItems = 20, maxLength = 120) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanText(item, maxLength)).filter(Boolean))).slice(0, maxItems);
}

function toIso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function toTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Timestamp.fromDate(date);
}

function displaySource(sourceKey, data) {
  if (sourceKey === "contact" && data.enquiryType === "whatsapp") return "WhatsApp";
  if (sourceKey === "contact" && data.source === "admin_manual") return "Manual Lead";
  return ENQUIRY_SOURCES[sourceKey]?.label || "Website Lead";
}

function sourceType(sourceKey, data) {
  if (sourceKey === "contact") return data.enquiryType || "discovery_conversation";
  return ENQUIRY_SOURCES[sourceKey]?.type || sourceKey;
}

function serializeLead(snapshot, sourceKey) {
  const data = snapshot.data();
  const id = snapshot.id;
  const email = normalizeEmail(data.email || data.emailLowercase);
  const phone = cleanText(data.phone, 40);
  const createdAt = toIso(data.createdAt || data.consentAcceptedAt || data.subscribedAt);
  const updatedAt = toIso(data.updatedAt || data.createdAt || data.subscribedAt);
  const fullName = cleanText(data.fullName || data.name || (sourceKey === "newsletter" ? "Newsletter subscriber" : "Website visitor"), 160);
  const leadKey = `${sourceKey}--${id}`;

  return {
    id,
    leadKey,
    sourceKey,
    sourceCollection: SOURCE_CONFIGS.find((item) => item.key === sourceKey)?.collection || "websiteLeads",
    sourceLabel: displaySource(sourceKey, data),
    enquiryType: sourceType(sourceKey, data),
    requestId: data.requestId || id,
    subscriberId: data.subscriberId || (sourceKey === "newsletter" ? id : ""),
    fullName,
    email,
    phone,
    phoneNormalized: data.phoneNormalized || normalizePhone(phone),
    status: cleanText(data.status, 80) || "new",
    priority: LEAD_PRIORITIES.includes(data.priority) ? data.priority : "normal",
    assignedTo: data.assignedTo || null,
    assignedToName: cleanText(data.assignedToName || data.assignedTo?.displayName || data.assignedTo?.name, 160),
    assignedToEmail: normalizeEmail(data.assignedToEmail || data.assignedTo?.email),
    followUpAt: toIso(data.followUpAt),
    firstResponseDueAt: toIso(data.firstResponseDueAt),
    firstContactAt: toIso(data.firstContactAt),
    connectedAt: toIso(data.connectedAt),
    qualifiedAt: toIso(data.qualifiedAt),
    convertedAt: toIso(data.convertedAt),
    closedAt: toIso(data.closedAt),
    createdAt,
    updatedAt,
    message: cleanText(data.message, 5000),
    serviceArea: cleanText(data.serviceArea, 180),
    preferredSlot: cleanText(data.preferredSlot, 180),
    goals: Array.isArray(data.goals) ? data.goals : [],
    assumedAnnualReturn: Number(data.assumedAnnualReturn || 0),
    estimatedMonthlyInvestment: Number(data.estimatedMonthlyInvestment || 0),
    totalValueOfSelectedGoals: Number(data.totalValueOfSelectedGoals || 0),
    currency: data.currency || "INR",
    source: cleanText(data.source, 180),
    sourcePage: cleanText(data.sourcePage || data.pagePath, 400),
    referrer: cleanText(data.referrer, 1200),
    campaign: data.campaign || {},
    tags: Array.isArray(data.tags) ? data.tags : [],
    nextAction: cleanText(data.nextAction, 500),
    lostReason: cleanText(data.lostReason, 500),
    emailStatus: data.emailStatus || null,
    providerStatus: cleanText(data.providerStatus, 120),
    conversionId: cleanText(data.conversionId, 180),
    conversionStatus: cleanText(data.conversionStatus, 120),
    consentAccepted: data.consentAccepted === true,
    raw: {
      ...data,
      createdAt,
      updatedAt,
      followUpAt: toIso(data.followUpAt),
      firstContactAt: toIso(data.firstContactAt),
      convertedAt: toIso(data.convertedAt),
    },
  };
}

export function parseLeadKey(leadKey) {
  let value = "";
  try {
    value = decodeURIComponent(cleanText(leadKey, 500));
  } catch {
    return null;
  }
  const separator = value.indexOf("--");
  if (separator < 1) return null;
  const sourceKey = value.slice(0, separator);
  const id = value.slice(separator + 2);
  const config = SOURCE_CONFIGS.find((item) => item.key === sourceKey);
  if (!config || !id) return null;
  return { sourceKey, id, collection: config.collection, leadKey: `${sourceKey}--${id}` };
}

async function writeActivity({ actor, leadKey, action, summary, details = {} }) {
  if (!isFirebaseAdminConfigured()) return;
  await getAdminDb().collection("leadActivities").add({
    leadKey,
    action,
    summary: cleanText(summary, 500),
    details,
    actorId: actor?.uid || "system",
    actorName: actor?.displayName || "System",
    actorEmail: actor?.email || "",
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function listSource(config, limit = 500) {
  const snapshot = await getAdminDb().collection(config.collection).limit(limit).get();
  return snapshot.docs.map((doc) => serializeLead(doc, config.key));
}

async function listAllEnquiries() {
  if (!isFirebaseAdminConfigured()) return [];
  const groups = await Promise.all(SOURCE_CONFIGS.map((config) => listSource(config)));
  return groups.flat().sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

function isFollowUpDue(item, now = Date.now()) {
  if (!item.followUpAt || CLOSED_STATUSES.has(item.status)) return false;
  return new Date(item.followUpAt).getTime() <= now;
}

function computeStats(items) {
  const now = Date.now();
  const newStatuses = new Set(["new", "new_email_attention_required", "submission_error", "provider_sync_failed"]);
  const responseHours = items
    .filter((item) => item.createdAt && item.firstContactAt)
    .map((item) => (new Date(item.firstContactAt).getTime() - new Date(item.createdAt).getTime()) / 3_600_000)
    .filter((hours) => Number.isFinite(hours) && hours >= 0);
  return {
    total: items.length,
    new: items.filter((item) => newStatuses.has(item.status)).length,
    followUpsDue: items.filter((item) => isFollowUpDue(item, now)).length,
    firstResponseOverdue: items.filter((item) => item.firstResponseDueAt && !item.firstContactAt && !CLOSED_STATUSES.has(item.status) && new Date(item.firstResponseDueAt).getTime() <= now).length,
    averageFirstResponseHours: responseHours.length ? Math.round((responseHours.reduce((sum, hours) => sum + hours, 0) / responseHours.length) * 10) / 10 : null,
    discovery: items.filter((item) => item.sourceKey === "contact" && item.enquiryType !== "whatsapp").length,
    bucketList: items.filter((item) => item.sourceKey === "bucket").length,
    newsletter: items.filter((item) => item.sourceKey === "newsletter").length,
    whatsapp: items.filter((item) => item.enquiryType === "whatsapp").length,
    qualified: items.filter((item) => item.status === "qualified").length,
    converted: items.filter((item) => item.status === "converted").length,
    closed: items.filter((item) => CLOSED_STATUSES.has(item.status)).length,
  };
}

export async function listEnquiries({
  source = "all",
  status = "all",
  priority = "all",
  assignee = "all",
  search = "",
  followUp = "all",
  page = 1,
  pageSize = 25,
} = {}) {
  const allItems = await listAllEnquiries();
  const query = cleanText(search, 180).toLowerCase();
  const now = Date.now();
  const filtered = allItems.filter((item) => {
    if (source !== "all") {
      if (source === "whatsapp" && item.enquiryType !== "whatsapp") return false;
      if (source === "contact" && (item.sourceKey !== "contact" || item.enquiryType === "whatsapp")) return false;
      if (!["whatsapp", "contact"].includes(source) && item.sourceKey !== source) return false;
    }
    if (status !== "all" && item.status !== status) return false;
    if (priority !== "all" && item.priority !== priority) return false;
    if (assignee === "unassigned" && (item.assignedTo || item.assignedToEmail)) return false;
    if (assignee !== "all" && assignee !== "unassigned" && item.assignedTo !== assignee && item.assignedToEmail !== assignee) return false;
    if (followUp === "due" && !isFollowUpDue(item, now)) return false;
    if (followUp === "scheduled" && (!item.followUpAt || isFollowUpDue(item, now) || CLOSED_STATUSES.has(item.status))) return false;
    if (query) {
      const haystack = [item.fullName, item.email, item.phone, item.requestId, item.serviceArea, item.enquiryType, item.sourceLabel]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const safePageSize = Math.max(10, Math.min(100, Number(pageSize) || 25));
  const safePage = Math.max(1, Number(page) || 1);
  const start = (safePage - 1) * safePageSize;
  return {
    items: filtered.slice(start, start + safePageSize),
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(filtered.length / safePageSize)),
    stats: computeStats(allItems),
  };
}

export async function getEnquiry(leadKey) {
  if (!isFirebaseAdminConfigured()) return null;
  const parsed = parseLeadKey(leadKey);
  if (!parsed) return null;
  const snapshot = await getAdminDb().collection(parsed.collection).doc(parsed.id).get();
  return snapshot.exists ? serializeLead(snapshot, parsed.sourceKey) : null;
}

export async function getEnquiryDetails(leadKey) {
  const lead = await getEnquiry(leadKey);
  if (!lead) return null;
  const db = getAdminDb();
  const [activitiesSnapshot, notesSnapshot, communicationByLead, communicationByRequest, communicationBySubscriber, allItems] = await Promise.all([
    db.collection("leadActivities").where("leadKey", "==", lead.leadKey).limit(200).get(),
    db.collection("leadNotes").where("leadKey", "==", lead.leadKey).limit(200).get(),
    db.collection("communicationLogs").where("leadKey", "==", lead.leadKey).limit(200).get().catch(() => ({ docs: [] })),
    lead.requestId ? db.collection("communicationLogs").where("requestId", "==", lead.requestId).limit(200).get().catch(() => ({ docs: [] })) : Promise.resolve({ docs: [] }),
    lead.subscriberId ? db.collection("communicationLogs").where("subscriberId", "==", lead.subscriberId).limit(200).get().catch(() => ({ docs: [] })) : Promise.resolve({ docs: [] }),
    listAllEnquiries(),
  ]);

  const serializeGeneric = (doc) => ({ id: doc.id, ...doc.data(), createdAt: toIso(doc.data().createdAt), updatedAt: toIso(doc.data().updatedAt) });
  const communicationMap = new Map();
  [...communicationByLead.docs, ...communicationByRequest.docs, ...communicationBySubscriber.docs].forEach((doc) => communicationMap.set(doc.id, serializeGeneric(doc)));

  const duplicates = allItems.filter((item) => {
    if (item.leadKey === lead.leadKey) return false;
    const emailMatch = lead.email && item.email && lead.email === item.email;
    const phoneMatch = lead.phoneNormalized && item.phoneNormalized && lead.phoneNormalized === item.phoneNormalized;
    return emailMatch || phoneMatch;
  }).slice(0, 20);

  return {
    lead,
    activities: activitiesSnapshot.docs.map(serializeGeneric).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    notes: notesSnapshot.docs.map(serializeGeneric).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    communications: [...communicationMap.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    duplicates,
  };
}

function normalizeRole(value) {
  return cleanText(value, 100).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function isAssignableProfile(profile, { requireRole = false } = {}) {
  if (!profile || profile.isActive === false || profile.disabled === true || profile.status === "disabled") return false;
  const role = normalizeRole(profile.role || profile.userRole || profile.userType);
  if (requireRole && !role) return false;
  return !["investor", "client", "customer"].includes(role);
}

async function resolveAssignableProfile(db, uid) {
  if (!uid) return null;
  const websiteAdmin = await db.collection("websiteAdmins").doc(uid).get();
  if (websiteAdmin.exists && isAssignableProfile(websiteAdmin.data())) return { uid, ...websiteAdmin.data() };
  const user = await db.collection("users").doc(uid).get().catch(() => null);
  if (user?.exists && isAssignableProfile(user.data(), { requireRole: true })) return { uid, ...user.data() };
  return null;
}

export async function listAssignableAdmins() {
  if (!isFirebaseAdminConfigured()) return [];
  const db = getAdminDb();
  const [adminSnapshot, userSnapshot] = await Promise.all([
    db.collection("websiteAdmins").limit(250).get(),
    db.collection("users").limit(500).get().catch(() => ({ docs: [] })),
  ]);
  const profiles = new Map();
  for (const document of adminSnapshot.docs) {
    const profile = { ...document.data(), uid: document.id };
    if (!isAssignableProfile(profile)) continue;
    profiles.set(profile.uid, profile);
  }
  for (const document of userSnapshot.docs) {
    const profile = { ...document.data(), uid: document.id };
    if (!isAssignableProfile(profile, { requireRole: true })) continue;
    const existing = profiles.get(profile.uid) || {};
    profiles.set(profile.uid, { ...profile, ...existing, uid: profile.uid });
  }
  return [...profiles.values()]
    .map((item) => ({
      uid: item.uid,
      displayName: item.displayName || item.fullName || item.name || item.email || "GrowVest team member",
      email: item.email || "",
      role: normalizeRole(item.role || item.userRole || item.userType),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function updateEnquiry(leadKey, input, actor) {
  const parsed = parseLeadKey(leadKey);
  if (!parsed) {
    const error = new Error("This enquiry reference is invalid.");
    error.status = 400;
    throw error;
  }
  const db = getAdminDb();
  const reference = db.collection(parsed.collection).doc(parsed.id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  const existing = serializeLead(snapshot, parsed.sourceKey);
  const status = LEAD_STATUSES.includes(input?.status) ? input.status : existing.status;
  const priority = LEAD_PRIORITIES.includes(input?.priority) ? input.priority : existing.priority;
  const assignedTo = cleanText(input?.assignedTo, 180);
  let assignedToName = "";
  let assignedToEmail = "";
  if (assignedTo) {
    const assignee = await resolveAssignableProfile(db, assignedTo);
    if (!assignee) {
      const error = new Error("The selected team member is not an active GrowVest staff or advisor profile.");
      error.status = 400;
      throw error;
    }
    assignedToName = cleanText(assignee.displayName || assignee.fullName || assignee.name || assignee.email || "GrowVest team member", 180);
    assignedToEmail = normalizeEmail(assignee.email);
  }
  const followUpAt = input?.followUpAt === "" ? null : toTimestamp(input?.followUpAt);
  const now = FieldValue.serverTimestamp();
  const update = {
    status,
    priority,
    assignedTo: assignedTo || null,
    assignedToName: assignedToName || "",
    assignedToEmail,
    followUpAt,
    nextAction: cleanText(input?.nextAction, 500),
    lostReason: cleanText(input?.lostReason, 500),
    tags: cleanStringArray(input?.tags),
    updatedBy: actor.uid,
    updatedByName: actor.displayName,
    updatedAt: now,
  };

  if (["contact_attempted", "connected", "follow_up", "qualified", "converted"].includes(status) && !existing.firstContactAt) update.firstContactAt = now;
  if (["connected", "follow_up", "qualified", "converted"].includes(status) && !existing.connectedAt) update.connectedAt = now;
  if (["qualified", "converted"].includes(status) && !existing.qualifiedAt) update.qualifiedAt = now;
  if (status === "converted" && !existing.convertedAt) update.convertedAt = now;
  if (CLOSED_STATUSES.has(status) && status !== "converted") update.closedAt = now;
  if (!CLOSED_STATUSES.has(status)) update.closedAt = null;

  await reference.set(update, { merge: true });
  const changed = [];
  if (status !== existing.status) changed.push(`status ${existing.status} → ${status}`);
  if (priority !== existing.priority) changed.push(`priority ${existing.priority} → ${priority}`);
  if ((existing.assignedTo || "") !== assignedTo) changed.push(`assignment updated`);
  if ((existing.followUpAt || "") !== (input?.followUpAt || "")) changed.push(`follow-up updated`);
  await writeActivity({
    actor,
    leadKey: parsed.leadKey,
    action: "lead.updated",
    summary: changed.length ? `Updated ${changed.join(", ")}.` : "Updated enquiry details.",
    details: { status, priority, assignedTo, followUpAt: input?.followUpAt || null },
  });
  return getEnquiry(parsed.leadKey);
}

export async function addEnquiryNote(leadKey, input, actor) {
  const lead = await getEnquiry(leadKey);
  if (!lead) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  const note = cleanText(input?.note, 5000);
  if (!note) {
    const error = new Error("Write a note before saving.");
    error.status = 400;
    throw error;
  }
  const db = getAdminDb();
  const reference = db.collection("leadNotes").doc();
  await reference.set({
    leadKey: lead.leadKey,
    note,
    visibility: input?.visibility === "private" ? "private" : "team",
    createdBy: actor.uid,
    createdByName: actor.displayName,
    createdByEmail: actor.email,
    createdAt: FieldValue.serverTimestamp(),
  });
  const parsed = parseLeadKey(lead.leadKey);
  await db.collection(parsed.collection).doc(parsed.id).set({ lastNoteAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  await writeActivity({ actor, leadKey: lead.leadKey, action: "note.added", summary: "Added an internal note." });
  return { id: reference.id, leadKey: lead.leadKey, note, visibility: input?.visibility === "private" ? "private" : "team", createdBy: actor.uid, createdByName: actor.displayName, createdByEmail: actor.email, createdAt: new Date().toISOString() };
}

export async function createManualEnquiry(input, actor) {
  const fullName = cleanText(input?.fullName, 160);
  const email = normalizeEmail(input?.email);
  const phone = cleanText(input?.phone, 40);
  if (!fullName || (!email && !phone)) {
    const error = new Error("Add the person's name and at least an email address or phone number.");
    error.status = 400;
    throw error;
  }
  const type = ["whatsapp", "manual", "discovery_conversation", "referral", "other"].includes(input?.enquiryType) ? input.enquiryType : "manual";
  const requestId = `GV-MAN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const db = getAdminDb();
  const reference = db.collection("websiteLeads").doc(requestId);
  await reference.set({
    requestId,
    fullName,
    email,
    emailLowercase: email,
    phone,
    phoneNormalized: normalizePhone(phone),
    enquiryType: type,
    serviceArea: cleanText(input?.serviceArea, 180),
    message: cleanText(input?.message, 5000),
    source: "admin_manual",
    sourcePage: cleanText(input?.sourcePage, 400),
    status: "new",
    priority: LEAD_PRIORITIES.includes(input?.priority) ? input.priority : "normal",
    assignedTo: actor.uid,
    assignedToName: actor.displayName,
    assignedToEmail: actor.email,
    consentAccepted: Boolean(input?.consentAccepted),
    createdBy: actor.uid,
    createdByName: actor.displayName,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const leadKey = `contact--${requestId}`;
  await writeActivity({ actor, leadKey, action: "lead.created", summary: `Created a manual ${type.replaceAll("_", " ")} enquiry.` });
  return getEnquiry(leadKey);
}

export async function sendEnquiryEmail(leadKey, input, actor) {
  const lead = await getEnquiry(leadKey);
  if (!lead) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  if (!lead.email) {
    const error = new Error("This enquiry does not have an email address.");
    error.status = 400;
    throw error;
  }
  const subject = cleanText(input?.subject, 180);
  const message = cleanText(input?.message, 12_000);
  if (!subject || !message) {
    const error = new Error("Add an email subject and message.");
    error.status = 400;
    throw error;
  }
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const db = getAdminDb();
  let result;
  try {
    result = await sendTransactionalEmail({
      to: { email: lead.email, name: lead.fullName },
      subject,
      htmlContent: `<p>Dear ${escapeHtml(lead.fullName || "Investor")},</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p><p>Regards,<br>${escapeHtml(actor.displayName || "GrowVest Team")}<br>GrowVest</p>`,
    });
  } catch (error) {
    await writeCommunicationLog(db, {
      requestId: lead.requestId,
      subscriberId: lead.subscriberId,
      leadKey: lead.leadKey,
      entityType: "websiteLead",
      entityId: lead.id,
      channel: "email",
      type: "admin_lead_follow_up",
      templateKey: cleanText(input?.templateKey, 120) || "manual_follow_up",
      recipient: lead.email,
      status: "failed",
      providerCode: error?.providerCode,
      errorMessage: error?.message,
      sentBy: actor.uid,
      sentByName: actor.displayName,
      subject,
    }).catch(() => {});
    await writeActivity({ actor, leadKey: lead.leadKey, action: "email.failed", summary: `Email failed: ${subject}`, details: { providerCode: error?.providerCode || null } }).catch(() => {});
    throw error;
  }
  await writeCommunicationLog(db, {
    requestId: lead.requestId,
    subscriberId: lead.subscriberId,
    leadKey: lead.leadKey,
    entityType: "websiteLead",
    entityId: lead.id,
    channel: "email",
    type: "admin_lead_follow_up",
    templateKey: cleanText(input?.templateKey, 120) || "manual_follow_up",
    recipient: lead.email,
    status: "sent",
    providerMessageId: result?.messageId,
    sentBy: actor.uid,
    sentByName: actor.displayName,
    subject,
  });
  await writeActivity({ actor, leadKey: lead.leadKey, action: "email.sent", summary: `Sent email: ${subject}` });
  const parsed = parseLeadKey(lead.leadKey);
  await db.collection(parsed.collection).doc(parsed.id).set({
    lastContactAt: FieldValue.serverTimestamp(),
    firstContactAt: lead.firstContactAt ? toTimestamp(lead.firstContactAt) : FieldValue.serverTimestamp(),
    status: ["new", "new_email_attention_required"].includes(lead.status) ? "contact_attempted" : lead.status,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  return { ok: true, messageId: result?.messageId || null };
}

export async function prepareEnquiryWhatsapp(leadKey, input, actor) {
  const lead = await getEnquiry(leadKey);
  if (!lead) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  const phone = normalizePhone(lead.phone);
  if (!phone) {
    const error = new Error("This enquiry does not have a valid phone number.");
    error.status = 400;
    throw error;
  }
  const message = cleanText(input?.message, 3000);
  if (!message) {
    const error = new Error("Write a WhatsApp message before continuing.");
    error.status = 400;
    throw error;
  }
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const db = getAdminDb();
  await writeCommunicationLog(db, {
    requestId: lead.requestId,
    subscriberId: lead.subscriberId,
    leadKey: lead.leadKey,
    entityType: "websiteLead",
    entityId: lead.id,
    channel: "whatsapp",
    type: "admin_whatsapp_handoff",
    templateKey: cleanText(input?.templateKey, 120) || "manual_whatsapp_follow_up",
    recipient: phone,
    status: "prepared",
    provider: "whatsapp_click_to_chat",
    sentBy: actor.uid,
    sentByName: actor.displayName,
  });
  await writeActivity({ actor, leadKey: lead.leadKey, action: "whatsapp.prepared", summary: "Prepared a WhatsApp follow-up message." });
  const parsed = parseLeadKey(lead.leadKey);
  await db.collection(parsed.collection).doc(parsed.id).set({
    lastContactAt: FieldValue.serverTimestamp(),
    firstContactAt: lead.firstContactAt ? toTimestamp(lead.firstContactAt) : FieldValue.serverTimestamp(),
    status: ["new", "new_email_attention_required"].includes(lead.status) ? "contact_attempted" : lead.status,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  return { ok: true, url };
}

export async function convertEnquiry(leadKey, input, actor) {
  const lead = await getEnquiry(leadKey);
  if (!lead) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  if (lead.status === "converted" && lead.conversionId) return { lead, conversionId: lead.conversionId, alreadyConverted: true };
  const db = getAdminDb();
  const conversionReference = db.collection("leadConversionRequests").doc();
  const conversionId = conversionReference.id;
  await conversionReference.set({
    conversionId,
    leadKey: lead.leadKey,
    sourceCollection: lead.sourceCollection,
    sourceDocumentId: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    enquiryType: lead.enquiryType,
    goals: lead.goals,
    requestedAction: "create_or_link_investor_profile",
    reportToolStatus: "pending_ops_profile_creation",
    notes: cleanText(input?.notes, 3000),
    requestedBy: actor.uid,
    requestedByName: actor.displayName,
    requestedByEmail: actor.email,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const parsed = parseLeadKey(lead.leadKey);
  await db.collection(parsed.collection).doc(parsed.id).set({
    status: "converted",
    conversionId,
    conversionStatus: "pending_ops_profile_creation",
    convertedAt: FieldValue.serverTimestamp(),
    convertedBy: actor.uid,
    convertedByName: actor.displayName,
    followUpAt: null,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await writeActivity({ actor, leadKey: lead.leadKey, action: "lead.converted", summary: "Converted the enquiry and created an investor handoff request.", details: { conversionId } });
  return { lead: await getEnquiry(lead.leadKey), conversionId, alreadyConverted: false };
}

export async function createLeadActivityForPublicSubmission({ leadKey, action = "lead.created", summary, details = {} }) {
  await writeActivity({ actor: null, leadKey, action, summary, details });
}
