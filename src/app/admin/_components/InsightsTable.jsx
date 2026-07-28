"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Eye, History, Pencil, Search } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function InsightsTable({ items, status, search, page, total, pageSize, canArchive = false }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [query, setQuery] = useState(search || "");
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  function applyFilters(next = {}) {
    const params = new URLSearchParams();
    const nextStatus = next.status ?? status;
    const nextSearch = next.search ?? query;
    const nextPage = next.page ?? 1;
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextSearch) params.set("search", nextSearch);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/insights${params.toString() ? `?${params}` : ""}`);
  }

  async function archive(id) {
    if (!window.confirm("Archive this Insight? It will no longer appear publicly.")) return;
    setBusyId(id);
    const response = await fetch(`/api/admin/insights/${id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    setBusyId("");
    if (!response.ok) window.alert(result.error || "Unable to archive the Insight.");
    else router.refresh();
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-black/5 p-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={(event) => { event.preventDefault(); applyFilters({ search: query, page: 1 }); }} className="relative w-full max-w-md">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, excerpt or tag" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-[#1F4ED8]" />
        </form>
        <select value={status} onChange={(event) => applyFilters({ status: event.target.value, page: 1 })} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1F4ED8]">
          {['all','draft','in_review','changes_requested','approved','scheduled','published','archived'].map((value) => <option key={value} value={value}>{value === 'all' ? 'All statuses' : value.replaceAll('_',' ')}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4F6F9] text-[11px] uppercase tracking-[0.12em] text-[#6B7280]"><tr><th className="px-5 py-3">Insight</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Author</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-black/5">
            {items.map((post) => <tr key={post.id} className="hover:bg-[#F8FAFF]">
              <td className="max-w-xl px-5 py-4"><p className="font-semibold text-[#0B0B0F]">{post.title}</p><p className="mt-1 line-clamp-1 text-xs text-[#6B7280]">/{post.slug}</p></td>
              <td className="px-5 py-4"><StatusBadge status={post.status} /></td>
              <td className="px-5 py-4 text-[#6B7280]">{post.authorName || '—'}</td>
              <td className="whitespace-nowrap px-5 py-4 text-[#6B7280]">{post.updatedAt ? new Intl.DateTimeFormat('en-IN',{dateStyle:'medium'}).format(new Date(post.updatedAt)) : '—'}</td>
              <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={`/admin/insights/${post.id}/edit`} aria-label={`Edit ${post.title}`} className="rounded-lg border border-gray-200 p-2 text-[#1F4ED8] hover:bg-blue-50"><Pencil size={16}/></Link><Link href={`/admin/insights/${post.id}/preview`} target="_blank" aria-label={`Preview ${post.title}`} className="rounded-lg border border-gray-200 p-2 text-[#6B7280] hover:bg-gray-50"><Eye size={16}/></Link><Link href={`/admin/insights/${post.id}/history`} aria-label={`View history for ${post.title}`} className="rounded-lg border border-gray-200 p-2 text-[#6B7280] hover:bg-gray-50"><History size={16}/></Link>{canArchive && <button type="button" disabled={busyId===post.id || post.status==='archived'} onClick={() => archive(post.id)} aria-label={`Archive ${post.title}`} className="rounded-lg border border-gray-200 p-2 text-[#E53935] hover:bg-red-50 disabled:opacity-40"><Archive size={16}/></button>}</div></td>
            </tr>)}
            {!items.length && <tr><td colSpan="5" className="px-5 py-14 text-center text-[#6B7280]">No Insights match the selected filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-black/5 px-5 py-4 text-sm"><span className="text-[#6B7280]">{total} Insight{total===1?'':'s'}</span><div className="flex gap-2"><button disabled={page<=1} onClick={() => applyFilters({page:page-1})} className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40">Previous</button><span className="px-2 py-2 text-[#6B7280]">{page} / {pageCount}</span><button disabled={page>=pageCount} onClick={() => applyFilters({page:page+1})} className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40">Next</button></div></div>
    </div>
  );
}
