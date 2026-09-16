import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listGuideKnowledge } from "../../../../lib/server/growvestGuideRepository";
import { GuideKnowledgeManager } from "../../../_components/GuideKnowledgeManager";

export const dynamic = "force-dynamic";

export default async function GrowVestGuideKnowledgePage() {
  await requireAdminPage("guide.manage");
  const items = await listGuideKnowledge();
  return <GuideKnowledgeManager initialItems={items} />;
}
