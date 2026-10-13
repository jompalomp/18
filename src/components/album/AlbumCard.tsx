"use client";

import Link from "next/link";
import { Disc } from "@/components/cd/Disc";
import { JewelCase } from "@/components/cd/JewelCase";
import type { AlbumSummary } from "@/lib/music/types";
import { RATING_MAX, rpmForRating, type Rating } from "@/lib/rating";

/**
 * Albumkort för rutnät: fodralet, och vid hovring tittar skivan fram.
 */
export function AlbumCard({
  album,
  rating,
  meta,
  actions,
}: {
  album: AlbumSummary;
  rating?: Rating;
  /** Extra rad under artisten, t.ex. datum. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <article className="group relative min-w-0">
      <Link href={`/album/${album.id}`} className="block rounded-[3px]">
        <div className="relative">
          <div className="absolute inset-[4%] transition-transform duration-500 ease-out group-hover:translate-x-[14%] group-focus-visible:translate-x-[14%] motion-reduce:transition-none">
            <Disc album={album} rpm={rpmForRating(rating ?? null)} spinning={false} />
          </div>
          <JewelCase album={album} className="relative" />
        </div>
        <h3 className="mt-3 truncate text-sm font-medium">{album.title}</h3>
        <p className="truncate text-sm text-muted">
          {album.artist}
          {album.year ? <span className="lcd text-xs"> · {album.year}</span> : null}
        </p>
      </Link>
      <div className="mt-1 flex min-h-5 items-center justify-between gap-2">
        <div className="min-w-0 truncate text-xs text-muted">{meta}</div>
        {rating != null && (
          <span
            className={`lcd text-sm ${rating === RATING_MAX ? "text-accent" : ""}`}
            aria-label={`Betyg ${rating} av 10`}
          >
            {String(rating).padStart(2, "0")}
          </span>
        )}
      </div>
      {actions}
    </article>
  );
}
