import { FieldPath, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";
import { sendTransactionalEmail } from "./brevo";
import { writeCommunicationLog } from "./communications";
import { notifyConversionRequested, notifyLeadAssignee, notifyLeadMilestone } from "./leadNotifications";

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

function toRangeTimestamp(value, { endOfDay = false } = {}) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value;
  const text = String(value).trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? new Date(`${text}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+05:30`)
    : new Date(text);
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


const DIRECTORY_COLLECTION = "enquiryDirectory";
const INVESTOR_COLLECTIONS = ["investorProfiles", "investors", "clients", "users"];

function makeSearchTokens(lead) {
  const values = [lead.fullName, lead.email, lead.phone, lead.phoneNormalized, lead.requestId, lead.serviceArea, lead.enquiryType, lead.sourceLabel]
    .map((value) => cleanText(value, 240).toLowerCase())
    .filter(Boolean);
  const tokens = new Set();
  for (const value of values) {
    tokens.add(value);
    for (const word of value.split(/[^a-z0-9@.+]+/i).filter(Boolean)) {
      const max = Math.min(word.length, 24);
      for (let length = 2; length <= max; length += 1) tokens.add(word.slice(0, length));
    }
  }
  return [...tokens].slice(0, 180);
}

function leadDirectoryType(lead) {
  if (lead.enquiryType === "whatsapp") return "whatsapp";
  if (lead.sourceKey === "bucket") return "bucket";
  if (lead.sourceKey === "newsletter") return "newsletter";
  return "contact";
}

function leadToDirectoryRecord(lead) {
  const createdAt = toTimestamp(lead.createdAt) || Timestamp.now();
  const updatedAt = toTimestamp(lead.updatedAt || lead.createdAt) || Timestamp.now();
  const firstResponseHours = lead.createdAt && lead.firstContactAt
    ? Math.max(0, (new Date(lead.firstContactAt).getTime() - new Date(lead.createdAt).getTime()) / 3_600_000)
    : null;
  return {
    leadKey: lead.leadKey,
    sourceKey: lead.sourceKey,
    sourceCollection: lead.sourceCollection,
    sourceDocumentId: lead.id,
    directoryType: leadDirectoryType(lead),
    sourceLabel: lead.sourceLabel,
    enquiryType: lead.enquiryType,
    requestId: lead.requestId || "",
    subscriberId: lead.subscriberId || "",
    fullName: lead.fullName,
    email: lead.email,
    emailLowercase: lead.email,
    phone: lead.phone,
    phoneNormalized: lead.phoneNormalized,
    status: lead.status,
    priority: lead.priority,
    assignedTo: lead.assignedTo || null,
    assignedToName: lead.assignedToName || "",
    assignedToEmail: lead.assignedToEmail || "",
    assigneeKey: lead.assignedTo || lead.assignedToEmail || "unassigned",
    followUpAt: toTimestamp(lead.followUpAt),
    firstResponseDueAt: toTimestamp(lead.firstResponseDueAt),
    firstContactAt: toTimestamp(lead.firstContactAt),
    firstContacted: Boolean(lead.firstContactAt),
    firstResponseHours,
    createdAt,
    updatedAt,
    serviceArea: lead.serviceArea || "",
    source: lead.source || "",
    sourcePage: lead.sourcePage || "",
    campaign: lead.campaign || {},
    goals: Array.isArray(lead.goals) ? lead.goals : [],
    tags: Array.isArray(lead.tags) ? lead.tags : [],
    conversionId: lead.conversionId || "",
    conversionStatus: lead.conversionStatus || "",
    consentAccepted: lead.consentAccepted === true,
    isClosed: CLOSED_STATUSES.has(lead.status),
    searchTokens: makeSearchTokens(lead),
  };
}

function serializeDirectory(snapshot) {
  const data = snapshot.data();
  return {
    id: data.sourceDocumentId || snapshot.id,
    leadKey: data.leadKey || snapshot.id,
    sourceKey: data.sourceKey || "contact",
    sourceCollection: data.sourceCollection || "websiteLeads",
    sourceLabel: data.sourceLabel || "Website Lead",
    enquiryType: data.enquiryType || "discovery_conversation",
    requestId: data.requestId || data.sourceDocumentId || snapshot.id,
    subscriberId: data.subscriberId || "",
    fullName: data.fullName || "Website visitor",
    email: data.email || "",
    phone: data.phone || "",
    phoneNormalized: data.phoneNormalized || "",
    status: data.status || "new",
    priority: data.priority || "normal",
    assignedTo: data.assignedTo || null,
    assignedToName: data.assignedToName || "",
    assignedToEmail: data.assignedToEmail || "",
    followUpAt: toIso(data.followUpAt),
    firstResponseDueAt: toIso(data.firstResponseDueAt),
    firstContactAt: toIso(data.firstContactAt),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    serviceArea: data.serviceArea || "",
    source: data.source || "",
    sourcePage: data.sourcePage || "",
    campaign: data.campaign || {},
    goals: Array.isArray(data.goals) ? data.goals : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    conversionId: data.conversionId || "",
    conversionStatus: data.conversionStatus || "",
    consentAccepted: data.consentAccepted === true,
  };
}

function encodeCursor(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeCursor(value) {
  try {
    return JSON.parse(Buffer.from(String(value || ""), "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function syncEnquiryDirectory(leadKey) {
  if (!isFirebaseAdminConfigured()) return null;
  const lead = await getEnquiry(leadKey);
  if (!lead) return null;
  await getAdminDb().collection(DIRECTORY_COLLECTION).doc(lead.leadKey).set(leadToDirectoryRecord(lead), { merge: true });
  return lead;
}

export async function backfillEnquiryDirectory({ limitPerSource = 10_000 } = {}) {
  if (!isFirebaseAdminConfigured()) return { indexed: 0, sources: {} };
  const db = getAdminDb();
  const maximum = Math.max(1, Math.min(50_000, Number(limitPerSource) || 10_000));
  let indexed = 0;
  const sources = {};
  for (const config of SOURCE_CONFIGS) {
    let sourceIndexed = 0;
    let lastDocument = null;
    while (sourceIndexed < maximum) {
      const chunkSize = Math.min(500, maximum - sourceIndexed);
      let query = db.collection(config.collection).orderBy(FieldPath.documentId()).limit(chunkSize);
      if (lastDocument) query = query.startAfter(lastDocument);
      const snapshot = await query.get();
      if (snapshot.empty) break;
      let batch = db.batch();
      let operations = 0;
      for (const document of snapshot.docs) {
        const lead = serializeLead(document, config.key);
        batch.set(db.collection(DIRECTORY_COLLECTION).doc(lead.leadKey), leadToDirectoryRecord(lead), { merge: true });
        operations += 1;
        indexed += 1;
        sourceIndexed += 1;
        if (operations === 400) {
          await batch.commit();
          batch = db.batch();
          operations = 0;
        }
      }
      if (operations) await batch.commit();
      lastDocument = snapshot.docs.at(-1);
      if (snapshot.size < chunkSize) break;
    }
    sources[config.key] = sourceIndexed;
  }
  return { indexed, sources, limitPerSource: maximum };
}

async function ensureDirectoryReady() {
  if (!isFirebaseAdminConfigured()) return;
  const existing = await getAdminDb().collection(DIRECTORY_COLLECTION).limit(1).get();
  if (existing.empty) await backfillEnquiryDirectory({ limitPerSource: 10_000 });
}

async function countQuery(query) {
  try {
    const result = await query.count().get();
    return Number(result.data().count || 0);
  } catch {
    try {
      const snapshot = await query.limit(2000).get();
      return snapshot.size;
    } catch {
      return 0;
    }
  }
}

async function computeDirectoryStats() {
  const db = getAdminDb();
  const base = db.collection(DIRECTORY_COLLECTION);
  const now = Timestamp.now();
  const [total, fresh, followUpsDue, discovery, bucketList, newsletter, whatsapp, qualified, converted, closed, firstResponseOverdue, responseSnapshot] = await Promise.all([
    countQuery(base),
    countQuery(base.where("status", "in", ["new", "new_email_attention_required", "submission_error", "provider_sync_failed"])),
    countQuery(base.where("isClosed", "==", false).where("followUpAt", "<=", now)),
    countQuery(base.where("directoryType", "==", "contact")),
    countQuery(base.where("directoryType", "==", "bucket")),
    countQuery(base.where("directoryType", "==", "newsletter")),
    countQuery(base.where("directoryType", "==", "whatsapp")),
    countQuery(base.where("status", "==", "qualified")),
    countQuery(base.where("status", "==", "converted")),
    countQuery(base.where("isClosed", "==", true)),
    countQuery(base.where("isClosed", "==", false).where("firstContacted", "==", false).where("firstResponseDueAt", "<=", now)),
    base.where("firstResponseHours", ">=", 0).limit(500).get().catch(() => ({ docs: [] })),
  ]);
  const responseHours = responseSnapshot.docs.map((doc) => Number(doc.data().firstResponseHours)).filter(Number.isFinite);
  return {
    total,
    new: fresh,
    followUpsDue,
    firstResponseOverdue,
    averageFirstResponseHours: responseHours.length ? Math.round((responseHours.reduce((sum, value) => sum + value, 0) / responseHours.length) * 10) / 10 : null,
    discovery,
    bucketList,
    newsletter,
    whatsapp,
    qualified,
    converted,
    closed,
  };
}

async function findDuplicateLeads(lead) {
  const db = getAdminDb();
  const matches = new Map();
  const queries = [];
  if (lead.email) queries.push(db.collection(DIRECTORY_COLLECTION).where("emailLowercase", "==", lead.email).limit(20).get());
  if (lead.phoneNormalized) queries.push(db.collection(DIRECTORY_COLLECTION).where("phoneNormalized", "==", lead.phoneNormalized).limit(20).get());
  const snapshots = await Promise.all(queries.map((query) => query.catch(() => ({ docs: [] }))));
  for (const snapshot of snapshots) {
    for (const document of snapshot.docs) {
      const item = serializeDirectory(document);
      if (item.leadKey !== lead.leadKey) matches.set(item.leadKey, item);
    }
  }
  return [...matches.values()].slice(0, 20);
}

function investorMatchLabel(collection, data, id) {
  return cleanText(data.displayName || data.fullName || data.name || data.investorName || data.email || id, 180);
}

export async function findExistingInvestorMatches(lead) {
  if (!isFirebaseAdminConfigured() || (!lead?.email && !lead?.phoneNormalized)) return [];
  const db = getAdminDb();
  const matches = new Map();
  const querySpecs = [];
  for (const collection of INVESTOR_COLLECTIONS) {
    if (lead.email) {
      querySpecs.push([collection, "emailLowercase", lead.email]);
      querySpecs.push([collection, "email", lead.email]);
    }
    if (lead.phoneNormalized) {
      querySpecs.push([collection, "phoneNormalized", lead.phoneNormalized]);
      querySpecs.push([collection, "normalizedPhone", lead.phoneNormalized]);
      querySpecs.push([collection, "mobileNormalized", lead.phoneNormalized]);
    }
    if (lead.phone) {
      querySpecs.push([collection, "phone", lead.phone]);
      querySpecs.push([collection, "mobile", lead.phone]);
      querySpecs.push([collection, "phoneNumber", lead.phone]);
    }
  }
  const snapshots = await Promise.all(querySpecs.map(async ([collection, field, value]) => {
    try {
      return { collection, snapshot: await db.collection(collection).where(field, "==", value).limit(10).get() };
    } catch {
      return { collection, snapshot: { docs: [] } };
    }
  }));
  for (const { collection, snapshot } of snapshots) {
    for (const document of snapshot.docs) {
      const data = document.data();
      const role = normalizeRole(data.role || data.userRole || data.userType || (collection === "users" ? "" : "investor"));
      if (collection === "users" && !["investor", "client", "customer"].includes(role)) continue;
      const key = `${collection}/${document.id}`;
      matches.set(key, {
        id: document.id,
        collection,
        reference: key,
        displayName: investorMatchLabel(collection, data, document.id),
        email: normalizeEmail(data.email || data.emailLowercase),
        phone: cleanText(data.phone || data.mobile || data.phoneNumber, 60),
        role: role || "investor",
        status: cleanText(data.status, 80),
        advisorId: cleanText(data.advisorId || data.assignedAdvisorId || data.assignedTo, 180),
      });
    }
  }
  return [...matches.values()].slice(0, 20);
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
  cursor = "",
  from = "",
  to = "",
} = {}) {
  if (!isFirebaseAdminConfigured()) {
    return { items: [], total: 0, page: 1, pageSize: 25, totalPages: 1, nextCursor: null, hasMore: false, stats: computeStats([]) };
  }
  await ensureDirectoryReady();
  const db = getAdminDb();
  const safePageSize = Math.max(10, Math.min(100, Number(pageSize) || 25));
  const now = Timestamp.now();
  let query = db.collection(DIRECTORY_COLLECTION);
  if (source !== "all") query = query.where("directoryType", "==", source);
  if (status !== "all") query = query.where("status", "==", status);
  if (priority !== "all") query = query.where("priority", "==", priority);
  if (assignee === "unassigned") query = query.where("assigneeKey", "==", "unassigned");
  if (assignee !== "all" && assignee !== "unassigned") query = query.where("assigneeKey", "==", assignee);
  const searchToken = cleanText(search, 180).toLowerCase().split(/\s+/).filter(Boolean)[0] || "";
  if (searchToken) query = query.where("searchTokens", "array-contains", searchToken);
  const fromDate = toRangeTimestamp(from);
  const toDate = toRangeTimestamp(to, { endOfDay: true });
  if (fromDate) query = query.where("createdAt", ">=", fromDate);
  if (toDate) query = query.where("createdAt", "<=", toDate);
  let sortField = fromDate || toDate ? "createdAt" : "updatedAt";
  let sortDirection = "desc";
  if (followUp === "due") {
    query = query.where("isClosed", "==", false).where("followUpAt", "<=", now);
    sortField = "followUpAt";
    sortDirection = "asc";
  } else if (followUp === "scheduled") {
    query = query.where("isClosed", "==", false).where("followUpAt", ">", now);
    sortField = "followUpAt";
    sortDirection = "asc";
  }
  const decoded = decodeCursor(cursor);
  try {
    const total = await countQuery(query);
    query = query.orderBy(sortField, sortDirection).orderBy(FieldPath.documentId(), sortDirection);
    if (decoded?.value && decoded?.id && decoded?.field === sortField) {
      const cursorValue = sortField.endsWith("At") ? Timestamp.fromMillis(Number(decoded.value)) : decoded.value;
      query = query.startAfter(cursorValue, decoded.id);
    } else if (!cursor && Number(page) > 1) {
      query = query.offset((Math.max(1, Number(page)) - 1) * safePageSize);
    }
    const snapshot = await query.limit(safePageSize + 1).get();
    const hasMore = snapshot.docs.length > safePageSize;
    const docs = snapshot.docs.slice(0, safePageSize);
    const items = docs.map(serializeDirectory);
    const last = docs.at(-1);
    const lastValue = last?.data()?.[sortField];
    const nextCursor = hasMore && last && lastValue
      ? encodeCursor({ field: sortField, value: typeof lastValue.toMillis === "function" ? lastValue.toMillis() : lastValue, id: last.id })
      : null;
    return {
      items,
      total,
      page: Math.max(1, Number(page) || 1),
      pageSize: safePageSize,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
      nextCursor,
      hasMore,
      stats: await computeDirectoryStats(),
      directoryPowered: true,
    };
  } catch {
    const snapshot = await db.collection(DIRECTORY_COLLECTION).orderBy("updatedAt", "desc").limit(5000).get();
    const term = cleanText(search, 180).toLowerCase();
    const nowMs = Date.now();
    const filtered = snapshot.docs.map(serializeDirectory).filter((item) => {
      if (source !== "all" && leadDirectoryType(item) !== source) return false;
      if (status !== "all" && item.status !== status) return false;
      if (priority !== "all" && item.priority !== priority) return false;
      if (assignee === "unassigned" && (item.assignedTo || item.assignedToEmail)) return false;
      if (assignee !== "all" && assignee !== "unassigned" && item.assignedTo !== assignee && item.assignedToEmail !== assignee) return false;
      if (followUp === "due" && (!item.followUpAt || new Date(item.followUpAt).getTime() > nowMs || CLOSED_STATUSES.has(item.status))) return false;
      if (followUp === "scheduled" && (!item.followUpAt || new Date(item.followUpAt).getTime() <= nowMs || CLOSED_STATUSES.has(item.status))) return false;
      if (fromDate && (!item.createdAt || new Date(item.createdAt).getTime() < fromDate.toMillis())) return false;
      if (toDate && (!item.createdAt || new Date(item.createdAt).getTime() > toDate.toMillis())) return false;
      if (term && ![item.fullName, item.email, item.phone, item.requestId, item.serviceArea, item.sourceLabel].join(" ").toLowerCase().includes(term)) return false;
      return true;
    });
    const offset = decoded?.field === "fallbackOffset" ? Number(decoded.value || 0) : Math.max(0, (Math.max(1, Number(page) || 1) - 1) * safePageSize);
    const items = filtered.slice(offset, offset + safePageSize);
    const hasMore = offset + safePageSize < filtered.length;
    return {
      items,
      total: filtered.length,
      page: Math.floor(offset / safePageSize) + 1,
      pageSize: safePageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / safePageSize)),
      nextCursor: hasMore ? encodeCursor({ field: "fallbackOffset", value: offset + safePageSize, id: "fallback" }) : null,
      hasMore,
      stats: await computeDirectoryStats(),
      directoryPowered: true,
      fallbackQuery: true,
    };
  }
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
  await syncEnquiryDirectory(lead.leadKey).catch(() => null);
  const db = getAdminDb();
  const ordered = async (collection) => db.collection(collection)
    .where("leadKey", "==", lead.leadKey)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get()
    .catch(async () => db.collection(collection).where("leadKey", "==", lead.leadKey).limit(200).get().catch(() => ({ docs: [] })));
  const [activitiesSnapshot, notesSnapshot, communicationByLead, communicationByRequest, communicationBySubscriber, duplicates, investorMatches, conversionSnapshot] = await Promise.all([
    ordered("leadActivities"),
    ordered("leadNotes"),
    ordered("communicationLogs"),
    lead.requestId ? db.collection("communicationLogs").where("requestId", "==", lead.requestId).orderBy("createdAt", "desc").limit(200).get().catch(() => ({ docs: [] })) : Promise.resolve({ docs: [] }),
    lead.subscriberId ? db.collection("communicationLogs").where("subscriberId", "==", lead.subscriberId).orderBy("createdAt", "desc").limit(200).get().catch(() => ({ docs: [] })) : Promise.resolve({ docs: [] }),
    findDuplicateLeads(lead),
    findExistingInvestorMatches(lead),
    lead.conversionId ? db.collection("leadConversionRequests").doc(lead.conversionId).get().catch(() => null) : Promise.resolve(null),
  ]);

  const serializeGeneric = (doc) => ({ id: doc.id, ...doc.data(), createdAt: toIso(doc.data().createdAt), updatedAt: toIso(doc.data().updatedAt), deliveredAt: toIso(doc.data().deliveredAt), openedAt: toIso(doc.data().openedAt), clickedAt: toIso(doc.data().clickedAt) });
  const communicationMap = new Map();
  [...communicationByLead.docs, ...communicationByRequest.docs, ...communicationBySubscriber.docs].forEach((doc) => communicationMap.set(doc.id, serializeGeneric(doc)));

  return {
    lead,
    activities: activitiesSnapshot.docs.map(serializeGeneric).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    notes: notesSnapshot.docs.map(serializeGeneric).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    communications: [...communicationMap.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    duplicates,
    investorMatches,
    conversion: conversionSnapshot?.exists ? serializeGeneric(conversionSnapshot) : null,
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
  const hasField = (key) => Object.prototype.hasOwnProperty.call(input || {}, key);
  const status = hasField("status") && LEAD_STATUSES.includes(input?.status) ? input.status : existing.status;
  const priority = hasField("priority") && LEAD_PRIORITIES.includes(input?.priority) ? input.priority : existing.priority;
  const assignedTo = hasField("assignedTo") ? cleanText(input?.assignedTo, 180) : cleanText(existing.assignedTo, 180);
  let assignedToName = hasField("assignedTo") ? "" : existing.assignedToName;
  let assignedToEmail = hasField("assignedTo") ? "" : existing.assignedToEmail;
  if (hasField("assignedTo") && assignedTo) {
    const assignee = await resolveAssignableProfile(db, assignedTo);
    if (!assignee) {
      const error = new Error("The selected team member is not an active GrowVest staff or advisor profile.");
      error.status = 400;
      throw error;
    }
    assignedToName = cleanText(assignee.displayName || assignee.fullName || assignee.name || assignee.email || "GrowVest team member", 180);
    assignedToEmail = normalizeEmail(assignee.email);
  }
  const followUpAt = hasField("followUpAt") ? (input?.followUpAt === "" ? null : toTimestamp(input?.followUpAt)) : toTimestamp(existing.followUpAt);
  const now = FieldValue.serverTimestamp();
  const update = {
    status,
    priority,
    assignedTo: assignedTo || null,
    assignedToName: hasField("assignedTo") ? assignedToName : existing.assignedToName,
    assignedToEmail: hasField("assignedTo") ? assignedToEmail : existing.assignedToEmail,
    consentAccepted: hasField("consentAccepted") ? input?.consentAccepted === true : existing.consentAccepted,
    consentRecordedAt: hasField("consentAccepted") && input?.consentAccepted === true && existing.consentAccepted !== true ? now : undefined,
    consentRecordedBy: hasField("consentAccepted") && input?.consentAccepted === true && existing.consentAccepted !== true ? actor.uid : undefined,
    consentRecordedByName: hasField("consentAccepted") && input?.consentAccepted === true && existing.consentAccepted !== true ? actor.displayName : undefined,
    consentWithdrawnAt: hasField("consentAccepted") && input?.consentAccepted !== true && existing.consentAccepted === true ? now : undefined,
    consentWithdrawnBy: hasField("consentAccepted") && input?.consentAccepted !== true && existing.consentAccepted === true ? actor.uid : undefined,
    consentWithdrawnByName: hasField("consentAccepted") && input?.consentAccepted !== true && existing.consentAccepted === true ? actor.displayName : undefined,
    followUpAt,
    nextAction: hasField("nextAction") ? cleanText(input?.nextAction, 500) : existing.nextAction,
    lostReason: hasField("lostReason") ? cleanText(input?.lostReason, 500) : existing.lostReason,
    tags: hasField("tags") ? cleanStringArray(input?.tags) : existing.tags,
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
  Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

  await reference.set(update, { merge: true });
  const changed = [];
  const changes = {};
  const recordChange = (field, from, to, label) => {
    if (JSON.stringify(from ?? null) === JSON.stringify(to ?? null)) return;
    changed.push(label || `${field} updated`);
    changes[field] = { from: from ?? null, to: to ?? null };
  };
  recordChange("status", existing.status, status, `status ${existing.status} → ${status}`);
  recordChange("priority", existing.priority, priority, `priority ${existing.priority} → ${priority}`);
  recordChange("assignedTo", existing.assignedTo || "", assignedTo || "", "assignment updated");
  if (hasField("followUpAt")) recordChange("followUpAt", existing.followUpAt || null, input?.followUpAt || null, "follow-up updated");
  if (hasField("nextAction")) recordChange("nextAction", existing.nextAction || "", update.nextAction || "", "next action updated");
  if (hasField("lostReason")) recordChange("lostReason", existing.lostReason || "", update.lostReason || "", "closure reason updated");
  if (hasField("tags")) recordChange("tags", existing.tags || [], update.tags || [], "tags updated");
  if (hasField("consentAccepted")) recordChange("consentAccepted", existing.consentAccepted === true, update.consentAccepted === true, update.consentAccepted ? "contact consent recorded" : "contact consent withdrawn");
  await writeActivity({
    actor,
    leadKey: parsed.leadKey,
    action: "lead.updated",
    summary: changed.length ? `Updated ${changed.join(", ")}.` : "Updated enquiry details.",
    details: { changes },
  });
  const updatedLead = await syncEnquiryDirectory(parsed.leadKey);
  if (updatedLead && (existing.assignedTo || "") !== (updatedLead.assignedTo || "") && updatedLead.assignedToEmail) {
    await notifyLeadAssignee({
      lead: updatedLead,
      actor,
      event: existing.assignedTo ? "reassigned" : "assigned",
      previousAssignee: existing.assignedToName || existing.assignedToEmail || "",
    }).catch(() => null);
  }
  if (updatedLead && existing.status !== "qualified" && updatedLead.status === "qualified" && updatedLead.assignedToEmail) {
    await notifyLeadMilestone({ lead: updatedLead, actor, milestone: "qualified" }).catch(() => null);
  }
  return updatedLead || getEnquiry(parsed.leadKey);
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
  const lead = await syncEnquiryDirectory(leadKey);
  if (lead?.assignedToEmail) await notifyLeadAssignee({ lead, actor, event: "assigned" }).catch(() => null);
  return lead || getEnquiry(leadKey);
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
  await syncEnquiryDirectory(lead.leadKey).catch(() => null);
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
  await syncEnquiryDirectory(lead.leadKey).catch(() => null);
  return { ok: true, url };
}

export async function convertEnquiry(leadKey, input, actor) {
  const lead = await getEnquiry(leadKey);
  if (!lead) {
    const error = new Error("This enquiry could not be found.");
    error.status = 404;
    throw error;
  }
  if (lead.conversionId) return { lead, conversionId: lead.conversionId, alreadyRequested: true };
  const notes = cleanText(input?.notes, 3000);
  const preferredCommunicationMethod = ["email", "phone", "whatsapp", "video_call"].includes(input?.preferredCommunicationMethod)
    ? input.preferredCommunicationMethod
    : "";
  const duplicateReviewCompleted = input?.duplicateReviewCompleted === true;
  const eligibility = {
    qualified: lead.status === "qualified",
    assigned: Boolean(lead.assignedTo || lead.assignedToEmail),
    contactAvailable: Boolean(lead.email || lead.phoneNormalized),
    consentRecorded: lead.consentAccepted === true,
    duplicateReviewCompleted,
    notesProvided: Boolean(notes),
    communicationPreferenceRecorded: Boolean(preferredCommunicationMethod),
  };
  const missing = Object.entries(eligibility).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    const labels = {
      qualified: "mark the lead as Qualified",
      assigned: "assign a GrowVest team member",
      contactAvailable: "add a valid email or mobile number",
      consentRecorded: "record contact consent",
      duplicateReviewCompleted: "complete the duplicate and existing-investor review",
      notesProvided: "add conversion notes",
      communicationPreferenceRecorded: "record the preferred communication method",
    };
    const error = new Error(`Complete these conversion requirements: ${missing.map((item) => labels[item]).join(", ")}.`);
    error.status = 400;
    error.code = "CONVERSION_NOT_ELIGIBLE";
    error.details = { eligibility, missing };
    throw error;
  }

  const investorMatches = await findExistingInvestorMatches(lead);
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
    phoneNormalized: lead.phoneNormalized,
    enquiryType: lead.enquiryType,
    goals: lead.goals,
    assignedTo: lead.assignedTo || null,
    assignedToName: lead.assignedToName || "",
    assignedToEmail: lead.assignedToEmail || "",
    requestedAction: "create_or_link_investor_profile",
    status: "pending_review",
    reportToolStatus: "pending_conversion_review",
    notes,
    preferredCommunicationMethod,
    duplicateReviewCompleted,
    investorMatches,
    selectedInvestorReference: cleanText(input?.selectedInvestorReference, 300),
    eligibility,
    requestedBy: actor.uid,
    requestedByName: actor.displayName,
    requestedByEmail: actor.email,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const parsed = parseLeadKey(lead.leadKey);
  await db.collection(parsed.collection).doc(parsed.id).set({
    conversionId,
    conversionStatus: "pending_review",
    conversionRequestedAt: FieldValue.serverTimestamp(),
    conversionRequestedBy: actor.uid,
    conversionRequestedByName: actor.displayName,
    preferredCommunicationMethod,
    duplicateReviewCompleted,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await writeActivity({ actor, leadKey: lead.leadKey, action: "conversion.requested", summary: "Created an investor conversion request for review.", details: { conversionId } });
  await syncEnquiryDirectory(lead.leadKey).catch(() => null);
  await notifyConversionRequested({ lead, conversionId, actor }).catch(() => null);
  return { lead: await getEnquiry(lead.leadKey), conversionId, alreadyRequested: false, status: "pending_review" };
}

function serializeConversion(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    conversionId: data.conversionId || snapshot.id,
    leadKey: data.leadKey || "",
    fullName: data.fullName || "Website lead",
    email: data.email || "",
    phone: data.phone || "",
    enquiryType: data.enquiryType || "",
    status: data.status || "pending_review",
    reportToolStatus: data.reportToolStatus || "",
    assignedToName: data.assignedToName || "",
    assignedToEmail: data.assignedToEmail || "",
    requestedByName: data.requestedByName || "",
    notes: data.notes || "",
    preferredCommunicationMethod: data.preferredCommunicationMethod || "",
    duplicateReviewCompleted: data.duplicateReviewCompleted === true,
    investorMatches: Array.isArray(data.investorMatches) ? data.investorMatches : [],
    selectedInvestorReference: data.selectedInvestorReference || "",
    eligibility: data.eligibility && typeof data.eligibility === "object" ? data.eligibility : {},
    investorProfileId: data.investorProfileId || "",
    investorUid: data.investorUid || "",
    decisionNotes: data.decisionNotes || "",
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    approvedAt: toIso(data.approvedAt),
    completedAt: toIso(data.completedAt),
  };
}

export async function listConversionRequests({ status = "all", search = "", pageSize = 50 } = {}) {
  if (!isFirebaseAdminConfigured()) return { items: [], counts: {} };
  const db = getAdminDb();
  let query = db.collection("leadConversionRequests");
  if (status !== "all") query = query.where("status", "==", status);
  const snapshot = await query.orderBy("updatedAt", "desc").limit(Math.max(10, Math.min(200, Number(pageSize) || 50))).get().catch(async () => query.limit(200).get());
  const term = cleanText(search, 180).toLowerCase();
  const items = snapshot.docs.map(serializeConversion).filter((item) => !term || [item.fullName, item.email, item.phone, item.conversionId, item.leadKey].join(" ").toLowerCase().includes(term));
  const all = await db.collection("leadConversionRequests").limit(1000).get().catch(() => ({ docs: [] }));
  const counts = all.docs.reduce((accumulator, document) => {
    const key = document.data().status || "pending_review";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
  return { items, counts };
}

export async function getConversionRequest(id) {
  if (!isFirebaseAdminConfigured()) return null;
  const snapshot = await getAdminDb().collection("leadConversionRequests").doc(cleanText(id, 180)).get();
  if (!snapshot.exists) return null;
  const conversion = serializeConversion(snapshot);
  const lead = conversion.leadKey ? await getEnquiry(conversion.leadKey) : null;
  const investorMatches = lead ? await findExistingInvestorMatches(lead) : conversion.investorMatches;
  return { conversion, lead, investorMatches };
}

export async function updateConversionRequest(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection("leadConversionRequests").doc(cleanText(id, 180));
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This conversion request could not be found.");
    error.status = 404;
    throw error;
  }
  const current = serializeConversion(snapshot);
  const action = cleanText(input?.action, 80);
  const decisionNotes = cleanText(input?.decisionNotes, 3000);
  const selectedInvestorReference = cleanText(input?.selectedInvestorReference || current.selectedInvestorReference, 300);
  const investorProfileId = cleanText(input?.investorProfileId || current.investorProfileId, 180);
  const investorUid = cleanText(input?.investorUid || current.investorUid, 180);
  const now = FieldValue.serverTimestamp();
  let update = { decisionNotes, selectedInvestorReference, investorProfileId, investorUid, updatedBy: actor.uid, updatedByName: actor.displayName, updatedAt: now };
  let activityAction = "conversion.updated";
  let activitySummary = "Updated the conversion request.";

  if (action === "approve") {
    if (!decisionNotes) {
      const error = new Error("Add approval notes before approving the conversion request.");
      error.status = 400;
      throw error;
    }
    update = { ...update, status: "approved", reportToolStatus: selectedInvestorReference ? "approved_link_existing" : "approved_create_profile", approvedBy: actor.uid, approvedByName: actor.displayName, approvedAt: now };
    activityAction = "conversion.approved";
    activitySummary = "Approved the investor conversion request.";
  } else if (action === "reject") {
    if (!decisionNotes) {
      const error = new Error("Add a rejection reason before rejecting the request.");
      error.status = 400;
      throw error;
    }
    update = { ...update, status: "rejected", reportToolStatus: "conversion_rejected", rejectedBy: actor.uid, rejectedByName: actor.displayName, rejectedAt: now };
    activityAction = "conversion.rejected";
    activitySummary = "Rejected the investor conversion request.";
  } else if (action === "onboarding_requested") {
    if (!['approved', 'onboarding_requested'].includes(current.status)) {
      const error = new Error("Approve the conversion before requesting investor onboarding.");
      error.status = 400;
      throw error;
    }
    update = { ...update, status: "onboarding_requested", reportToolStatus: "pending_ops_profile_creation", onboardingRequestedBy: actor.uid, onboardingRequestedByName: actor.displayName, onboardingRequestedAt: now };
    activityAction = "conversion.onboarding_requested";
    activitySummary = "Sent the approved conversion for investor-profile onboarding.";
  } else if (action === "complete") {
    if (current.status !== "onboarding_requested") {
      const error = new Error("Send the approved conversion to onboarding before marking it complete.");
      error.status = 400;
      throw error;
    }
    if (!investorProfileId && !selectedInvestorReference) {
      const error = new Error("Record an Investor Profile ID or link an existing investor before completing conversion.");
      error.status = 400;
      throw error;
    }
    update = { ...update, status: "completed", reportToolStatus: "investor_profile_linked", completedBy: actor.uid, completedByName: actor.displayName, completedAt: now };
    activityAction = "conversion.completed";
    activitySummary = "Completed investor conversion and linked the investor profile.";
  } else {
    const allowedStatuses = ["pending_review", "approved", "rejected", "onboarding_requested", "completed"];
    const status = allowedStatuses.includes(input?.status) ? input.status : current.status;
    update = { ...update, status };
  }

  await reference.set(update, { merge: true });
  if (current.leadKey) {
    const parsed = parseLeadKey(current.leadKey);
    if (parsed) {
      const sourceUpdate = {
        conversionStatus: update.status || current.status,
        updatedAt: now,
        ...(action === "complete" ? {
          status: "converted",
          convertedAt: now,
          convertedBy: actor.uid,
          convertedByName: actor.displayName,
          investorProfileId: investorProfileId || null,
          investorUid: investorUid || null,
          linkedInvestorReference: selectedInvestorReference || null,
          followUpAt: null,
        } : {}),
      };
      await db.collection(parsed.collection).doc(parsed.id).set(sourceUpdate, { merge: true });
      await writeActivity({ actor, leadKey: current.leadKey, action: activityAction, summary: activitySummary, details: { conversionId: current.conversionId, selectedInvestorReference, investorProfileId, investorUid } });
      await syncEnquiryDirectory(current.leadKey).catch(() => null);
    }
  }
  return getConversionRequest(current.conversionId);
}

export async function getEnquiryAnalytics({ from = "", to = "" } = {}) {
  if (!isFirebaseAdminConfigured()) return { summary: {}, monthly: [], statuses: [], sources: [], assignees: [], goals: [], pages: [], campaigns: [] };
  await ensureDirectoryReady();
  const db = getAdminDb();
  let baseQuery = db.collection(DIRECTORY_COLLECTION);
  const fromDate = toRangeTimestamp(from);
  const toDate = toRangeTimestamp(to, { endOfDay: true });
  if (fromDate) baseQuery = baseQuery.where("createdAt", ">=", fromDate);
  if (toDate) baseQuery = baseQuery.where("createdAt", "<=", toDate);
  baseQuery = baseQuery.orderBy("createdAt", "desc").orderBy(FieldPath.documentId(), "desc");
  const rows = [];
  let lastDocument = null;
  while (rows.length < 20_000) {
    let query = baseQuery.limit(1000);
    if (lastDocument) query = query.startAfter(lastDocument);
    const snapshot = await query.get();
    if (snapshot.empty) break;
    rows.push(...snapshot.docs.map((doc) => ({ ...serializeDirectory(doc), raw: doc.data() })));
    lastDocument = snapshot.docs.at(-1);
    if (snapshot.size < 1000) break;
  }
  const countBy = (getter) => {
    const map = new Map();
    for (const row of rows) {
      const keys = getter(row);
      for (const key of (Array.isArray(keys) ? keys : [keys])) {
        const label = cleanText(key, 180) || "Not specified";
        map.set(label, (map.get(label) || 0) + 1);
      }
    }
    return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  };
  const conversionBy = (getter) => {
    const map = new Map();
    for (const row of rows) {
      const label = cleanText(getter(row), 180) || "Not specified";
      const current = map.get(label) || { label, total: 0, converted: 0, rate: 0 };
      current.total += 1;
      if (row.status === "converted") current.converted += 1;
      map.set(label, current);
    }
    return [...map.values()]
      .map((item) => ({ ...item, rate: item.total ? Math.round((item.converted / item.total) * 1000) / 10 : 0 }))
      .sort((a, b) => b.total - a.total);
  };
  const converted = rows.filter((row) => row.status === "converted").length;
  const guideRows = rows.filter((row) => row.source === "growvest_guide");
  const whatsappRows = rows.filter((row) => row.enquiryType === "whatsapp");
  const responseHours = rows.map((row) => Number(row.raw.firstResponseHours)).filter(Number.isFinite);
  return {
    summary: {
      total: rows.length,
      converted,
      conversionRate: rows.length ? Math.round((converted / rows.length) * 1000) / 10 : 0,
      averageFirstResponseHours: responseHours.length ? Math.round((responseHours.reduce((sum, value) => sum + value, 0) / responseHours.length) * 10) / 10 : null,
      guideLeads: guideRows.length,
      guideConverted: guideRows.filter((row) => row.status === "converted").length,
      guideConversionRate: guideRows.length ? Math.round((guideRows.filter((row) => row.status === "converted").length / guideRows.length) * 1000) / 10 : 0,
      whatsappLeads: whatsappRows.length,
      whatsappConverted: whatsappRows.filter((row) => row.status === "converted").length,
      whatsappConversionRate: whatsappRows.length ? Math.round((whatsappRows.filter((row) => row.status === "converted").length / whatsappRows.length) * 1000) / 10 : 0,
    },
    monthly: countBy((row) => row.createdAt ? row.createdAt.slice(0, 7) : "Unknown").sort((a, b) => a.label.localeCompare(b.label)),
    statuses: countBy((row) => row.status),
    sources: countBy((row) => row.sourceLabel),
    assignees: countBy((row) => row.assignedToName || "Unassigned"),
    goals: countBy((row) => row.goals?.map((goal) => goal.title || goal.name || goal.type || goal) || []),
    pages: countBy((row) => row.sourcePage || "Not captured").slice(0, 15),
    campaigns: countBy((row) => row.campaign?.campaign || row.campaign?.source || "Organic / direct").slice(0, 15),
    sourceConversions: conversionBy((row) => row.sourceLabel).slice(0, 15),
    assigneeConversions: conversionBy((row) => row.assignedToName || "Unassigned").slice(0, 15),
  };
}

export async function exportEnquiriesCsv(filters = {}) {
  const result = await listEnquiries({ ...filters, pageSize: 100 });
  const rows = [...result.items];
  let cursor = result.nextCursor;
  while (cursor && rows.length < 5000) {
    const next = await listEnquiries({ ...filters, pageSize: 100, cursor });
    rows.push(...next.items);
    cursor = next.nextCursor;
  }
  const columns = ["Reference", "Name", "Email", "Phone", "Type", "Status", "Priority", "Assigned To", "Follow-up", "Source Page", "Created"];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns.map(escape).join(","), ...rows.map((row) => [row.requestId, row.fullName, row.email, row.phone, row.sourceLabel, row.status, row.priority, row.assignedToName, row.followUpAt, row.sourcePage, row.createdAt].map(escape).join(","))].join("\n");
}


export async function createLeadActivityForPublicSubmission({ leadKey, action = "lead.created", summary, details = {} }) {
  await writeActivity({ actor: null, leadKey, action, summary, details });
}
