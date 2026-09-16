import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listConversionRequests } from "../../../../lib/server/enquiriesRepository";
import { ConversionWorkspace } from "../../../_components/ConversionWorkspace";

export const dynamic = "force-dynamic";

export default async function ConversionRequestsPage() {
  await requireAdminPage("enquiries.convert");
  const result = await listConversionRequests();
  return <ConversionWorkspace initialResult={result} />;
}
