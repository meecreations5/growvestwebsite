"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ExternalLink,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

const SESSION_KEY = "growvest_guide_session_id";
const STATE_KEY = "growvest_guide_state_v24";

function makeSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `guide_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeReadState() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STATE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return null;
    if (Number(parsed.expiresAt || 0) < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function MessageBubble({ message, onQuickReply, onFeedback, feedbackBusy }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[90%] ${isUser ? "" : "w-full"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "ml-auto w-fit max-w-full rounded-br-md bg-[#1F4ED8] text-white" : "rounded-bl-md border border-black/5 bg-white text-[#0B0B0F] shadow-sm"}`}>
          {!isUser && message.intent?.label ? <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1F4ED8]">{message.intent.label}</p> : null}
          <p className="whitespace-pre-line">{message.text}</p>
          {!isUser && message.sources?.length ? (
            <div className="mt-3 border-t border-black/5 pt-2.5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Based on approved content</p>
              <div className="space-y-1.5">
                {message.sources.map((source) => (
                  <Link key={`${source.url}-${source.label}`} href={source.url} target={source.url?.startsWith("http") ? "_blank" : undefined} rel={source.url?.startsWith("http") ? "noreferrer" : undefined} className="flex items-center gap-1.5 text-xs font-semibold text-[#1F4ED8] hover:underline">
                    {source.label} <ExternalLink size={11} />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {!isUser && message.quickReplies?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <button
                key={`${message.id}-${reply.label}-${index}`}
                type="button"
                onClick={() => onQuickReply(reply)}
                className="min-h-10 rounded-full border border-[#1F4ED8]/15 bg-white px-3.5 py-2 text-left text-xs font-bold text-[#1F4ED8] shadow-sm transition hover:border-[#1F4ED8]/40 hover:bg-[#EEF3FF]"
              >
                {reply.label}
              </button>
            ))}
          </div>
        ) : null}

        {!isUser && message.feedbackEnabled && message.messageId ? (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#6B7280]">
            <span>Was this helpful?</span>
            <button type="button" disabled={feedbackBusy === message.messageId || message.feedback === "helpful"} onClick={() => onFeedback(message, "helpful")} aria-label="Mark this answer helpful" className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${message.feedback === "helpful" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white hover:border-emerald-200 hover:text-emerald-700"}`}><ThumbsUp size={13} /></button>
            <button type="button" disabled={feedbackBusy === message.messageId || message.feedback === "not_helpful"} onClick={() => onFeedback(message, "not_helpful")} aria-label="Mark this answer not helpful" className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${message.feedback === "not_helpful" ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white hover:border-red-200 hover:text-red-700"}`}><ThumbsDown size={13} /></button>
            {message.feedback ? <span className="font-semibold text-[#0B0B0F]">Thank you</span> : null}
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
  const [conversationContext, setConversationContext] = useState({});
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoff, setHandoff] = useState({ name: "", phone: "", consentAccepted: false });
  const [handoffBusy, setHandoffBusy] = useState(false);
  const [feedbackBusy, setFeedbackBusy] = useState("");
  const [footerVisible, setFooterVisible] = useState(false);
  const scrollRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastQuestion = useMemo(() => [...messages].reverse().find((item) => item.role === "user")?.text || "", [messages]);

  useEffect(() => {
    const restored = safeReadState();
    const existingSession = window.localStorage.getItem(SESSION_KEY);
    const value = restored?.sessionId || existingSession || makeSessionId();
    window.localStorage.setItem(SESSION_KEY, value);
    setSessionId(value);
    if (Array.isArray(restored?.messages)) setMessages(restored.messages.slice(-30));
    if (restored?.conversationContext && typeof restored.conversationContext === "object") setConversationContext(restored.conversationContext);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const retentionHours = Math.max(1, Math.min(168, Number(config.sessionRetentionHours || 24)));
      window.localStorage.setItem(STATE_KEY, JSON.stringify({
        sessionId,
        messages: messages.slice(-30),
        conversationContext,
        expiresAt: Date.now() + retentionHours * 60 * 60 * 1000,
      }));
    } catch {
      // Local memory is an enhancement; the Guide remains usable if storage is unavailable.
    }
  }, [config.sessionRetentionHours, conversationContext, messages, sessionId]);

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
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(siteFooter);
    return () => observer.disconnect();
  }, []);

  if (config.isEnabled === false) return null;

  function ensureSession() {
    if (sessionId) return sessionId;
    const value = makeSessionId();
    window.localStorage.setItem(SESSION_KEY, value);
    setSessionId(value);
    return value;
  }

  function restartConversation() {
    const value = makeSessionId();
    window.localStorage.setItem(SESSION_KEY, value);
    window.localStorage.removeItem(STATE_KEY);
    setSessionId(value);
    setMessages([]);
    setConversationContext({});
    setShowHandoff(false);
    setHandoff({ name: "", phone: "", consentAccepted: false });
    setInput("");
    setError("");
  }

  async function ask(question) {
    const cleaned = String(question || "").trim();
    if (!cleaned || busy) return;
    const activeSession = ensureSession();
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
        body: JSON.stringify({
          sessionId: activeSession,
          message: cleaned,
          conversationContext,
          pageUrl: window.location.pathname + window.location.search,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "GrowVest Guide could not answer right now.");
      if (result.conversationId && result.conversationId !== activeSession) {
        setSessionId(result.conversationId);
        window.localStorage.setItem(SESSION_KEY, result.conversationId);
      }
      setConversationContext(result.conversationContext || {});
      setMessages((current) => [...current, {
        id: `a_${Date.now()}`,
        messageId: result.messageId || "",
        role: "assistant",
        text: result.answer,
        sources: result.sources || [],
        quickReplies: result.quickReplies || [],
        intent: result.intent || null,
        confidenceLevel: result.confidenceLevel || "",
        feedbackEnabled: Boolean(result.feedbackEnabled),
      }]);
      if ((!result.matched || result.boundary) && result.canHandoff && !(result.quickReplies || []).some((item) => item.type === "handoff")) setShowHandoff(true);
    } catch (requestError) {
      setError(requestError?.message || "Unable to answer right now.");
    } finally {
      setBusy(false);
    }
  }

  function handleQuickReply(reply) {
    if (!reply) return;
    if (reply.type === "handoff") {
      setShowHandoff(true);
      return;
    }
    if (reply.type === "restart") {
      restartConversation();
      return;
    }
    if (reply.type === "link" && reply.url) {
      if (reply.url.startsWith("http")) window.open(reply.url, "_blank", "noopener,noreferrer");
      else window.location.assign(reply.url);
      return;
    }
    ask(reply.value || reply.label);
  }

  async function submitFeedback(message, value) {
    if (!message.messageId || feedbackBusy) return;
    setFeedbackBusy(message.messageId);
    try {
      const response = await fetch("/api/growvest-guide/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messageId: message.messageId, value }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to save feedback.");
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, feedback: value } : item));
    } catch (feedbackError) {
      setError(feedbackError?.message || "Unable to save feedback.");
    } finally {
      setFeedbackBusy("");
    }
  }

  async function continueOnWhatsApp() {
    if (!handoff.consentAccepted) {
      setError("Please confirm that you want to share this conversation context with the GrowVest team.");
      return;
    }
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
          consentAccepted: handoff.consentAccepted,
          conversationContext,
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
      setMessages((current) => [...current, {
        id: `h_${Date.now()}`,
        role: "assistant",
        text: "Your WhatsApp message is ready with the relevant Guide context. Please review it and tap send in WhatsApp to contact the GrowVest team.",
      }]);
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
        <span className="gv-guide-launcher__icon" aria-hidden="true"><Sparkles size={17} /></span>
        <span className="gv-guide-launcher__label">{config.launcherLabel || "Ask GrowVest Guide"}</span>
      </button>

      {open ? (
        <section role="dialog" aria-modal="true" aria-label="GrowVest Guide" className="gv-guide-dialog">
          <header className="gv-guide-dialog__header flex items-center gap-3 bg-[#0B0B0F] px-4 py-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4ED8]"><Bot size={20} /></div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg font-bold">{config.assistantName || "GrowVest Guide"}</p>
              <p className="text-[11px] text-white/55">Approved information · remembers this session</p>
            </div>
            {messages.length ? <button type="button" onClick={restartConversation} aria-label="Start a new Guide conversation" title="Start again" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 text-white/65 transition hover:bg-white/10 hover:text-white"><RotateCcw size={18} /></button> : null}
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

            {messages.map((message) => <MessageBubble key={message.id} message={message} onQuickReply={handleQuickReply} onFeedback={submitFeedback} feedbackBusy={feedbackBusy} />)}
            {busy ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 text-sm text-[#6B7280] shadow-sm"><LoaderCircle size={15} className="animate-spin" /> Understanding your question…</div></div> : null}

            {showHandoff ? (
              <div className="rounded-2xl border border-[#25D366]/30 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3"><div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#25D366]/12 text-[#14863E]"><MessageCircle size={18} /></div><div><p className="text-sm font-bold">Continue with the GrowVest team</p><p className="mt-1 text-xs leading-5 text-[#6B7280]">The Guide will carry forward your goal, timeline and latest question. WhatsApp opens with a prepared message; it is sent only after you tap send.</p></div></div>
                {conversationContext.conversationSummary ? <div className="mt-3 rounded-xl bg-[#F4F6F9] px-3 py-2.5 text-xs leading-5 text-[#6B7280]"><span className="font-bold text-[#0B0B0F]">Context:</span> {conversationContext.conversationSummary}</div> : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input value={handoff.name} onChange={(event) => setHandoff((current) => ({ ...current, name: event.target.value }))} placeholder="Your name (optional)" autoComplete="name" className="h-12 rounded-xl border border-gray-200 px-3 text-base sm:h-10 sm:text-sm" />
                  <input value={handoff.phone} onChange={(event) => setHandoff((current) => ({ ...current, phone: event.target.value }))} placeholder="Your mobile (optional)" inputMode="tel" autoComplete="tel" className="h-12 rounded-xl border border-gray-200 px-3 text-base sm:h-10 sm:text-sm" />
                </div>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-200 p-3 text-xs leading-5 text-[#6B7280]"><input type="checkbox" checked={handoff.consentAccepted} onChange={(event) => setHandoff((current) => ({ ...current, consentAccepted: event.target.checked }))} className="mt-0.5 h-4 w-4 flex-none accent-[#1F4ED8]" /><span>I agree to share this Guide conversation context with the GrowVest team for follow-up.</span></label>
                <button type="button" onClick={continueOnWhatsApp} disabled={handoffBusy || !handoff.consentAccepted} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#128C4A] px-4 text-sm font-bold text-white disabled:opacity-45">{handoffBusy ? <LoaderCircle size={15} className="animate-spin" /> : <MessageCircle size={16} />} {config.whatsappLabel || "Continue on WhatsApp"}</button>
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
