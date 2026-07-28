import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listGuideConversations, listUnansweredGuideQuestions } from "../../../../lib/server/growvestGuideRepository";
import { GuideConversationsManager } from "../../../_components/GuideConversationsManager";

export const dynamic = "force-dynamic";

export default async function GrowVestGuideConversationsPage() {
  await requireAdminPage("guide.conversations");
  const [items, unanswered] = await Promise.all([
    listGuideConversations({ limit: 200 }),
    listUnansweredGuideQuestions({ status: "open", limit: 200 }),
  ]);
  return <GuideConversationsManager initialItems={items} initialUnanswered={unanswered} />;
}
