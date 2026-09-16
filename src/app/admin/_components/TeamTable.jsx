import Link from "next/link";
import { Pencil, Plus, UserRound } from "lucide-react";
import { TEAM_DEPARTMENTS } from "../../data/teamSocial";

function statusClasses(status) {
  if (status === "published") return "bg-emerald-50 text-emerald-700";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-amber-50 text-amber-700";
}

export function TeamTable({ items = [], canManage = false }) {
  const departmentMap = Object.fromEntries(TEAM_DEPARTMENTS.map((item) => [item.value, item.label]));
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-4"><div><h2 className="font-serif text-xl font-bold">Team directory</h2><p className="mt-1 text-xs text-[#6B7280]">{items.length} profile{items.length === 1 ? "" : "s"}</p></div>{canManage ? <Link href="/admin/team/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1F4ED8] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add team member</Link> : null}</div>
      <div className="divide-y divide-black/5">
        {items.map((item) => (
          <div key={item.id} className="grid gap-4 px-5 py-4 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#E9EDF5]">{item.photo?.url ? <img src={item.photo.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${item.photo.focalX ?? 50}% ${item.photo.focalY ?? 50}%` }} /> : <div className="flex h-full items-center justify-center text-[#1F4ED8]"><UserRound size={24} /></div>}</div>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-[#0B0B0F]">{item.fullName}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusClasses(item.status)}`}>{item.status}</span>{item.isVisible === false ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">Hidden</span> : null}</div><p className="mt-1 text-sm text-[#6B7280]">{item.designation}</p><p className="mt-1 text-xs text-[#6B7280]">{departmentMap[item.department] || item.department} · Level {item.hierarchyLevel || 1} · Order {item.displayOrder || 0}</p></div>
            {canManage ? <Link href={`/admin/team/${item.id}/edit`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-bold text-[#1F4ED8] hover:bg-blue-50"><Pencil size={15} /> Edit</Link> : null}
          </div>
        ))}
        {!items.length ? <div className="px-5 py-16 text-center"><UserRound size={28} className="mx-auto text-[#6B7280]" /><h3 className="mt-4 font-serif text-2xl font-bold">No team profiles yet.</h3><p className="mt-2 text-sm text-[#6B7280]">Add verified team members when their public profile details are ready.</p></div> : null}
      </div>
    </div>
  );
}
