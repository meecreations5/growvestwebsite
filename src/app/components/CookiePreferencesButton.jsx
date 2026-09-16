"use client";

export function CookiePreferencesButton({ className = "" }) {
  function openPreferences() {
    window.dispatchEvent(new CustomEvent("growvest:open-consent"));
  }

  return (
    <button type="button" className={className} onClick={openPreferences}>
      Cookie Preferences
    </button>
  );
}
