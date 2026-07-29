import Link from "next/link";
import { ExternalLink, FolderTree, Plus } from "lucide-react";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listTestimonials } from "../../../lib/server/testimonialsRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { TestimonialTable } from "../../_components/TestimonialTable";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const admin = await requireAdminPage("testimonials.read");
  const items = await listTestimonials();
  const canManage = admin.permissions.includes("testimonials.manage");
  const actions = (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/investor-experiences"
        target="_blank"
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"
      >
        <ExternalLink size={16} /> View public page
      </Link>
      {admin.permissions.includes("website.manage") ? (
        <Link
          href="/admin/website/navigation"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#1F4ED8]"
        >
          <FolderTree size={16} /> Edit website navigation
        </Link>
      ) : null}
      {canManage ? (
        <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white">
          <Plus size={17} /> Add testimonial
        </Link>
      ) : null}
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title="Investor testimonials"
        description="Manage genuine, consented investor experiences for the dedicated public page and optional website previews, without performance promises or unverified claims."
        actions={actions}
      />
      <TestimonialTable items={items} canManage={canManage} />
    </>
  );
}
