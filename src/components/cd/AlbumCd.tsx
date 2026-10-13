"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { AlbumSummary } from "@/lib/music/types";
import { rpmForRating, type Rating } from "@/lib/rating";
import { Disc } from "./Disc";
import { JewelCase } from "./JewelCase";

type Props = {
  album: AlbumSummary;
  rating: Rating;
  /** Bredd på fodralet i px. Hela komponenten blir ca 1,6 gånger bredare. */
  size?: number;
  /** Öppna fodralet automatiskt efter en kort stund. */
  autoOpen?: boolean;
  className?: string;
};

const DISC = 0.92; // skivans diameter relativt fodralet
const OUT = 0.62; // hur långt skivan glider ut

/**
 * Fodral + skiva. Klick på fodralet låter skivan glida ut och snurra med
 * ett varvtal som styrs av betyget.
 */
export function AlbumCd({ album, rating, size = 220, autoOpen = true, className = "" }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    const t = setTimeout(() => setOpen(true), reduce ? 0 : 450);
    return () => clearTimeout(t);
  }, [autoOpen, reduce]);

  const disc = size * DISC;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size * (0.04 + OUT + DISC), height: size }}
    >
      <motion.div
        className="absolute"
        style={{ top: (size - disc) / 2, left: size * 0.04, width: disc, height: disc }}
        initial={false}
        animate={{ x: open ? size * OUT : 0 }}
        transition={
          reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 20, mass: 0.9 }
        }
      >
        <Disc album={album} rpm={rpmForRating(rating)} spinning={open} />
      </motion.div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={open ? "Lägg tillbaka skivan i fodralet" : "Ta ut skivan ur fodralet"}
        className="group absolute top-0 left-0 rounded-[3px]"
        style={{ width: size, height: size }}
      >
        <motion.div
          whileHover={reduce ? undefined : { rotate: -0.8, y: -2 }}
          whileTap={reduce ? undefined : { scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="h-full w-full"
        >
          <JewelCase album={album} />
        </motion.div>
      </button>
    </div>
  );
}
