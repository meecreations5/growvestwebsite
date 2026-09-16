import { EnquiriesPageServer } from "../../_components/EnquiriesPageServer";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage({ searchParams }) {
  const query = await searchParams;
  return <EnquiriesPageServer
    title="Enquiries & lead management"
    description="Capture, assign, follow up and convert website, Bucket List, newsletter and manually added enquiries from one workspace."
    showAnalytics
    filters={{
      source: query?.source || "all",
      status: query?.status || "all",
      priority: query?.priority || "all",
      assignee: query?.assignee || "all",
      followUp: query?.followUp || "all",
      search: query?.search || "",
      page: Number(query?.page || 1),
    }}
  />;
}
