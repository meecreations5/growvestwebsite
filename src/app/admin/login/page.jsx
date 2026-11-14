import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/server/adminAuth";
import { AdminLogin } from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }) {
  const admin = await getAdminSession();
  if (admin) redirect(admin.requiresPasswordChange ? "/admin/change-password" : "/admin/dashboard");
  const query = await searchParams;
  return <AdminLogin passwordUpdated={query?.passwordUpdated === "1"} />;
}
