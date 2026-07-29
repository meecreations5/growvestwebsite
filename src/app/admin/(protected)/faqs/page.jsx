import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listFaqs } from "../../../lib/server/websiteContentRepository";
import { FaqManager } from "../../_components/FaqManager";
export const dynamic = "force-dynamic";
export default async function AdminFaqsPage() { await requireAdminPage("website.manage"); return <FaqManager initialItems={await listFaqs()} />; }
