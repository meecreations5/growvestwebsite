import { unstable_cache, revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";
import {
  FAQ_SEED,
  GOAL_LIBRARY_SEED,
  WEBSITE_NAVIGATION_DEFAULT,
  WEBSITE_PAGE_DEFAULTS,
  WEBSITE_PAGE_STATUSES,
  WEBSITE_SETTINGS_DEFAULT,
} from "../../data/websiteContentSeed";

const PAGE_COLLECTION = "websitePages";
const SETTINGS_COLLECTION = "websiteSettings";
const NAVIGATION_COLLECTION = "websiteNavigation";
const FAQ_COLLECTION = "faqs";
const GOAL_COLLECTION = "goalLibrary";
const VERSION_COLLECTION = "websiteContentVersions";
const AUDIT_COLLECTION = "websiteAuditLogs";

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanInteger(value, fallback = 0, min = 0, max = 9999) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function cleanBoolean(value, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function cleanUrl(value, { allowInternal = true } = {}) {
  const cleaned = cleanText(value, 1600);
  if (!cleaned) return "";
  if (allowInternal && cleaned.startsWith("/")) return cleaned;
  try {
    const parsed = new URL(cleaned);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function cleanArray(value, maxItems = 100, maxLength = 1000) {
  return Array.isArray(value)
    ? value.slice(0, maxItems).map((item) => cleanText(item, maxLength)).filter(Boolean)
    : [];
}

function cleanObject(value, depth = 0) {
  if (depth > 8) return null;
  if (Array.isArray(value)) return value.slice(0, 250).map((item) => cleanObject(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 250)
        .map(([key, item]) => [cleanText(key, 120), cleanObject(item, depth + 1)]),
    );
  }
  if (typeof value === "string") return cleanText(value, 15_000);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  return value == null ? null : cleanText(value, 500);
}

function serializeValue(value) {
  if (value?.toDate) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeValue(item)]));
  }
  return value;
}

function serialize(snapshot) {
  return { id: snapshot.id, ...serializeValue(snapshot.data()) };
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
    details: cleanObject(details),
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function writeVersion({ actor, entityType, entityId, data }) {
  if (!isFirebaseAdminConfigured()) return;
  await getAdminDb().collection(VERSION_COLLECTION).add({
    entityType,
    entityId,
    snapshot: cleanObject(data),
    createdBy: actor?.uid || "system",
    createdByName: actor?.displayName || "System",
    createdAt: FieldValue.serverTimestamp(),
  });
}

export function sanitizeWebsitePageInput(pageKey, input, { existing = null, actor = null } = {}) {
  const fallback = WEBSITE_PAGE_DEFAULTS[pageKey];
  if (!fallback) {
    const error = new Error("This website page is not supported by the content manager.");
    error.status = 400;
    throw error;
  }
  const status = WEBSITE_PAGE_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  const content = cleanObject(input?.content || existing?.content || fallback.content);
  const contentSize = JSON.stringify(content).length;
  if (contentSize > 450_000) {
    const error = new Error("This page content is too large. Reduce the content and try again.");
    error.status = 400;
    throw error;
  }
  return {
    pageKey,
    title: cleanText(input?.title || existing?.title || fallback.title, 180),
    status,
    content,
    seo: {
      title: cleanText(input?.seo?.title || existing?.seo?.title || fallback.seo.title, 180),
      description: cleanText(input?.seo?.description || existing?.seo?.description || fallback.seo.description, 320),
      allowIndexing: cleanBoolean(input?.seo?.allowIndexing, existing?.seo?.allowIndexing ?? true),
    },
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
      createdAt: FieldValue.serverTimestamp(),
    }),
    ...(status === "published" ? { publishedAt: existing?.publishedAt || FieldValue.serverTimestamp(), archivedAt: null } : {}),
    ...(status === "archived" ? { archivedAt: FieldValue.serverTimestamp() } : {}),
  };
}

export function sanitizeWebsiteSettingsInput(input, { existing = null, actor = null } = {}) {
  const fallback = WEBSITE_SETTINGS_DEFAULT;
  const addressLines = cleanArray(input?.addressLines, 8, 220);
  return {
    key: "global",
    status: input?.status === "draft" ? "draft" : "published",
    brandName: cleanText(input?.brandName || fallback.brandName, 120),
    legalName: cleanText(input?.legalName || fallback.legalName, 180),
    positioning: cleanText(input?.positioning || fallback.positioning, 180),
    mission: cleanText(input?.mission || fallback.mission, 240),
    vision: cleanText(input?.vision || fallback.vision, 240),
    phoneDisplay: cleanText(input?.phoneDisplay || fallback.phoneDisplay, 80),
    phoneHref: cleanText(input?.phoneHref || fallback.phoneHref, 80),
    email: cleanText(input?.email || fallback.email, 180).toLowerCase(),
    addressLines: addressLines.length ? addressLines : fallback.addressLines,
    officeHours: cleanText(input?.officeHours || fallback.officeHours, 220),
    clientsSupported: cleanText(input?.clientsSupported || fallback.clientsSupported, 40),
    reviewsCompleted: cleanText(input?.reviewsCompleted || fallback.reviewsCompleted, 40),
    coverage: cleanText(input?.coverage || fallback.coverage, 80),
    regulatoryLabel: cleanText(input?.regulatoryLabel || fallback.regulatoryLabel, 500),
    sebiStatus: cleanText(input?.sebiStatus || fallback.sebiStatus, 300),
    directAdvisoryFee: cleanText(input?.directAdvisoryFee || fallback.directAdvisoryFee, 300),
    investorPortalUrl: cleanUrl(input?.investorPortalUrl || fallback.investorPortalUrl),
    footerDescription: cleanText(input?.footerDescription || fallback.footerDescription, 600),
    footerDisclosure1: cleanText(input?.footerDisclosure1 || fallback.footerDisclosure1, 2500),
    footerDisclosure2: cleanText(input?.footerDisclosure2 || fallback.footerDisclosure2, 2500),
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: actor?.uid || "system" }),
  };
}

function sanitizeNavLink(item) {
  return {
    label: cleanText(item?.label, 100),
    path: cleanUrl(item?.path || item?.href),
  };
}

export function sanitizeWebsiteNavigationInput(input, { existing = null, actor = null } = {}) {
  const fallback = WEBSITE_NAVIGATION_DEFAULT;
  const groups = Array.isArray(input?.groups) ? input.groups.slice(0, 10).map((group, index) => ({
    label: cleanText(group?.label, 100),
    eyebrow: cleanText(group?.eyebrow, 160),
    displayOrder: cleanInteger(group?.displayOrder, index, 0, 100),
    children: Array.isArray(group?.children) ? group.children.slice(0, 12).map(sanitizeNavLink).filter((item) => item.label && item.path) : [],
  })).filter((group) => group.label && group.children.length) : fallback.groups;
  const footerColumns = Array.isArray(input?.footerColumns) ? input.footerColumns.slice(0, 8).map((column) => ({
    heading: cleanText(column?.heading, 100),
    links: Array.isArray(column?.links) ? column.links.slice(0, 15).map(sanitizeNavLink).filter((item) => item.label && item.path) : [],
  })).filter((column) => column.heading && column.links.length) : fallback.footerColumns;
  const legalLinks = Array.isArray(input?.legalLinks) ? input.legalLinks.slice(0, 15).map(sanitizeNavLink).filter((item) => item.label && item.path) : fallback.legalLinks;
  return {
    key: "primary",
    status: input?.status === "draft" ? "draft" : "published",
    homeLabel: cleanText(input?.homeLabel || fallback.homeLabel, 80),
    groups,
    headerPrimaryCta: {
      label: cleanText(input?.headerPrimaryCta?.label || fallback.headerPrimaryCta.label, 100),
      href: cleanUrl(input?.headerPrimaryCta?.href || fallback.headerPrimaryCta.href),
    },
    investorPortalLabel: cleanText(input?.investorPortalLabel || fallback.investorPortalLabel, 100),
    footerColumns,
    legalLinks,
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: actor?.uid || "system" }),
  };
}

export function sanitizeFaqInput(input, { existing = null, actor = null } = {}) {
  const question = cleanText(input?.question, 280);
  const answer = cleanText(input?.answer, 5000);
  if (!question || !answer) {
    const error = new Error("Add both the question and approved answer.");
    error.status = 400;
    throw error;
  }
  const status = WEBSITE_PAGE_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  return {
    question,
    answer,
    category: cleanText(input?.category || "General", 120),
    displayOrder: cleanInteger(input?.displayOrder, existing?.displayOrder || 0, 0, 9999),
    status,
    isVisible: cleanBoolean(input?.isVisible, existing?.isVisible ?? true),
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: actor?.uid || "system" }),
  };
}

export function sanitizeGoalInput(input, { existing = null, actor = null } = {}) {
  const label = cleanText(input?.label, 180);
  if (!label) {
    const error = new Error("Add a goal name.");
    error.status = 400;
    throw error;
  }
  const status = WEBSITE_PAGE_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  return {
    label,
    slug: slugify(input?.slug || label),
    iconKey: cleanText(input?.iconKey || "target", 80),
    color: /^#[0-9A-Fa-f]{6}$/.test(String(input?.color || "")) ? input.color : "#1F4ED8",
    horizon: cleanText(input?.horizon, 120),
    typical: cleanText(input?.typical, 120),
    monthlySip: cleanText(input?.monthlySip, 120),
    description: cleanText(input?.description, 1800),
    why: cleanText(input?.why, 1800),
    keySteps: cleanArray(input?.keySteps, 15, 500),
    watchOuts: cleanArray(input?.watchOuts, 15, 500),
    displayOrder: cleanInteger(input?.displayOrder, existing?.displayOrder || 0, 0, 9999),
    status,
    isVisible: cleanBoolean(input?.isVisible, existing?.isVisible ?? true),
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: actor?.uid || "system" }),
  };
}

export async function listWebsitePages() {
  if (!isFirebaseAdminConfigured()) return Object.values(WEBSITE_PAGE_DEFAULTS);
  try {
    const snapshot = await getAdminDb().collection(PAGE_COLLECTION).limit(50).get();
    const items = snapshot.docs.map(serialize);
    const byKey = new Map(items.map((item) => [item.pageKey || item.id, item]));
    return Object.keys(WEBSITE_PAGE_DEFAULTS).map((key) => byKey.get(key) || WEBSITE_PAGE_DEFAULTS[key]);
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read managed pages; using approved fallbacks.", error?.message || error);
    return Object.values(WEBSITE_PAGE_DEFAULTS);
  }
}

export async function getWebsitePage(pageKey, { publicOnly = false } = {}) {
  const fallback = WEBSITE_PAGE_DEFAULTS[pageKey] || null;
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    const snapshot = await getAdminDb().collection(PAGE_COLLECTION).doc(pageKey).get();
    if (!snapshot.exists) return fallback;
    const item = serialize(snapshot);
    if (publicOnly && item.status !== "published") return fallback;
    return item;
  } catch (error) {
    console.warn(`[GrowVest Website Content] Unable to read page ${pageKey}; using approved fallback.`, error?.message || error);
    return fallback;
  }
}

export async function updateWebsitePage(pageKey, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(PAGE_COLLECTION).doc(pageKey);
  const snapshot = await reference.get();
  const existing = snapshot.exists ? snapshot.data() : null;
  if (existing) await writeVersion({ actor, entityType: "websitePage", entityId: pageKey, data: existing });
  const payload = sanitizeWebsitePageInput(pageKey, input, { existing, actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "website.page.updated", entityType: "websitePage", entityId: pageKey, summary: `Updated ${payload.title}.`, details: { status: payload.status } });
  revalidateTag(`growvest-page-${pageKey}`);
  return getWebsitePage(pageKey);
}

export async function getWebsiteSettings({ publicOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) return WEBSITE_SETTINGS_DEFAULT;
  try {
    const snapshot = await getAdminDb().collection(SETTINGS_COLLECTION).doc("global").get();
    if (!snapshot.exists) return WEBSITE_SETTINGS_DEFAULT;
    const item = serialize(snapshot);
    if (publicOnly && item.status !== "published") return WEBSITE_SETTINGS_DEFAULT;
    return item;
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read global settings; using approved fallback.", error?.message || error);
    return WEBSITE_SETTINGS_DEFAULT;
  }
}

export async function updateWebsiteSettings(input, actor) {
  const db = getAdminDb();
  const reference = db.collection(SETTINGS_COLLECTION).doc("global");
  const snapshot = await reference.get();
  const existing = snapshot.exists ? snapshot.data() : null;
  if (existing) await writeVersion({ actor, entityType: "websiteSettings", entityId: "global", data: existing });
  const payload = sanitizeWebsiteSettingsInput(input, { existing, actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "website.settings.updated", entityType: "websiteSettings", entityId: "global", summary: "Updated global website settings." });
  revalidateTag("growvest-website-settings");
  return getWebsiteSettings();
}

export async function getWebsiteNavigation({ publicOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) return WEBSITE_NAVIGATION_DEFAULT;
  try {
    const snapshot = await getAdminDb().collection(NAVIGATION_COLLECTION).doc("primary").get();
    if (!snapshot.exists) return WEBSITE_NAVIGATION_DEFAULT;
    const item = serialize(snapshot);
    if (publicOnly && item.status !== "published") return WEBSITE_NAVIGATION_DEFAULT;
    return item;
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read navigation; using approved fallback.", error?.message || error);
    return WEBSITE_NAVIGATION_DEFAULT;
  }
}

export async function updateWebsiteNavigation(input, actor) {
  const db = getAdminDb();
  const reference = db.collection(NAVIGATION_COLLECTION).doc("primary");
  const snapshot = await reference.get();
  const existing = snapshot.exists ? snapshot.data() : null;
  if (existing) await writeVersion({ actor, entityType: "websiteNavigation", entityId: "primary", data: existing });
  const payload = sanitizeWebsiteNavigationInput(input, { existing, actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "website.navigation.updated", entityType: "websiteNavigation", entityId: "primary", summary: "Updated website navigation and footer links." });
  revalidateTag("growvest-website-navigation");
  return getWebsiteNavigation();
}

export async function listFaqs({ publicOnly = false } = {}) {
  const fallback = FAQ_SEED.map((item, index) => ({ id: `fallback-${index}`, ...item }));
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    const snapshot = await getAdminDb().collection(FAQ_COLLECTION).limit(500).get();
    const items = snapshot.docs.map(serialize);
    const filtered = publicOnly ? items.filter((item) => item.status === "published" && item.isVisible !== false) : items;
    if (!filtered.length && publicOnly) return fallback;
    return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.question.localeCompare(b.question));
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read FAQs; using approved fallbacks.", error?.message || error);
    return fallback;
  }
}

export async function createFaq(input, actor) {
  const db = getAdminDb();
  const reference = db.collection(FAQ_COLLECTION).doc();
  const payload = sanitizeFaqInput(input, { actor });
  await reference.set(payload);
  await writeAudit({ actor, action: "faq.created", entityType: "faq", entityId: reference.id, summary: `Created FAQ: ${payload.question}` });
  revalidateTag("growvest-faqs");
  const snapshot = await reference.get();
  return serialize(snapshot);
}

export async function updateFaq(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(FAQ_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This FAQ could not be found.");
    error.status = 404;
    throw error;
  }
  await writeVersion({ actor, entityType: "faq", entityId: id, data: snapshot.data() });
  const payload = sanitizeFaqInput(input, { existing: snapshot.data(), actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "faq.updated", entityType: "faq", entityId: id, summary: `Updated FAQ: ${payload.question}` });
  revalidateTag("growvest-faqs");
  const updated = await reference.get();
  return serialize(updated);
}

export async function archiveFaq(id, actor) {
  return updateFaq(id, { ...(await getFaq(id)), status: "archived", isVisible: false }, actor);
}

export async function getFaq(id) {
  if (!isFirebaseAdminConfigured() || !id) return null;
  const snapshot = await getAdminDb().collection(FAQ_COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function listGoalLibrary({ publicOnly = false } = {}) {
  const fallback = GOAL_LIBRARY_SEED.map((item, index) => ({ id: `fallback-${index}`, ...item }));
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    const snapshot = await getAdminDb().collection(GOAL_COLLECTION).limit(500).get();
    const items = snapshot.docs.map(serialize);
    const filtered = publicOnly ? items.filter((item) => item.status === "published" && item.isVisible !== false) : items;
    if (!filtered.length && publicOnly) return fallback;
    return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.label.localeCompare(b.label));
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read Goal Library; using approved fallbacks.", error?.message || error);
    return fallback;
  }
}

export async function getGoal(id) {
  if (!isFirebaseAdminConfigured() || !id) return null;
  const snapshot = await getAdminDb().collection(GOAL_COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createGoal(input, actor) {
  const db = getAdminDb();
  const reference = db.collection(GOAL_COLLECTION).doc();
  const payload = sanitizeGoalInput(input, { actor });
  await reference.set(payload);
  await writeAudit({ actor, action: "goal.created", entityType: "goalLibrary", entityId: reference.id, summary: `Created goal: ${payload.label}` });
  revalidateTag("growvest-goal-library");
  const snapshot = await reference.get();
  return serialize(snapshot);
}

export async function updateGoal(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(GOAL_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This goal could not be found.");
    error.status = 404;
    throw error;
  }
  await writeVersion({ actor, entityType: "goalLibrary", entityId: id, data: snapshot.data() });
  const payload = sanitizeGoalInput(input, { existing: snapshot.data(), actor });
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: "goal.updated", entityType: "goalLibrary", entityId: id, summary: `Updated goal: ${payload.label}` });
  revalidateTag("growvest-goal-library");
  const updated = await reference.get();
  return serialize(updated);
}

export async function archiveGoal(id, actor) {
  return updateGoal(id, { ...(await getGoal(id)), status: "archived", isVisible: false }, actor);
}

export async function previewWebsiteContentImport({ force = false } = {}) {
  const fallback = {
    configured: false,
    pages: { create: Object.keys(WEBSITE_PAGE_DEFAULTS).length, replace: 0, skip: 0 },
    settings: { create: 1, replace: 0, skip: 0 },
    navigation: { create: 1, replace: 0, skip: 0 },
    faqs: { create: FAQ_SEED.length, replace: 0, skip: 0 },
    goals: { create: GOAL_LIBRARY_SEED.length, replace: 0, skip: 0 },
  };
  if (!isFirebaseAdminConfigured()) return fallback;
  const db = getAdminDb();
  const pageSnapshots = await Promise.all(Object.keys(WEBSITE_PAGE_DEFAULTS).map((key) => db.collection(PAGE_COLLECTION).doc(key).get()));
  const [settings, navigation, faqCount, goalCount] = await Promise.all([
    db.collection(SETTINGS_COLLECTION).doc("global").get(),
    db.collection(NAVIGATION_COLLECTION).doc("primary").get(),
    db.collection(FAQ_COLLECTION).count().get(),
    db.collection(GOAL_COLLECTION).count().get(),
  ]);
  const result = {
    configured: true,
    pages: { create: pageSnapshots.filter((item) => !item.exists).length, replace: 0, skip: pageSnapshots.filter((item) => item.exists).length },
    settings: { create: settings.exists ? 0 : 1, replace: 0, skip: settings.exists ? 1 : 0 },
    navigation: { create: navigation.exists ? 0 : 1, replace: 0, skip: navigation.exists ? 1 : 0 },
    faqs: { create: faqCount.data().count ? 0 : FAQ_SEED.length, replace: 0, skip: faqCount.data().count ? faqCount.data().count : 0 },
    goals: { create: goalCount.data().count ? 0 : GOAL_LIBRARY_SEED.length, replace: 0, skip: goalCount.data().count ? goalCount.data().count : 0 },
  };
  if (force) {
    for (const item of Object.values(result)) {
      if (!item || typeof item !== "object" || !("skip" in item)) continue;
      item.replace = item.skip;
      item.skip = 0;
    }
    result.faqs.replace = faqCount.data().count;
    result.faqs.create = FAQ_SEED.length;
    result.goals.replace = goalCount.data().count;
    result.goals.create = GOAL_LIBRARY_SEED.length;
  }
  return result;
}

export async function seedWebsiteContent(actor, { force = false } = {}) {
  if (!isFirebaseAdminConfigured()) {
    const error = new Error("Firebase Admin is not configured. Add the server credentials before importing content.");
    error.status = 503;
    throw error;
  }
  const db = getAdminDb();
  const batch = db.batch();
  const results = { pages: 0, settings: 0, navigation: 0, faqs: 0, goals: 0, skipped: 0 };

  for (const [key, page] of Object.entries(WEBSITE_PAGE_DEFAULTS)) {
    const reference = db.collection(PAGE_COLLECTION).doc(key);
    const snapshot = await reference.get();
    if (!snapshot.exists || force) {
      batch.set(reference, sanitizeWebsitePageInput(key, page, { existing: snapshot.exists ? snapshot.data() : null, actor }), { merge: true });
      results.pages += 1;
    } else results.skipped += 1;
  }

  const settingsRef = db.collection(SETTINGS_COLLECTION).doc("global");
  const settingsSnapshot = await settingsRef.get();
  if (!settingsSnapshot.exists || force) {
    batch.set(settingsRef, sanitizeWebsiteSettingsInput(WEBSITE_SETTINGS_DEFAULT, { existing: settingsSnapshot.exists ? settingsSnapshot.data() : null, actor }), { merge: true });
    results.settings = 1;
  } else results.skipped += 1;

  const navigationRef = db.collection(NAVIGATION_COLLECTION).doc("primary");
  const navigationSnapshot = await navigationRef.get();
  if (!navigationSnapshot.exists || force) {
    batch.set(navigationRef, sanitizeWebsiteNavigationInput(WEBSITE_NAVIGATION_DEFAULT, { existing: navigationSnapshot.exists ? navigationSnapshot.data() : null, actor }), { merge: true });
    results.navigation = 1;
  } else results.skipped += 1;

  const faqSnapshot = await db.collection(FAQ_COLLECTION).limit(1).get();
  if (faqSnapshot.empty || force) {
    if (force) {
      const current = await db.collection(FAQ_COLLECTION).get();
      current.docs.forEach((doc) => batch.delete(doc.ref));
    }
    FAQ_SEED.forEach((item) => {
      const reference = db.collection(FAQ_COLLECTION).doc();
      batch.set(reference, sanitizeFaqInput(item, { actor }));
      results.faqs += 1;
    });
  } else results.skipped += 1;

  const goalsSnapshot = await db.collection(GOAL_COLLECTION).limit(1).get();
  if (goalsSnapshot.empty || force) {
    if (force) {
      const current = await db.collection(GOAL_COLLECTION).get();
      current.docs.forEach((doc) => batch.delete(doc.ref));
    }
    GOAL_LIBRARY_SEED.forEach((item) => {
      const reference = db.collection(GOAL_COLLECTION).doc();
      batch.set(reference, sanitizeGoalInput(item, { actor }));
      results.goals += 1;
    });
  } else results.skipped += 1;

  await batch.commit();
  await writeAudit({ actor, action: "website.content.seeded", entityType: "websiteContent", entityId: "initial-import", summary: "Imported current GrowVest website content into Firestore.", details: results });
  ["home", "about"].forEach((key) => revalidateTag(`growvest-page-${key}`));
  revalidateTag("growvest-website-settings");
  revalidateTag("growvest-website-navigation");
  revalidateTag("growvest-faqs");
  revalidateTag("growvest-goal-library");
  return results;
}

export async function getWebsiteContentSummary() {
  const fallback = {
    configured: false,
    pages: Object.keys(WEBSITE_PAGE_DEFAULTS).length,
    faqs: FAQ_SEED.length,
    goals: GOAL_LIBRARY_SEED.length,
    settingsReady: false,
    navigationReady: false,
  };
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    const db = getAdminDb();
    const [pages, faqs, goals, settings, navigation] = await Promise.all([
      db.collection(PAGE_COLLECTION).count().get(),
      db.collection(FAQ_COLLECTION).count().get(),
      db.collection(GOAL_COLLECTION).count().get(),
      db.collection(SETTINGS_COLLECTION).doc("global").get(),
      db.collection(NAVIGATION_COLLECTION).doc("primary").get(),
    ]);
    return {
      configured: true,
      pages: pages.data().count,
      faqs: faqs.data().count,
      goals: goals.data().count,
      settingsReady: settings.exists,
      navigationReady: navigation.exists,
    };
  } catch (error) {
    console.warn("[GrowVest Website Content] Unable to read database summary.", error?.message || error);
    return fallback;
  }
}

export const getPublishedWebsitePage = (pageKey) => unstable_cache(
  async () => getWebsitePage(pageKey, { publicOnly: true }),
  [`growvest-published-page-${pageKey}`],
  { tags: [`growvest-page-${pageKey}`], revalidate: 300 },
)();

export const getPublishedWebsiteSettings = unstable_cache(
  async () => getWebsiteSettings({ publicOnly: true }),
  ["growvest-published-website-settings"],
  { tags: ["growvest-website-settings"], revalidate: 300 },
);

export const getPublishedWebsiteNavigation = unstable_cache(
  async () => getWebsiteNavigation({ publicOnly: true }),
  ["growvest-published-website-navigation"],
  { tags: ["growvest-website-navigation"], revalidate: 300 },
);

export const getPublishedFaqs = unstable_cache(
  async () => listFaqs({ publicOnly: true }),
  ["growvest-published-faqs"],
  { tags: ["growvest-faqs"], revalidate: 300 },
);

export const getPublishedGoalLibrary = unstable_cache(
  async () => listGoalLibrary({ publicOnly: true }),
  ["growvest-published-goal-library"],
  { tags: ["growvest-goal-library"], revalidate: 300 },
);

export const WEBSITE_CONTENT_COLLECTIONS = {
  PAGE_COLLECTION,
  SETTINGS_COLLECTION,
  NAVIGATION_COLLECTION,
  FAQ_COLLECTION,
  GOAL_COLLECTION,
  VERSION_COLLECTION,
};
