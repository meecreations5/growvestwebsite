import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listSocialLinks } from "../../../lib/server/teamSocialRepository";
import { SocialMediaManager } from "../../_components/SocialMediaManager";

export const dynamic = "force-dynamic";

export default async function SocialMediaPage() {
  await requireAdminPage("social.manage");
  return <SocialMediaManager initialItems={await listSocialLinks()} />;
}
