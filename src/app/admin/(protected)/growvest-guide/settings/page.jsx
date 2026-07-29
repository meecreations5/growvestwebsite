import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getGuideSettings } from "../../../../lib/server/growvestGuideRepository";
import { GuideSettingsEditor } from "../../../_components/GuideSettingsEditor";

export const dynamic = "force-dynamic";

export default async function GrowVestGuideSettingsPage() {
  await requireAdminPage("guide.manage");
  const item = await getGuideSettings();
  return <GuideSettingsEditor initialItem={item} />;
}
