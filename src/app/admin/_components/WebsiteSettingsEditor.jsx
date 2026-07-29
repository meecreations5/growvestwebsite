"use client";

import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

function Field({ label, value, onChange, textarea = false, rows = 4, type = "text", help = "" }) {
  const Input = textarea ? "textarea" : "input";
  return <div><label className="mb-2 block text-sm font-semibold">{label}</label><Input type={textarea ? undefined : type} rows={textarea ? rows : undefined} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={`${textarea ? "min-h-[110px] py-3" : "h-11"} w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]`} />{help ? <p className="mt-1.5 text-xs leading-5 text-[#6B7280]">{help}</p> : null}</div>;
}

export function WebsiteSettingsEditor({ initialItem }) {
  const [form, setForm] = useState(initialItem);
  const [addressText, setAddressText] = useState((initialItem.addressLines || []).join("\n"));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/website/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, addressLines: addressText.split("\n").map((item) => item.trim()).filter(Boolean) }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save website settings.");
      setForm(result.item);
      setMessage("Global website settings were pushed directly to Firestore.");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save website settings.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Content</p><h1 className="mt-2 font-serif text-4xl font-bold">Global settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Manage verified company information, trust statistics and footer disclosures from one place.</p></div><button type="submit" disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save to database</button></div>
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Brand identity</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Brand name" value={form.brandName} onChange={(value) => setField("brandName", value)} /><Field label="Legal entity name" value={form.legalName} onChange={(value) => setField("legalName", value)} /><Field label="Positioning" value={form.positioning} onChange={(value) => setField("positioning", value)} /><Field label="Mission" value={form.mission} onChange={(value) => setField("mission", value)} /><div className="sm:col-span-2"><Field label="Vision" value={form.vision} onChange={(value) => setField("vision", value)} /></div></div></section>
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Contact and access</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Phone display" value={form.phoneDisplay} onChange={(value) => setField("phoneDisplay", value)} /><Field label="Phone link value" value={form.phoneHref} onChange={(value) => setField("phoneHref", value)} /><Field label="Email" type="email" value={form.email} onChange={(value) => setField("email", value)} /><Field label="Office hours" value={form.officeHours} onChange={(value) => setField("officeHours", value)} /><div className="sm:col-span-2"><Field label="Address lines" value={addressText} onChange={setAddressText} textarea rows={4} help="Enter one public address line per row." /></div><div className="sm:col-span-2"><Field label="Investor Portal URL" type="url" value={form.investorPortalUrl} onChange={(value) => setField("investorPortalUrl", value)} /></div></div></section>
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Trust indicators</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><Field label="Clients supported" value={form.clientsSupported} onChange={(value) => setField("clientsSupported", value)} /><Field label="Reviews completed" value={form.reviewsCompleted} onChange={(value) => setField("reviewsCompleted", value)} /><Field label="Coverage" value={form.coverage} onChange={(value) => setField("coverage", value)} /><div className="sm:col-span-3"><Field label="Certification wording" value={form.regulatoryLabel} onChange={(value) => setField("regulatoryLabel", value)} textarea rows={3} /><Field label="SEBI status wording" value={form.sebiStatus} onChange={(value) => setField("sebiStatus", value)} textarea rows={3} /><Field label="Fee wording" value={form.directAdvisoryFee} onChange={(value) => setField("directAdvisoryFee", value)} textarea rows={3} /></div></div></section>
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Footer content</h2><div className="mt-5 space-y-4"><Field label="Footer introduction" value={form.footerDescription} onChange={(value) => setField("footerDescription", value)} textarea rows={4} /><Field label="Disclosure paragraph 1" value={form.footerDisclosure1} onChange={(value) => setField("footerDisclosure1", value)} textarea rows={6} /><Field label="Disclosure paragraph 2" value={form.footerDisclosure2} onChange={(value) => setField("footerDisclosure2", value)} textarea rows={6} /></div></section>
      {message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}{error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
