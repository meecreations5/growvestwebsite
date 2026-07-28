import { requireAdminPage } from "../../lib/server/adminAuth";
import { listAssignableAdmins, listEnquiries } from "../../lib/server/enquiriesRepository";
import { EnquiriesWorkspace } from "./EnquiriesWorkspace";

export async function EnquiriesPageServer({ title, description, filters = {}, showAnalytics = false }) {
  const admin = await requireAdminPage("enquiries.read");
  const [initialResult, assignees] = await Promise.all([
    listEnquiries({ ...filters, pageSize: 25 }),
    listAssignableAdmins(),
  ]);
  return <EnquiriesWorkspace initialResult={initialResult} initialFilters={filters} assignees={assignees} title={title} description={description} showAnalytics={showAnalytics} canManage={admin.permissions.includes("enquiries.manage")} />;
}
