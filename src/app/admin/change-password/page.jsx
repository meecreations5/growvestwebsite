import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/server/adminAuth";
import { InitialPasswordChange } from "./InitialPasswordChange";

export const dynamic = "force-dynamic";

export default async function AdminChangePasswordPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  if (!admin.requiresPasswordChange) redirect("/admin/dashboard");
  return <InitialPasswordChange username={admin.username} email={admin.email} />;
}
