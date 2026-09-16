import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/server/firebaseAdmin";
import { buildGuideResponse, sanitizeGuideClientContext } from "../../../lib/server/growvestGuideEngine";
import { findGuideAnswer, getGuideSessionContext, getGuideSettings, recordGuideExchange } from "../../../lib/server/growvestGuideRepository";
import { ApiError, assertAllowedOrigin, cleanText, enforceRateLimit, getRequestContext, readJsonBody } from "../../../lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(payload, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  try {
    assertAllowedOrigin(request);
    const body = await readJsonBody(request, 22_000);
    const message = cleanText(body?.message, 800);
    const sessionId = cleanText(body?.sessionId, 160);
    const pageUrl = cleanText(body?.pageUrl, 600);
    if (!message) throw new ApiError(400, "Type a question for GrowVest Guide.", "GUIDE_MESSAGE_REQUIRED");

    if (isFirebaseAdminConfigured()) {
      await enforceRateLimit({ db: getAdminDb(), request, scope: "growvest_guide_chat", limit: 30, windowMs: 10 * 60 * 1000 });
    }

    const settings = await getGuideSettings({ publicOnly: true });
    if (!settings.isEnabled) throw new ApiError(503, "GrowVest Guide is temporarily unavailable.", "GUIDE_DISABLED");

    const [storedContext] = await Promise.all([
      settings.sessionMemoryEnabled !== false ? getGuideSessionContext(sessionId) : Promise.resolve({}),
    ]);
    const clientContext = sanitizeGuideClientContext(body?.conversationContext || {});
    const sessionContext = settings.sessionMemoryEnabled === false ? {} : { ...clientContext, ...storedContext };

    const answer = await buildGuideResponse({
      message,
      settings,
      sessionContext,
      findKnowledgeAnswer: findGuideAnswer,
    });

    if (settings.showSources === false) answer.sources = [];

    const requestContext = getRequestContext(request);
    const record = await recordGuideExchange({ sessionId, message, response: answer, pageUrl, context: requestContext })
      .catch(() => ({ conversationId: sessionId || "", messageId: "" }));

    const nextContext = answer.stateUpdate?.reset
      ? {}
      : sanitizeGuideClientContext({ ...sessionContext, ...(answer.stateUpdate || {}) });

    return response({
      ok: true,
      conversationId: record.conversationId || sessionId,
      messageId: record.messageId || "",
      answer: answer.answer,
      matched: Boolean(answer.matched),
      boundary: Boolean(answer.boundary),
      confidence: Number(answer.confidence || 0),
      confidenceLevel: Number(answer.confidence || 0) >= 0.75 ? "high" : Number(answer.confidence || 0) >= Number(settings.lowConfidenceThreshold || 0.35) ? "medium" : "low",
      matchedQuestion: answer.matchedQuestion || "",
      intent: answer.intent || null,
      conversationSummary: answer.conversationSummary || nextContext.conversationSummary || "",
      conversationContext: nextContext,
      sources: answer.sources || [],
      quickReplies: answer.quickReplies || [],
      nextAction: answer.nextAction || "",
      canHandoff: Boolean(answer.canHandoff ?? settings.whatsappEnabled),
      feedbackEnabled: Boolean(settings.feedbackEnabled),
      whatsappLabel: settings.whatsappLabel,
      disclaimer: settings.disclaimer,
    });
  } catch (error) {
    return response({
      ok: false,
      code: error?.code || "GUIDE_REQUEST_FAILED",
      message: error?.message || "GrowVest Guide could not answer right now. Please try again.",
    }, error?.status || 500);
  }
}
