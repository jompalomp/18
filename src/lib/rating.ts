export const RATING_MIN = 1;
export const RATING_MAX = 10;

/** Ett betyg är ett heltal 1–10, eller null om inget satts. */
export type Rating = number | null;

export function clampRating(n: number): number {
  return Math.min(RATING_MAX, Math.max(RATING_MIN, Math.round(n)));
}

/** Formaterar ett snitt på svenska: 7.4 → "7,4". */
export function formatAverage(n: number, decimals = 1): string {
  return n.toLocaleString("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function average(values: Rating[]): number | null {
  const set = values.filter((v): v is number => v != null);
  if (set.length === 0) return null;
  return set.reduce((a, b) => a + b, 0) / set.length;
}

/**
 * Skivans varvtal per betyg: 1 snurrar långsamt (8 rpm), 10 som en 78:a.
 * Utan betyg snurrar den i standardfart, 33 ⅓.
 */
export const RPM_UNRATED = 33;
export function rpmForRating(rating: Rating): number {
  if (rating == null) return RPM_UNRATED;
  return Math.round(8 + ((clampRating(rating) - 1) * 70) / 9);
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return "–:––";
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
