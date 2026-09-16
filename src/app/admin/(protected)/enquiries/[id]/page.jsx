import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getEnquiryDetails, listAssignableAdmins } from "../../../../lib/server/enquiriesRepository";
import { EnquiryDetail } from "../../../_components/EnquiryDetail";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({ params }) {
  const admin = await requireAdminPage("enquiries.read");
  const { id } = await params;
  const [initialData, assignees] = await Promise.all([getEnquiryDetails(id), listAssignableAdmins()]);
  if (!initialData) notFound();
  return <EnquiryDetail initialData={initialData} assignees={assignees} permissions={admin.permissions} />;
}
