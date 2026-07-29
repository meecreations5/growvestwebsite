import Link from "next/link";
import { BookCheck, MessageCircle, MessageSquareWarning, MessageSquareText, Settings2 } from "lucide-react";
import { requireAdminPage } from "../../../lib/server/adminAuth";
import { getGuideSettings, getGuideSummary, listGuideConversations, listUnansweredGuideQuestions } from "../../../lib/server/growvestGuideRepository";
import { AdminPageHeader } from "../../_components/AdminPageHeader";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function GrowVestGuideAdminPage() {
  const admin = await requireAdminPage("guide.read");
  const [summary, settings, conversations, unanswered] = await Promise.all([
    getGuideSummary(),
    getGuideSettings(),
    admin.permissions.includes("guide.conversations") ? listGuideConversations({ limit: 6 }) : Promise.resolve([]),
    admin.permissions.includes("guide.conversations") ? listUnansweredGuideQuestions({ status: "open", limit: 6 }) : Promise.resolve([]),
  ]);

  const cards = [
    { label: "Published answers", value: summary.publishedKnowledge, icon: BookCheck, color: "#1F4ED8" },
    { label: "Guide conversations", value: summary.conversations, icon: MessageSquareText, color: "#6B7280" },
    { label: "Needs follow-up", value: summary.needsFollowUp, icon: MessageSquareWarning, color: "#E53935" },
    { label: "WhatsApp handoffs", value: summary.handoffs, icon: MessageCircle, color: "#14863E" },
  ];

  return (
    <>
      <AdminPageHeader
        title="GrowVest Guide"
        description="A controlled, approved-content assistant for website questions, unanswered-question capture and WhatsApp handoff."
        actions={admin.permissions.includes("guide.manage") ? <Link href="/admin/growvest-guide/settings" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white"><Settings2 size={17} /> Guide settings</Link> : null}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}14`, color }}><Icon size={20} /></div><p className="mt-5 font-serif text-4xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7280]">{label}</p></div>)}
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Public status</p><h2 className="mt-1 font-serif text-2xl font-bold">{settings.isEnabled !== false ? "GrowVest Guide is active" : "GrowVest Guide is disabled"}</h2><p className="mt-2 text-sm text-[#6B7280]">WhatsApp handoff is {settings.whatsappEnabled !== false ? "enabled" : "disabled"}. The Guide uses only published GrowVest answers and website content.</p></div>{admin.permissions.includes("guide.manage") ? <div className="flex flex-wrap gap-2"><Link href="/admin/growvest-guide/knowledge" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#1F4ED8]">Manage answers</Link><Link href="/admin/growvest-guide/settings" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#1F4ED8]">Configure Guide</Link></div> : null}</div>
      </div>

      {admin.permissions.includes("guide.conversations") ? <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-black/5 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">Recent conversations</h2><Link href="/admin/growvest-guide/conversations" className="text-sm font-semibold text-[#1F4ED8]">View all</Link></div><div className="divide-y divide-black/5">{conversations.map((item) => <Link key={item.id} href="/admin/growvest-guide/conversations" className="block px-5 py-4 transition hover:bg-[#F9FAFB]"><div className="flex items-center gap-2"><p className="line-clamp-1 flex-1 font-semibold">{item.lastQuestion || "Guide conversation"}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "needs_follow_up" ? "bg-red-50 text-red-700" : item.status === "handed_off" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#1F4ED8]"}`}>{String(item.status || "active").replaceAll("_", " ")}</span></div><p className="mt-1 line-clamp-2 text-sm text-[#6B7280]">{item.lastAnswer || "No answer recorded."}</p><p className="mt-2 text-[11px] text-[#6B7280]">{formatDate(item.lastMessageAt)}</p></Link>)}{!conversations.length ? <p className="px-5 py-12 text-center text-sm text-[#6B7280]">No Guide conversations yet.</p> : null}</div></section>
        <section className="rounded-2xl border border-black/5 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-black/5 px-5 py-4"><h2 className="font-serif text-xl font-bold">Unanswered questions</h2><Link href="/admin/growvest-guide/conversations" className="text-sm font-semibold text-[#1F4ED8]">Review</Link></div><div className="divide-y divide-black/5">{unanswered.map((item) => <div key={item.id} className="px-5 py-4"><p className="font-semibold">{item.question}</p><p className="mt-2 text-[11px] text-[#6B7280]">{formatDate(item.createdAt)} · {item.pageUrl || "Unknown page"}</p></div>)}{!unanswered.length ? <div className="px-5 py-12 text-center"><BookCheck size={28} className="mx-auto text-[#14863E]" /><p className="mt-3 text-sm font-semibold">No open unanswered questions.</p></div> : null}</div></section>
      </div> : null}
    </>
  );
}
