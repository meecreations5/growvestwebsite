import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getWebsiteNavigation } from "../../../../lib/server/websiteContentRepository";
import { WebsiteNavigationEditor } from "../../../_components/WebsiteNavigationEditor";
export const dynamic = "force-dynamic";
export default async function WebsiteNavigationPage() { await requireAdminPage("website.manage"); return <WebsiteNavigationEditor initialItem={await getWebsiteNavigation()} />; }
