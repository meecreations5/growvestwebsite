import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getEnquiryAnalytics } from "../../../../lib/server/enquiriesRepository";
import { EnquiriesAnalyticsDashboard } from "../../../_components/EnquiriesAnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function EnquiriesAnalyticsPage() {
  await requireAdminPage("enquiries.analytics");
  const data = await getEnquiryAnalytics();
  return <EnquiriesAnalyticsDashboard initialData={data} />;
}
