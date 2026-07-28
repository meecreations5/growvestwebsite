import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/server/adminAuth";
import { AdminLogin } from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/admin/dashboard");
  return <AdminLogin />;
}
