import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getTeamMember } from "../../../../../lib/server/teamSocialRepository";
import { TeamEditor } from "../../../../_components/TeamEditor";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({ params }) {
  await requireAdminPage("team.manage");
  const { id } = await params;
  const item = await getTeamMember(id);
  if (!item) notFound();
  return <TeamEditor initialItem={item} />;
}
