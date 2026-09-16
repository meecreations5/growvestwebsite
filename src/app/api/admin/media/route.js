import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../lib/server/adminAuth";
import { listMedia, uploadMedia } from "../../../lib/server/mediaRepository";
import { assertAllowedOrigin } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "media.manage");
    const { searchParams } = new URL(request.url);
    const result = await listMedia({
      search: searchParams.get("search") || "",
      page: Number(searchParams.get("page") || 1),
      pageSize: Math.min(60, Number(searchParams.get("pageSize") || 30)),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load media." }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "media.manage");
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 5 * 1024 * 1024) return NextResponse.json({ error: "The upload is too large." }, { status: 413 });
    const formData = await request.formData();
    const media = await uploadMedia({
      file: formData.get("file"),
      altText: formData.get("altText"),
      caption: formData.get("caption"),
      actor: admin,
    });
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to upload media." }, { status: error?.status || 500 });
  }
}
