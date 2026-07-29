"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "growvest_cookie_consent";

export function CookieConsent() {
  const [choice, setChoice] = useState("loading");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setChoice(saved === "accepted" || saved === "declined" ? saved : "pending");

    function openPreferences() {
      setChoice("pending");
    }

    window.addEventListener("growvest:open-consent", openPreferences);
    return () => window.removeEventListener("growvest:open-consent", openPreferences);
  }, []);

  function saveChoice(nextChoice) {
    window.localStorage.setItem(STORAGE_KEY, nextChoice);
    setChoice(nextChoice);
    window.dispatchEvent(
      new CustomEvent("growvest:consent", {
        detail: { analytics: nextChoice === "accepted" },
      }),
    );
  }

  if (choice !== "pending") return null;

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-[760px] rounded-3xl border border-white/10 bg-[#0B0B0F]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6"
      aria-label="Analytics preference"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[500px]">
          <p className="mb-1 text-[14px] font-semibold">A clearer website experience</p>
          <p className="text-[12px] leading-relaxed text-white/70">
            GrowVest uses optional Firebase Analytics to understand website performance and improve the visitor journey. Analytics remains disabled until you accept. Read our{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#F5B301] underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
            onClick={() => saveChoice("declined")}
          >
            Decline
          </button>
          <button
            type="button"
            className="rounded-full bg-[#1F4ED8] px-4 py-2.5 text-[12px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            onClick={() => saveChoice("accepted")}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
