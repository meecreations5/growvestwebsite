import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getWebsitePage } from "../../../../lib/server/websiteContentRepository";
import { WebsitePageEditor } from "../../../_components/WebsitePageEditor";
export const dynamic = "force-dynamic";
export default async function WebsiteHomePage() { await requireAdminPage("website.manage"); return <WebsitePageEditor pageKey="home" initialItem={await getWebsitePage("home")} />; }
