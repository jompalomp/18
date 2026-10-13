const MONTHS = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** "2026-10-13" → "13 okt" (eller "13 okt 2025" om annat år). */
export function formatDay(iso: string, now = new Date()): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  const base = `${d} ${MONTHS[m - 1]}`;
  return y === now.getFullYear() ? base : `${base} ${y}`;
}
