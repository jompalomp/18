"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "@/components/layout/AppShell";
import { AlbumCd } from "@/components/cd/AlbumCd";
import { VolumeKnob } from "@/components/rating";
import { Avatar } from "@/components/ui/Avatar";
import { Lcd } from "@/components/ui/Lcd";
import { toSummary } from "@/lib/mock/catalog";
import { DEMO_USERS, demoLogsForAlbum } from "@/lib/mock/social";
import type { Album } from "@/lib/music/types";
import { formatDay } from "@/lib/format";
import {
  RATING_MAX,
  average,
  formatAverage,
  formatDuration,
  rpmForRating,
  type Rating,
} from "@/lib/rating";
import {
  deleteLog,
  rateTrack,
  saveLog,
  today,
  toggleFavorite,
  toggleQueue,
  useVarvtal,
} from "@/lib/store";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { AlbumCurve } from "./AlbumCurve";
import { TrackInsert } from "./TrackInsert";

export function AlbumView({ album }: { album: Album }) {
  const s = useVarvtal();
  const summary = toSummary(album);
  const log = s.logs[album.id];
  const rating = log?.rating ?? null;
  const trackRatings: Rating[] = album.tracks.map((t) => s.trackRatings[t.id] ?? null);
  const trackAvg = average(trackRatings);
  const inQueue = s.queue.some((q) => q.albumId === album.id);
  const isFavorite = s.favorites.includes(album.id);
  const favoritesFull = !isFavorite && !s.favorites.includes(null);
  const wide = useMediaQuery("(min-width: 768px)");
  const total = album.tracks.reduce((sum, t) => sum + (t.durationMs ?? 0), 0);

  // Vänners och allas betyg (demodata tills Supabase är inkopplat).
  const others = demoLogsForAlbum(album.id);
  const friends = others.filter((l) => s.follows.includes(l.username));
  const friendsAvg = average(friends.map((l) => l.rating));
  const allRatings = [...others.map((l) => l.rating), ...(rating != null ? [rating] : [])];
  const allAvg = average(allRatings);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      {/* ------------------------------------------------ Huvud */}
      <section className="flex flex-col gap-8 pt-8 md:flex-row md:items-center md:gap-10 md:pt-14">
        <AlbumCd album={summary} rating={rating} size={wide ? 260 : 196} />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Album{album.genre ? ` · ${album.genre}` : ""}
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {album.title}
          </h1>
          <p className="mt-1 text-lg text-muted">{album.artist}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {album.year && <Lcd>{album.year}</Lcd>}
            <span>
              <Lcd>{album.tracks.length}</Lcd> låtar
            </span>
            {total > 0 && <Lcd>{formatDuration(total)}</Lcd>}
            <span>
              <Lcd className="text-fg">{rpmForRating(rating)}</Lcd> rpm
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleQueue(summary)}
              aria-pressed={inQueue}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                inQueue ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
              }`}
            >
              {inQueue ? "I kön ✓" : "Lyssna senare"}
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(summary)}
              aria-pressed={isFavorite}
              disabled={favoritesFull}
              title={favoritesFull ? "CD-stället är fullt – ta bort en favorit först" : undefined}
              className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                isFavorite ? "border-accent text-accent" : "border-line hover:border-fg"
              }`}
            >
              {isFavorite ? "I CD-stället" : "Ställ i CD-stället"}
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Betyg */}
      <section
        aria-labelledby="betyg-h"
        className="mt-12 grid gap-8 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8 md:grid-cols-[auto_1fr] md:gap-12"
      >
        <div className="flex flex-col items-center gap-2">
          <SectionTitle id="betyg-h">Ditt betyg</SectionTitle>
          <VolumeKnob
            value={rating}
            onChange={(v) => saveLog(summary, { rating: v })}
            label="Ditt albumbetyg"
            size={176}
            className="mt-2"
          />
        </div>

        <div className="flex flex-col justify-center gap-6">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
            <Stat label="Ditt album" value={rating} peak={rating === RATING_MAX} />
            <Stat
              label="Dina låtar snittar"
              value={trackAvg}
              note={trackAvg == null ? "Dra i fadrarna nedan" : undefined}
            />
            <Stat label="Vänner" value={friendsAvg} count={friends.length} />
            <Stat label="Alla" value={allAvg} count={allRatings.length} />
          </dl>
          <LogDetails albumId={album.id} onChange={(patch) => saveLog(summary, patch)} />
        </div>
      </section>

      {/* ------------------------------------------------ Albumkurvan */}
      <section aria-labelledby="kurva-h" className="mt-14">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <SectionTitle id="kurva-h">Albumkurvan</SectionTitle>
          <p className="text-xs text-muted">
            {trackRatings.filter((r) => r != null).length} av {album.tracks.length} låtar betygsatta
          </p>
        </div>
        <AlbumCurve tracks={album.tracks} ratings={trackRatings} />
      </section>

      {/* ------------------------------------------------ Låtlista */}
      <section aria-labelledby="latar-h" className="mt-14">
        <h2 id="latar-h" className="sr-only">
          Låtlista och låtbetyg
        </h2>
        <TrackInsert
          album={album}
          ratings={trackRatings}
          onRate={(id, v) => rateTrack(summary, id, v)}
        />
      </section>

      {/* ------------------------------------------------ Recension */}
      <section aria-labelledby="recension-h" className="mt-14">
        <SectionTitle id="recension-h">Din recension</SectionTitle>
        <Review albumId={album.id} onSave={(review) => saveLog(summary, { review })} />
      </section>

      {/* ------------------------------------------------ Andras loggar */}
      {others.length > 0 && (
        <section aria-labelledby="andra-h" className="mt-14">
          <SectionTitle id="andra-h">Andra som lyssnat</SectionTitle>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {others.map((l) => {
              const u = DEMO_USERS.find((d) => d.username === l.username)!;
              return (
                <li key={l.username} className="flex gap-4 py-4">
                  <Avatar name={u.displayName} color={u.color} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-3 text-sm">
                      <Link href={`/u/${u.username}`} className="font-medium hover:underline">
                        {u.displayName}
                      </Link>
                      <span className="flex items-baseline gap-3">
                        <span className="text-xs text-muted">{formatDay(l.listenedOn)}</span>
                        <Lcd peak={l.rating === RATING_MAX}>{String(l.rating).padStart(2, "0")}</Lcd>
                      </span>
                    </p>
                    {l.review && <p className="mt-1 text-sm text-muted">{l.review}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {log && (
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => {
              if (confirm("Ta bort din logg för det här albumet? Låtbetygen sparas.")) deleteLog(album.id);
            }}
            className="text-xs text-muted underline underline-offset-4 hover:text-accent"
          >
            Ta bort loggen
          </button>
        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  count,
  note,
  peak,
}: {
  label: string;
  value: number | null;
  count?: number;
  note?: string;
  peak?: boolean;
}) {
  const integer = value != null && Number.isInteger(value);
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1">
        <Lcd className={`text-2xl ${value == null ? "text-muted" : ""}`} peak={peak}>
          {value == null ? "–" : integer ? value : formatAverage(value)}
        </Lcd>
        {count != null && (
          <span className="ml-1.5 text-xs text-muted">
            {count === 0 ? "inga betyg än" : `${count} betyg`}
          </span>
        )}
        {note && <span className="mt-0.5 block text-xs text-muted">{note}</span>}
      </dd>
    </div>
  );
}

function LogDetails({
  albumId,
  onChange,
}: {
  albumId: string;
  onChange: (patch: { listenedOn?: string; relisten?: boolean }) => void;
}) {
  const { logs } = useVarvtal();
  const log = logs[albumId];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 text-sm">
      <label className="flex items-center gap-3">
        <span className="text-muted">Lyssnat</span>
        <input
          type="date"
          value={log?.listenedOn ?? today()}
          max={today()}
          onChange={(e) => e.target.value && onChange({ listenedOn: e.target.value })}
          className="lcd rounded-md border border-line bg-bg px-2 py-1 text-sm"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={log?.relisten ?? false}
          onChange={(e) => onChange({ relisten: e.target.checked })}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-5 w-9 rounded-full bg-surface-2 transition-colors peer-checked:bg-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-surface after:shadow after:transition-transform peer-checked:after:translate-x-4"
        />
        <span className="text-muted">Lyssnat igen</span>
      </label>
      <p className="text-xs text-muted" aria-live="polite">
        {log ? `Loggad · ${formatDay(log.listenedOn)}` : "Inte loggad än – vrid på ratten så loggas albumet"}
      </p>
    </div>
  );
}

function Review({ albumId, onSave }: { albumId: string; onSave: (review: string) => void }) {
  const { logs } = useVarvtal();
  const saved = logs[albumId]?.review ?? "";
  const [text, setText] = useState(saved);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const synced = useRef(false);

  // Hämta sparad text när lagringen väl laddats i webbläsaren.
  useEffect(() => {
    if (!synced.current && saved) {
      synced.current = true;
      setText(saved);
    }
  }, [saved]);

  function change(value: string) {
    setText(value);
    setStatus("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSave(value);
      setStatus("saved");
    }, 600);
  }

  return (
    <div className="mt-4">
      <textarea
        value={text}
        onChange={(e) => change(e.target.value)}
        rows={5}
        placeholder="Vad tyckte du? Bästa låten, sämsta övergången, var du var när du hörde den…"
        aria-label="Din recension"
        className="w-full resize-y rounded-xl border border-line bg-surface p-4 text-[15px] leading-relaxed placeholder:text-muted/70 focus:border-fg focus-visible:outline-none"
      />
      <p className="mt-1.5 h-4 text-right text-xs text-muted" aria-live="polite">
        {status === "saving" ? "Sparar…" : status === "saved" ? "Sparat" : ""}
      </p>
    </div>
  );
}
