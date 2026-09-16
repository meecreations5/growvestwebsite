import { requireAdminRequest } from "../../../../lib/server/adminAuth";
import { getProductionReadiness } from "../../../../lib/server/productionReadiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  try {
    await requireAdminRequest(request, "system.read");
    const readiness = await getProductionReadiness({ includeRuntime: true });
    return Response.json(readiness, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    return Response.json(
      {
        error: error?.message || "The production-readiness check could not be completed.",
        code: error?.code || "READINESS_CHECK_FAILED",
      },
      {
        status: Number(error?.status || 500),
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
