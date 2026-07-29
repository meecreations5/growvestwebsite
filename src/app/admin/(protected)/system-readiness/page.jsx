import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { SystemReadinessDashboard } from "../../_components/SystemReadinessDashboard";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { getProductionReadiness } from "../../../lib/server/productionReadiness";

export const dynamic = "force-dynamic";

export default async function SystemReadinessPage() {
  await requireAdminPage("system.read");
  const readiness = await getProductionReadiness({ includeRuntime: true });

  return (
    <>
      <AdminPageHeader
        eyebrow="Production Operations"
        title="System readiness"
        description="Validate launch-critical environment, Firebase, security, communication, monitoring and runtime dependencies before promoting a release."
      />
      <SystemReadinessDashboard initialReadiness={readiness} />
    </>
  );
}
