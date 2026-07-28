import { requireAdminPage } from "../../lib/server/adminAuth";
import { AdminShell } from "../_components/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }) {
  const admin = await requireAdminPage(null);
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
