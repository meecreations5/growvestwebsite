"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleX, ExternalLink, RefreshCw, Server, ShieldCheck } from "lucide-react";

const statusStyles = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  fail: "border-red-200 bg-red-50 text-red-800",
};

const summaryStyles = {
  ready: "border-emerald-200 bg-emerald-50",
  degraded: "border-amber-200 bg-amber-50",
  blocked: "border-red-200 bg-red-50",
};

const summaryText = {
  ready: "Ready for launch",
  degraded: "Ready with follow-up items",
  blocked: "Launch is blocked",
};

function StatusIcon({ status, size = 18 }) {
  if (status === "pass") return <CheckCircle2 size={size} aria-hidden="true" />;
  if (status === "warn") return <AlertTriangle size={size} aria-hidden="true" />;
  return <CircleX size={size} aria-hidden="true" />;
}

export function SystemReadinessDashboard({ initialReadiness }) {
  const [readiness, setReadiness] = useState(initialReadiness);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const groups = useMemo(() => {
    return readiness.checks.reduce((result, item) => {
      result[item.category] = [...(result[item.category] || []), item];
      return result;
    }, {});
  }, [readiness]);

  async function refresh() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/system/readiness", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The readiness check could not be refreshed.");
      setReadiness(body);
    } catch (refreshError) {
      setError(refreshError?.message || "The readiness check could not be refreshed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${summaryStyles[readiness.status]}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShieldCheck size={24} className="text-[#1F4ED8]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Current release</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#0B0B0F]">{summaryText[readiness.status]}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Release {readiness.release} · {readiness.environment} · checked {new Date(readiness.checkedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/80 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-700">{readiness.totals.pass}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Passed</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-700">{readiness.totals.warn}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Warnings</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-red-700">{readiness.totals.fail}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Blocked</p>
            </div>
            <button type="button" onClick={refresh} disabled={busy} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1F4ED8] px-4 text-sm font-bold text-white disabled:opacity-60">
              <RefreshCw size={16} className={busy ? "animate-spin" : ""} aria-hidden="true" />
              {busy ? "Checking…" : "Run checks"}
            </button>
          </div>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700">{error}</p> : null}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {Object.entries(groups).map(([category, checks]) => (
            <section key={category} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Server size={18} className="text-[#1F4ED8]" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-bold">{category}</h3>
                </div>
                <span className="text-xs font-semibold text-[#6B7280]">{checks.length} checks</span>
              </div>
              <div className="divide-y divide-black/5">
                {checks.map((item) => (
                  <div key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[36px_minmax(0,1fr)]">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${statusStyles[item.status]}`}>
                      <StatusIcon status={item.status} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#0B0B0F]">{item.label}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[item.status]}`}>{item.status}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#6B7280]">{item.detail}</p>
                      {item.action ? <p className="mt-2 text-xs font-semibold leading-5 text-[#1F4ED8]">Action: {item.action}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Release identity</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-[#6B7280]">Version</dt><dd className="mt-1 font-semibold">{readiness.release}</dd></div>
              <div><dt className="text-[#6B7280]">Environment</dt><dd className="mt-1 font-semibold capitalize">{readiness.environment}</dd></div>
              <div><dt className="text-[#6B7280]">Commit</dt><dd className="mt-1 break-all font-mono text-xs">{readiness.commit}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Operational endpoints</p>
            <div className="mt-4 space-y-2">
              <a href="/api/health/live" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-[#F4F6F9]">
                Liveness check <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a href="/api/health/ready" target="_blank" rel="noreferrer noopener" className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-[#F4F6F9]">
                Readiness check <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-[#0B0B0F] p-5 text-white shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5B301]">Launch gate</p>
            <p className="mt-3 font-serif text-xl font-bold">Do not enable indexing while any critical check is blocked.</p>
            <p className="mt-3 text-sm leading-6 text-white/60">Run the local readiness command, deploy to Preview, complete smoke testing, then promote the same verified build to Production.</p>
            <code className="mt-4 block overflow-x-auto rounded-xl bg-white/8 px-3 py-3 text-xs text-white/80">npm run readiness</code>
          </section>
        </aside>
      </div>
    </div>
  );
}
