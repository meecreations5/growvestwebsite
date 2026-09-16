import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listMedia } from "../../../lib/server/mediaRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { MediaLibrary } from "../../_components/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({ searchParams }) {
  await requireAdminPage("media.manage");
  const params = await searchParams;
  const search = params?.search || "";
  const result = await listMedia({ search, pageSize: 60 });
  return (
    <>
      <AdminPageHeader title="Media Library" description="Upload and reuse approved images for GrowVest Insights. Keep alternative text clear, useful and human." />
      <MediaLibrary initialItems={result.items} initialSearch={search} total={result.total} />
    </>
  );
}
