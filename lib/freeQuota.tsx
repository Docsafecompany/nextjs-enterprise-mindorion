export const FREE_LIMIT = 3;
const KEY = "docsafe_free_used";

export function getFreeUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}

export function incFreeUsed(): number {
  if (typeof window === "undefined") return 0;
  const next = getFreeUsed() + 1;
  localStorage.setItem(KEY, String(next));
  // Optional: also set a cookie to help server-side checks
  document.cookie = `${KEY}=${next}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`;
  return next;
}

export function hasFreeLeft(): boolean {
  return getFreeUsed() < FREE_LIMIT;
}
