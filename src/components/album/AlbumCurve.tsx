"use client";

import { useState } from "react";
import type { Track } from "@/lib/music/types";
import { RATING_MAX, type Rating } from "@/lib/rating";

/**
 * Albumkurvan: mina låtbetyg som equalizer-staplar längs albumet,
 * så att albumets toppar och dalar syns direkt.
 */
export function AlbumCurve({ tracks, ratings }: { tracks: Track[]; ratings: Rating[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const rated = ratings.filter((r) => r != null).length;
  const segments = Array.from({ length: RATING_MAX }, (_, i) => i + 1);

  return (
    <figure className="relative">
      <div
        className="flex h-36 items-end gap-[3px] sm:gap-1"
        role="img"
        aria-label={`Albumkurva: ${rated} av ${tracks.length} låtar betygsatta`}
        onMouseLeave={() => setHover(null)}
      >
        {tracks.map((t, i) => {
          const r = ratings[i];
          return (
            <div
              key={t.id}
              className="relative flex h-full min-w-0 flex-1 flex-col-reverse gap-[2px]"
              onMouseEnter={() => setHover(i)}
            >
              {/* Varje stapel är tio LED-segment, som en nivåmätare */}
              {segments.map((s) => {
                const lit = r != null && s <= r;
                return (
                  <span
                    key={s}
                    className="block min-h-0 flex-1 rounded-[2px]"
                    style={{
                      background: lit
                        ? s === RATING_MAX
                          ? "var(--accent)"
                          : "var(--fg)"
                        : "var(--surface-2)",
                      opacity: lit ? (hover == null || hover === i ? 1 : 0.45) : 1,
                      transition: "background 120ms linear, opacity 150ms",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-[3px] sm:gap-1" aria-hidden>
        {tracks.map((t, i) => (
          <span
            key={t.id}
            className={`lcd min-w-0 flex-1 text-center text-[10px] ${hover === i ? "text-fg" : "text-muted"}`}
          >
            {tracks.length > 16 && i % 2 === 1 ? "" : t.number}
          </span>
        ))}
      </div>
      {hover != null && (
        <figcaption
          className="pointer-events-none absolute -top-2 left-0 -translate-y-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs shadow-card"
          style={{
            left: `clamp(0px, calc(${((hover + 0.5) / tracks.length) * 100}% - 80px), calc(100% - 160px))`,
            width: 160,
          }}
        >
          <span className="lcd text-muted">{tracks[hover].number}.</span>{" "}
          <span className="font-medium">{tracks[hover].title}</span>
          <span className="lcd float-right">{ratings[hover] ?? "–"}</span>
        </figcaption>
      )}
    </figure>
  );
}
