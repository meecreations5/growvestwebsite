"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  const reference = error?.digest || "GLOBAL-ERROR";

  useEffect(() => {
    console.error("GrowVest global application error", { reference, error });
  }, [error, reference]);

  return (
    <html lang="en-IN">
      <body style={{ margin: 0, background: "#F4F6F9", color: "#0B0B0F", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "100%", maxWidth: 560, border: "1px solid #E5E7EB", borderRadius: 24, background: "#FFFFFF", padding: 32, textAlign: "center", boxShadow: "0 18px 60px rgba(11,11,15,.08)" }}>
            <p style={{ margin: 0, color: "#1F4ED8", fontSize: 13, fontWeight: 700 }}>GrowVest</p>
            <h1 style={{ margin: "12px 0", fontSize: 32 }}>We could not complete this request.</h1>
            <p style={{ margin: "0 auto", maxWidth: 440, color: "#6B7280", lineHeight: 1.7 }}>Please retry once. If the issue continues, share the reference below with the GrowVest team.</p>
            <p style={{ margin: "18px 0 0", fontFamily: "monospace", fontSize: 12, color: "#6B7280" }}>Reference: {reference}</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 24 }}>
              <button type="button" onClick={reset} style={{ border: 0, borderRadius: 999, background: "#1F4ED8", color: "white", padding: "12px 22px", fontWeight: 700, cursor: "pointer" }}>Try again</button>
              <a href="/" style={{ border: "1px solid #D1D5DB", borderRadius: 999, color: "#0B0B0F", padding: "12px 22px", fontWeight: 700, textDecoration: "none" }}>Return home</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
