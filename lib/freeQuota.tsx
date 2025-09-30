export const FREE_LIMIT = 3;
const KEY = "docsafe_free_used";

export function getFreeUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}

export function setFreeUsed(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(n));
  document.cookie = `${KEY}=${n}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`;
}

export function incFreeUsed(): number {
  const next = getFreeUsed() + 1;
  setFreeUsed(next);
  return next;
}

export function hasFreeLeft(): boolean {
  return getFreeUsed() < FREE_LIMIT;
}

