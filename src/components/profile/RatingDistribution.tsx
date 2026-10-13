"use client";

import { useState } from "react";
import { RATING_MAX } from "@/lib/rating";

/** Betygsfördelning 1–10 som stapeldiagram. */
export function RatingDistribution({ ratings }: { ratings: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const counts = Array.from({ length: RATING_MAX }, (_, i) => ratings.filter((r) => r === i + 1).length);
  const max = Math.max(1, ...counts);
  const top = counts.indexOf(Math.max(...counts));

  return (
    <figure>
      <div className="flex h-32 items-end gap-1.5 border-b border-line" aria-hidden onMouseLeave={() => setHover(null)}>
        {counts.map((c, i) => {
          const step = i + 1;
          const showLabel = c > 0 && (i === top || hover === i);
          return (
            <div
              key={step}
              className="relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setHover(i)}
            >
              <span
                className={`lcd absolute inset-x-0 text-center text-[11px] transition-opacity ${showLabel ? "opacity-100" : "opacity-0"}`}
                style={{ bottom: `calc(${(c / max) * 100}% + 4px)` }}
              >
                {c}
              </span>
              <span
                className="block rounded-t-[4px] transition-[height,opacity] duration-500 ease-out motion-reduce:transition-none"
                style={{
                  height: c === 0 ? 0 : `${Math.max(4, (c / max) * 100)}%`,
                  background: step === RATING_MAX ? "var(--accent)" : "var(--fg)",
                  opacity: hover == null || hover === i ? 1 : 0.4,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5" aria-hidden>
        {counts.map((_, i) => (
          <span key={i} className={`lcd flex-1 text-center text-[11px] ${hover === i ? "text-fg" : "text-muted"}`}>
            {i + 1}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Betygsfördelning</caption>
        <thead>
          <tr>
            <th>Betyg</th>
            <th>Antal album</th>
          </tr>
        </thead>
        <tbody>
          {counts.map((c, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
