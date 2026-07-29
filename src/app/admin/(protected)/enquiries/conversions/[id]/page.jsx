import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getConversionRequest } from "../../../../../lib/server/enquiriesRepository";
import { ConversionDetail } from "../../../../_components/ConversionDetail";

export const dynamic = "force-dynamic";

export default async function ConversionRequestDetailPage({ params }) {
  await requireAdminPage("enquiries.convert");
  const { id } = await params;
  const data = await getConversionRequest(id);
  if (!data) notFound();
  return <ConversionDetail initialData={data} />;
}
