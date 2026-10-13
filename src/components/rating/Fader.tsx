"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { RATING_MAX, RATING_MIN, type Rating } from "@/lib/rating";
import { useRatingControl } from "./useRatingControl";

type Props = {
  value: Rating;
  onChange?: (value: number) => void;
  /** Tillgängligt namn, t.ex. "Betyg för Låt 3". */
  label: string;
  orientation?: "vertical" | "horizontal";
  /** Längd på reglaget i px. */
  length?: number;
  readOnly?: boolean;
  className?: string;
};

const CAP_LONG = 22; // fadermössans längd längs rörelseriktningen
const CAP_SHORT = 30; // och tvärs över
const THICKNESS = 36;

/**
 * Fadern: låtbetyg 1–10 som ett skjutreglage på ett mixerbord.
 * Tryck var som helst på spåret för att hoppa dit och dra vidare.
 */
export function Fader({
  value,
  onChange,
  label,
  orientation = "vertical",
  length = 150,
  readOnly,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const vertical = orientation === "vertical";

  const { ariaProps, commit, interactive } = useRatingControl({
    value,
    onChange,
    label,
    readOnly,
    orientation,
  });

  const travel = length - CAP_LONG;
  const stepPx = travel / (RATING_MAX - RATING_MIN);
  /** Avstånd från "botten" (1) till mössans mitt. */
  const offsetFor = (v: Rating) => (v == null ? 0 : (v - RATING_MIN) * stepPx);

  function valueFromPointer(e: React.PointerEvent) {
    const rect = trackRef.current!.getBoundingClientRect();
    const pos = vertical
      ? rect.bottom - e.clientY - CAP_LONG / 2
      : e.clientX - rect.left - CAP_LONG / 2;
    return Math.round(pos / stepPx) + RATING_MIN;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    commit(valueFromPointer(e));
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragging) commit(valueFromPointer(e));
  }

  const end = () => setDragging(false);
  const offset = offsetFor(value);
  const peak = value === RATING_MAX;
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 1100, damping: 34, mass: 0.4 };

  return (
    <div
      ref={trackRef}
      {...ariaProps}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      className={`relative shrink-0 select-none rounded-md ${
        interactive ? (dragging ? "cursor-grabbing" : "cursor-pointer") : ""
      } ${className}`}
      style={{
        width: vertical ? THICKNESS : length,
        height: vertical ? length : THICKNESS,
        touchAction: interactive ? "none" : undefined,
      }}
    >
      {/* Skalstreck: ett per läge, toppen markerad i accentfärg */}
      {Array.from({ length: RATING_MAX }, (_, i) => {
        const step = i + RATING_MIN;
        const pos = CAP_LONG / 2 + i * stepPx;
        const major = step === 1 || step === 5 || step === RATING_MAX;
        const lit = value != null && step <= value;
        return (
          <span
            key={step}
            aria-hidden
            className="absolute"
            style={{
              ...(vertical
                ? { bottom: pos, left: 0, width: major ? 7 : 4, height: 1 }
                : { left: pos, bottom: 0, height: major ? 7 : 4, width: 1 }),
              background:
                step === RATING_MAX && lit
                  ? "var(--accent)"
                  : lit
                    ? "var(--fg)"
                    : "var(--line)",
              transition: "background 90ms linear",
            }}
          />
        );
      })}

      {/* Spåret (slitsen) */}
      <span
        aria-hidden
        className="absolute rounded-full bg-surface-2"
        style={
          vertical
            ? { left: "50%", top: CAP_LONG / 2, bottom: CAP_LONG / 2, width: 4, marginLeft: -2 }
            : { top: "50%", left: CAP_LONG / 2, right: CAP_LONG / 2, height: 4, marginTop: -2 }
        }
      >
        <span
          className="absolute rounded-full"
          style={{
            ...(vertical
              ? { left: 0, right: 0, bottom: 0, height: value == null ? 0 : offset }
              : { top: 0, bottom: 0, left: 0, width: value == null ? 0 : offset }),
            background: peak ? "var(--accent)" : "var(--fg)",
            opacity: peak ? 1 : 0.55,
            transition: reduce ? undefined : "height 120ms ease-out, width 120ms ease-out",
          }}
        />
      </span>

      {/* Fadermössan */}
      <motion.span
        aria-hidden
        initial={false}
        animate={vertical ? { y: -offset } : { x: offset }}
        transition={spring}
        className="absolute flex items-center justify-center rounded-[4px] border border-line bg-surface"
        style={{
          ...(vertical
            ? { left: "50%", bottom: 0, marginLeft: -CAP_SHORT / 2, width: CAP_SHORT, height: CAP_LONG }
            : { top: "50%", left: 0, marginTop: -CAP_SHORT / 2, width: CAP_LONG, height: CAP_SHORT }),
          boxShadow: "var(--shadow)",
          opacity: value == null ? 0.55 : 1,
        }}
      >
        <span
          className="rounded-full"
          style={{
            ...(vertical ? { width: CAP_SHORT - 10, height: 2 } : { width: 2, height: CAP_SHORT - 10 }),
            background: peak ? "var(--accent)" : "var(--fg)",
            transition: "background 120ms linear",
          }}
        />
      </motion.span>
    </div>
  );
}
