"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, ExternalLink, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";

function makeSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `guide_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "rounded-br-md bg-[#1F4ED8] text-white" : "rounded-bl-md border border-black/5 bg-white text-[#0B0B0F] shadow-sm"}`}>
        <p>{message.text}</p>
        {!isUser && message.sources?.length ? (
          <div className="mt-3 border-t border-black/5 pt-2.5">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Learn more</p>
            <div className="space-y-1.5">
              {message.sources.map((source) => (
                <Link key={`${source.url}-${source.label}`} href={source.url} className="flex items-center gap-1.5 text-xs font-semibold text-[#1F4ED8] hover:underline">
                  {source.label} <ExternalLink size={11} />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function GrowVestGuide({ settings }) {
  const config = settings || {};
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoff, setHandoff] = useState({ name: "", phone: "" });
  const [handoffBusy, setHandoffBusy] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const scrollRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastQuestion = useMemo(() => [...messages].reverse().find((item) => item.role === "user")?.text || "", [messages]);

  useEffect(() => {
    const key = "growvest_guide_session_id";
    const existing = window.localStorage.getItem(key);
    const value = existing || makeSessionId();
    window.localStorage.setItem(key, value);
    setSessionId(value);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, showHandoff]);

  useEffect(() => {
    document.body.dataset.growvestGuideOpen = open ? "true" : "false";
    document.body.classList.toggle("gv-guide-open", open);
    window.dispatchEvent(new CustomEvent("growvest-guide-state", { detail: { open } }));

    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("gv-guide-open");
      document.body.dataset.growvestGuideOpen = "false";
      window.dispatchEvent(new CustomEvent("growvest-guide-state", { detail: { open: false } }));
    };
  }, [open]);

  useEffect(() => {
    const siteFooter = document.querySelector("[data-site-footer]");
    if (!siteFooter || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(siteFooter);
    return () => observer.disconnect();
  }, []);

  if (config.isEnabled === false) return null;

  async function ask(question) {
    const cleaned = String(question || "").trim();
    if (!cleaned || busy) return;
    setOpen(true);
    setBusy(true);
    setError("");
    setShowHandoff(false);
    setMessages((current) => [...current, { id: `u_${Date.now()}`, role: "user", text: cleaned }]);
    setInput("");
    try {
      const response = await fetch("/api/growvest-guide/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: cleaned, pageUrl: window.location.pathname + window.location.search }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "GrowVest Guide could not answer right now.");
      if (result.conversationId && result.conversationId !== sessionId) {
        setSessionId(result.conversationId);
        window.localStorage.setItem("growvest_guide_session_id", result.conversationId);
      }
      setMessages((current) => [...current, {
        id: `a_${Date.now()}`,
        role: "assistant",
        text: result.answer,
        sources: result.sources || [],
        canHandoff: result.canHandoff,
      }]);
      if (!result.matched || result.boundary) setShowHandoff(Boolean(result.canHandoff));
    } catch (requestError) {
      setError(requestError?.message || "Unable to answer right now.");
    } finally {
      setBusy(false);
    }
  }

  async function continueOnWhatsApp() {
    const whatsappWindow = window.open("about:blank", "_blank");
    setHandoffBusy(true);
    setError("");
    try {
      const response = await fetch("/api/growvest-guide/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          question: lastQuestion,
          name: handoff.name,
          phone: handoff.phone,
          pageUrl: window.location.pathname + window.location.search,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.whatsappUrl) throw new Error(result.message || "Unable to open WhatsApp.");
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = result.whatsappUrl;
      } else {
        window.location.assign(result.whatsappUrl);
      }
      setMessages((current) => [...current, { id: `h_${Date.now()}`, role: "assistant", text: "Your WhatsApp message is ready. Please review it and tap send in WhatsApp to contact the GrowVest team." }]);
      setShowHandoff(false);
    } catch (handoffError) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      setError(handoffError?.message || "Unable to open WhatsApp.");
    } finally {
      setHandoffBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={config.launcherLabel || "Ask GrowVest Guide"}
        data-footer-visible={footerVisible ? "true" : "false"}
        className={`gv-guide-launcher ${footerVisible ? "gv-guide-launcher--footer" : ""} ${open ? "gv-guide-launcher--hidden" : ""}`}
      >
        <span className="gv-guide-launcher__icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <span className="gv-guide-launcher__label">{config.launcherLabel || "Ask GrowVest Guide"}</span>
      </button>

      {open ? (
        <section role="dialog" aria-modal="true" aria-label="GrowVest Guide" className="gv-guide-dialog">
          <header className="gv-guide-dialog__header flex items-center gap-3 bg-[#0B0B0F] px-4 py-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]"><Bot size={20} /></div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg font-bold">{config.assistantName || "GrowVest Guide"}</p>
              <p className="text-[11px] text-white/55">Approved GrowVest information</p>
            </div>
            <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} aria-label="Close GrowVest Guide" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 text-white/65 transition hover:bg-white/10 hover:text-white"><X size={19} /></button>
          </header>

          <div ref={scrollRef} className="gv-guide-dialog__body flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5">
            {!messages.length ? (
              <div>
                <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">Conscious clarity</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold">{config.welcomeTitle || "What would you like clarity on?"}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{config.welcomeMessage}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  {(config.quickPrompts || []).map((prompt) => (
                    <button key={prompt} type="button" onClick={() => ask(prompt)} className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 text-left text-sm font-semibold shadow-sm transition hover:border-[#1F4ED8]/30 hover:text-[#1F4ED8]">
                      <span className="min-w-0 pr-3">{prompt}</span><ArrowRight size={15} className="shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            {busy ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 text-sm text-[#6B7280] shadow-sm"><LoaderCircle size={15} className="animate-spin" /> Checking approved GrowVest content…</div></div> : null}

            {showHandoff ? (
              <div className="rounded-2xl border border-[#25D366]/30 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3"><div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#25D366]/12 text-[#14863E]"><MessageCircle size={18} /></div><div><p className="text-sm font-bold">Continue with the GrowVest team</p><p className="mt-1 text-xs leading-5 text-[#6B7280]">Name and phone are optional. WhatsApp opens with your question prepared; the message is sent only after you tap send.</p></div></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input value={handoff.name} onChange={(event) => setHandoff((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" autoComplete="name" className="h-12 rounded-xl border border-gray-200 px-3 text-base sm:h-10 sm:text-sm" />
                  <input value={handoff.phone} onChange={(event) => setHandoff((current) => ({ ...current, phone: event.target.value }))} placeholder="Your mobile" inputMode="tel" autoComplete="tel" className="h-12 rounded-xl border border-gray-200 px-3 text-base sm:h-10 sm:text-sm" />
                </div>
                <button type="button" onClick={continueOnWhatsApp} disabled={handoffBusy} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#128C4A] px-4 text-sm font-bold text-white disabled:opacity-60">{handoffBusy ? <LoaderCircle size={15} className="animate-spin" /> : <MessageCircle size={16} />} {config.whatsappLabel || "Continue on WhatsApp"}</button>
              </div>
            ) : null}

            {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          </div>

          <footer className="gv-guide-dialog__footer border-t border-black/5 bg-white p-3">
            <form onSubmit={(event) => { event.preventDefault(); ask(input); }} className="flex items-end gap-2">
              <label className="sr-only" htmlFor="growvest-guide-input">Ask GrowVest Guide</label>
              <textarea id="growvest-guide-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 800))} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input); } }} rows={1} placeholder={config.inputPlaceholder || "Type your question…"} className="min-h-12 max-h-28 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-3 text-base leading-5 outline-none transition focus:border-[#1F4ED8] sm:min-h-11 sm:py-2.5 sm:text-sm" />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send question" className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#1F4ED8] text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"><Send size={17} /></button>
            </form>
            <p className="mt-2 text-[9px] leading-4 text-[#6B7280]">{config.disclaimer}</p>
          </footer>
        </section>
      ) : null}
    </>
  );
}
