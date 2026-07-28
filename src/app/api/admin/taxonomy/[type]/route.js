import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { INSIGHTS_COLLECTIONS, listAuthors, listCategories, listTags, saveTaxonomyItem } from "../../../../lib/server/insightsRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function collectionFor(type) {
  if (type === "categories") return INSIGHTS_COLLECTIONS.categories;
  if (type === "tags") return INSIGHTS_COLLECTIONS.tags;
  if (type === "authors") return INSIGHTS_COLLECTIONS.authors;
  return null;
}

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "insights.read");
    const { type } = await params;
    const items = type === "categories" ? await listCategories() : type === "tags" ? await listTags() : type === "authors" ? await listAuthors() : null;
    if (!items) return NextResponse.json({ error: "Unsupported collection." }, { status: 404 });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load content settings." }, { status: error?.status || 500 });
  }
}

export async function POST(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "taxonomy.manage");
    const { type } = await params;
    const collectionName = collectionFor(type);
    if (!collectionName) return NextResponse.json({ error: "Unsupported collection." }, { status: 404 });
    const body = await readJsonBody(request, 30_000);
    const item = await saveTaxonomyItem(collectionName, body, admin, body?.id || null);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to save the content setting." }, { status: error?.status || 500 });
  }
}
