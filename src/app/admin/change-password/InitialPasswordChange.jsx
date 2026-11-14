"use client";

import { useState } from "react";
import { LockKeyhole, LoaderCircle, ShieldCheck } from "lucide-react";

export function InitialPasswordChange({ username, email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to update password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.location.replace("/admin/login?passwordUpdated=1");
    } catch (reason) {
      setError(reason?.message || "Unable to update password.");
      setBusy(false);
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#1F4ED8] focus:ring-4 focus:ring-[#1F4ED8]/10";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F9] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-xl sm:p-9">
        <img src="/growvest-logo-dark.svg" alt="GrowVest" className="mb-7 h-auto w-[150px]" />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F4ED8]/10 text-[#1F4ED8]"><ShieldCheck size={26} /></div>
        <h1 className="mt-5 font-serif text-3xl font-bold">Secure your new account</h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">Before using the admin workspace, replace your initial password with one only you know. Your username is <strong>{username}</strong>. Password resets are sent to {email}.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">Initial password
            <input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">New password
            <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">Confirm new password
            <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">
            {busy ? <LoaderCircle className="animate-spin" size={17} /> : <LockKeyhole size={17} />} Update password
          </button>
          <p className="text-xs leading-5 text-[#64748B]">Use at least 12 characters including letters and numbers. You will sign in again with the new password after this change.</p>
        </form>
      </div>
    </main>
  );
}
