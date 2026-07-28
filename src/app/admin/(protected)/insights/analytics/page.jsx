import Link from "next/link";
import { BarChart3, Eye, MousePointerClick, Share2 } from "lucide-react";
import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listInsightMetrics } from "../../../../lib/server/insightMetrics";
import { listInsights } from "../../../../lib/server/insightsRepository";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function InsightsAnalyticsPage() {
  await requireAdminPage("insights.analytics");
  const [{ items: posts }, metrics] = await Promise.all([
    listInsights({ pageSize: 300 }),
    listInsightMetrics(300),
  ]);
  const metricMap = Object.fromEntries(metrics.map((item) => [item.id, item]));
  const rows = posts.map((post) => ({
    post,
    views: Number(metricMap[post.id]?.views || 0),
    ctaClicks: Number(metricMap[post.id]?.ctaClicks || 0),
    shares: Number(metricMap[post.id]?.shares || 0),
  })).sort((a, b) => b.views - a.views);
  const totals = rows.reduce((acc, row) => ({ views: acc.views + row.views, ctaClicks: acc.ctaClicks + row.ctaClicks, shares: acc.shares + row.shares }), { views: 0, ctaClicks: 0, shares: 0 });
  const cards = [
    { label: "Consent-based views", value: totals.views, icon: Eye, color: "#1F4ED8" },
    { label: "Journey CTA clicks", value: totals.ctaClicks, icon: MousePointerClick, color: "#F5B301" },
    { label: "Insight shares", value: totals.shares, icon: Share2, color: "#16A34A" },
    { label: "CTA conversion", value: totals.views ? `${((totals.ctaClicks / totals.views) * 100).toFixed(1)}%` : "0%", icon: BarChart3, color: "#6B7280" },
  ];

  return (
    <>
      <AdminPageHeader title="Insight Analytics" description="A privacy-conscious view of article engagement recorded only after visitors accept analytics consent." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}14`, color }}><Icon size={20} /></div><p className="mt-5 font-serif text-4xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6B7280]">{label}</p></div>)}</div>
      <section className="mt-7 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-black/5 p-5"><h2 className="font-serif text-2xl font-bold">Performance by Insight</h2><p className="mt-1 text-sm text-[#6B7280]">Counts are directional and will be lower than total traffic when visitors decline analytics.</p></div>
        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-[#F4F6F9] text-[11px] uppercase tracking-[0.12em] text-[#6B7280]"><tr><th className="px-5 py-3">Insight</th><th className="px-5 py-3 text-right">Views</th><th className="px-5 py-3 text-right">CTA clicks</th><th className="px-5 py-3 text-right">Shares</th><th className="px-5 py-3 text-right">Conversion</th></tr></thead><tbody className="divide-y divide-black/5">{rows.map(({ post, views, ctaClicks, shares }) => <tr key={post.id}><td className="max-w-xl px-5 py-4"><Link href={`/admin/insights/${post.id}/edit`} className="font-semibold hover:text-[#1F4ED8]">{post.title}</Link><p className="mt-1 text-xs text-[#6B7280]">{post.status.replaceAll("_", " ")}</p></td><td className="px-5 py-4 text-right font-semibold">{views}</td><td className="px-5 py-4 text-right">{ctaClicks}</td><td className="px-5 py-4 text-right">{shares}</td><td className="px-5 py-4 text-right">{views ? `${((ctaClicks / views) * 100).toFixed(1)}%` : "—"}</td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
