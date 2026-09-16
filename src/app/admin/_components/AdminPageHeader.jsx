export function AdminPageHeader({ eyebrow = "Insights & Blog", title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">{eyebrow}</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p>}</div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
