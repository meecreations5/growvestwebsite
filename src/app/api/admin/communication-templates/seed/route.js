import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { seedCommunicationTemplates } from "../../../../lib/server/communicationTemplatesRepository";
import { assertAllowedOrigin, readJsonBody } from "../../../../lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const admin = await requireAdminRequest(request, "communicationTemplates.manage");
    const body = await readJsonBody(request, 5_000);
    return NextResponse.json(await seedCommunicationTemplates(admin, { replace: body?.replace === true }));
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Unable to seed communication templates." }, { status: error?.status || 500 });
  }
}
