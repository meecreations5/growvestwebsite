import { unstable_cache } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { TESTIMONIAL_JOURNEY_TYPES, TESTIMONIAL_STATUSES } from "../../data/testimonials";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";

const COLLECTION = "investorTestimonials";
const AUDIT_COLLECTION = "websiteAuditLogs";

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanUrl(value) {
  const cleaned = cleanText(value, 1600);
  if (!cleaned) return "";
  try {
    const url = new URL(cleaned);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function cleanInteger(value, fallback = 0, min = 0, max = 9999) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function cleanPercent(value, fallback = 50) {
  const number = Number(value);
  return Math.max(0, Math.min(100, Number.isFinite(number) ? number : fallback));
}

function toIso(value) {
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
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    publishedAt: toIso(data.publishedAt),
    archivedAt: toIso(data.archivedAt),
    consentRecordedAt: toIso(data.consentRecordedAt),
  };
}

function journeyExists(value) {
  return TESTIMONIAL_JOURNEY_TYPES.some((item) => item.value === value);
}

function deriveInitials(displayName) {
  const parts = cleanText(displayName, 160).split(/\s+/).filter(Boolean);
  if (!parts.length) return "GV";
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
}

export function sanitizeTestimonialInput(input, { existing = null, actor = null } = {}) {
  const status = TESTIMONIAL_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  const displayName = cleanText(input?.displayName, 160) || "A GrowVest Investor";
  const quote = cleanText(input?.quote, 1800);
  const photoUrl = cleanUrl(input?.photo?.url || input?.photoUrl);
  const photoAltText = cleanText(input?.photo?.altText || input?.photoAltText, 240);
  const consentConfirmed = input?.consentConfirmed === true;
  const showOnHomepage = input?.showOnHomepage === true;
  const showOnInsights = input?.showOnInsights !== false;
  const showOnAbout = input?.showOnAbout === true;

  if (!quote) {
    const error = new Error("Add the investor's approved testimonial before saving.");
    error.status = 400;
    throw error;
  }

  if (status === "published" && !consentConfirmed) {
    const error = new Error("Confirm that written investor consent is recorded before publishing this testimonial.");
    error.status = 400;
    throw error;
  }

  if (status === "published" && photoUrl && !photoAltText) {
    const error = new Error("Add alternative text for the investor photograph before publishing.");
    error.status = 400;
    throw error;
  }

  const previousConsent = existing?.consentConfirmed === true;
  const payload = {
    displayName,
    city: cleanText(input?.city, 120),
    journeyType: journeyExists(input?.journeyType) ? input.journeyType : "financial_clarity",
    quote,
    shortQuote: cleanText(input?.shortQuote, 360),
    photo: {
      url: photoUrl,
      altText: photoAltText,
      focalX: cleanPercent(input?.photo?.focalX),
      focalY: cleanPercent(input?.photo?.focalY),
    },
    useInitials: input?.useInitials !== false,
    initials: cleanText(input?.initials, 4).toUpperCase() || deriveInitials(displayName),
    consentConfirmed,
    consentReference: cleanText(input?.consentReference, 320),
    isFeatured: input?.isFeatured === true,
    showOnHomepage,
    showOnInsights,
    showOnAbout,
    displayOrder: cleanInteger(input?.displayOrder, 0, 0, 9999),
    status,
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
      createdAt: FieldValue.serverTimestamp(),
    }),
    ...(consentConfirmed && !previousConsent ? { consentRecordedAt: FieldValue.serverTimestamp() } : {}),
    ...(!consentConfirmed ? { consentRecordedAt: null } : {}),
    ...(status === "published" ? {
      publishedAt: existing?.publishedAt || FieldValue.serverTimestamp(),
      archivedAt: null,
    } : {}),
    ...(status === "archived" ? {
      archivedAt: FieldValue.serverTimestamp(),
      isFeatured: false,
      showOnHomepage: false,
      showOnInsights: false,
      showOnAbout: false,
    } : {}),
  };

  return payload;
}

async function writeAudit({ actor, action, entityId, summary, details = {} }) {
  if (!isFirebaseAdminConfigured()) return;
  await getAdminDb().collection(AUDIT_COLLECTION).add({
    actorId: actor?.uid || "system",
    actorName: actor?.displayName || "System",
    actorEmail: actor?.email || "",
    action,
    entityType: "investorTestimonial",
    entityId,
    summary,
    details,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function listTestimonials({ publicOnly = false, location = "", limit = 250 } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(COLLECTION).limit(Math.min(Math.max(Number(limit) || 250, 1), 500)).get();
  return snapshot.docs
    .map(serialize)
    .filter((item) => !publicOnly || (item.status === "published" && item.consentConfirmed === true))
    .filter((item) => !location || item?.[location] === true)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || (a.displayOrder || 0) - (b.displayOrder || 0) || (a.publishedAt || "").localeCompare(b.publishedAt || ""));
}

export async function getTestimonial(id) {
  if (!isFirebaseAdminConfigured() || !id) return null;
  const snapshot = await getAdminDb().collection(COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createTestimonial(input, actor) {
  const db = getAdminDb();
  const payload = sanitizeTestimonialInput(input, { actor });
  const reference = db.collection(COLLECTION).doc();
  await reference.set(payload);
  const item = await getTestimonial(reference.id);
  await writeAudit({
    actor,
    action: "testimonial.created",
    entityId: reference.id,
    summary: `Created investor testimonial for ${item.displayName}.`,
    details: { status: item.status },
  });
  return item;
}

export async function updateTestimonial(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This investor testimonial could not be found.");
    error.status = 404;
    throw error;
  }
  const payload = sanitizeTestimonialInput(input, { existing: snapshot.data(), actor });
  await reference.set(payload, { merge: true });
  const item = await getTestimonial(id);
  await writeAudit({
    actor,
    action: "testimonial.updated",
    entityId: id,
    summary: `Updated investor testimonial for ${item.displayName}.`,
    details: { status: item.status, locations: { home: item.showOnHomepage, insights: item.showOnInsights, about: item.showOnAbout } },
  });
  return item;
}

export async function archiveTestimonial(id, actor) {
  const db = getAdminDb();
  const reference = db.collection(COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This investor testimonial could not be found.");
    error.status = 404;
    throw error;
  }
  const displayName = snapshot.data()?.displayName || "investor";
  await reference.set({
    status: "archived",
    isFeatured: false,
    showOnHomepage: false,
    showOnInsights: false,
    showOnAbout: false,
    archivedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor?.uid || "system",
    updatedByName: actor?.displayName || "System",
  }, { merge: true });
  await writeAudit({ actor, action: "testimonial.archived", entityId: id, summary: `Archived investor testimonial for ${displayName}.` });
}

export async function getTestimonialsSummary() {
  const items = await listTestimonials();
  return {
    total: items.length,
    published: items.filter((item) => item.status === "published").length,
    draft: items.filter((item) => item.status === "draft").length,
    awaitingConsent: items.filter((item) => item.status !== "archived" && item.consentConfirmed !== true).length,
  };
}

export const getPublishedTestimonials = unstable_cache(
  async (location = "") => listTestimonials({ publicOnly: true, location }),
  ["growvest-published-investor-testimonials"],
  { tags: ["growvest-testimonials"], revalidate: 300 },
);

export const TESTIMONIAL_COLLECTIONS = {
  testimonials: COLLECTION,
  audit: AUDIT_COLLECTION,
};
