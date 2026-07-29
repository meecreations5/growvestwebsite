import Link from "next/link";
import { BookOpen, Bot, CalendarClock, CircleCheck, FilePenLine, Inbox, MessageSquareQuote, Network, PanelsTopLeft, Plus, Share2 } from "lucide-react";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { listInsights } from "../../../lib/server/insightsRepository";
import { listEnquiries } from "../../../lib/server/enquiriesRepository";
import { listSocialLinks, listTeamMembers } from "../../../lib/server/teamSocialRepository";
import { getWebsiteContentSummary } from "../../../lib/server/websiteContentRepository";
import { getGuideSummary } from "../../../lib/server/growvestGuideRepository";
import { getTestimonialsSummary } from "../../../lib/server/testimonialsRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { StatusBadge } from "../../_components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdminPage("insights.read");
  const [{ items, total }, teamMembers, socialLinks, websiteSummary, enquiriesSummary, guideSummary, testimonialsSummary] = await Promise.all([
    listInsights({ pageSize: 100 }),
    admin.permissions.includes("team.read") ? listTeamMembers() : Promise.resolve([]),
    admin.permissions.includes("social.read") ? listSocialLinks() : Promise.resolve([]),
    admin.permissions.includes("website.read") ? getWebsiteContentSummary() : Promise.resolve(null),
    admin.permissions.includes("enquiries.read") ? listEnquiries({ pageSize: 10 }) : Promise.resolve(null),
    admin.permissions.includes("guide.read") ? getGuideSummary() : Promise.resolve(null),
    admin.permissions.includes("testimonials.read") ? getTestimonialsSummary() : Promise.resolve(null),
  ]);
  const counts = items.reduce((acc, post) => ({ ...acc, [post.status]: (acc[post.status] || 0) + 1 }), {});
  const cards = [
    { label: "Total Insights", value: total, icon: BookOpen, color: "#1F4ED8" },
    { label: "Drafts", value: counts.draft || 0, icon: FilePenLine, color: "#6B7280" },
    { label: "Awaiting Review", value: counts.in_review || 0, icon: CalendarClock, color: "#F5B301" },
    { label: "Published", value: counts.published || 0, icon: CircleCheck, color: "#16A34A" },
  ];
  const actions = admin.permissions.includes("insights.create") ? (
    <Link href="/admin/insights/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white"><Plus size={17}/> Add Insight</Link>
  ) : null;
  return <>
    <AdminPageHeader title="Editorial dashboard" description="A clear view of GrowVest Insights from first draft to published educational content." actions={actions} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({label,value,icon:Icon,color}) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:`${color}14`,color}}><Icon size={20}/></div><p className="mt-5 font-serif text-4xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7280]">{label}</p></div>)}</div>
    <div className="mt-7 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl font-bold">Recently updated</h2><Link href="/admin/insights" className="text-sm font-semibold text-[#1F4ED8]">View all</Link></div><div className="divide-y divide-black/5">{items.slice(0,6).map(post => <div key={post.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{post.title}</p><p className="mt-1 text-xs text-[#6B7280]">{post.authorName || "GrowVest Editorial Team"}</p></div><div className="flex items-center gap-3"><StatusBadge status={post.status}/><Link href={`/admin/insights/${post.id}/edit`} className="text-sm font-semibold text-[#1F4ED8]">Edit</Link></div></div>)}</div></div>
    {(admin.permissions.includes("guide.read") || admin.permissions.includes("enquiries.read") || admin.permissions.includes("website.read") || admin.permissions.includes("team.read") || admin.permissions.includes("testimonials.read") || admin.permissions.includes("social.read")) ? <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{admin.permissions.includes("guide.read") && guideSummary ? <Link href="/admin/growvest-guide" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><Bot size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{guideSummary.unanswered || 0}</p><p className="mt-1 text-sm text-[#6B7280]">Unanswered Guide questions</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Open GrowVest Guide →</p></Link> : null}{admin.permissions.includes("enquiries.read") && enquiriesSummary ? <Link href="/admin/enquiries" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E53935]/10 text-[#E53935]"><Inbox size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{enquiriesSummary.stats?.new || 0}</p><p className="mt-1 text-sm text-[#6B7280]">New enquiries</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Open lead workspace →</p></Link> : null}{admin.permissions.includes("website.read") && websiteSummary ? <Link href="/admin/website" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><PanelsTopLeft size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{websiteSummary.pages + websiteSummary.faqs + websiteSummary.goals}</p><p className="mt-1 text-sm text-[#6B7280]">Managed website records</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Manage website content →</p></Link> : null}{admin.permissions.includes("team.read") ? <Link href="/admin/team" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><Network size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{teamMembers.length}</p><p className="mt-1 text-sm text-[#6B7280]">Team profiles</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Manage hierarchy →</p></Link> : null}{admin.permissions.includes("testimonials.read") && testimonialsSummary ? <Link href="/admin/testimonials" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5B301]/15 text-[#8A6500]"><MessageSquareQuote size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{testimonialsSummary.published || 0}</p><p className="mt-1 text-sm text-[#6B7280]">Published testimonials</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Manage investor experiences →</p></Link> : null}{admin.permissions.includes("social.read") ? <Link href="/admin/social-media" className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5B301]/12 text-[#9A7000]"><Share2 size={20}/></div><p className="mt-5 font-serif text-3xl font-bold">{socialLinks.filter((item) => item.isVisible !== false).length}</p><p className="mt-1 text-sm text-[#6B7280]">Active social channels</p><p className="mt-4 text-sm font-semibold text-[#1F4ED8]">Manage connections →</p></Link> : null}</div> : null}
  </>;
}
