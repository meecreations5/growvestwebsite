import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getWebsiteSettings } from "../../../../lib/server/websiteContentRepository";
import { WebsiteSettingsEditor } from "../../../_components/WebsiteSettingsEditor";
export const dynamic = "force-dynamic";
export default async function WebsiteSettingsPage() { await requireAdminPage("website.manage"); return <WebsiteSettingsEditor initialItem={await getWebsiteSettings()} />; }
