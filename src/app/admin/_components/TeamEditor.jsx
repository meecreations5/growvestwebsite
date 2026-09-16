"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Save, Trash2 } from "lucide-react";
import { MediaUploadField } from "./MediaUploadField";
import { TEAM_DEPARTMENTS, TEAM_STATUSES } from "../../data/teamSocial";

const EMPTY = {
  fullName: "",
  slug: "",
  designation: "",
  department: "client_guidance",
  hierarchyLevel: 1,
  displayOrder: 0,
  shortBio: "",
  bio: "",
  photo: { url: "", altText: "", focalX: 50, focalY: 50 },
  qualifications: [],
  certifications: [],
  linkedinUrl: "",
  publicEmail: "",
  status: "draft",
  isVisible: true,
};

function linesToArray(value) {
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayToLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function slugify(value) {
  return String(value || "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function TeamEditor({ initialItem = null }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initialItem || {}), photo: { ...EMPTY.photo, ...(initialItem?.photo || {}) } }));
  const [qualifications, setQualifications] = useState(arrayToLines(initialItem?.qualifications));
  const [certifications, setCertifications] = useState(arrayToLines(initialItem?.certifications));
  const [busy, setBusy] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(initialItem?.id);
  const departmentLabel = useMemo(() => TEAM_DEPARTMENTS.find((item) => item.value === form.department)?.label || "Team", [form.department]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.fullName),
        qualifications: linesToArray(qualifications),
        certifications: linesToArray(certifications),
      };
      const response = await fetch(isEditing ? `/api/admin/team/${initialItem.id}` : "/api/admin/team", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save this team profile.");
      router.push("/admin/team");
      router.refresh();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save this team profile.");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!isEditing || !window.confirm(`Archive ${form.fullName}? The profile will be removed from the public website.`)) return;
    setArchiving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/team/${initialItem.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to archive this team profile.");
      router.push("/admin/team");
      router.refresh();
    } catch (archiveError) {
      setError(archiveError?.message || "Unable to archive this team profile.");
      setArchiving(false);
    }
  }

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/team" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F4ED8]"><ArrowLeft size={15} /> Back to team</Link>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Team and Hierarchy</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">{isEditing ? `Edit ${form.fullName}` : "Add a team member"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Publish only verified names, roles, qualifications and certifications.</p>
        </div>
        <span className="w-fit rounded-full bg-[#F5B301]/12 px-3 py-1.5 text-xs font-bold text-[#8A6500]">{departmentLabel}</span>
      </div>

      <form onSubmit={save} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-bold">Profile details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold">Full name *</label><input required value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value, slug: current.slug || slugify(event.target.value) }))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]" /></div>
              <div><label className="mb-2 block text-sm font-semibold">Designation *</label><input required value={form.designation} onChange={(event) => setField("designation", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]" placeholder="Founder and Director" /></div>
              <div><label className="mb-2 block text-sm font-semibold">Profile slug</label><input value={form.slug} onChange={(event) => setField("slug", slugify(event.target.value))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]" /></div>
              <div><label className="mb-2 block text-sm font-semibold">Department</label><select value={form.department} onChange={(event) => setField("department", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">{TEAM_DEPARTMENTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div><label className="mb-2 block text-sm font-semibold">Hierarchy level</label><input type="number" min="1" max="20" value={form.hierarchyLevel} onChange={(event) => setField("hierarchyLevel", Number(event.target.value))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /><p className="mt-1 text-xs text-[#6B7280]">Lower numbers appear first within the department.</p></div>
              <div><label className="mb-2 block text-sm font-semibold">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={(event) => setField("displayOrder", Number(event.target.value))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" /></div>
            </div>
            <div className="mt-4"><label className="mb-2 block text-sm font-semibold">Short introduction</label><textarea rows="3" value={form.shortBio} onChange={(event) => setField("shortBio", event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#1F4ED8]" placeholder="A concise public introduction for the team card." /></div>
            <div className="mt-4"><label className="mb-2 block text-sm font-semibold">Extended biography</label><textarea rows="6" value={form.bio} onChange={(event) => setField("bio", event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#1F4ED8]" /></div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-bold">Verified background</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">Use one qualification or certification per line. Do not publish unverified claims.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold">Qualifications</label><textarea rows="6" value={qualifications} onChange={(event) => setQualifications(event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="MBA in Finance\nBachelor of Commerce" /></div>
              <div><label className="mb-2 block text-sm font-semibold">Certifications</label><textarea rows="6" value={certifications} onChange={(event) => setCertifications(event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="NISM-Series-V-A Mutual Fund Distributors Certification" /></div>
              <div><label className="mb-2 block text-sm font-semibold">LinkedIn profile</label><input type="url" value={form.linkedinUrl} onChange={(event) => setField("linkedinUrl", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="https://www.linkedin.com/in/..." /></div>
              <div><label className="mb-2 block text-sm font-semibold">Public email</label><input type="email" value={form.publicEmail} onChange={(event) => setField("publicEmail", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Optional" /></div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Profile photograph</h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-[#E9EDF5]">
              {form.photo?.url ? <img src={form.photo.url} alt={form.photo.altText || "Team photograph preview"} className="aspect-[4/4.3] w-full object-cover" style={{ objectPosition: `${form.photo.focalX}% ${form.photo.focalY}%` }} /> : <div className="flex aspect-[4/4.3] items-center justify-center text-sm text-[#6B7280]">No photograph uploaded</div>}
            </div>
            <div className="mt-4"><MediaUploadField value={form.photo?.url} altText={form.photo?.altText} onUploaded={(media) => setField("photo", { ...form.photo, url: media.url, altText: media.altText || form.photo.altText })} /></div>
            <label className="mb-2 mt-4 block text-sm font-semibold">Alternative text</label><input value={form.photo?.altText || ""} onChange={(event) => setField("photo", { ...form.photo, altText: event.target.value })} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Portrait of ..." />
            <div className="mt-4 grid grid-cols-2 gap-3"><div><label className="mb-1 block text-xs font-semibold">Horizontal focus</label><input type="range" min="0" max="100" value={form.photo?.focalX ?? 50} onChange={(event) => setField("photo", { ...form.photo, focalX: Number(event.target.value) })} className="w-full accent-[#1F4ED8]" /></div><div><label className="mb-1 block text-xs font-semibold">Vertical focus</label><input type="range" min="0" max="100" value={form.photo?.focalY ?? 50} onChange={(event) => setField("photo", { ...form.photo, focalY: Number(event.target.value) })} className="w-full accent-[#1F4ED8]" /></div></div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Publishing</h2>
            <div className="mt-4 space-y-4">
              <div><label className="mb-2 block text-sm font-semibold">Status</label><select value={form.status} onChange={(event) => setField("status", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">{TEAM_STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div>
              <label className="flex items-start gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isVisible} onChange={(event) => setField("isVisible", event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1F4ED8]" /><span>Show on the public About page when published</span></label>
              {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <button type="submit" disabled={busy || archiving} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} {busy ? "Saving..." : "Save profile"}</button>
              {isEditing ? <button type="button" onClick={archive} disabled={busy || archiving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">{archiving ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />} Archive profile</button> : null}
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
