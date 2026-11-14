import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getWebsitePage } from "../../../../../lib/server/websiteContentRepository";
import { SITE_PAGES } from "../../../../../lib/sitePages";
import { SitePageSettingsEditor } from "../../../../_components/SitePageSettingsEditor";

export const dynamic = "force-dynamic";

export default async function ManageSitePage({ params }) {
  await requireAdminPage("website.page.manage");
  const { key } = await params;
  const page = SITE_PAGES.find((item) => item.key === key);
  if (!page) notFound();
  return <SitePageSettingsEditor page={page} initialItem={await getWebsitePage(key)} />;
}
