import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listAdminUsers } from "../../../lib/server/adminUsersRepository";
import { AdminUsersManager } from "../../_components/AdminUsersManager";
export const dynamic = "force-dynamic";
export default async function AdminUsersPage() {
  const admin = await requireAdminPage("admins.manage");
  return <AdminUsersManager initialItems={await listAdminUsers()} currentUid={admin.uid} />;
}
