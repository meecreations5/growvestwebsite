const styles = {
  draft: "bg-gray-100 text-gray-700",
  in_review: "bg-amber-100 text-amber-800",
  changes_requested: "bg-red-100 text-red-700",
  approved: "bg-blue-100 text-blue-800",
  scheduled: "bg-violet-100 text-violet-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${styles[status] || styles.draft}`}>{String(status || "draft").replaceAll("_", " ")}</span>;
}
