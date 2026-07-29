import { getProductionReadiness } from "../../../lib/server/productionReadiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const readiness = await getProductionReadiness({ includeRuntime: true });
  const publicChecks = readiness.checks
    .filter((item) => item.category === "Runtime")
    .map(({ id, label, status }) => ({ id, label, status }));

  return Response.json(
    {
      status: readiness.status,
      service: readiness.service,
      release: readiness.release,
      environment: readiness.environment,
      checkedAt: readiness.checkedAt,
      checks: publicChecks,
    },
    {
      status: readiness.status === "blocked" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
