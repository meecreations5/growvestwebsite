// Pure validation shared by server-side provisioning and username sign-in.
// Usernames are deliberately case-insensitive. No password is ever persisted here.
export function normalizeAdminUsername(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidAdminUsername(value) {
  const username = normalizeAdminUsername(value);
  return /^[a-z][a-z0-9._-]{2,31}$/.test(username) &&
    !/^(admin|administrator|root|system|support|firebase|growvest|security|api|login|contact)$/.test(username);
}

export function normalizeAdminEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidAdminEmail(value) {
  const email = normalizeAdminEmail(value);
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidInitialPassword(value, username = "", email = "") {
  if (typeof value !== "string" || value.length < 12 || value.length > 128) return false;
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return false;
  const lowered = value.toLowerCase();
  const name = normalizeAdminUsername(username);
  const localPart = normalizeAdminEmail(email).split("@")[0];
  return !(name && lowered.includes(name)) && !(localPart.length >= 4 && lowered.includes(localPart));
}
