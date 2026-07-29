import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { CACHE_TAGS, pageCacheTag } from "../../../../lib/server/cacheConfig";
import { getAdminDb } from "../../../../lib/server/firebaseAdmin";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRESETS = {
  website: {
    tags: [pageCacheTag("home"), pageCacheTag("about"), CACHE_TAGS.websiteSettings, CACHE_TAGS.websiteNavigation, CACHE_TAGS.faqs, CACHE_TAGS.goalLibrary],
    paths: ["/", "/about", "/faqs", "/goal-library"],
  },
  insights: {
    tags: [CACHE_TAGS.insights, CACHE_TAGS.insightTaxonomy, CACHE_TAGS.guideSources],
    paths: ["/", "/insights", "/insights/feed.xml", "/sitemap.xml"],
  },
  people: {
    tags: [CACHE_TAGS.team, CACHE_TAGS.social, CACHE_TAGS.testimonials],
    paths: ["/", "/about", "/contact", "/insights", "/investor-experiences"],
  },
  guide: {
    tags: [CACHE_TAGS.guideKnowledge, CACHE_TAGS.guideSettings, CACHE_TAGS.guideSources],
    paths: ["/"],
  },
};
PRESETS.all = {
  tags: Array.from(new Set(Object.values(PRESETS).flatMap((preset) => preset.tags))),
  paths: Array.from(new Set(Object.values(PRESETS).flatMap((preset) => preset.paths))),
};

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "system.manage");
    const body = await readJsonBody(request, 4_000);
    const presetKey = String(body?.preset || "");
    const preset = PRESETS[presetKey];
    if (!preset) return NextResponse.json({ error: "Choose a valid cache group." }, { status: 400 });

    preset.tags.forEach((tag) => revalidateTag(tag));
    preset.paths.forEach((path) => {
      if (path === "/") revalidatePath("/", "layout");
      else revalidatePath(path);
    });

    await getAdminDb().collection("websiteAuditLogs").add({
      actorId: admin.uid,
      actorName: admin.displayName,
      actorEmail: admin.email,
      action: "system.cache.revalidated",
      entityType: "systemCache",
      entityId: presetKey,
      summary: `Refreshed the ${presetKey} public cache preset.`,
      details: { tags: preset.tags, paths: preset.paths },
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, preset: presetKey, tags: preset.tags.length, paths: preset.paths.length });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "The public cache could not be refreshed.", code: error?.code || "CACHE_REVALIDATION_FAILED" }, { status: error?.status || 500 });
  }
}
