import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listInsights } from "../../../lib/server/insightsRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { InsightsTable } from "../../_components/InsightsTable";
import { SeedContentButton } from "../../_components/SeedContentButton";

export const dynamic = "force-dynamic";

export default async function InsightsAdminPage({ searchParams }) {
  const admin = await requireAdminPage("insights.read");
  const params = await searchParams;
  const status = params?.status || "all";
  const search = params?.search || "";
  const page = Math.max(1, Number(params?.page || 1));
  const result = await listInsights({ status, search, page, pageSize: 20 });
  const actions = (
    <>
      {admin.permissions.includes("insights.publish") && <SeedContentButton />}
      {admin.permissions.includes("insights.create") && (
        <Link href="/admin/insights/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white">
          <Plus size={17} /> Add New Insight
        </Link>
      )}
    </>
  );
  return (
    <>
      <AdminPageHeader title="Insights & Blog" description="Create educational content, move it through review and publish it with controlled SEO and disclosure settings." actions={actions} />
      <InsightsTable {...result} status={status} search={search} canArchive={admin.permissions.includes("insights.delete")} />
    </>
  );
}
