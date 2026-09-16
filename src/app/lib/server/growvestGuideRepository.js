import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { FAQS } from "../../data/faqs";
import { GOAL_LIBRARY_SEED } from "../../data/websiteContentSeed";
import { INSIGHTS_SEED } from "../../data/insightsSeed";
import { GUIDE_CONVERSATION_STATUSES, GUIDE_DEFAULT_SETTINGS, GUIDE_FEEDBACK_VALUES, GUIDE_KNOWLEDGE_SEED, GUIDE_STATUSES } from "../../data/growvestGuide";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";
import { CACHE_TAGS, PUBLIC_CACHE_TTL } from "./cacheConfig";
import { syncEnquiryDirectory } from "./enquiriesRepository";

const KNOWLEDGE_COLLECTION = "guideKnowledge";
const SETTINGS_COLLECTION = "guideSettings";
const CONVERSATIONS_COLLECTION = "guideConversations";
const MESSAGES_COLLECTION = "guideMessages";
const UNANSWERED_COLLECTION = "guideUnansweredQuestions";
const FEEDBACK_COLLECTION = "guideFeedback";
const AUDIT_COLLECTION = "websiteAuditLogs";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "by", "can", "could", "do", "does", "for", "from", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "our", "the", "this", "to", "we", "what", "when", "where", "which", "who", "why", "with", "you", "your",
]);

const ADVICE_PATTERNS = [
  /\b(which|best|top)\s+(mutual fund|fund|sip|stock|share|insurance|policy|investment)\b/i,
  /\b(buy|sell|invest in|switch to|exit|redeem)\b/i,
  /\bguarantee(?:d)?\s+(return|profit|income)\b/i,
  /\bhow much should i invest\b/i,
  /\bportfolio recommendation\b/i,
  /\btarget return\b/i,
  /\btrading signal\b/i,
];

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanInteger(value, fallback = 0, min = 0, max = 9999) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function cleanBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function cleanUrl(value) {
  const text = cleanText(value, 1200);
  if (!text) return "";
  if (text.startsWith("/")) return text;
  try {
    const url = new URL(text);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function slugify(value) {
  return cleanText(value, 180)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function iso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function serialize(document) {
  if (!document) return null;
  const data = typeof document.data === "function" ? document.data() : document;
  const id = typeof document.id === "string" ? document.id : data.id;
  return {
    ...data,
    id,
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
    lastMessageAt: iso(data.lastMessageAt),
    handedOffAt: iso(data.handedOffAt),
    closedAt: iso(data.closedAt),
  };
}

function tokenize(value) {
  return cleanText(value, 5000)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9₹]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function compactAnswer(value, max = 760) {
  const text = cleanText(value, 3000).replace(/\s+/g, " ");
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastStop = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf("? "), truncated.lastIndexOf("! "));
  return `${(lastStop > 250 ? truncated.slice(0, lastStop + 1) : truncated).trim()}…`;
}

function scoreCandidate(query, queryTokens, candidate) {
  const question = cleanText(candidate.question || candidate.title || candidate.label, 500).toLowerCase();
  const answer = cleanText(candidate.answer || candidate.description || candidate.excerpt, 2500).toLowerCase();
  const keywords = Array.isArray(candidate.keywords) ? candidate.keywords.map((item) => cleanText(item, 120).toLowerCase()) : [];
  const haystackTokens = new Set(tokenize(`${question} ${answer} ${keywords.join(" ")} ${candidate.category || ""}`));
  let score = 0;
  let overlap = 0;

  for (const token of queryTokens) {
    if (haystackTokens.has(token)) {
      overlap += 1;
      score += token.length >= 7 ? 4 : 2;
    }
    if (question.includes(token)) score += 1.5;
  }

  if (question && (question.includes(query) || query.includes(question))) score += 14;
  for (const keyword of keywords) {
    if (keyword && query.includes(keyword)) score += 8;
  }

  const coverage = queryTokens.length ? overlap / queryTokens.length : 0;
  score += coverage * 12;
  return { score, coverage };
}

function normalizeKnowledge(item, sourceType = "guide") {
  const question = cleanText(item.question || item.q || item.title || item.label, 420);
  const answer = cleanText(item.answer || item.a || item.description || item.excerpt || item.why, 4000);
  return {
    id: item.id || slugify(question),
    sourceType,
    question,
    answer,
    category: cleanText(item.category || item.categoryName || (sourceType === "insight" ? "Insights" : "General"), 120),
    keywords: unique([
      ...(Array.isArray(item.keywords) ? item.keywords : []),
      ...(Array.isArray(item.tags) ? item.tags : []),
      ...(Array.isArray(item.keySteps) ? item.keySteps.slice(0, 4) : []),
      ...(Array.isArray(item.watchOuts) ? item.watchOuts.slice(0, 2) : []),
    ]).slice(0, 30),
    sourceUrl: cleanUrl(item.sourceUrl || (sourceType === "insight" && item.slug ? `/insights/${item.slug}` : sourceType === "goal" ? "/goal-library" : sourceType === "faq" ? "/faqs" : "")),
    sourceLabel: cleanText(item.sourceLabel || (sourceType === "insight" ? "GrowVest Insights" : sourceType === "goal" ? "Goal Library" : sourceType === "faq" ? "GrowVest FAQs" : "GrowVest Guide"), 160),
    status: item.status || "published",
    displayOrder: Number(item.displayOrder || 0),
  };
}

export function sanitizeGuideKnowledgeInput(input, { existing = null, actor = null } = {}) {
  const question = cleanText(input?.question, 420);
  const answer = cleanText(input?.answer, 5000);
  if (!question || !answer) {
    const error = new Error("Add both the approved question and answer.");
    error.status = 400;
    throw error;
  }
  const status = GUIDE_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  return {
    question,
    answer,
    category: cleanText(input?.category || "General", 120),
    keywords: unique((Array.isArray(input?.keywords) ? input.keywords : String(input?.keywords || "").split(",")).map((item) => cleanText(item, 120))).slice(0, 30),
    sourceUrl: cleanUrl(input?.sourceUrl),
    sourceLabel: cleanText(input?.sourceLabel, 160),
    status,
    displayOrder: cleanInteger(input?.displayOrder, existing?.displayOrder || 0, 0, 9999),
    isVisible: input?.isVisible !== false,
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdAt: FieldValue.serverTimestamp(),
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
    }),
    ...(status === "published" ? { publishedAt: existing?.publishedAt || FieldValue.serverTimestamp() } : {}),
  };
}

export function sanitizeGuideSettingsInput(input, { existing = null, actor = null } = {}) {
  const fallback = { ...GUIDE_DEFAULT_SETTINGS, ...(existing || {}) };
  const quickPrompts = unique((Array.isArray(input?.quickPrompts) ? input.quickPrompts : fallback.quickPrompts).map((item) => cleanText(item, 180))).slice(0, 8);
  const number = cleanText(input?.whatsappNumber || fallback.whatsappNumber, 40).replace(/[^0-9]/g, "");
  return {
    key: "global",
    status: input?.status === "draft" ? "draft" : "published",
    isEnabled: cleanBoolean(input?.isEnabled, fallback.isEnabled),
    assistantName: cleanText(input?.assistantName || fallback.assistantName, 100),
    launcherLabel: cleanText(input?.launcherLabel || fallback.launcherLabel, 120),
    welcomeTitle: cleanText(input?.welcomeTitle || fallback.welcomeTitle, 180),
    welcomeMessage: cleanText(input?.welcomeMessage || fallback.welcomeMessage, 800),
    inputPlaceholder: cleanText(input?.inputPlaceholder || fallback.inputPlaceholder, 160),
    fallbackMessage: cleanText(input?.fallbackMessage || fallback.fallbackMessage, 1000),
    adviceBoundaryMessage: cleanText(input?.adviceBoundaryMessage || fallback.adviceBoundaryMessage, 1200),
    disclaimer: cleanText(input?.disclaimer || fallback.disclaimer, 1200),
    whatsappEnabled: cleanBoolean(input?.whatsappEnabled, fallback.whatsappEnabled),
    whatsappNumber: number || GUIDE_DEFAULT_SETTINGS.whatsappNumber,
    whatsappLabel: cleanText(input?.whatsappLabel || fallback.whatsappLabel, 120),
    guidedJourneysEnabled: cleanBoolean(input?.guidedJourneysEnabled, fallback.guidedJourneysEnabled),
    sessionMemoryEnabled: cleanBoolean(input?.sessionMemoryEnabled, fallback.sessionMemoryEnabled),
    feedbackEnabled: cleanBoolean(input?.feedbackEnabled, fallback.feedbackEnabled),
    showSources: cleanBoolean(input?.showSources, fallback.showSources),
    lowConfidenceThreshold: Math.max(0.1, Math.min(0.9, Number(input?.lowConfidenceThreshold ?? fallback.lowConfidenceThreshold ?? 0.35))),
    sessionRetentionHours: cleanInteger(input?.sessionRetentionHours, fallback.sessionRetentionHours || 24, 1, 168),
    quickPrompts: quickPrompts.length ? quickPrompts : GUIDE_DEFAULT_SETTINGS.quickPrompts,
    maxAnswerSources: cleanInteger(input?.maxAnswerSources, fallback.maxAnswerSources, 1, 5),
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: actor?.uid || "system" }),
  };
}

async function writeAudit({ actor, action, entityType, entityId, summary, details = {} }) {
  if (!isFirebaseAdminConfigured()) return;
  await getAdminDb().collection(AUDIT_COLLECTION).add({
    actorId: actor?.uid || "system",
    actorName: actor?.displayName || "System",
    actorEmail: actor?.email || "",
    action,
    entityType,
    entityId,
    summary,
    details,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function listGuideKnowledge({ publicOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) {
    return GUIDE_KNOWLEDGE_SEED
      .map((item) => ({ ...item, isSeedFallback: true }))
      .filter((item) => !publicOnly || (item.status === "published" && item.isVisible !== false));
  }
  const snapshot = await getAdminDb().collection(KNOWLEDGE_COLLECTION).limit(500).get();
  const stored = snapshot.docs.map(serialize);
  const storedById = new Map(stored.map((item) => [item.id, item]));
  const merged = GUIDE_KNOWLEDGE_SEED.map((item) => storedById.get(item.id) || { ...item, isSeedFallback: true });
  const seedIds = new Set(GUIDE_KNOWLEDGE_SEED.map((item) => item.id));
  merged.push(...stored.filter((item) => !seedIds.has(item.id)));
  return merged
    .filter((item) => !publicOnly || (item.status === "published" && item.isVisible !== false))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || String(a.question).localeCompare(String(b.question)));
}

export async function getGuideKnowledge(id) {
  if (!id) return null;
  if (!isFirebaseAdminConfigured()) return GUIDE_KNOWLEDGE_SEED.find((item) => item.id === id) || null;
  const snapshot = await getAdminDb().collection(KNOWLEDGE_COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createGuideKnowledge(input, actor) {
  const db = getAdminDb();
  const payload = sanitizeGuideKnowledgeInput(input, { actor });
  const reference = db.collection(KNOWLEDGE_COLLECTION).doc();
  await reference.set(payload);
  await writeAudit({ actor, action: "guide.knowledge.created", entityType: "guideKnowledge", entityId: reference.id, summary: `Created Guide answer: ${payload.question}` });
  return getGuideKnowledge(reference.id);
}

export async function updateGuideKnowledge(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(KNOWLEDGE_COLLECTION).doc(id);
  const snapshot = await reference.get();
  const seedFallback = GUIDE_KNOWLEDGE_SEED.find((item) => item.id === id) || null;
  if (!snapshot.exists && !seedFallback) {
    const error = new Error("Guide answer not found.");
    error.status = 404;
    throw error;
  }
  const existing = snapshot.exists ? snapshot.data() : seedFallback;
  const payload = sanitizeGuideKnowledgeInput(input, { existing: snapshot.exists ? existing : null, actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: snapshot.exists ? "guide.knowledge.updated" : "guide.knowledge.created_from_default", entityType: "guideKnowledge", entityId: id, summary: `Updated Guide answer: ${payload.question}` });
  return getGuideKnowledge(id);
}

export async function archiveGuideKnowledge(id, actor) {
  const db = getAdminDb();
  const reference = db.collection(KNOWLEDGE_COLLECTION).doc(id);
  const snapshot = await reference.get();
  const seedFallback = GUIDE_KNOWLEDGE_SEED.find((item) => item.id === id) || null;
  if (!snapshot.exists && !seedFallback) return;
  const base = snapshot.exists ? {} : sanitizeGuideKnowledgeInput({ ...seedFallback, status: "archived", isVisible: false }, { actor });
  await reference.set({ ...base, status: "archived", isVisible: false, archivedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid, updatedByName: actor.displayName }, { merge: true });
  await writeAudit({ actor, action: "guide.knowledge.archived", entityType: "guideKnowledge", entityId: id, summary: `Archived Guide answer: ${snapshot.data()?.question || seedFallback?.question || id}` });
}

export async function seedGuideKnowledge(actor) {
  const db = getAdminDb();
  const batch = db.batch();
  let created = 0;
  let skipped = 0;
  for (const item of GUIDE_KNOWLEDGE_SEED) {
    const reference = db.collection(KNOWLEDGE_COLLECTION).doc(item.id);
    const snapshot = await reference.get();
    if (snapshot.exists) {
      skipped += 1;
      continue;
    }
    batch.set(reference, sanitizeGuideKnowledgeInput(item, { actor }));
    created += 1;
  }
  if (created) await batch.commit();
  await writeAudit({ actor, action: "guide.knowledge.seeded", entityType: "guideKnowledge", entityId: "approved-defaults", summary: `Seeded ${created} approved Guide answers.`, details: { created, skipped } });
  return { created, skipped };
}

export async function getGuideSettings({ publicOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) return { ...GUIDE_DEFAULT_SETTINGS };
  const snapshot = await getAdminDb().collection(SETTINGS_COLLECTION).doc("global").get();
  if (!snapshot.exists) return { ...GUIDE_DEFAULT_SETTINGS };
  const item = serialize(snapshot);
  if (publicOnly && item.status !== "published") return { ...GUIDE_DEFAULT_SETTINGS };
  return { ...GUIDE_DEFAULT_SETTINGS, ...item };
}


export const getPublishedGuideSettings = unstable_cache(
  async () => getGuideSettings({ publicOnly: true }),
  ["growvest-published-guide-settings-v26"],
  { tags: [CACHE_TAGS.guideSettings], revalidate: PUBLIC_CACHE_TTL.guide },
);

export async function updateGuideSettings(input, actor) {
  const db = getAdminDb();
  const reference = db.collection(SETTINGS_COLLECTION).doc("global");
  const snapshot = await reference.get();
  const payload = sanitizeGuideSettingsInput(input, { existing: snapshot.exists ? snapshot.data() : null, actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "guide.settings.updated", entityType: "guideSettings", entityId: "global", summary: "Updated GrowVest Guide settings." });
  return getGuideSettings();
}

async function loadApprovedSources() {
  const curated = (await listGuideKnowledge({ publicOnly: true })).map((item) => normalizeKnowledge(item, "guide"));
  if (!isFirebaseAdminConfigured()) {
    return [
      ...curated,
      ...FAQS.map((item, index) => normalizeKnowledge({ ...item, id: `faq-${index}` }, "faq")),
      ...GOAL_LIBRARY_SEED.map((item, index) => normalizeKnowledge({ ...item, id: `goal-${index}` }, "goal")),
      ...INSIGHTS_SEED.filter((item) => item.status === "published").map((item) => normalizeKnowledge(item, "insight")),
    ];
  }

  const db = getAdminDb();
  const [faqSnapshot, goalSnapshot, insightSnapshot] = await Promise.all([
    db.collection("faqs").limit(300).get().catch(() => null),
    db.collection("goalLibrary").limit(200).get().catch(() => null),
    db.collection("insightsPosts").limit(400).get().catch(() => null),
  ]);

  const faqs = faqSnapshot?.docs?.length
    ? faqSnapshot.docs.map(serialize).filter((item) => item.status === "published" && item.isVisible !== false).map((item) => normalizeKnowledge(item, "faq"))
    : FAQS.map((item, index) => normalizeKnowledge({ ...item, id: `faq-${index}` }, "faq"));
  const goals = goalSnapshot?.docs?.length
    ? goalSnapshot.docs.map(serialize).filter((item) => item.status === "published" && item.isVisible !== false).map((item) => normalizeKnowledge(item, "goal"))
    : GOAL_LIBRARY_SEED.map((item, index) => normalizeKnowledge({ ...item, id: `goal-${index}` }, "goal"));
  const insights = insightSnapshot?.docs?.length
    ? insightSnapshot.docs.map(serialize).filter((item) => item.status === "published").map((item) => normalizeKnowledge(item, "insight"))
    : INSIGHTS_SEED.filter((item) => item.status === "published").map((item) => normalizeKnowledge(item, "insight"));

  return [...curated, ...faqs, ...goals, ...insights].filter((item) => item.question && item.answer);
}

const getCachedApprovedSources = unstable_cache(loadApprovedSources, ["growvest-guide-approved-sources-v26"], {
  revalidate: PUBLIC_CACHE_TTL.guide,
  tags: [CACHE_TAGS.guideKnowledge, CACHE_TAGS.faqs, CACHE_TAGS.goalLibrary, CACHE_TAGS.guideSources],
});

export function isPersonalAdviceRequest(message) {
  return ADVICE_PATTERNS.some((pattern) => pattern.test(cleanText(message, 800)));
}

export async function getGuideSessionContext(sessionId) {
  const id = cleanText(sessionId, 160);
  if (!id || !isFirebaseAdminConfigured()) return {};
  const snapshot = await getAdminDb().collection(CONVERSATIONS_COLLECTION).doc(id).get();
  if (!snapshot.exists) return {};
  const data = snapshot.data() || {};
  return {
    intentId: cleanText(data.intentId, 80),
    intentLabel: cleanText(data.intentLabel, 120),
    journeyStage: cleanText(data.journeyStage, 80),
    timeline: cleanText(data.timeline, 100),
    planningStatus: cleanText(data.planningStatus, 100),
    conversationSummary: cleanText(data.conversationSummary, 500),
  };
}


export async function findGuideAnswer(message, settings = GUIDE_DEFAULT_SETTINGS) {
  const query = cleanText(message, 800).toLowerCase().replace(/\s+/g, " ");
  const queryTokens = unique(tokenize(query));
  if (!queryTokens.length) return { matched: false, confidence: 0, answer: settings.fallbackMessage, sources: [] };

  if (isPersonalAdviceRequest(message)) {
    return {
      matched: false,
      boundary: true,
      confidence: 1,
      answer: settings.adviceBoundaryMessage,
      sources: [{ label: "Important disclosures", url: "/disclosures" }],
    };
  }

  const sources = await getCachedApprovedSources();
  const ranked = sources
    .map((candidate) => ({ candidate, ...scoreCandidate(query, queryTokens, candidate) }))
    .filter((item) => item.score >= 5 && item.coverage >= 0.2)
    .sort((a, b) => b.score - a.score || b.coverage - a.coverage || (a.candidate.displayOrder || 0) - (b.candidate.displayOrder || 0));

  if (!ranked.length || ranked[0].score < 8) {
    return { matched: false, confidence: ranked[0]?.score || 0, answer: settings.fallbackMessage, sources: [] };
  }

  const best = ranked[0];
  const supporting = ranked.slice(0, settings.maxAnswerSources || 3);
  const sourceLinks = [];
  for (const item of supporting) {
    if (item.candidate.sourceUrl && !sourceLinks.some((source) => source.url === item.candidate.sourceUrl)) {
      sourceLinks.push({ label: item.candidate.sourceLabel || item.candidate.question, url: item.candidate.sourceUrl });
    }
  }

  return {
    matched: true,
    confidence: Math.min(1, best.score / 35),
    answer: compactAnswer(best.candidate.answer),
    matchedQuestion: best.candidate.question,
    category: best.candidate.category,
    sourceType: best.candidate.sourceType,
    sources: sourceLinks.slice(0, settings.maxAnswerSources || 3),
  };
}

export async function recordGuideExchange({ sessionId, message, response, pageUrl = "", context = {} }) {
  if (!isFirebaseAdminConfigured()) return { conversationId: sessionId || "local", messageId: "local" };
  const db = getAdminDb();
  const conversationId = cleanText(sessionId, 160) || db.collection(CONVERSATIONS_COLLECTION).doc().id;
  const conversationRef = db.collection(CONVERSATIONS_COLLECTION).doc(conversationId);
  const messageRef = db.collection(MESSAGES_COLLECTION).doc();
  const now = FieldValue.serverTimestamp();
  const userMessage = cleanText(message, 800);
  const state = response?.stateUpdate || {};
  const resetState = Boolean(state.reset);

  const existingConversation = await conversationRef.get();
  await conversationRef.set({
    sessionId: conversationId,
    status: response.matched || response.boundary ? "answered" : "needs_follow_up",
    lastQuestion: userMessage,
    lastAnswer: cleanText(response.answer, 1200),
    lastMatchedQuestion: response.matchedQuestion || "",
    lastSourceType: response.sourceType || "",
    lastConfidence: Number(response.confidence || 0),
    intentId: resetState ? "" : cleanText(state.intentId || response.intent?.id || existingConversation.data()?.intentId, 80),
    intentLabel: resetState ? "" : cleanText(state.intentLabel || response.intent?.label || existingConversation.data()?.intentLabel, 120),
    journeyStage: resetState ? "" : cleanText(state.journeyStage || existingConversation.data()?.journeyStage, 80),
    timeline: resetState ? "" : cleanText(state.timeline || existingConversation.data()?.timeline, 100),
    planningStatus: resetState ? "" : cleanText(state.planningStatus || existingConversation.data()?.planningStatus, 100),
    conversationSummary: resetState ? "" : cleanText(state.conversationSummary || response.conversationSummary || existingConversation.data()?.conversationSummary, 500),
    lastNextAction: cleanText(response.nextAction, 80),
    pageUrl: cleanText(pageUrl, 600),
    userAgent: cleanText(context.userAgent, 500),
    referrer: cleanText(context.referrer, 500),
    messageCount: FieldValue.increment(2),
    lastMessageAt: now,
    updatedAt: now,
    ...(existingConversation.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
  }, { merge: true });

  await messageRef.set({
    conversationId,
    sessionId: conversationId,
    role: "exchange",
    userMessage,
    assistantMessage: cleanText(response.answer, 1600),
    matched: Boolean(response.matched),
    boundary: Boolean(response.boundary),
    matchedQuestion: response.matchedQuestion || "",
    sourceType: response.sourceType || "",
    confidence: Number(response.confidence || 0),
    intentId: cleanText(state.intentId || response.intent?.id, 80),
    intentLabel: cleanText(state.intentLabel || response.intent?.label, 120),
    journeyStage: cleanText(state.journeyStage, 80),
    timeline: cleanText(state.timeline, 100),
    planningStatus: cleanText(state.planningStatus, 100),
    conversationSummary: cleanText(state.conversationSummary || response.conversationSummary, 500),
    nextAction: cleanText(response.nextAction, 80),
    quickReplies: Array.isArray(response.quickReplies) ? response.quickReplies.slice(0, 8) : [],
    sources: Array.isArray(response.sources) ? response.sources.slice(0, 5) : [],
    pageUrl: cleanText(pageUrl, 600),
    createdAt: now,
  });

  if (!response.matched && !response.boundary) {
    const unansweredRef = db.collection(UNANSWERED_COLLECTION).doc();
    await unansweredRef.set({
      conversationId,
      messageId: messageRef.id,
      question: userMessage,
      normalizedQuestion: userMessage.toLowerCase(),
      pageUrl: cleanText(pageUrl, 600),
      status: "open",
      occurrenceCount: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { conversationId, messageId: messageRef.id };
}

export async function recordGuideFeedback({ sessionId, messageId, value, comment = "", context = {} }) {
  const conversationId = cleanText(sessionId, 160);
  const feedbackValue = GUIDE_FEEDBACK_VALUES.includes(value) ? value : "";
  if (!conversationId || !messageId || !feedbackValue) {
    const error = new Error("A valid Guide message and feedback value are required.");
    error.status = 400;
    error.code = "GUIDE_FEEDBACK_INVALID";
    throw error;
  }
  if (!isFirebaseAdminConfigured()) return { id: "local", value: feedbackValue };
  const db = getAdminDb();
  const reference = db.collection(FEEDBACK_COLLECTION).doc(`${conversationId}--${cleanText(messageId, 180)}`);
  await reference.set({
    conversationId,
    messageId: cleanText(messageId, 180),
    value: feedbackValue,
    comment: cleanText(comment, 600),
    userAgent: cleanText(context.userAgent, 500),
    referrer: cleanText(context.referrer, 500),
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await db.collection(CONVERSATIONS_COLLECTION).doc(conversationId).set({
    lastFeedback: feedbackValue,
    lastFeedbackAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  return { id: reference.id, value: feedbackValue };
}

export async function recordGuideHandoff({ sessionId, name = "", phone = "", question = "", pageUrl = "", whatsappUrl = "", targetNumber = "", conversationSummary = "", intentId = "", intentLabel = "", timeline = "", planningStatus = "", context = {} }) {
  if (!isFirebaseAdminConfigured()) return { leadId: "local", leadKey: "contact--local" };
  const db = getAdminDb();
  const leadRef = db.collection("websiteLeads").doc();
  const leadKey = `contact--${leadRef.id}`;
  const conversationId = cleanText(sessionId, 160) || "";
  const now = FieldValue.serverTimestamp();
  const normalizedPhone = cleanText(phone, 40).replace(/[^0-9]/g, "");

  await leadRef.set({
    type: "growvest_guide_whatsapp",
    enquiryType: "whatsapp",
    source: "growvest_guide",
    tags: ["growvest-guide", "whatsapp-handoff"],
    sourcePage: cleanText(pageUrl, 600) || "/",
    name: cleanText(name, 160) || "GrowVest Guide visitor",
    phone: cleanText(phone, 80),
    normalizedPhone,
    email: "",
    message: cleanText(question, 1000),
    guideConversationId: conversationId,
    guideConversationSummary: cleanText(conversationSummary, 500),
    detectedIntent: cleanText(intentId, 80),
    detectedIntentLabel: cleanText(intentLabel, 120),
    goalTimeline: cleanText(timeline, 100),
    planningStatus: cleanText(planningStatus, 100),
    status: "new",
    priority: "normal",
    assignedTo: null,
    consentAccepted: true,
    consentContext: "Visitor selected Continue on WhatsApp from GrowVest Guide.",
    firstResponseDueAt: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
    userAgent: cleanText(context.userAgent, 500),
    referrer: cleanText(context.referrer, 500),
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("communicationLogs").add({
    leadKey,
    entityType: "websiteLead",
    entityId: leadRef.id,
    channel: "whatsapp",
    direction: "inbound",
    type: "guide_whatsapp_handoff",
    templateKey: "growvest_guide_handoff",
    status: "prepared",
    destination: cleanText(targetNumber, 40).replace(/[^0-9]/g, ""),
    visitorPhone: normalizedPhone,
    provider: "click_to_chat",
    metadata: {
      conversationId,
      whatsappUrl: cleanText(whatsappUrl, 1200),
      conversationSummary: cleanText(conversationSummary, 500),
      intentId: cleanText(intentId, 80),
      intentLabel: cleanText(intentLabel, 120),
      timeline: cleanText(timeline, 100),
      planningStatus: cleanText(planningStatus, 100),
    },
    createdAt: now,
  });

  if (conversationId) {
    await db.collection(CONVERSATIONS_COLLECTION).doc(conversationId).set({
      status: "handed_off",
      leadKey,
      leadId: leadRef.id,
      conversationSummary: cleanText(conversationSummary, 500),
      handedOffAt: now,
      updatedAt: now,
    }, { merge: true });
  }

  await syncEnquiryDirectory(leadKey).catch(() => null);
  return { leadId: leadRef.id, leadKey };
}

export async function listGuideConversations({ status = "", limit = 100 } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(CONVERSATIONS_COLLECTION).orderBy("lastMessageAt", "desc").limit(Math.min(250, Math.max(1, limit))).get();
  return snapshot.docs.map(serialize).filter((item) => !status || item.status === status);
}

export async function listGuideMessages(conversationId, { limit = 100 } = {}) {
  if (!isFirebaseAdminConfigured() || !conversationId) return [];
  const snapshot = await getAdminDb().collection(MESSAGES_COLLECTION).where("conversationId", "==", conversationId).orderBy("createdAt", "asc").limit(Math.min(200, Math.max(1, limit))).get();
  return snapshot.docs.map(serialize);
}

export async function updateGuideConversation(id, input, actor) {
  if (!isFirebaseAdminConfigured()) return null;
  const status = GUIDE_CONVERSATION_STATUSES.includes(input?.status) ? input.status : "active";
  const reference = getAdminDb().collection(CONVERSATIONS_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("Guide conversation not found.");
    error.status = 404;
    throw error;
  }
  await reference.set({
    status,
    internalNote: cleanText(input?.internalNote, 2000),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor.uid,
    updatedByName: actor.displayName,
    ...(status === "closed" ? { closedAt: FieldValue.serverTimestamp() } : {}),
  }, { merge: true });
  await writeAudit({ actor, action: "guide.conversation.updated", entityType: "guideConversation", entityId: id, summary: `Updated Guide conversation status to ${status}.` });
  const updated = await reference.get();
  return serialize(updated);
}

export async function listUnansweredGuideQuestions({ status = "open", limit = 100 } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(UNANSWERED_COLLECTION).orderBy("createdAt", "desc").limit(Math.min(250, Math.max(1, limit))).get();
  return snapshot.docs.map(serialize).filter((item) => !status || item.status === status);
}

export async function resolveUnansweredQuestion(id, input, actor) {
  if (!isFirebaseAdminConfigured()) return null;
  const reference = getAdminDb().collection(UNANSWERED_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("Unanswered question not found.");
    error.status = 404;
    throw error;
  }
  await reference.set({
    status: input?.status === "ignored" ? "ignored" : "resolved",
    resolutionNote: cleanText(input?.resolutionNote, 1000),
    resolvedBy: actor.uid,
    resolvedByName: actor.displayName,
    resolvedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await writeAudit({ actor, action: "guide.unanswered.resolved", entityType: "guideUnansweredQuestion", entityId: id, summary: "Resolved an unanswered GrowVest Guide question." });
  const updated = await reference.get();
  return serialize(updated);
}

export async function getGuideSummary() {
  if (!isFirebaseAdminConfigured()) {
    return {
      knowledge: GUIDE_KNOWLEDGE_SEED.length,
      publishedKnowledge: GUIDE_KNOWLEDGE_SEED.filter((item) => item.status === "published").length,
      conversations: 0,
      needsFollowUp: 0,
      handoffs: 0,
      unanswered: 0,
      answeredRate: 0,
      handoffRate: 0,
      helpful: 0,
      notHelpful: 0,
      topIntent: "—",
    };
  }
  const db = getAdminDb();
  const [knowledgeItems, conversations, unanswered, feedback] = await Promise.all([
    listGuideKnowledge(),
    db.collection(CONVERSATIONS_COLLECTION).limit(500).get(),
    db.collection(UNANSWERED_COLLECTION).limit(500).get(),
    db.collection(FEEDBACK_COLLECTION).limit(500).get().catch(() => null),
  ]);
  const conversationItems = conversations.docs.map((doc) => doc.data());
  const unansweredItems = unanswered.docs.map((doc) => doc.data());
  const feedbackItems = feedback?.docs?.map((doc) => doc.data()) || [];
  const answered = conversationItems.filter((item) => ["answered", "handed_off", "closed"].includes(item.status)).length;
  const handoffs = conversationItems.filter((item) => item.status === "handed_off").length;
  const intentCounts = new Map();
  for (const item of conversationItems) {
    const label = cleanText(item.intentLabel, 120);
    if (label) intentCounts.set(label, (intentCounts.get(label) || 0) + 1);
  }
  const topIntent = [...intentCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  return {
    knowledge: knowledgeItems.length,
    publishedKnowledge: knowledgeItems.filter((item) => item.status === "published" && item.isVisible !== false).length,
    conversations: conversations.size,
    needsFollowUp: conversationItems.filter((item) => item.status === "needs_follow_up").length,
    handoffs,
    unanswered: unansweredItems.filter((item) => item.status === "open").length,
    answeredRate: conversations.size ? Math.round((answered / conversations.size) * 100) : 0,
    handoffRate: conversations.size ? Math.round((handoffs / conversations.size) * 100) : 0,
    helpful: feedbackItems.filter((item) => item.value === "helpful").length,
    notHelpful: feedbackItems.filter((item) => item.value === "not_helpful").length,
    topIntent,
  };
}
