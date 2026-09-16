import Link from "next/link";
import { MessageSquareQuote, Pencil, Plus, ShieldCheck, UserRound } from "lucide-react";
import { TESTIMONIAL_JOURNEY_TYPES } from "../../data/testimonials";

function statusClasses(status) {
  if (status === "published") return "bg-emerald-50 text-emerald-700";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-amber-50 text-amber-700";
}

export function TestimonialTable({ items = [], canManage = false }) {
  const journeyMap = Object.fromEntries(TESTIMONIAL_JOURNEY_TYPES.map((item) => [item.value, item.label]));
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold">Investor testimonial library</h2>
          <p className="mt-1 text-xs text-[#6B7280]">{items.length} record{items.length === 1 ? "" : "s"}</p>
        </div>
        {canManage ? (
          <Link href="/admin/testimonials/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-4 py-2.5 text-sm font-bold text-white">
            <Plus size={16} /> Add testimonial
          </Link>
        ) : null}
      </div>

      <div className="divide-y divide-black/5">
        {items.map((item) => (
          <div key={item.id} className="grid gap-4 px-5 py-4 md:grid-cols-[64px_minmax(0,1fr)_auto] md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#E9EDF5]">
              {item.photo?.url && !item.useInitials ? (
                <img src={item.photo.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${item.photo.focalX ?? 50}% ${item.photo.focalY ?? 50}%` }} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-[#1F4ED8]">{item.initials || <UserRound size={22} />}</div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0B0B0F]">{item.displayName}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusClasses(item.status)}`}>{item.status}</span>
                {item.isFeatured ? <span className="rounded-full bg-[#F5B301]/15 px-2 py-0.5 text-[10px] font-bold text-[#8A6500]">Featured</span> : null}
                {item.consentConfirmed ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><ShieldCheck size={11} /> Consent recorded</span> : <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">Consent pending</span>}
              </div>
              <p className="mt-1 text-sm text-[#6B7280]">{journeyMap[item.journeyType] || item.journeyType}{item.city ? ` · ${item.city}` : ""}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4B5563]">“{item.shortQuote || item.quote}”</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
                {item.showOnHomepage ? <span>Homepage</span> : null}
                {item.showOnInsights ? <span>Insights</span> : null}
                {item.showOnAbout ? <span>About</span> : null}
                <span>Order {item.displayOrder || 0}</span>
              </div>
            </div>

            {canManage ? (
              <Link href={`/admin/testimonials/${item.id}/edit`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-bold text-[#1F4ED8] hover:bg-blue-50">
                <Pencil size={15} /> Edit
              </Link>
            ) : null}
          </div>
        ))}

        {!items.length ? (
          <div className="px-5 py-16 text-center">
            <MessageSquareQuote size={30} className="mx-auto text-[#6B7280]" />
            <h3 className="mt-4 font-serif text-2xl font-bold">No investor testimonials yet.</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#6B7280]">Add only genuine investor experiences with written consent. The public section stays hidden until an approved testimonial is published.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
