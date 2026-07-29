"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  FolderTree,
  Link2,
  LoaderCircle,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

const INVESTOR_EXPERIENCES_LINK = {
  label: "Investor Experiences",
  path: "/investor-experiences",
};

function normaliseLink(item = {}) {
  return {
    label: String(item.label || ""),
    path: String(item.path || item.href || ""),
  };
}

function normaliseNavigation(item = {}) {
  return {
    key: "primary",
    status: item.status || "published",
    homeLabel: item.homeLabel || "Home",
    investorPortalLabel: item.investorPortalLabel || "Investor Portal",
    headerPrimaryCta: {
      label: item.headerPrimaryCta?.label || "Begin Your Journey",
      href: item.headerPrimaryCta?.href || item.headerPrimaryCta?.path || "/contact",
    },
    groups: Array.isArray(item.groups)
      ? item.groups.map((group, index) => ({
          label: group.label || `Menu Group ${index + 1}`,
          eyebrow: group.eyebrow || "",
          displayOrder: Number.isFinite(group.displayOrder) ? group.displayOrder : index,
          children: Array.isArray(group.children) ? group.children.map(normaliseLink) : [],
        }))
      : [],
    footerColumns: Array.isArray(item.footerColumns)
      ? item.footerColumns.map((column) => ({
          heading: column.heading || "Footer Column",
          links: Array.isArray(column.links) ? column.links.map(normaliseLink) : [],
        }))
      : [],
    legalLinks: Array.isArray(item.legalLinks) ? item.legalLinks.map(normaliseLink) : [],
  };
}

function moveItem(items, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function LinkRows({ links = [], onChange, addLabel = "Add link" }) {
  function update(index, changes) {
    onChange(links.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)));
  }

  function remove(index) {
    onChange(links.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-3">
      {links.map((item, index) => (
        <div key={`${item.label}-${item.path}-${index}`} className="grid gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFBFD] p-3 md:grid-cols-[1fr_1.15fr_auto] md:items-center">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Label</label>
            <input
              value={item.label}
              onChange={(event) => update(index, { label: event.target.value })}
              placeholder="Menu label"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Destination</label>
            <div className="relative">
              <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={item.path}
                onChange={(event) => update(index, { path: event.target.value })}
                placeholder="/page-path"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 self-end md:self-center">
            <button type="button" onClick={() => onChange(moveItem(links, index, -1))} disabled={index === 0} aria-label="Move link up" className="rounded-lg border border-gray-200 bg-white p-2 text-[#6B7280] transition hover:text-[#1F4ED8] disabled:opacity-30">
              <ArrowUp size={14} />
            </button>
            <button type="button" onClick={() => onChange(moveItem(links, index, 1))} disabled={index === links.length - 1} aria-label="Move link down" className="rounded-lg border border-gray-200 bg-white p-2 text-[#6B7280] transition hover:text-[#1F4ED8] disabled:opacity-30">
              <ArrowDown size={14} />
            </button>
            <button type="button" onClick={() => remove(index)} aria-label="Remove link" className="rounded-lg border border-red-100 bg-white p-2 text-red-500 transition hover:bg-red-50">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...links, { label: "New Link", path: "/" }])}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#BFCBE8] bg-[#F7F9FF] px-3.5 py-2.5 text-xs font-extrabold text-[#1F4ED8] transition hover:border-[#1F4ED8]/50 hover:bg-[#EEF3FF]"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export function WebsiteNavigationEditor({ initialItem }) {
  const [form, setForm] = useState(() => normaliseNavigation(initialItem));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const hasInvestorExperiences = useMemo(
    () => form.groups.some((group) => group.children.some((item) => item.path === INVESTOR_EXPERIENCES_LINK.path)),
    [form.groups],
  );

  function setFormDirty(updater) {
    setDirty(true);
    setMessage("");
    setError("");
    setForm(updater);
  }

  function updateGroup(index, changes) {
    setFormDirty((current) => ({
      ...current,
      groups: current.groups.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
    }));
  }

  function updateFooter(index, changes) {
    setFormDirty((current) => ({
      ...current,
      footerColumns: current.footerColumns.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
    }));
  }

  function addInvestorExperiences() {
    setFormDirty((current) => {
      let groups = current.groups.map((group) => ({ ...group, children: [...group.children] }));
      let footerColumns = current.footerColumns.map((column) => ({ ...column, links: [...column.links] }));

      if (!groups.some((group) => group.children.some((item) => item.path === INVESTOR_EXPERIENCES_LINK.path))) {
        let groupIndex = groups.findIndex((group) => group.label.toLowerCase().includes("who we help"));
        if (groupIndex < 0) {
          groups.push({ label: "Who We Help", eyebrow: "Guidance around your life", children: [], displayOrder: groups.length });
          groupIndex = groups.length - 1;
        }
        groups[groupIndex].children.push({ ...INVESTOR_EXPERIENCES_LINK });
      }

      if (!footerColumns.some((column) => column.links.some((item) => item.path === INVESTOR_EXPERIENCES_LINK.path))) {
        let footerIndex = footerColumns.findIndex((column) => column.heading.toLowerCase().includes("who we help"));
        if (footerIndex < 0) {
          footerColumns.push({ heading: "Who We Help", links: [] });
          footerIndex = footerColumns.length - 1;
        }
        footerColumns[footerIndex].links.push({ ...INVESTOR_EXPERIENCES_LINK });
      }

      return { ...current, groups, footerColumns };
    });
    setMessage("Investor Experiences was added to the editable header and footer. Save to publish the change.");
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        groups: form.groups.map((group, index) => ({ ...group, displayOrder: index })),
        status: "published",
      };
      const response = await fetch("/api/admin/website/navigation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save navigation.");
      setForm(normaliseNavigation(result.item));
      setDirty(false);
      setMessage("Header and footer navigation were published to Firestore.");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save navigation.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 rounded-[24px] border border-[#DDE4F2] bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Content</p>
            {dirty ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700">Unsaved changes</span> : null}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Navigation and footer</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Edit every menu label and destination directly. Changes are published to the shared Firestore navigation record.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-[#1F4ED8]">
            <ExternalLink size={15} /> Preview website
          </Link>
          <button type="submit" disabled={busy || !dirty} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(31,78,216,.18)] disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save to database
          </button>
        </div>
      </div>

      {!hasInvestorExperiences ? (
        <section className="rounded-[22px] border border-[#F1D88C] bg-[#FFF9E9] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5B301]/15 text-[#B47E00]"><Sparkles size={18} /></span>
              <div>
                <h2 className="text-sm font-extrabold text-[#0B0B0F]">Investor Experiences is not in the current database navigation.</h2>
                <p className="mt-1 text-xs leading-6 text-[#6B7280]">Add the dedicated page to the Who We Help header group and footer, then save.</p>
              </div>
            </div>
            <button type="button" onClick={addInvestorExperiences} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0B0B0F] px-4 text-xs font-extrabold text-white">
              <Plus size={14} /> Add Investor Experiences
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="inline-flex items-center gap-2 font-bold"><CheckCircle2 size={16} /> Investor Experiences is included in the editable website navigation.</span>
        </section>
      )}

      <section className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#1F4ED8]"><Link2 size={18} /></span>
          <div><h2 className="font-serif text-2xl font-bold">Header actions</h2><p className="mt-1 text-xs text-[#6B7280]">Control the fixed header labels and main journey button.</p></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><label className="mb-2 block text-sm font-semibold">Home label</label><input value={form.homeLabel} onChange={(event) => setFormDirty((current) => ({ ...current, homeLabel: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10" /></div>
          <div><label className="mb-2 block text-sm font-semibold">Investor Portal label</label><input value={form.investorPortalLabel} onChange={(event) => setFormDirty((current) => ({ ...current, investorPortalLabel: event.target.value }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10" /></div>
          <div><label className="mb-2 block text-sm font-semibold">Primary CTA label</label><input value={form.headerPrimaryCta.label} onChange={(event) => setFormDirty((current) => ({ ...current, headerPrimaryCta: { ...current.headerPrimaryCta, label: event.target.value } }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10" /></div>
          <div><label className="mb-2 block text-sm font-semibold">Primary CTA link</label><input value={form.headerPrimaryCta.href} onChange={(event) => setFormDirty((current) => ({ ...current, headerPrimaryCta: { ...current.headerPrimaryCta, href: event.target.value } }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/10" /></div>
        </div>
      </section>

      <section className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#1F4ED8]"><FolderTree size={18} /></span>
            <div><h2 className="font-serif text-2xl font-bold">Header menu groups</h2><p className="mt-1 text-xs text-[#6B7280]">Edit grouped menu links visually—no pipe-separated text is required.</p></div>
          </div>
          <button type="button" onClick={() => setFormDirty((current) => ({ ...current, groups: [...current.groups, { label: "New Group", eyebrow: "", children: [], displayOrder: current.groups.length }] }))} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-bold text-[#1F4ED8]"><Plus size={15} /> Add group</button>
        </div>

        <div className="mt-5 space-y-4">
          {form.groups.map((group, index) => (
            <article key={`${group.label}-${index}`} className="rounded-[20px] border border-[#DDE4F2] bg-[#FCFCFD] p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Group label</label><input value={group.label} onChange={(event) => updateGroup(index, { label: event.target.value })} className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#1F4ED8]" /></div>
                  <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Dropdown eyebrow</label><input value={group.eyebrow || ""} onChange={(event) => updateGroup(index, { eyebrow: event.target.value })} className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1F4ED8]" /></div>
                </div>
                <div className="flex items-center gap-1 self-end lg:self-start">
                  <button type="button" onClick={() => setFormDirty((current) => ({ ...current, groups: moveItem(current.groups, index, -1) }))} disabled={index === 0} aria-label="Move group up" className="rounded-lg border border-gray-200 bg-white p-2 text-[#6B7280] disabled:opacity-30"><ArrowUp size={15} /></button>
                  <button type="button" onClick={() => setFormDirty((current) => ({ ...current, groups: moveItem(current.groups, index, 1) }))} disabled={index === form.groups.length - 1} aria-label="Move group down" className="rounded-lg border border-gray-200 bg-white p-2 text-[#6B7280] disabled:opacity-30"><ArrowDown size={15} /></button>
                  <button type="button" onClick={() => setFormDirty((current) => ({ ...current, groups: current.groups.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Delete group" className="rounded-lg border border-red-100 bg-white p-2 text-red-500"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="mt-4 border-t border-[#E5E7EB] pt-4">
                <p className="mb-3 text-xs font-extrabold text-[#0B0B0F]">Dropdown links</p>
                <LinkRows links={group.children} onChange={(children) => updateGroup(index, { children })} addLabel="Add menu link" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-serif text-2xl font-bold">Footer columns</h2><p className="mt-1 text-xs text-[#6B7280]">Edit each footer column and its links.</p></div>
          <button type="button" onClick={() => setFormDirty((current) => ({ ...current, footerColumns: [...current.footerColumns, { heading: "New Column", links: [] }] }))} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-bold text-[#1F4ED8]"><Plus size={15} /> Add column</button>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {form.footerColumns.map((column, index) => (
            <article key={`${column.heading}-${index}`} className="rounded-[20px] border border-[#DDE4F2] bg-[#FCFCFD] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <input value={column.heading} onChange={(event) => updateFooter(index, { heading: event.target.value })} className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#1F4ED8]" />
                <button type="button" onClick={() => setFormDirty((current) => ({ ...current, footerColumns: current.footerColumns.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Delete footer column" className="rounded-lg border border-red-100 bg-white p-2 text-red-500"><Trash2 size={15} /></button>
              </div>
              <div className="mt-4"><LinkRows links={column.links} onChange={(links) => updateFooter(index, { links })} addLabel="Add footer link" /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-2xl font-bold">Legal links</h2>
        <p className="mt-1 text-xs text-[#6B7280]">These links appear in the legal row at the bottom of the footer.</p>
        <div className="mt-5"><LinkRows links={form.legalLinks} onChange={(legalLinks) => setFormDirty((current) => ({ ...current, legalLinks }))} addLabel="Add legal link" /></div>
      </section>

      {message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
