// Lightweight input validation & sanitisation helpers shared by the API routes.
// Drizzle parameterises all SQL (so there is no SQL-injection surface) and React
// escapes output (mitigating stored XSS); these helpers add length caps, type
// checks, an upload allow-list, and object-path safety on top.

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);

export const ALLOWED_UPLOAD_EXTENSIONS = new Set(["jpg", "jpeg", "png", "pdf"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trim, drop ASCII control characters (0x00-0x1F and 0x7F), and cap length.
// Returns undefined when empty.
export function cleanString(value: unknown, maxLen = 500): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  if (!s) return undefined;
  let cleaned = "";
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f) continue;
    cleaned += ch;
  }
  cleaned = cleaned.trim();
  return cleaned ? cleaned.slice(0, maxLen) : undefined;
}

export function isEmail(value: unknown): boolean {
  const s = cleanString(value, 254);
  return !!s && EMAIL_RE.test(s);
}

export function toFiniteNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

// Reject path traversal / unexpected characters in a stored object path.
export function isSafeObjectPath(path: string): boolean {
  if (!path || path.length > 256) return false;
  if (path.includes("..")) return false;
  if (path.startsWith("/")) return false;
  return /^[A-Za-z0-9._/-]+$/.test(path);
}

// M-Pesa AccountReference: alphanumeric, max 12 chars, with a safe fallback.
export function mpesaAccountRef(name: string | null | undefined, fallback: string): string {
  const cleaned = (name || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  return cleaned || fallback;
}

// Account numbers: digits/letters/spaces/dashes only, 3-34 chars.
export function isReasonableAccountNumber(value: string): boolean {
  return /^[A-Za-z0-9 -]{3,34}$/.test(value);
}
