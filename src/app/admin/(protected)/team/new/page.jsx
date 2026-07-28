import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { TeamEditor } from "../../../_components/TeamEditor";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  await requireAdminPage("team.manage");
  return <TeamEditor />;
}
