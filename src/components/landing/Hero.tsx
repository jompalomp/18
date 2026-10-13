"use client";

import { useState } from "react";
import { AlbumCd } from "@/components/cd/AlbumCd";
import { VolumeKnob } from "@/components/rating";
import { Lcd } from "@/components/ui/Lcd";
import { getDemoAlbum, toSummary } from "@/lib/mock/catalog";
import { rpmForRating, type Rating } from "@/lib/rating";
import { useMediaQuery } from "@/lib/useMediaQuery";

const ALBUM = toSummary(getDemoAlbum("demo-varvtal")!);

/** Prova själv: ratten styr hur fort skivan snurrar. */
export function Hero() {
  const [rating, setRating] = useState<Rating>(6);
  const wide = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
      <AlbumCd album={ALBUM} rating={rating} size={wide ? 240 : 180} />
      <div className="flex flex-col items-center gap-2">
        <VolumeKnob value={rating} onChange={setRating} label="Prova ratten" size={140} showReadout={false} />
        <p className="text-xs text-muted">
          <Lcd className="text-sm text-fg">{String(rating ?? 0).padStart(2, "0")}</Lcd> /10 ·{" "}
          <Lcd className="text-sm text-fg">{rpmForRating(rating)}</Lcd> rpm
        </p>
      </div>
    </div>
  );
}
