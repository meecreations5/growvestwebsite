import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../../lib/server/adminAuth";
import { getConversionRequest, updateConversionRequest } from "../../../../../lib/server/enquiriesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request, "enquiries.convert");
    const { id } = await params;
    const result = await getConversionRequest(id);
    if (!result) return NextResponse.json({ error: "Conversion request not found." }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to load the conversion request." }, { status: error?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "enquiries.convert");
    const body = await readJsonBody(request, 25_000);
    const { id } = await params;
    return NextResponse.json(await updateConversionRequest(id, body, admin));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to update the conversion request." }, { status: error?.status || 500 });
  }
}
