import { RATING_MAX } from "@/lib/rating";

/** En liten albumkurva för flöden och listor. */
export function MiniCurve({ ratings, className = "" }: { ratings: (number | null)[]; className?: string }) {
  const rated = ratings.filter((r): r is number => r != null);
  if (rated.length === 0) return null;
  return (
    <span
      role="img"
      aria-label={`Låtbetyg: ${ratings.map((r) => r ?? "–").join(", ")}`}
      className={`inline-flex h-6 items-end gap-[2px] ${className}`}
    >
      {ratings.map((r, i) => (
        <span
          key={i}
          className="w-[3px] rounded-t-[1px]"
          style={{
            height: r == null ? 2 : `${(r / RATING_MAX) * 100}%`,
            background: r === RATING_MAX ? "var(--accent)" : r == null ? "var(--line)" : "var(--fg)",
            opacity: r == null || r === RATING_MAX ? 1 : 0.35 + (r / RATING_MAX) * 0.65,
          }}
        />
      ))}
    </span>
  );
}
