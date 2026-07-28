import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { INSIGHT_AUTHORS_SEED, INSIGHT_CATEGORIES_SEED, INSIGHT_TAGS_SEED, INSIGHTS_SEED } from "../../data/insightsSeed";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";

const POST_COLLECTION = "insightsPosts";
const CATEGORY_COLLECTION = "insightCategories";
const TAG_COLLECTION = "insightTags";
const AUTHOR_COLLECTION = "insightAuthors";
const AUDIT_COLLECTION = "websiteAuditLogs";
const REDIRECT_COLLECTION = "websiteRedirects";
const VERSION_COLLECTION = "insightVersions";

export const POST_STATUSES = [
  "draft",
  "in_review",
  "changes_requested",
  "approved",
  "scheduled",
  "published",
  "archived",
];

export function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
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

function dateToTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : Timestamp.fromDate(value);
  const raw = String(value).trim();
  const zoned = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)
    ? `${raw}:00+05:30`
    : /^\d{4}-\d{2}-\d{2}$/.test(raw)
      ? `${raw}T00:00:00+05:30`
      : raw;
  const date = new Date(zoned);
  return Number.isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

export function serializeInsight(document) {
  if (!document) return null;
  const data = typeof document.data === "function" ? document.data() : document;
  const id = typeof document.id === "string" ? document.id : data.id;
  return {
    ...data,
    id,
    publishedAt: iso(data.publishedAt),
    scheduledAt: iso(data.scheduledAt),
    reviewDueAt: iso(data.reviewDueAt),
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
    approvedAt: iso(data.approvedAt),
    archivedAt: iso(data.archivedAt),
  };
}

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanUrl(value, { allowRelative = false, max = 1600 } = {}) {
  const cleaned = cleanText(value, max);
  if (!cleaned) return "";
  if (allowRelative && cleaned.startsWith("/") && !cleaned.startsWith("//")) return cleaned;
  try {
    const url = new URL(cleaned);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function cleanStringArray(value, maxItems = 30, maxLength = 80) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanText(item, maxLength)).filter(Boolean))).slice(0, maxItems);
}

function cleanTableArray(value, maxItems = 12, maxLength = 500) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => cleanText(item, maxLength));
}

function cleanPercent(value, fallback = 50) {
  const number = Number(value);
  return Math.max(0, Math.min(100, Number.isFinite(number) ? number : fallback));
}

function sanitizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  const allowedTypes = [
    "lead", "paragraph", "heading2", "heading3", "quote", "callout", "list",
    "disclaimer", "image", "table", "cta", "video", "divider",
  ];
  return blocks.slice(0, 160).map((block, index) => {
    const type = allowedTypes.includes(block?.type) ? block.type : "paragraph";
    const headers = cleanTableArray(block?.headers, 12, 180);
    const rows = Array.isArray(block?.rows)
      ? block.rows.slice(0, 50).map((row) => cleanTableArray(row, 12, 500))
      : [];
    return {
      id: cleanText(block?.id || `block-${index + 1}`, 80),
      type,
      title: cleanText(block?.title, 180),
      text: cleanText(block?.text, 12000),
      items: cleanStringArray(block?.items, 50, 800),
      url: cleanUrl(block?.url),
      altText: cleanText(block?.altText, 250),
      caption: cleanText(block?.caption, 600),
      buttonLabel: cleanText(block?.buttonLabel, 80),
      buttonHref: cleanUrl(block?.buttonHref, { allowRelative: true, max: 1200 }),
      variant: ["primary", "secondary", "gold"].includes(block?.variant) ? block.variant : "primary",
      headers,
      rows,
      focalX: cleanPercent(block?.focalX),
      focalY: cleanPercent(block?.focalY),
    };
  }).filter((block) => block.type === "divider" || block.text || block.items.length || block.title || block.url || block.headers.length || block.rows.length);
}

export function sanitizeInsightInput(input, { existing = null, actor = null } = {}) {
  const title = cleanText(input?.title, 180);
  const slug = slugify(input?.slug || title);
  const status = POST_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  const scheduledAt = dateToTimestamp(input?.scheduledAt);
  const publishedAt = status === "published"
    ? dateToTimestamp(input?.publishedAt) || existing?.publishedAt || Timestamp.now()
    : dateToTimestamp(input?.publishedAt) || existing?.publishedAt || null;

  return {
    title,
    slug,
    excerpt: cleanText(input?.excerpt, 500),
    blocks: sanitizeBlocks(input?.blocks),
    categoryIds: cleanStringArray(input?.categoryIds, 8, 100),
    tagIds: cleanStringArray(input?.tagIds, 20, 100),
    authorId: cleanText(input?.authorId, 120),
    authorName: cleanText(input?.authorName, 160),
    status,
    isFeatured: Boolean(input?.isFeatured),
    featuredImage: {
      url: cleanUrl(input?.featuredImage?.url, { max: 1200 }),
      altText: cleanText(input?.featuredImage?.altText, 250),
      caption: cleanText(input?.featuredImage?.caption, 500),
      focalX: cleanPercent(input?.featuredImage?.focalX),
      focalY: cleanPercent(input?.featuredImage?.focalY),
    },
    readingTime: Math.max(1, Math.min(60, Number(input?.readingTime) || calculateReadingTime(input?.blocks))),
    publishedAt,
    scheduledAt,
    reviewDueAt: dateToTimestamp(input?.reviewDueAt),
    disclosureKey: cleanText(input?.disclosureKey || "educational-general", 100),
    sourceReferences: Array.isArray(input?.sourceReferences)
      ? input.sourceReferences.slice(0, 30).map((source) => ({
          label: cleanText(source?.label, 220),
          url: cleanUrl(source?.url, { max: 1200 }),
        })).filter((source) => source.label || source.url)
      : [],
    seo: {
      title: cleanText(input?.seo?.title, 70),
      description: cleanText(input?.seo?.description, 170),
      canonicalUrl: cleanUrl(input?.seo?.canonicalUrl, { max: 1200 }),
      openGraphImage: cleanUrl(input?.seo?.openGraphImage, { max: 1200 }),
      allowIndexing: input?.seo?.allowIndexing !== false,
    },
    reviewerNotes: cleanText(input?.reviewerNotes, 2000),
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
      createdAt: FieldValue.serverTimestamp(),
    }),
    ...(status === "approved" || status === "published" ? {
      approvedBy: actor?.uid || existing?.approvedBy || null,
      approvedByName: actor?.displayName || existing?.approvedByName || null,
      approvedAt: existing?.approvedAt || FieldValue.serverTimestamp(),
    } : {}),
    ...(status === "archived" ? { archivedAt: FieldValue.serverTimestamp() } : {}),
  };
}

export function calculateReadingTime(blocks) {
  const words = (Array.isArray(blocks) ? blocks : []).reduce((total, block) => {
    const tableText = (block?.rows || []).flat().join(" ");
    const text = `${block?.title || ""} ${block?.text || ""} ${(block?.items || []).join(" ")} ${tableText}`;
    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.ceil(words / 210));
}

function validatePublishable(payload) {
  if (!payload.excerpt) throw Object.assign(new Error("Add a short excerpt before publishing."), { status: 400 });
  if (!payload.blocks.length) throw Object.assign(new Error("Add article content before publishing."), { status: 400 });
  if (payload.featuredImage?.url && !payload.featuredImage?.altText) {
    throw Object.assign(new Error("Add alternative text for the featured image before publishing."), { status: 400 });
  }
  const imageWithoutAlt = payload.blocks.find((block) => block.type === "image" && block.url && !block.altText);
  if (imageWithoutAlt) throw Object.assign(new Error("Every article image needs alternative text before publishing."), { status: 400 });
  if (payload.status === "scheduled" && !payload.scheduledAt) {
    throw Object.assign(new Error("Choose a publishing date and time before scheduling."), { status: 400 });
  }
  if (payload.status === "scheduled" && payload.scheduledAt.toMillis() <= Date.now()) {
    throw Object.assign(new Error("Choose a future publishing date and time."), { status: 400 });
  }
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

async function clearOtherFeaturedPosts(currentPostId) {
  const db = getAdminDb();
  const snapshot = await db.collection(POST_COLLECTION).where("isFeatured", "==", true).limit(50).get();
  const batch = db.batch();
  let changes = 0;
  for (const document of snapshot.docs) {
    if (document.id === currentPostId) continue;
    batch.set(document.ref, { isFeatured: false, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    changes += 1;
  }
  if (changes) await batch.commit();
}

async function createInsightVersion({ postId, snapshot, actor, reason = "update" }) {
  if (!isFirebaseAdminConfigured() || !snapshot) return null;
  const reference = getAdminDb().collection(VERSION_COLLECTION).doc();
  await reference.set({
    postId,
    title: snapshot.title || "Untitled Insight",
    slug: snapshot.slug || "",
    status: snapshot.status || "draft",
    reason,
    snapshot,
    createdBy: actor?.uid || "system",
    createdByName: actor?.displayName || "System",
    createdAt: FieldValue.serverTimestamp(),
  });
  return reference.id;
}

function serializeVersion(document) {
  const data = document.data();
  return {
    id: document.id,
    postId: data.postId,
    title: data.title,
    slug: data.slug,
    status: data.status,
    reason: data.reason,
    createdBy: data.createdBy,
    createdByName: data.createdByName,
    createdAt: iso(data.createdAt),
  };
}

export async function listInsights({ status = "all", search = "", page = 1, pageSize = 20, publicOnly = false, featuredOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) {
    let seed = INSIGHTS_SEED.map((item) => ({ ...item }));
    if (publicOnly) seed = seed.filter((post) => isPublicPost(post));
    if (status !== "all") seed = seed.filter((post) => post.status === status);
    if (featuredOnly) seed = seed.filter((post) => post.isFeatured);
    if (search) {
      const term = search.toLowerCase();
      seed = seed.filter((post) => `${post.title} ${post.excerpt}`.toLowerCase().includes(term));
    }
    const total = seed.length;
    const start = Math.max(0, (Number(page) - 1) * Number(pageSize));
    return { items: seed.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize), source: "seed" };
  }

  const snapshot = await getAdminDb().collection(POST_COLLECTION).orderBy("updatedAt", "desc").limit(300).get();
  let items = snapshot.docs.map(serializeInsight);
  if (publicOnly) items = items.filter(isPublicPost);
  if (status !== "all") items = items.filter((post) => post.status === status);
  if (featuredOnly) items = items.filter((post) => post.isFeatured);
  if (search) {
    const term = search.toLowerCase();
    items = items.filter((post) => `${post.title} ${post.excerpt} ${(post.tagIds || []).join(" ")}`.toLowerCase().includes(term));
  }
  items.sort((a, b) => new Date(b.publishedAt || b.updatedAt || 0) - new Date(a.publishedAt || a.updatedAt || 0));
  const total = items.length;
  const start = Math.max(0, (Number(page) - 1) * Number(pageSize));
  return { items: items.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize), source: "firestore" };
}

export function isPublicPost(post) {
  if (!post || post.status !== "published") return false;
  return !post.publishedAt || new Date(post.publishedAt) <= new Date();
}

export async function getInsightById(id) {
  if (!id) return null;
  if (!isFirebaseAdminConfigured()) return INSIGHTS_SEED.find((post) => post.id === id) || null;
  const snapshot = await getAdminDb().collection(POST_COLLECTION).doc(id).get();
  return snapshot.exists ? serializeInsight(snapshot) : null;
}

export async function getPublishedInsightBySlug(slug) {
  const normalized = slugify(slug);
  if (!isFirebaseAdminConfigured()) {
    return INSIGHTS_SEED.find((post) => post.slug === normalized && isPublicPost(post)) || null;
  }
  const snapshot = await getAdminDb().collection(POST_COLLECTION).where("slug", "==", normalized).limit(1).get();
  const post = snapshot.empty ? null : serializeInsight(snapshot.docs[0]);
  return post && isPublicPost(post) ? post : null;
}

export async function resolveInsightRedirect(slug) {
  if (!isFirebaseAdminConfigured()) return null;
  const snapshot = await getAdminDb().collection(REDIRECT_COLLECTION).where("fromPath", "==", `/insights/${slugify(slug)}`).limit(1).get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data()?.toPath || null;
}

export async function createInsight(input, actor) {
  const requestedStatus = POST_STATUSES.includes(input?.status) ? input.status : "draft";
  if (["approved", "scheduled", "published"].includes(requestedStatus) && !actor?.permissions?.includes("insights.publish")) {
    throw Object.assign(new Error("Your role cannot approve, schedule or publish Insights."), { status: 403 });
  }
  if (requestedStatus === "archived" && !actor?.permissions?.includes("insights.delete")) {
    throw Object.assign(new Error("Your role cannot archive Insights."), { status: 403 });
  }
  const db = getAdminDb();
  const payload = sanitizeInsightInput(input, { actor });
  if (!payload.title || !payload.slug) throw Object.assign(new Error("Title and slug are required."), { status: 400 });
  if (["approved", "scheduled", "published"].includes(payload.status)) validatePublishable(payload);
  const duplicate = await db.collection(POST_COLLECTION).where("slug", "==", payload.slug).limit(1).get();
  if (!duplicate.empty) throw Object.assign(new Error("This URL slug is already in use."), { status: 409 });
  const reference = db.collection(POST_COLLECTION).doc();
  await reference.set(payload);
  if (payload.isFeatured && payload.status === "published") await clearOtherFeaturedPosts(reference.id);
  await writeAudit({ actor, action: "insight.created", entityType: "insight", entityId: reference.id, summary: `Created insight: ${payload.title}` });
  return getInsightById(reference.id);
}

export async function updateInsight(id, input, actor) {
  const requestedStatus = POST_STATUSES.includes(input?.status) ? input.status : "draft";
  if (["approved", "scheduled", "published"].includes(requestedStatus) && !actor?.permissions?.includes("insights.publish")) {
    throw Object.assign(new Error("Your role cannot approve, schedule or publish Insights."), { status: 403 });
  }
  if (requestedStatus === "archived" && !actor?.permissions?.includes("insights.delete")) {
    throw Object.assign(new Error("Your role cannot archive Insights."), { status: 403 });
  }
  const db = getAdminDb();
  const reference = db.collection(POST_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw Object.assign(new Error("Insight not found."), { status: 404 });
  const existing = snapshot.data();
  const payload = sanitizeInsightInput(input, { existing, actor });
  if (!payload.title || !payload.slug) throw Object.assign(new Error("Title and slug are required."), { status: 400 });
  if (["approved", "scheduled", "published"].includes(payload.status)) validatePublishable(payload);
  await createInsightVersion({ postId: id, snapshot: existing, actor, reason: "before_update" });
  if (payload.slug !== existing.slug) {
    const duplicate = await db.collection(POST_COLLECTION).where("slug", "==", payload.slug).limit(1).get();
    if (!duplicate.empty && duplicate.docs[0].id !== id) throw Object.assign(new Error("This URL slug is already in use."), { status: 409 });
    await db.collection(REDIRECT_COLLECTION).add({
      fromPath: `/insights/${existing.slug}`,
      toPath: `/insights/${payload.slug}`,
      entityId: id,
      type: "permanent",
      createdBy: actor.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await reference.set(payload, { merge: true });
  if (payload.isFeatured && payload.status === "published") await clearOtherFeaturedPosts(id);
  await writeAudit({ actor, action: "insight.updated", entityType: "insight", entityId: id, summary: `Updated insight: ${payload.title}`, details: { previousStatus: existing.status, status: payload.status } });
  return getInsightById(id);
}

export async function archiveInsight(id, actor) {
  const reference = getAdminDb().collection(POST_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw Object.assign(new Error("Insight not found."), { status: 404 });
  await createInsightVersion({ postId: id, snapshot: snapshot.data(), actor, reason: "before_archive" });
  await reference.set({ status: "archived", archivedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid }, { merge: true });
  await writeAudit({ actor, action: "insight.archived", entityType: "insight", entityId: id, summary: `Archived insight: ${snapshot.data()?.title || id}` });
}

export async function listInsightVersions(postId, limit = 30) {
  const snapshot = await getAdminDb().collection(VERSION_COLLECTION)
    .where("postId", "==", postId)
    .limit(Math.min(100, Number(limit) || 30))
    .get();
  return snapshot.docs.map(serializeVersion).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function restoreInsightVersion(postId, versionId, actor) {
  const db = getAdminDb();
  const [postSnapshot, versionSnapshot] = await Promise.all([
    db.collection(POST_COLLECTION).doc(postId).get(),
    db.collection(VERSION_COLLECTION).doc(versionId).get(),
  ]);
  if (!postSnapshot.exists) throw Object.assign(new Error("Insight not found."), { status: 404 });
  if (!versionSnapshot.exists || versionSnapshot.data()?.postId !== postId) throw Object.assign(new Error("Version not found."), { status: 404 });
  const current = postSnapshot.data();
  const historical = versionSnapshot.data()?.snapshot || {};
  await createInsightVersion({ postId, snapshot: current, actor, reason: "before_restore" });
  const payload = sanitizeInsightInput({ ...historical, slug: current.slug, status: "draft", publishedAt: null, scheduledAt: null }, { existing: current, actor });
  await db.collection(POST_COLLECTION).doc(postId).set({
    ...payload,
    status: "draft",
    restoredFromVersionId: versionId,
    restoredAt: FieldValue.serverTimestamp(),
    restoredBy: actor.uid,
  }, { merge: true });
  await writeAudit({ actor, action: "insight.version_restored", entityType: "insight", entityId: postId, summary: `Restored a previous version of ${historical.title || current.title}` });
  return getInsightById(postId);
}

export async function publishDueScheduledInsights(actor = { uid: "cron", displayName: "GrowVest Scheduler", email: "" }) {
  const db = getAdminDb();
  const now = Timestamp.now();
  const snapshot = await db.collection(POST_COLLECTION)
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", now)
    .limit(50)
    .get();
  let published = 0;
  const publishedPosts = [];
  for (const document of snapshot.docs) {
    const post = document.data();
    await createInsightVersion({ postId: document.id, snapshot: post, actor, reason: "before_scheduled_publish" });
    await document.ref.set({
      status: "published",
      publishedAt: post.publishedAt || post.scheduledAt || now,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actor.uid,
      updatedByName: actor.displayName,
    }, { merge: true });
    if (post.isFeatured) await clearOtherFeaturedPosts(document.id);
    await writeAudit({ actor, action: "insight.scheduled_published", entityType: "insight", entityId: document.id, summary: `Published scheduled Insight: ${post.title}` });
    published += 1;
    publishedPosts.push({ id: document.id, title: post.title, slug: post.slug, status: "published" });
  }
  return { published, publishedPosts };
}

export async function getRelatedInsights(post, limit = 3) {
  if (!post) return [];
  const { items } = await listInsights({ publicOnly: true, pageSize: 300 });
  const postCategories = new Set(post.categoryIds || []);
  const postTags = new Set(post.tagIds || []);
  return items
    .filter((item) => item.id !== post.id)
    .map((item) => ({
      ...item,
      relevance: (item.categoryIds || []).filter((id) => postCategories.has(id)).length * 3
        + (item.tagIds || []).filter((id) => postTags.has(id)).length,
    }))
    .sort((a, b) => b.relevance - a.relevance || new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, Math.max(1, Number(limit) || 3));
}

export async function listTaxonomy(collectionName) {
  const seedMap = {
    [CATEGORY_COLLECTION]: INSIGHT_CATEGORIES_SEED,
    [AUTHOR_COLLECTION]: INSIGHT_AUTHORS_SEED,
    [TAG_COLLECTION]: [
      { id: "bucket-list", name: "Bucket List", slug: "bucket-list", isActive: true },
      { id: "goal-mapping", name: "Goal Mapping", slug: "goal-mapping", isActive: true },
      { id: "family-goals", name: "Family Goals", slug: "family-goals", isActive: true },
      { id: "review", name: "Review", slug: "review", isActive: true },
      { id: "discipline", name: "Discipline", slug: "discipline", isActive: true },
    ],
  };
  if (!isFirebaseAdminConfigured()) return seedMap[collectionName] || [];
  const snapshot = await getAdminDb().collection(collectionName).orderBy("displayOrder", "asc").limit(200).get().catch(async () => getAdminDb().collection(collectionName).limit(200).get());
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: iso(doc.data().createdAt), updatedAt: iso(doc.data().updatedAt) }));
}

export async function listCategories() { return listTaxonomy(CATEGORY_COLLECTION); }
export async function listTags() { return listTaxonomy(TAG_COLLECTION); }
export async function listAuthors() { return listTaxonomy(AUTHOR_COLLECTION); }

export async function saveTaxonomyItem(collectionName, input, actor, id = null) {
  const allowed = [CATEGORY_COLLECTION, TAG_COLLECTION, AUTHOR_COLLECTION];
  if (!allowed.includes(collectionName)) throw Object.assign(new Error("Unsupported content collection."), { status: 400 });
  const db = getAdminDb();
  const name = cleanText(input?.name, 160);
  const slug = slugify(input?.slug || name);
  if (!name || !slug) throw Object.assign(new Error("Name and slug are required."), { status: 400 });
  const reference = id ? db.collection(collectionName).doc(id) : db.collection(collectionName).doc(slug);
  const payload = {
    name,
    slug,
    description: cleanText(input?.description, 600),
    designation: cleanText(input?.designation, 180),
    bio: cleanText(input?.bio, 1400),
    imageUrl: cleanUrl(input?.imageUrl, { max: 1200 }),
    color: cleanText(input?.color || "#1F4ED8", 30),
    displayOrder: Number(input?.displayOrder) || 0,
    isActive: input?.isActive !== false,
    updatedBy: actor.uid,
    updatedAt: FieldValue.serverTimestamp(),
    ...(id ? {} : { createdBy: actor.uid, createdAt: FieldValue.serverTimestamp() }),
  };
  await reference.set(payload, { merge: true });
  await writeAudit({ actor, action: `${collectionName}.saved`, entityType: collectionName, entityId: reference.id, summary: `Saved ${collectionName}: ${name}` });
  const saved = await reference.get();
  return { id: saved.id, ...saved.data() };
}

async function previewSeedCollection(db, collectionName, seeds) {
  const results = { create: 0, replace: 0, skip: 0 };
  for (const item of seeds) {
    const snapshot = await db.collection(collectionName).doc(item.id).get();
    if (snapshot.exists) results.skip += 1;
    else results.create += 1;
  }
  return results;
}

async function findExistingSeedPost(db, item) {
  const byId = await db.collection(POST_COLLECTION).doc(item.id).get();
  if (byId.exists) return byId;
  const bySlug = await db.collection(POST_COLLECTION).where("slug", "==", item.slug).limit(1).get();
  return bySlug.empty ? null : bySlug.docs[0];
}

async function previewSeedPosts(db) {
  const results = { create: 0, replace: 0, skip: 0 };
  for (const item of INSIGHTS_SEED) {
    const existing = await findExistingSeedPost(db, item);
    if (existing) results.skip += 1;
    else results.create += 1;
  }
  return results;
}

export async function previewInsightsImport({ force = false } = {}) {
  const fallback = {
    configured: false,
    posts: { create: INSIGHTS_SEED.length, replace: 0, skip: 0 },
    categories: { create: INSIGHT_CATEGORIES_SEED.length, replace: 0, skip: 0 },
    tags: { create: INSIGHT_TAGS_SEED.length, replace: 0, skip: 0 },
    authors: { create: INSIGHT_AUTHORS_SEED.length, replace: 0, skip: 0 },
  };
  if (!isFirebaseAdminConfigured()) return fallback;
  const db = getAdminDb();
  const [posts, categories, tags, authors] = await Promise.all([
    previewSeedPosts(db),
    previewSeedCollection(db, CATEGORY_COLLECTION, INSIGHT_CATEGORIES_SEED),
    previewSeedCollection(db, TAG_COLLECTION, INSIGHT_TAGS_SEED),
    previewSeedCollection(db, AUTHOR_COLLECTION, INSIGHT_AUTHORS_SEED),
  ]);
  if (force) {
    for (const item of [posts, categories, tags, authors]) {
      item.replace = item.skip;
      item.skip = 0;
    }
  }
  return { configured: true, posts, categories, tags, authors };
}

export async function getInsightsContentSummary() {
  const fallback = {
    configured: false,
    posts: INSIGHTS_SEED.length,
    categories: INSIGHT_CATEGORIES_SEED.length,
    tags: INSIGHT_TAGS_SEED.length,
    authors: INSIGHT_AUTHORS_SEED.length,
  };
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    const db = getAdminDb();
    const [posts, categories, tags, authors] = await Promise.all([
      db.collection(POST_COLLECTION).count().get(),
      db.collection(CATEGORY_COLLECTION).count().get(),
      db.collection(TAG_COLLECTION).count().get(),
      db.collection(AUTHOR_COLLECTION).count().get(),
    ]);
    return {
      configured: true,
      posts: posts.data().count,
      categories: categories.data().count,
      tags: tags.data().count,
      authors: authors.data().count,
    };
  } catch (error) {
    console.warn("[GrowVest Insights] Unable to read content summary.", error?.message || error);
    return fallback;
  }
}

export async function seedInsightsContent(actor, { force = false } = {}) {
  if (!isFirebaseAdminConfigured()) {
    const error = new Error("Firebase Admin is not configured. Add the server credentials before importing Insights.");
    error.status = 503;
    throw error;
  }

  const db = getAdminDb();
  const batch = db.batch();
  const results = { posts: 0, categories: 0, tags: 0, authors: 0, skipped: 0, replaced: 0 };

  async function queueTaxonomy(collectionName, item, counterKey) {
    const reference = db.collection(collectionName).doc(item.id);
    const snapshot = await reference.get();
    if (snapshot.exists && !force) {
      results.skipped += 1;
      return;
    }
    batch.set(reference, {
      ...item,
      updatedBy: actor?.uid || "system",
      updatedAt: FieldValue.serverTimestamp(),
      ...(snapshot.exists ? {} : { createdBy: actor?.uid || "system", createdAt: FieldValue.serverTimestamp() }),
    }, { merge: true });
    results[counterKey] += 1;
    if (snapshot.exists) results.replaced += 1;
  }

  for (const item of INSIGHT_CATEGORIES_SEED) await queueTaxonomy(CATEGORY_COLLECTION, item, "categories");
  for (const item of INSIGHT_TAGS_SEED) await queueTaxonomy(TAG_COLLECTION, item, "tags");
  for (const item of INSIGHT_AUTHORS_SEED) await queueTaxonomy(AUTHOR_COLLECTION, item, "authors");

  const existingFeatured = await db.collection(POST_COLLECTION)
    .where("isFeatured", "==", true)
    .where("status", "==", "published")
    .limit(1)
    .get();
  const preserveExistingFeatured = !force && !existingFeatured.empty;
  let importedFeaturedId = null;

  for (const item of INSIGHTS_SEED) {
    const existingDocument = await findExistingSeedPost(db, item);
    if (existingDocument && !force) {
      results.skipped += 1;
      continue;
    }
    const reference = existingDocument?.ref || db.collection(POST_COLLECTION).doc(item.id);
    const existingData = existingDocument?.data() || null;
    if (existingDocument) {
      await createInsightVersion({
        postId: existingDocument.id,
        snapshot: existingData,
        actor,
        reason: "approved-static-content-reimport",
      });
    }
    const { id, ...post } = item;
    const shouldFeature = Boolean(post.isFeatured) && !preserveExistingFeatured;
    const payload = sanitizeInsightInput({
      ...post,
      status: post.status === "published" ? "published" : "draft",
      isFeatured: shouldFeature,
      scheduledAt: null,
      disclosureKey: "educational-general",
    }, { existing: existingData, actor });
    batch.set(reference, {
      ...payload,
      importedFromStaticWebsite: true,
      importSource: "approved-static-website",
      importVersion: "v20.1",
      originalStaticId: id,
      originalStaticSlug: post.slug,
      legacyPreviewOnly: Boolean(post.legacyPreviewOnly),
      legacyTag: cleanText(post.legacyTag, 80),
      legacyDisplayDate: cleanText(post.legacyDisplayDate || "", 80),
    }, { merge: true });
    if (shouldFeature && payload.status === "published") importedFeaturedId = reference.id;
    results.posts += 1;
    if (existingDocument) results.replaced += 1;
  }

  await batch.commit();
  if (importedFeaturedId) await clearOtherFeaturedPosts(importedFeaturedId);
  await writeAudit({
    actor,
    action: force ? "insights.approved_defaults_replaced" : "insights.approved_content_imported",
    entityType: "insights",
    entityId: "approved-static-content",
    summary: force
      ? "Replaced managed Insights with the approved static GrowVest content."
      : "Imported missing approved static GrowVest Insights content.",
    details: results,
  });
  return results;
}

export const INSIGHTS_COLLECTIONS = {
  posts: POST_COLLECTION,
  categories: CATEGORY_COLLECTION,
  tags: TAG_COLLECTION,
  authors: AUTHOR_COLLECTION,
};
