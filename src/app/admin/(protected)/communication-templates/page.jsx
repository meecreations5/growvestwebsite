import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listCommunicationTemplates } from "../../../lib/server/communicationTemplatesRepository";
import { CommunicationTemplatesManager } from "../../_components/CommunicationTemplatesManager";

export const dynamic = "force-dynamic";

export default async function CommunicationTemplatesPage() {
  const admin = await requireAdminPage("communicationTemplates.read");
  const items = await listCommunicationTemplates();
  return <CommunicationTemplatesManager initialItems={items} canManage={admin.permissions.includes("communicationTemplates.manage")} />;
}
