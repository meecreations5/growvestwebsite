import Link from "next/link";
import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listWebsitePages } from "../../../../lib/server/websiteContentRepository";
import { SITE_PAGES } from "../../../../lib/sitePages";

export const dynamic = "force-dynamic";

export default async function WebsitePagesDirectory() {
  await requireAdminPage("website.page.manage");
  const saved = await listWebsitePages();
  const byKey = new Map(saved.map((item) => [item.pageKey, item]));
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-widest text-[#1F4ED8]">Content & SEO</p><h1 className="mt-2 font-serif text-4xl font-bold">All public website pages</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">Manage SEO metadata, indexability, a supporting content section and page-specific FAQ questions and answers for every fixed public page. Homepage and About have additional detailed content editors.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{SITE_PAGES.map((page) => {
      const item = byKey.get(page.key);
      const livePageFaqs = (item?.content?.pageFaqs || []).filter((faq) => faq.status === "published" && faq.isVisible !== false && faq.question?.trim() && faq.answer?.trim()).length;
      return <Link key={page.key} href={`/admin/website/pages/${page.key}`} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-[#1F4ED8]/40"><div className="flex items-center justify-between gap-2"><h2 className="font-serif text-xl font-bold">{page.label}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item?.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{item?.status || "fallback"}</span></div><p className="mt-3 break-all text-xs text-[#64748B]">{page.path}</p><p className="mt-2 text-xs font-semibold text-[#475569]">{page.key === "faqs" ? "Full FAQ directory" : `${livePageFaqs} page FAQs published`}{page.key === "thank-you" ? " · noindex" : ""}</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Edit SEO & page FAQs</p></Link>;
    })}</div>
  </div>;
}
