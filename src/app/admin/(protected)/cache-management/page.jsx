import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { CacheManagementPanel } from "../../_components/CacheManagementPanel";
import { requireAdminPage } from "../../../lib/server/adminAuth";

export const dynamic = "force-dynamic";

export default async function CacheManagementPage() {
  await requireAdminPage("system.manage");
  return (
    <>
      <AdminPageHeader
        eyebrow="Performance"
        title="Cache Management"
        description="Refresh specific public-content caches after a production change without rebuilding the complete website. Normal Admin publishing already performs automatic cache invalidation."
      />
      <CacheManagementPanel />
    </>
  );
}
