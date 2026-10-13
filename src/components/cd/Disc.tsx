"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import type { AlbumSummary } from "@/lib/music/types";
import { Cover } from "./Cover";

/**
 * En CD-skiva med omslaget som tryck. Snurrar med angivet varvtal och
 * accelererar/bromsar mjukt när varvtalet ändras. Reflexerna står still
 * medan skivan snurrar under dem, som i verkligheten.
 */
export function Disc({
  album,
  rpm,
  spinning = true,
  className = "",
}: {
  album: Pick<AlbumSummary, "id" | "title" | "artist" | "coverUrl" | "art">;
  rpm: number;
  spinning?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0);
  const speed = useRef(0); // grader per sekund just nu

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const target = spinning ? rpm * 6 : 0; // rpm → grader/s
    // Tröghet: närma sig målfarten under ungefär en halv sekund.
    speed.current += (target - speed.current) * Math.min(1, delta / 350);
    if (Math.abs(speed.current) < 0.05) return;
    rotate.set((rotate.get() + (speed.current * delta) / 1000) % 360);
  });

  return (
    <div className={`relative aspect-square rounded-full ${className}`}>
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          rotate,
          // Hål i mitten
          WebkitMaskImage: "radial-gradient(circle, transparent 7.5%, #000 7.9%)",
          maskImage: "radial-gradient(circle, transparent 7.5%, #000 7.9%)",
          background: "#cfd0d4",
        }}
      >
        {/* Tryck */}
        <div className="absolute inset-[1.6%] overflow-hidden rounded-full">
          <Cover album={album} />
        </div>
        {/* Genomskinligt nav runt hålet */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "32%",
            background:
              "radial-gradient(circle, rgba(225,226,230,.95) 0 46%, rgba(190,192,198,.9) 47% 49%, rgba(235,236,240,.55) 50% 100%)",
            boxShadow: "0 0 0 1px rgba(0,0,0,.12)",
          }}
        />
        {/* Märke så att rotationen syns även på enfärgade tryck */}
        <div
          className="absolute rounded-full bg-black/25"
          style={{ left: "49%", top: "35%", width: "2%", height: "6%" }}
        />
      </motion.div>

      {/* Stillastående reflexer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          WebkitMaskImage: "radial-gradient(circle, transparent 7.5%, #000 7.9%)",
          maskImage: "radial-gradient(circle, transparent 7.5%, #000 7.9%)",
          background:
            "conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,.35) 25deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,.28) 205deg, rgba(255,255,255,0) 240deg)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15), 0 10px 30px -14px rgba(0,0,0,.5)",
        }}
      />
    </div>
  );
}
