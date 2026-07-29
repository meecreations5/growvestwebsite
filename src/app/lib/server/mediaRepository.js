import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, getAdminStorage } from "./firebaseAdmin";

const MEDIA_COLLECTION = "websiteMedia";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function detectImageType(buffer) {
  if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return "image/webp";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 6 && ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"))) return "image/gif";
  return "";
}

function cleanFileName(value) {
  const name = String(value || "image")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  return name || "image";
}

function iso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return null;
}

async function writeMediaAudit({ actor, action, entityId, summary }) {
  await getAdminDb().collection("websiteAuditLogs").add({
    actorId: actor?.uid || "system",
    actorName: actor?.displayName || "System",
    actorEmail: actor?.email || "",
    action,
    entityType: "websiteMedia",
    entityId,
    summary,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export function serializeMedia(document) {
  const data = typeof document.data === "function" ? document.data() : document;
  return {
    ...data,
    id: document.id || data.id,
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
    archivedAt: iso(data.archivedAt),
  };
}

export async function listMedia({ page = 1, pageSize = 30, search = "" } = {}) {
  const snapshot = await getAdminDb().collection(MEDIA_COLLECTION).orderBy("createdAt", "desc").limit(300).get();
  let items = snapshot.docs.map(serializeMedia).filter((item) => item.status !== "archived");
  const term = String(search || "").trim().toLowerCase();
  if (term) items = items.filter((item) => `${item.fileName} ${item.altText || ""} ${item.caption || ""}`.toLowerCase().includes(term));
  const total = items.length;
  const start = Math.max(0, (Number(page) - 1) * Number(pageSize));
  return { items: items.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) };
}

export async function uploadMedia({ file, altText = "", caption = "", actor }) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw Object.assign(new Error("Select an image to upload."), { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw Object.assign(new Error("Upload a JPG, PNG, WebP or GIF image."), { status: 415 });
  }
  if (!file.size || file.size > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error("The image must be smaller than 4 MB."), { status: 413 });
  }

  const db = getAdminDb();
  const bucket = getAdminStorage().bucket();
  const now = new Date();
  const safeName = cleanFileName(file.name);
  const objectPath = `website-media/insights/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}-${safeName}`;
  const downloadToken = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = detectImageType(buffer);
  if (!detectedType || detectedType !== file.type) {
    throw Object.assign(new Error("The selected file does not contain a supported image."), { status: 415 });
  }
  const storageFile = bucket.file(objectPath);

  await storageFile.save(buffer, {
    resumable: false,
    validation: "crc32c",
    metadata: {
      contentType: file.type,
      cacheControl: "public,max-age=31536000,immutable",
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
  });

  const encodedPath = encodeURIComponent(objectPath);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;
  const reference = db.collection(MEDIA_COLLECTION).doc();
  await reference.set({
    fileName: safeName,
    originalFileName: String(file.name || safeName).slice(0, 180),
    objectPath,
    bucket: bucket.name,
    url,
    contentType: file.type,
    size: file.size,
    altText: String(altText || "").trim().slice(0, 250),
    caption: String(caption || "").trim().slice(0, 500),
    usage: "insights",
    status: "active",
    createdBy: actor.uid,
    createdByName: actor.displayName,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snapshot = await reference.get();
  await writeMediaAudit({ actor, action: "media.uploaded", entityId: reference.id, summary: `Uploaded media: ${safeName}` });
  return serializeMedia(snapshot);
}

export async function archiveMedia(id, actor) {
  const db = getAdminDb();
  const reference = db.collection(MEDIA_COLLECTION).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw Object.assign(new Error("Media item not found."), { status: 404 });
  await reference.set({
    status: "archived",
    archivedBy: actor.uid,
    archivedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await writeMediaAudit({ actor, action: "media.archived", entityId: id, summary: `Archived media: ${snapshot.data()?.fileName || id}` });
}
