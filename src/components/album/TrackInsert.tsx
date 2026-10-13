"use client";

import { useEffect, useRef, useState } from "react";
import { Fader } from "@/components/rating";
import type { Album } from "@/lib/music/types";
import { RATING_MAX, formatDuration, type Rating } from "@/lib/rating";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Låtlistan, designad som baksidan av ett CD-fodral (bakre inlägget):
 * två ryggar med artist och titel, låtlista med speltider, streckkod och
 * finstilt. Varje låt har en egen fader, så listan blir ett mixerbord.
 */
export function TrackInsert({
  album,
  ratings,
  onRate,
}: {
  album: Album;
  ratings: Rating[];
  onRate: (trackId: string, value: number) => void;
}) {
  const wide = useMediaQuery("(min-width: 640px)");
  const total = album.tracks.reduce((sum, t) => sum + (t.durationMs ?? 0), 0);
  const multiDisc = album.tracks.some((t) => t.disc > 1);
  const preview = usePreview();
  const spine = `${album.artist} — ${album.title}`.toLocaleUpperCase("sv-SE");

  return (
    <div
      className="relative flex overflow-hidden rounded-[4px] border border-line bg-surface"
      style={{ boxShadow: "var(--shadow)" }}
    >
      <Spine text={spine} year={album.year} side="left" />

      <div className="min-w-0 flex-1 px-3 py-5 sm:px-6">
        <div className="mb-3 flex items-baseline justify-between border-b border-line pb-3">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">Låtlista</p>
          <p className="text-[11px] tracking-[0.18em] text-muted uppercase">Ditt betyg</p>
        </div>

        <ol>
          {album.tracks.map((t, i) => {
            const r = ratings[i];
            const showDisc = multiDisc && (i === 0 || album.tracks[i - 1].disc !== t.disc);
            return (
              <li key={t.id}>
                {showDisc && (
                  <p className="lcd mt-3 mb-1 text-[11px] text-muted">CD {t.disc}</p>
                )}
                <div className="flex items-center gap-2 py-1.5 sm:gap-3">
                  <span className="lcd w-5 shrink-0 text-right text-xs text-muted">{t.number}</span>
                  {t.previewUrl ? (
                    <button
                      type="button"
                      onClick={() => preview.toggle(t.previewUrl!)}
                      aria-label={
                        preview.playing === t.previewUrl
                          ? `Pausa ${t.title}`
                          : `Lyssna på ett klipp ur ${t.title}`
                      }
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                    >
                      {preview.playing === t.previewUrl ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{t.title}</span>
                    <span className="lcd block text-[11px] text-muted sm:hidden">
                      {formatDuration(t.durationMs)}
                    </span>
                  </span>
                  <span className="lcd hidden w-12 shrink-0 text-right text-xs text-muted sm:block">
                    {formatDuration(t.durationMs)}
                  </span>
                  <Fader
                    orientation="horizontal"
                    value={r}
                    onChange={(v) => onRate(t.id, v)}
                    label={`Betyg för ${t.number}. ${t.title}`}
                    length={wide ? 150 : 104}
                  />
                  <span
                    className={`lcd w-5 shrink-0 text-right text-sm ${r === RATING_MAX ? "text-accent" : r == null ? "text-muted" : ""}`}
                    aria-hidden
                  >
                    {r ?? "–"}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
          <div className="text-[10px] leading-relaxed text-muted">
            <p>
              Total speltid <span className="lcd text-fg">{formatDuration(total)}</span>
            </p>
            {album.copyright && <p className="mt-1 max-w-[28ch] truncate">{album.copyright}</p>}
          </div>
          <Barcode seed={album.id} />
        </div>
      </div>

      <Spine text={spine} year={album.year} side="right" />
    </div>
  );
}

function Spine({ text, year, side }: { text: string; year: number | null; side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`relative w-5 shrink-0 bg-surface-2 sm:w-7 ${side === "left" ? "border-r" : "border-l"} border-line`}
    >
      <span
        className="absolute top-1/2 left-1/2 flex w-max items-center gap-3 text-[9px] font-medium tracking-[0.2em] whitespace-nowrap text-muted sm:text-[10px]"
        style={{ transform: `translate(-50%, -50%) rotate(${side === "left" ? -90 : 90}deg)` }}
      >
        {text}
        {year && <span className="lcd">{year}</span>}
      </span>
    </div>
  );
}

function Barcode({ seed }: { seed: string }) {
  let h = 7;
  const bars: number[] = [];
  for (let i = 0; i < 34; i++) {
    h = (h * 31 + seed.charCodeAt(i % seed.length)) % 997;
    bars.push(1 + (h % 3));
  }
  let x = 0;
  return (
    <svg width="72" height="30" viewBox="0 0 92 30" aria-hidden className="shrink-0 text-fg">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="24" fill="currentColor" /> : null;
        x += w;
        return rect;
      })}
      <text x="0" y="30" fontSize="5" fill="currentColor" fontFamily="var(--font-geist-mono), monospace">
        7 {seed.replace(/\D/g, "").padEnd(12, "3").slice(0, 12)}
      </text>
    </svg>
  );
}

function usePreview() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => () => audio.current?.pause(), []);

  function toggle(url: string) {
    if (!audio.current) {
      audio.current = new Audio();
      audio.current.addEventListener("ended", () => setPlaying(null));
    }
    const a = audio.current;
    if (playing === url) {
      a.pause();
      setPlaying(null);
      return;
    }
    a.src = url;
    void a.play().catch(() => setPlaying(null));
    setPlaying(url);
  }

  return { playing, toggle };
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M2 1l7 4-7 4z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" />
    </svg>
  );
}
