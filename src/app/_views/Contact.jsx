"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Check, Clock, Mail, MapPin, Phone, Target, Users } from "lucide-react";
import { BLACK, BLUE, GOLD, MGRAY, COMPANY, serif, dotGrid } from "../lib/brand";
import { trackEvent } from "../lib/analytics";

const SERVICES = [
  "Goal and Bucket List Mapping",
  "Financial Planning Conversation",
  "Progress Review",
  "NRI or Family Goals",
  "Protection and Emergency Preparedness",
  "Existing Client Query",
  "Other",
];

const TIMES = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"];

function buildSlots() {
  const slots = [];
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const baseDate = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));

  for (let dayOffset = 1; slots.length < 12 && dayOffset < 15; dayOffset += 1) {
    const candidate = new Date(baseDate);
    candidate.setUTCDate(candidate.getUTCDate() + dayOffset);
    const day = candidate.getUTCDay();
    if (day === 0) continue;

    const dateLabel = candidate.toLocaleDateString("en-IN", {
      timeZone: "UTC",
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    TIMES.forEach((time) => {
      if (slots.length < 12) slots.push(`${dateLabel} · ${time}`);
    });
  }

  return slots;
}

export default function Contact() {
  const [slots, setSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
  const [deliveryNotice, setDeliveryNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    slot: "",
    message: "",
    consent: false,
    website: "",
  });

  useEffect(() => {
    setSlots(buildSlots());
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function handleDetailsSubmit(event) {
    event.preventDefault();
    setError("");
    trackEvent("contact_details_completed", { service_area: form.service || "not_selected" });
    setStep(2);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "We could not submit your request.");

      setRequestId(data.requestId || "");
      setDeliveryNotice(data.teamNotified === false ? `Your request is safely recorded. Email delivery is delayed, so please call ${COMPANY.phoneDisplay} if your enquiry is urgent.` : "");
      setStatus("success");
      trackEvent("contact_request_submitted", { service_area: form.service || "not_selected", preferred_slot_selected: Boolean(form.slot) });
    } catch (submissionError) {
      setStatus("error");
      trackEvent("contact_request_error", { service_area: form.service || "not_selected" });
      setError(submissionError.message || `Please email ${COMPANY.email} or call ${COMPANY.phoneDisplay}.`);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 55% at 30% 55%, rgba(31,78,216,0.15) 0%, transparent 65%)" }} />
        <div className="relative mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Request a Discovery Conversation</span>
              </div>
              <h1 className="mb-6 text-[44px] font-bold leading-[1.04] text-white sm:text-[54px] xl:text-[66px]" style={serif}>
                Let Us Start<br />with Your<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Bucket List.</em>
              </h1>
              <p className="mb-8 max-w-[470px] text-[16px] leading-relaxed text-white/70">
                Request a conversation focused on your goals, priorities and current situation. A preferred slot is a request and remains subject to team confirmation.
              </p>

              <div className="space-y-4">
                <a href={`tel:${COMPANY.phoneHref}`} className="flex items-start gap-3.5 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-[#1F4ED8]">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${BLUE}20` }}><Phone size={13} style={{ color: BLUE }} /></span>
                  <span><span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Phone</span><span className="text-[14px] text-white/75">{COMPANY.phoneDisplay}</span></span>
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-start gap-3.5 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-[#1F4ED8]">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${BLUE}20` }}><Mail size={13} style={{ color: BLUE }} /></span>
                  <span><span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Email</span><span className="text-[14px] text-white/75">{COMPANY.email}</span></span>
                </a>
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${BLUE}20` }}><MapPin size={13} style={{ color: BLUE }} /></span>
                  <span><span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Office</span><span className="text-[14px] leading-relaxed text-white/75">{COMPANY.addressLines.join(" ")}</span></span>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${BLUE}20` }}><Clock size={13} style={{ color: BLUE }} /></span>
                  <span><span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MGRAY }}>Meetings</span><span className="text-[14px] text-white/75">By appointment</span></span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-[0_8px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              {status === "success" ? (
                <div className="p-9 text-center sm:p-10" aria-live="polite">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `${GOLD}20` }}>
                    <Check size={24} style={{ color: GOLD }} />
                  </div>
                  <h2 className="mb-3 text-[23px] font-bold text-white" style={serif}>Your Request Has Been Received.</h2>
                  <p className="mb-6 text-[14px] leading-relaxed text-white/70">
                    The GrowVest team will review your request and contact you during business hours. Your selected time remains a preferred slot until confirmed.
                  </p>
                  {deliveryNotice && <p className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-[12px] leading-relaxed text-amber-100">{deliveryNotice}</p>}
                  {requestId && <p className="rounded-xl bg-white/[0.06] px-4 py-3 text-[12px] text-white/65">Reference: {requestId}</p>}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 border-b border-white/10 px-7 py-5">
                    {[1, 2].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: step >= item ? BLUE : "rgba(255,255,255,0.12)", color: step >= item ? "white" : "rgba(255,255,255,0.55)" }}>{item}</span>
                        <span className={`text-[12px] ${step >= item ? "text-white/75" : "text-white/55"}`}>{item === 1 ? "Your Details" : "Preferred Slot"}</span>
                      </div>
                    ))}
                  </div>

                  {step === 1 ? (
                    <form onSubmit={handleDetailsSubmit} className="space-y-4 p-7">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="contact-name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Full Name *</label>
                          <input id="contact-name" required name="name" value={form.name} onChange={handleChange} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-blue-400" placeholder="Your full name" />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Email Address *</label>
                          <input id="contact-email" required name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-blue-400" placeholder="you@example.com" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Phone Number *</label>
                        <input id="contact-phone" required name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-blue-400" placeholder="+91 98765 43210" />
                      </div>
                      <div>
                        <label htmlFor="contact-service" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">What Would You Like to Discuss?</label>
                        <select id="contact-service" name="service" value={form.service} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-[#1a1a22] px-4 py-3 text-[13px] text-white outline-none focus:border-blue-400">
                          <option value="">Select an area</option>
                          {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="contact-message" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Anything Else to Share?</label>
                        <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-blue-400" placeholder="Tell us briefly about your goals or current situation" />
                      </div>
                      <div className="hidden" aria-hidden="true">
                        <label htmlFor="contact-website">Website</label>
                        <input id="contact-website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-white/65">
                        <input required type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-blue-600" />
                        <span>I agree that GrowVest may use these details to respond to my request and contact me about this enquiry.</span>
                      </label>
                      <button type="submit" className="w-full rounded-full py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
                        Continue to Preferred Slot <ArrowRight size={16} className="ml-1.5 inline" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="p-7">
                      <p className="mb-2 text-[16px] font-semibold text-white" style={serif}>Choose a Preferred Slot</p>
                      <p className="mb-5 text-[11px] leading-relaxed text-white/60">Times are in IST and remain subject to confirmation by the GrowVest team.</p>
                      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {slots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            aria-pressed={form.slot === slot}
                            onClick={() => setForm((current) => ({ ...current, slot }))}
                            className="rounded-xl border px-3 py-3 text-center text-[11px] font-medium transition-colors"
                            style={{ background: form.slot === slot ? BLUE : "rgba(255,255,255,0.07)", color: form.slot === slot ? "white" : "rgba(255,255,255,0.72)", borderColor: form.slot === slot ? BLUE : "rgba(255,255,255,0.10)" }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-[12px] leading-relaxed text-red-100">{error}</p>}
                      <div className="flex gap-3">
                        <button type="button" onClick={() => { setStep(1); setError(""); }} className="rounded-full border border-white/15 px-5 py-3.5 text-[14px] font-medium text-white/70">Back</button>
                        <button type="submit" disabled={!form.slot || status === "submitting"} className="flex-1 rounded-full py-3.5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45" style={{ background: BLUE }}>
                          {status === "submitting" ? "Submitting..." : form.slot ? "Submit Request" : "Select a Slot First"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: MGRAY }}>Your Discovery Conversation</p>
            <h2 className="text-[34px] font-bold leading-tight text-[#0B0B0F] lg:text-[44px]" style={serif}>What We Aim to Understand.</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {[
              { Icon: Target, title: "Your Bucket List", copy: "The goals, experiences and responsibilities that matter most to you." },
              { Icon: Users, title: "Your Current Situation", copy: "The financial decisions already in place and the areas where you need clarity." },
              { Icon: Calendar, title: "Possible Next Steps", copy: "A clear view of what information, action or professional support may be needed next." },
            ].map(({ Icon, title, copy }) => (
              <article key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${BLUE}10` }}><Icon size={19} style={{ color: BLUE }} /></div>
                <h3 className="mb-2 text-[15px] font-bold text-[#0B0B0F]" style={serif}>{title}</h3>
                <p className="text-[13px] leading-relaxed text-[#6B7280]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
