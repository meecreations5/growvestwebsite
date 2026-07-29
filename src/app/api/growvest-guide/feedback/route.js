import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";
import { recordGuideFeedback } from "../../../lib/server/growvestGuideRepository";
import { ApiError, assertAllowedOrigin, cleanText, enforceRateLimit, getRequestContext, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(payload, status = 200) {
  return NextResponse.json(payload, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 8_000);
    const sessionId = cleanText(body?.sessionId, 160);
    const messageId = cleanText(body?.messageId, 180);
    const value = cleanText(body?.value, 40);
    const comment = cleanText(body?.comment, 600);
    if (!sessionId || !messageId || !["helpful", "not_helpful"].includes(value)) {
      throw new ApiError(400, "Choose helpful or not helpful for a valid Guide response.", "GUIDE_FEEDBACK_INVALID");
    }
    if (isFirebaseAdminConfigured()) {
      await enforceRateLimit({ db: getAdminDb(), request, scope: "growvest_guide_feedback", limit: 20, windowMs: 60 * 60 * 1000 });
    }
    const item = await recordGuideFeedback({ sessionId, messageId, value, comment, context: getRequestContext(request) });
    return response({ ok: true, item });
  } catch (error) {
    return response({ ok: false, code: error?.code || "GUIDE_FEEDBACK_FAILED", message: error?.message || "Unable to save feedback." }, error?.status || 500);
  }
}
