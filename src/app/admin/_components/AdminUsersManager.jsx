"use client";

import { useState } from "react";
import {
  Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, RefreshCw,
  ShieldCheck, UserRoundPlus, Users,
} from "lucide-react";

const ROLE_OPTIONS = [
  ["seo_manager", "SEO Manager", "Pages, SEO metadata, FAQs, media and Insight drafts"],
  ["content_editor", "Content Editor", "Draft and edit content"],
  ["content_reviewer", "Content Reviewer", "Review and publish approved Insights"],
  ["website_admin", "Website Admin", "Website operations and publishing"],
  ["viewer", "Viewer", "Read-only Insights, pages and SEO Centre"],
  ["super_admin", "Super Admin", "All access, including user management"],
];

const EMPTY_FORM = {
  displayName: "", email: "", username: "", password: "", role: "seo_manager", authMethod: "password",
};

function generatePassword() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = window.crypto.getRandomValues(new Uint8Array(28));
  return Array.from(bytes, (value) => characters[value % characters.length]).join("");
}

const inputClass = "mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#1F4ED8] focus:ring-4 focus:ring-[#1F4ED8]/10";

export function AdminUsersManager({ initialItems, currentUid }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changes, setChanges] = useState({});
  const stateFor = (item) => changes[item.uid] || { role: item.role, isActive: item.isActive };
  const changeForm = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));
  const passwordMode = form.authMethod === "password";

  async function submit(event) {
    event.preventDefault();
    setBusy("add");
    setError("");
    setMessage("");
    try {
      const payload = { ...form };
      if (payload.authMethod !== "password") {
        delete payload.username;
        delete payload.password;
      }
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to create admin user.");
      setItems((previous) => [...previous, result.item].sort((a, b) => a.email.localeCompare(b.email)));
      setForm({ ...EMPTY_FORM, authMethod: payload.authMethod });
      setShowPassword(false);
      setMessage(payload.authMethod === "password"
        ? `Created ${result.item.username}. Share the initial password securely. At first sign-in the team member must choose a new password.`
        : `Website access granted to ${result.item.email}. They can continue signing in with their existing provider.`);
    } catch (reason) {
      setError(reason?.message || "Unable to create admin user.");
    } finally {
      setBusy("");
    }
  }

  async function update(item) {
    setBusy(item.uid);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(item.uid)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateFor(item)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to change access.");
      setItems((previous) => previous.map((entry) => entry.uid === item.uid ? result.item : entry));
      setChanges((previous) => { const next = { ...previous }; delete next[item.uid]; return next; });
      setMessage(`Updated access for ${item.username || item.email}.`);
    } catch (reason) {
      setError(reason?.message || "Unable to update access.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#1F4ED8]">Secure administration</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">User Management</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
          Create username/password accounts for your SEO and content teams, grant access to existing Microsoft users, and manage roles. Only Super Admins can use this workspace.
        </p>
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><UserRoundPlus size={22} className="text-[#1F4ED8]" /> Create or add a team member</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose login method">
          <button type="button" disabled={Boolean(busy)} onClick={() => changeForm("authMethod", "password")}
            aria-pressed={passwordMode}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${passwordMode ? "border-[#1F4ED8] bg-[#1F4ED8]/5" : "border-gray-200 hover:border-[#1F4ED8]/40"}`}>
            <KeyRound size={20} className="shrink-0 text-[#1F4ED8]" />
            <span><strong className="block text-sm">Create username & password</strong><small className="mt-1 block text-xs text-[#64748B]">Provision a new Firebase account</small></span>
          </button>
          <button type="button" disabled={Boolean(busy)} onClick={() => changeForm("authMethod", "existing")}
            aria-pressed={!passwordMode}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${!passwordMode ? "border-[#1F4ED8] bg-[#1F4ED8]/5" : "border-gray-200 hover:border-[#1F4ED8]/40"}`}>
            <ShieldCheck size={20} className="shrink-0 text-[#1F4ED8]" />
            <span><strong className="block text-sm">Add existing Microsoft/Firebase user</strong><small className="mt-1 block text-xs text-[#64748B]">Keep their current login method</small></span>
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Full name
              <input required={passwordMode} maxLength={120} autoComplete="off" value={form.displayName} onChange={(event) => changeForm("displayName", event.target.value)} className={inputClass} placeholder="Rahul Sharma" />
            </label>
            <label className="block text-sm font-semibold">Email address
              <input required type="email" autoComplete="off" maxLength={254} value={form.email} onChange={(event) => changeForm("email", event.target.value)} className={inputClass} placeholder="rahul@growvest.info" />
            </label>
            {passwordMode && <>
              <label className="block text-sm font-semibold">Username
                <input required autoComplete="off" pattern="[A-Za-z][A-Za-z0-9._-]{2,31}" minLength={3} maxLength={32} value={form.username} onChange={(event) => changeForm("username", event.target.value)} className={inputClass} placeholder="rahul.seo" />
                <span className="mt-1 block text-xs font-normal text-[#64748B]">3–32 characters. Case-insensitive; cannot be changed later.</span>
              </label>
              <label className="block text-sm font-semibold">Initial password
                <span className="relative block">
                  <input required type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={12} maxLength={128} value={form.password} onChange={(event) => changeForm("password", event.target.value)} className={`${inputClass} pr-11`} placeholder="At least 12 characters" />
                  <button type="button" aria-label={showPassword ? "Hide initial password" : "Show initial password"} onClick={() => setShowPassword((current) => !current)} className="absolute right-2 top-4 rounded-lg p-2 text-[#64748B] hover:bg-gray-100">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </span>
                <button type="button" onClick={() => { changeForm("password", generatePassword()); setShowPassword(true); }} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4ED8] hover:underline"><RefreshCw size={13} /> Generate strong password</button>
              </label>
            </>}
            <label className="block text-sm font-semibold">Role
              <select required value={form.role} onChange={(event) => changeForm("role", event.target.value)} className={inputClass}>
                {ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <span className="mt-1 block text-xs font-normal text-[#64748B]">{ROLE_OPTIONS.find(([key]) => key === form.role)?.[2]}</span>
            </label>
          </div>
          <p className="rounded-xl bg-[#F4F6F9] p-4 text-xs leading-5 text-[#64748B]">
            {passwordMode
              ? "The user will change this password on first sign-in. Share it privately before creating the account. Passwords are sent only to Firebase Authentication, never saved in the website database or audit logs. The email is needed for password recovery."
              : "The team member must already have a verified Firebase account. For Microsoft sign-in, ask them to try the Admin login once, then grant access here."}
          </p>
          <button type="submit" disabled={Boolean(busy)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-6 text-sm font-semibold text-white disabled:opacity-60">
            {busy === "add" ? <LoaderCircle size={17} className="animate-spin" /> : <UserRoundPlus size={17} />}
            {passwordMode ? "Create user" : "Grant existing user access"}
          </button>
        </form>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><Users size={21} className="text-[#1F4ED8]" /> Admin user directory</h2>
          <p className="mt-2 text-sm text-[#64748B]">Disabling an account immediately blocks new authenticated requests. Role changes clear old custom permission grants.</p>
        </div>
        <div className="divide-y divide-gray-100">
          {items.length === 0 && <p className="p-6 text-sm text-[#64748B]">No admin users have been added.</p>}
          {items.map((item) => {
            const values = stateFor(item);
            const isSelf = item.uid === currentUid;
            return (
              <div key={item.uid} className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_180px_110px_105px] md:items-center">
                <div>
                  <p className="break-words text-sm font-semibold">{item.displayName || item.email}</p>
                  <p className="mt-1 break-all text-xs text-[#64748B]">{item.username ? `@${item.username} · ` : ""}{item.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="rounded-md bg-gray-100 px-2 py-1">{item.authMethod === "password" ? "Username / password" : "Existing Firebase"}</span>
                    {item.requiresPasswordChange && <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-800"><LockKeyhole size={11} className="mr-1 inline" />First sign-in pending</span>}
                    {isSelf && <span className="text-[#1F4ED8]">Your account</span>}
                  </div>
                </div>
                <label className="text-xs text-[#64748B]">Role
                  <select disabled={isSelf || Boolean(busy)} value={values.role} onChange={(event) => setChanges((previous) => ({ ...previous, [item.uid]: { ...values, role: event.target.value } }))} className="mt-1 h-10 w-full rounded-xl border border-gray-200 bg-white px-2 text-xs disabled:bg-gray-50">
                    {ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" disabled={isSelf || Boolean(busy)} checked={values.isActive} onChange={(event) => setChanges((previous) => ({ ...previous, [item.uid]: { ...values, isActive: event.target.checked } }))} className="h-4 w-4 accent-[#1F4ED8]" /> Active</label>
                <button type="button" disabled={isSelf || Boolean(busy) || (values.role === item.role && values.isActive === item.isActive)} onClick={() => update(item)} className="h-10 rounded-xl border border-[#1F4ED8]/40 px-3 text-xs font-semibold text-[#1F4ED8] disabled:border-gray-100 disabled:text-gray-400">{busy === item.uid ? "Saving..." : "Save changes"}</button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
