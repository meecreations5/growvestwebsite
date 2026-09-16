import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Home, LibraryBig, Navigation, Settings2 } from "lucide-react";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { getWebsiteContentSummary, listWebsitePages } from "../../../lib/server/websiteContentRepository";
import { getInsightsContentSummary } from "../../../lib/server/insightsRepository";
import { WebsiteSeedButton } from "../../_components/WebsiteSeedButton";

export const dynamic = "force-dynamic";

const modules = [
  { label: "Homepage", href: "/admin/website/home", icon: Home, description: "Hero, trust indicators, brand belief, vision, mission and final CTA." },
  { label: "About GrowVest", href: "/admin/website/about", icon: FileText, description: "Brand story, mission, vision and closing brand message." },
  { label: "Global Settings", href: "/admin/website/settings", icon: Settings2, description: "Verified company details, statistics, access links and disclosures." },
  { label: "Navigation & Footer", href: "/admin/website/navigation", icon: Navigation, description: "Header menus, submenu links, footer columns and legal links." },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, description: "Approved questions and answers shown on the public FAQ page." },
  { label: "Goal Library", href: "/admin/goal-library", icon: LibraryBig, description: "Goal guides, timelines, ranges, key steps and watch-outs." },
  { label: "Insights & Blog", href: "/admin/insights", icon: BookOpen, description: "Existing static Insights, articles, categories, tags, authors and publishing workflow." },
];

export default async function WebsiteContentPage() {
  await requireAdminPage("website.read");
  const [summary, insightsSummary, pages] = await Promise.all([getWebsiteContentSummary(), getInsightsContentSummary(), listWebsitePages()]);
  const hasContent = summary.configured && (summary.pages > 0 || summary.faqs > 0 || summary.goals > 0 || insightsSummary.posts > 0);
  return (
    <div className="space-y-7">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">GrowVest Website</p><h1 className="mt-2 font-serif text-4xl font-bold">Website content management</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">Manage approved public content inside the website project. Every save is validated on the server and pushed directly into the shared GrowVest Firestore database.</p></div>
      {!summary.configured ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">Firebase Admin is not available in this environment. Add the server-side Firebase credentials before pushing content to Firestore.</div> : null}
      <WebsiteSeedButton hasContent={hasContent} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{modules.map(({ label, href, icon: Icon, description }) => <Link key={href} href={href} className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1F4ED8]/25"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><Icon size={19} /></div><h2 className="mt-5 font-serif text-xl font-bold group-hover:text-[#1F4ED8]">{label}</h2><p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p></Link>)}</div>
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><h2 className="font-serif text-2xl font-bold">Database status</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{[
        ["Pages", summary.pages], ["FAQs", summary.faqs], ["Goals", summary.goals], ["Insights", insightsSummary.posts], ["Categories", insightsSummary.categories], ["Tags", insightsSummary.tags], ["Authors", insightsSummary.authors], ["Global settings", summary.settingsReady ? "Ready" : "Missing"], ["Navigation", summary.navigationReady ? "Ready" : "Missing"],
      ].map(([label, value]) => <div key={label} className="rounded-xl bg-[#F4F6F9] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">{label}</p><p className="mt-2 font-serif text-2xl font-bold text-[#0B0B0F]">{value}</p></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{pages.map((page) => <span key={page.pageKey} className={`rounded-full px-3 py-1.5 text-xs font-bold ${page.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{page.title}: {page.status}</span>)}</div></section>
    </div>
  );
}
