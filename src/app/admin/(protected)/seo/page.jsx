import Link from "next/link";
import { CheckCircle2, CircleAlert, ExternalLink, FileSearch, Network, Rss, SearchCheck } from "lucide-react";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { SEO_PAGES, SITE_URL, absoluteUrl } from "../../../lib/seo";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listInsights } from "../../../lib/server/insightsRepository";
import { getPublishedFaqs, getPublishedWebsitePage } from "../../../lib/server/websiteContentRepository";
import { SITE_PAGES } from "../../../lib/sitePages";

export const dynamic = "force-dynamic";

function scoreLength(length, min, max) {
  if (!length) return { label: "Missing", tone: "red" };
  if (length < min) return { label: "Short", tone: "amber" };
  if (length > max) return { label: "Long", tone: "amber" };
  return { label: "Good", tone: "green" };
}

function Badge({ tone = "gray", children }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-[#1F4ED8]",
    gray: "bg-gray-100 text-[#6B7280]",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[tone]}`}>{children}</span>;
}

function StatusCard({ title, ready, description }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {ready ? <CheckCircle2 className="mt-0.5 text-emerald-600" size={20} /> : <CircleAlert className="mt-0.5 text-amber-600" size={20} />}
        <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-[#6B7280]">{description}</p></div>
      </div>
    </div>
  );
}

export default async function SeoCentrePage() {
  const admin = await requireAdminPage("seo.read");
  const [{ items: insights }, pages, faqs] = await Promise.all([
    listInsights({ pageSize: 300 }),
    Promise.all(SITE_PAGES.map(async (page) => [page.key, await getPublishedWebsitePage(page.key)])),
    getPublishedFaqs(),
  ]);
  const managedByKey = new Map(pages);
  const pageRows = SITE_PAGES.map(({ path, key }) => {
    const defaults = SEO_PAGES[path] || {
      title: "Thank You | GrowVest",
      description: "Your enquiry has been submitted to GrowVest.",
    };
    const page = managedByKey.get(key);
    const override = page?.seo || {};
    const rawTitle = override.title || defaults.title;
    const finalTitle = /growvest/i.test(rawTitle) ? rawTitle : path === "/" ? `GrowVest | ${rawTitle}` : `${rawTitle} | GrowVest`;
    const description = override.description || defaults.description;
    const pageFaqs = (page?.content?.pageFaqs || []).filter((faq) => faq.status === "published" && faq.isVisible !== false && faq.question?.trim() && faq.answer?.trim());
    const sharedFaqs = faqs.filter((faq) => faq.status === "published" && faq.isVisible !== false && (faq.pageKeys || []).includes(key));
    const faqCount = key === "faqs" ? faqs.length : page?.content?.faqSection?.enabled === false ? 0 : new Set([...pageFaqs, ...sharedFaqs].map((faq) => faq.question?.trim().toLowerCase()).filter(Boolean)).size;
    return {
      path, key,
      title: finalTitle,
      titleScore: scoreLength(finalTitle.length, 30, 65),
      description,
      descriptionScore: scoreLength(description.length, 120, 170),
      indexable: path !== "/thank-you" && override.allowIndexing !== false,
      faqCount,
    };
  });

  const publishedInsights = insights.filter((item) => item.status === "published");
  const insightIssues = {
    noindex: publishedInsights.filter((item) => item.seo?.allowIndexing === false).length,
    missingTitle: publishedInsights.filter((item) => !(item.seo?.title || item.title)).length,
    missingDescription: publishedInsights.filter((item) => !(item.seo?.description || item.excerpt)).length,
    missingImageAlt: publishedInsights.filter((item) => item.featuredImage?.url && !item.featuredImage?.altText).length,
  };
  const staticIssues = pageRows.filter((row) => row.path !== "/thank-you" && (row.titleScore.tone !== "green" || row.descriptionScore.tone !== "green" || !row.indexable)).length;
  const totalIssues = staticIssues + Object.values(insightIssues).reduce((sum, value) => sum + value, 0);
  const indexingEnabled = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const productionUrlReady = SITE_URL === "https://growvest.info";
  const googleVerificationReady = Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);

  const actions = (
    <>
      {admin.permissions.includes("website.page.manage") ? <Link href="/admin/website/pages" className="inline-flex h-11 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold">Manage All Pages</Link> : null}
      <Link href="/admin/insights" className="inline-flex h-11 items-center rounded-xl bg-[#1F4ED8] px-4 text-sm font-bold text-white">Review Insights SEO</Link>
    </>
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Search Visibility"
        title="SEO Centre"
        description="Review and edit metadata for every public page, check page-specific FAQ coverage and monitor published Insight readiness."
        actions={actions}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><SearchCheck size={20} className="text-[#1F4ED8]" /><p className="mt-4 font-serif text-3xl font-bold">{pageRows.length}</p><p className="mt-1 text-sm text-[#6B7280]">Managed public routes configured</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><FileSearch size={20} className="text-[#1F4ED8]" /><p className="mt-4 font-serif text-3xl font-bold">{publishedInsights.length}</p><p className="mt-1 text-sm text-[#6B7280]">Published Insights reviewed</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><CircleAlert size={20} className={totalIssues ? "text-amber-600" : "text-emerald-600"} /><p className="mt-4 font-serif text-3xl font-bold">{totalIssues}</p><p className="mt-1 text-sm text-[#6B7280]">Items needing SEO attention</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><Network size={20} className="text-[#1F4ED8]" /><p className="mt-4 font-serif text-3xl font-bold">{indexingEnabled ? "Live" : "Blocked"}</p><p className="mt-1 text-sm text-[#6B7280]">Production indexing status</p></div>
      </div>

      <section className="mt-7">
        <h2 className="font-serif text-2xl font-bold">Technical search configuration</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatusCard title="Production indexing" ready={indexingEnabled} description={indexingEnabled ? "Robots metadata and sitemap are enabled for search engines." : "Set NEXT_PUBLIC_ALLOW_INDEXING=true only in the production environment."} />
          <StatusCard title="Canonical production URL" ready={productionUrlReady} description={`Current canonical base: ${SITE_URL}`} />
          <StatusCard title="Google Search Console verification" ready={googleVerificationReady} description={googleVerificationReady ? "A Google verification token is configured." : "Add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in production after creating the Search Console property."} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={absoluteUrl("/sitemap.xml")} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold"><Network size={16} /> Sitemap <ExternalLink size={14} /></a>
          <a href={absoluteUrl("/robots.txt")} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold"><FileSearch size={16} /> Robots.txt <ExternalLink size={14} /></a>
          <a href={absoluteUrl("/insights/feed.xml")} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold"><Rss size={16} /> Insights RSS <ExternalLink size={14} /></a>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6"><h2 className="font-serif text-2xl font-bold">Public page snippets</h2><p className="mt-1 text-sm text-[#6B7280]">Length checks are guidance, not guarantees. Search engines may rewrite titles and snippets.</p></div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#6B7280]"><tr><th className="px-5 py-3">Page</th><th className="px-5 py-3">Search title</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Indexing</th><th className="px-5 py-3">FAQs</th><th className="px-5 py-3">Manage</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((row) => (
                <tr key={row.path}>
                  <td className="px-5 py-4"><a href={absoluteUrl(row.path)} target="_blank" rel="noreferrer noopener" className="font-bold text-[#1F4ED8]">{row.path}</a></td>
                  <td className="max-w-[360px] px-5 py-4"><p className="font-medium">{row.title}</p><div className="mt-2 flex items-center gap-2"><Badge tone={row.titleScore.tone}>{row.titleScore.label}</Badge><span className="text-xs text-[#6B7280]">{row.title.length} characters</span></div></td>
                  <td className="max-w-[440px] px-5 py-4"><p className="line-clamp-3 text-[#6B7280]">{row.description}</p><div className="mt-2 flex items-center gap-2"><Badge tone={row.descriptionScore.tone}>{row.descriptionScore.label}</Badge><span className="text-xs text-[#6B7280]">{row.description.length} characters</span></div></td>
                  <td className="px-5 py-4"><Badge tone={row.indexable ? "green" : "red"}>{row.indexable ? "Index" : "Noindex"}</Badge></td>
                  <td className="px-5 py-4"><Badge tone="gray">{row.faqCount} published</Badge></td>
                  <td className="px-5 py-4">{admin.permissions.includes("website.page.manage") ? <Link href={`/admin/website/pages/${row.key}`} className="font-semibold text-[#1F4ED8]">Edit</Link> : <span className="text-[#94A3B8]">Read only</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div><h2 className="font-serif text-2xl font-bold">Insight SEO</h2><p className="mt-2 text-sm text-[#64748B]">The SEO Team can update an Insight's search metadata without changing its publishing approval, article body or status. Article FAQs can be added as FAQ blocks in the editorial draft workflow.</p></div>
        <div className="mt-5 divide-y divide-gray-100">{publishedInsights.slice(0, 40).map((post) => <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-sm font-semibold text-[#0B0B0F]">{post.title}</p><p className="mt-1 text-xs text-[#64748B]">/insights/{post.slug}</p></div>{admin.permissions.includes("seo.manage") ? <Link href={`/admin/seo/insights/${post.id}`} className="text-sm font-semibold text-[#1F4ED8]">Edit metadata</Link> : <span className="text-xs text-[#94A3B8]">Read only</span>}</div>)}{!publishedInsights.length ? <p className="py-6 text-sm text-[#64748B]">There are no published Insights to review yet.</p> : null}</div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Published Insights marked noindex" ready={insightIssues.noindex === 0} description={`${insightIssues.noindex} published record(s) are excluded from indexing.`} />
        <StatusCard title="Insight search titles" ready={insightIssues.missingTitle === 0} description={`${insightIssues.missingTitle} published record(s) are missing a usable title.`} />
        <StatusCard title="Insight meta descriptions" ready={insightIssues.missingDescription === 0} description={`${insightIssues.missingDescription} published record(s) are missing a usable description.`} />
        <StatusCard title="Featured-image alternative text" ready={insightIssues.missingImageAlt === 0} description={`${insightIssues.missingImageAlt} published record(s) use an image without alternative text.`} />
      </section>
    </>
  );
}
