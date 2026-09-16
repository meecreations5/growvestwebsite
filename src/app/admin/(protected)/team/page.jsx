import { Plus } from "lucide-react";
import Link from "next/link";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listTeamMembers } from "../../../lib/server/teamSocialRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { TeamTable } from "../../_components/TeamTable";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const admin = await requireAdminPage("team.read");
  const items = await listTeamMembers();
  const canManage = admin.permissions.includes("team.manage");
  const actions = canManage ? <Link href="/admin/team/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white"><Plus size={17} /> Add team member</Link> : null;
  return <><AdminPageHeader title="Team and hierarchy" description="Manage the people behind GrowVest with verified profiles, thoughtful hierarchy and clear public visibility." actions={actions} /><TeamTable items={items} canManage={canManage} /></>;
}
