import type { AlbumSummary } from "@/lib/music/types";
import { Cover } from "./Cover";

/**
 * Ett CD-fodral (jewel case): omslaget bakom plast, gångjärnet till vänster
 * och en svag reflex i plasten.
 */
export function JewelCase({
  album,
  className = "",
}: {
  album: Pick<AlbumSummary, "id" | "title" | "artist" | "coverUrl" | "art">;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-[3px] bg-[#111] ${className}`}
      style={{
        boxShadow:
          "0 1px 1px rgba(0,0,0,.12), 0 12px 28px -14px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.08)",
      }}
    >
      {/* Omslaget ligger innanför gångjärnet */}
      <div className="absolute inset-y-0 right-0 left-[7%]">
        <Cover album={album} />
      </div>
      {/* Gångjärnet */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[7%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.04) 40%, rgba(0,0,0,.35) 70%, rgba(255,255,255,.12))",
          backgroundColor: "rgba(30,30,32,.85)",
        }}
      >
        <div className="absolute inset-y-[4%] left-[38%] w-px bg-white/15" />
        <div className="absolute inset-y-[4%] left-[62%] w-px bg-black/30" />
      </div>
      {/* Plastreflex */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 28%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 78%, rgba(255,255,255,.07) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)",
        }}
      />
    </div>
  );
}
