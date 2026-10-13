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
 * Skivans varvtal per betyg. 1 ≈ en långsam 16-varvare,
 * 10 ≈ en uppskruvad 78:a. Används av CD-komponenten.
 */
export function rpmForRating(rating: Rating): number {
  if (rating == null) return 0;
  return 12 + (clampRating(rating) - 1) * 8; // 12 → 84 rpm
}
