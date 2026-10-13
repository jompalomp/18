"use client";

import { useEffect, useRef, useState } from "react";
import { JewelCase } from "@/components/cd/JewelCase";
import { VolumeKnob } from "@/components/rating";
import type { AlbumSummary } from "@/lib/music/types";
import type { Rating } from "@/lib/rating";
import { saveLog, today, useVarvtal } from "@/lib/store";

/** Snabblogg: betyg och datum räcker. Öppnas från sökresultat och kö. */
export function QuickLogButton({ album, className = "" }: { album: AlbumSummary; className?: string }) {
  const [open, setOpen] = useState(false);
  const { logs } = useVarvtal();
  const logged = logs[album.id];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-full border border-line px-3 py-1 text-xs transition-colors hover:border-fg ${className}`}
      >
        {logged ? "Ändra logg" : "Logga"}
      </button>
      {open && <QuickLogDialog album={album} onClose={() => setOpen(false)} />}
    </>
  );
}

function QuickLogDialog({ album, onClose }: { album: AlbumSummary; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { logs } = useVarvtal();
  const existing = logs[album.id];
  const [rating, setRating] = useState<Rating>(existing?.rating ?? null);
  const [date, setDate] = useState(existing?.listenedOn ?? today());

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveLog(album, { rating, listenedOn: date });
    onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="quicklog-title"
      className="m-auto w-[min(92vw,380px)] rounded-2xl border border-line bg-surface p-0 text-fg shadow-card backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <JewelCase album={album} className="w-16 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs tracking-[0.14em] text-muted uppercase">Logga</p>
            <h2 id="quicklog-title" className="truncate font-semibold">
              {album.title}
            </h2>
            <p className="truncate text-sm text-muted">{album.artist}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <VolumeKnob value={rating} onChange={setRating} label="Albumbetyg" size={150} />
        </div>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">Lyssnat</span>
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
            className="lcd rounded-md border border-line bg-bg px-2 py-1 text-sm"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm text-muted hover:text-fg"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg disabled:opacity-40"
          >
            Spara
          </button>
        </div>
      </form>
    </dialog>
  );
}
