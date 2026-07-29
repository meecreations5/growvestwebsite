import { unstable_cache } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin";
import { SOCIAL_PLATFORMS, TEAM_DEPARTMENTS, TEAM_STATUSES } from "../../data/teamSocial";

const TEAM_COLLECTION = "teamMembers";
const SOCIAL_COLLECTION = "websiteSocialLinks";
const AUDIT_COLLECTION = "websiteAuditLogs";

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
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

function cleanUrl(value, { allowMailto = false } = {}) {
  const cleaned = cleanText(value, 1600);
  if (!cleaned) return "";
  try {
    const url = new URL(cleaned);
    const allowed = ["http:", "https:"];
    if (allowMailto) allowed.push("mailto:");
    return allowed.includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function cleanStringArray(value, maxItems = 30, maxLength = 180) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanText(item, maxLength)).filter(Boolean))).slice(0, maxItems);
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
    publishedAt: iso(data.publishedAt),
    archivedAt: iso(data.archivedAt),
  };
}

function departmentExists(value) {
  return TEAM_DEPARTMENTS.some((item) => item.value === value);
}

function platformExists(value) {
  return SOCIAL_PLATFORMS.some((item) => item.value === value);
}

export function sanitizeTeamMemberInput(input, { existing = null, actor = null } = {}) {
  const fullName = cleanText(input?.fullName, 160);
  const designation = cleanText(input?.designation, 160);
  const department = departmentExists(input?.department) ? input.department : "client_guidance";
  const status = TEAM_STATUSES.includes(input?.status) ? input.status : existing?.status || "draft";
  const photoUrl = cleanUrl(input?.photo?.url || input?.photoUrl);
  const photoAltText = cleanText(input?.photo?.altText || input?.photoAltText, 240);

  if (!fullName) {
    const error = new Error("Add the team member's full name.");
    error.status = 400;
    throw error;
  }
  if (!designation) {
    const error = new Error("Add the team member's designation.");
    error.status = 400;
    throw error;
  }
  if (status === "published" && photoUrl && !photoAltText) {
    const error = new Error("Add alternative text for the team photograph before publishing.");
    error.status = 400;
    throw error;
  }

  return {
    fullName,
    slug: slugify(input?.slug || fullName),
    designation,
    department,
    hierarchyLevel: cleanInteger(input?.hierarchyLevel, 1, 1, 20),
    displayOrder: cleanInteger(input?.displayOrder, 0, 0, 9999),
    shortBio: cleanText(input?.shortBio, 420),
    bio: cleanText(input?.bio, 2500),
    photo: {
      url: photoUrl,
      altText: photoAltText,
      focalX: cleanPercent(input?.photo?.focalX),
      focalY: cleanPercent(input?.photo?.focalY),
    },
    qualifications: cleanStringArray(input?.qualifications, 20, 220),
    certifications: cleanStringArray(input?.certifications, 20, 220),
    linkedinUrl: cleanUrl(input?.linkedinUrl),
    publicEmail: cleanText(input?.publicEmail, 180).toLowerCase(),
    status,
    isVisible: input?.isVisible !== false,
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
      createdAt: FieldValue.serverTimestamp(),
    }),
    ...(status === "published" ? { publishedAt: existing?.publishedAt || FieldValue.serverTimestamp(), archivedAt: null } : {}),
    ...(status === "archived" ? { archivedAt: FieldValue.serverTimestamp(), isVisible: false } : {}),
  };
}

export function sanitizeSocialLinkInput(input, { existing = null, actor = null } = {}) {
  const platform = platformExists(input?.platform) ? input.platform : "linkedin";
  const url = cleanUrl(input?.url);
  const label = cleanText(input?.label, 180) || SOCIAL_PLATFORMS.find((item) => item.value === platform)?.label || "Social profile";

  if (!url) {
    const error = new Error("Add a valid https link for this social account.");
    error.status = 400;
    throw error;
  }

  return {
    platform,
    label,
    handle: cleanText(input?.handle, 120),
    url,
    displayOrder: cleanInteger(input?.displayOrder, 0, 0, 9999),
    isVisible: input?.isVisible !== false,
    openInNewTab: input?.openInNewTab !== false,
    locations: {
      footer: input?.locations?.footer !== false,
      about: Boolean(input?.locations?.about),
      contact: Boolean(input?.locations?.contact),
      mobileMenu: Boolean(input?.locations?.mobileMenu),
    },
    updatedBy: actor?.uid || existing?.updatedBy || "system",
    updatedByName: actor?.displayName || existing?.updatedByName || "System",
    updatedAt: FieldValue.serverTimestamp(),
    ...(existing ? {} : {
      createdBy: actor?.uid || "system",
      createdByName: actor?.displayName || "System",
      createdAt: FieldValue.serverTimestamp(),
    }),
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

export async function listTeamMembers({ publicOnly = false } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(TEAM_COLLECTION).limit(250).get();
  return snapshot.docs
    .map(serialize)
    .filter((item) => !publicOnly || (item.status === "published" && item.isVisible !== false))
    .sort((a, b) => {
      const departmentA = TEAM_DEPARTMENTS.findIndex((item) => item.value === a.department);
      const departmentB = TEAM_DEPARTMENTS.findIndex((item) => item.value === b.department);
      return departmentA - departmentB || (a.hierarchyLevel || 0) - (b.hierarchyLevel || 0) || (a.displayOrder || 0) - (b.displayOrder || 0) || a.fullName.localeCompare(b.fullName);
    });
}

export async function getTeamMember(id) {
  if (!isFirebaseAdminConfigured() || !id) return null;
  const snapshot = await getAdminDb().collection(TEAM_COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createTeamMember(input, actor) {
  const db = getAdminDb();
  const payload = sanitizeTeamMemberInput(input, { actor });
  const reference = db.collection(TEAM_COLLECTION).doc();
  await reference.set(payload);
  const item = await getTeamMember(reference.id);
  await writeAudit({ actor, action: "team.created", entityType: "teamMember", entityId: reference.id, summary: `Created team profile for ${item.fullName}.` });
  return item;
}

export async function updateTeamMember(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(TEAM_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This team member could not be found.");
    error.status = 404;
    throw error;
  }
  const existing = snapshot.data();
  const payload = sanitizeTeamMemberInput(input, { existing, actor });
  await reference.set(payload, { merge: true });
  const item = await getTeamMember(id);
  await writeAudit({ actor, action: "team.updated", entityType: "teamMember", entityId: id, summary: `Updated team profile for ${item.fullName}.`, details: { status: item.status } });
  return item;
}

export async function archiveTeamMember(id, actor) {
  const db = getAdminDb();
  const reference = db.collection(TEAM_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This team member could not be found.");
    error.status = 404;
    throw error;
  }
  await reference.set({ status: "archived", isVisible: false, archivedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor?.uid || "system", updatedByName: actor?.displayName || "System" }, { merge: true });
  await writeAudit({ actor, action: "team.archived", entityType: "teamMember", entityId: id, summary: `Archived team profile for ${snapshot.data()?.fullName || "team member"}.` });
}

export async function listSocialLinks({ publicOnly = false, location = "" } = {}) {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getAdminDb().collection(SOCIAL_COLLECTION).limit(100).get();
  return snapshot.docs
    .map(serialize)
    .filter((item) => !publicOnly || item.isVisible !== false)
    .filter((item) => !location || item.locations?.[location] === true)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.label.localeCompare(b.label));
}

export async function getSocialLink(id) {
  if (!isFirebaseAdminConfigured() || !id) return null;
  const snapshot = await getAdminDb().collection(SOCIAL_COLLECTION).doc(id).get();
  return snapshot.exists ? serialize(snapshot) : null;
}

export async function createSocialLink(input, actor) {
  const db = getAdminDb();
  const payload = sanitizeSocialLinkInput(input, { actor });
  const reference = db.collection(SOCIAL_COLLECTION).doc();
  await reference.set(payload);
  const item = await getSocialLink(reference.id);
  await writeAudit({ actor, action: "social.created", entityType: "socialLink", entityId: reference.id, summary: `Added ${item.label}.` });
  return item;
}

export async function updateSocialLink(id, input, actor) {
  const db = getAdminDb();
  const reference = db.collection(SOCIAL_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This social account could not be found.");
    error.status = 404;
    throw error;
  }
  const payload = sanitizeSocialLinkInput(input, { existing: snapshot.data(), actor });
  await reference.set(payload, { merge: true });
  const item = await getSocialLink(id);
  await writeAudit({ actor, action: "social.updated", entityType: "socialLink", entityId: id, summary: `Updated ${item.label}.` });
  return item;
}

export async function hideSocialLink(id, actor) {
  const db = getAdminDb();
  const reference = db.collection(SOCIAL_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    const error = new Error("This social account could not be found.");
    error.status = 404;
    throw error;
  }
  await reference.set({ isVisible: false, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor?.uid || "system", updatedByName: actor?.displayName || "System" }, { merge: true });
  await writeAudit({ actor, action: "social.hidden", entityType: "socialLink", entityId: id, summary: `Hidden ${snapshot.data()?.label || "social account"}.` });
}

export const getPublishedTeamMembers = unstable_cache(
  async () => listTeamMembers({ publicOnly: true }),
  ["growvest-published-team-members"],
  { tags: ["growvest-team"], revalidate: 300 },
);

export const getPublishedSocialLinks = unstable_cache(
  async () => listSocialLinks({ publicOnly: true }),
  ["growvest-published-social-links"],
  { tags: ["growvest-social"], revalidate: 300 },
);

export const TEAM_SOCIAL_COLLECTIONS = {
  team: TEAM_COLLECTION,
  social: SOCIAL_COLLECTION,
  audit: AUDIT_COLLECTION,
};
