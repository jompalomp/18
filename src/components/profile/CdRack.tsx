"use client";

import Link from "next/link";
import { JewelCase } from "@/components/cd/JewelCase";
import type { AlbumSummary } from "@/lib/music/types";

/** Profilens fyra favoriter, uppställda i ett CD-ställ. */
export function CdRack({ albums, own }: { albums: (AlbumSummary | null)[]; own: boolean }) {
  const slots = [...albums, null, null, null, null].slice(0, 4);
  return (
    <div className="relative pt-2">
      <ul className="relative z-10 grid grid-cols-4 gap-2.5 px-2 sm:gap-5 sm:px-5" style={{ perspective: 900 }}>
        {slots.map((a, i) => (
          <li key={a?.id ?? `tom-${i}`}>
            {a ? (
              <Link
                href={`/album/${a.id}`}
                aria-label={`${a.title} av ${a.artist}`}
                className={`block origin-bottom ${i < 2 ? "[--tilt:10deg]" : "[--tilt:-10deg]"} transition-[transform,translate] duration-300 ease-out [transform:rotateY(var(--tilt))] hover:-translate-y-2 hover:[--tilt:0deg] focus-visible:-translate-y-2 focus-visible:[--tilt:0deg] motion-reduce:transition-none`}
              >
                <JewelCase album={a} />
              </Link>
            ) : (
              <div className="grid aspect-square place-items-center rounded-[3px] border border-dashed border-line text-center text-[10px] text-muted sm:text-xs">
                {own ? (
                  <Link href="/sok" className="p-2 hover:text-fg">
                    + Välj
                    <span className="hidden sm:inline"> favorit</span>
                  </Link>
                ) : (
                  "Tom plats"
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Hyllplanet */}
      <div
        aria-hidden
        className="relative -mt-1 h-3 rounded-[2px] border border-line bg-surface-2"
        style={{ boxShadow: "0 10px 20px -12px rgba(0,0,0,.35)" }}
      />
      <div aria-hidden className="mx-3 h-2 rounded-b-[2px] bg-line/70" />
    </div>
  );
}
