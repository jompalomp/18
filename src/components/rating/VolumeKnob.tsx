"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState } from "react";
import { RATING_MAX, type Rating } from "@/lib/rating";
import { useRatingControl } from "./useRatingControl";

type Props = {
  value: Rating;
  onChange?: (value: number) => void;
  /** Tillgängligt namn, t.ex. "Albumbetyg". */
  label: string;
  /** Diameter i px. */
  size?: number;
  readOnly?: boolean;
  /** Visa siffran i en liten display under ratten. */
  showReadout?: boolean;
  className?: string;
};

// Ratten sveper 270°: läge 1 vid −135°, läge 10 vid +135°.
const SWEEP_START = -135;
const STEP_DEG = 270 / (RATING_MAX - 1);
const OFF_ANGLE = SWEEP_START - 18; // vila när inget betyg är satt
const DRAG_PX_PER_STEP = 16;

const C = 50; // mitt i viewBox 0–100
const KNOB_R = 31;

function angleFor(value: Rating) {
  return value == null ? OFF_ANGLE : SWEEP_START + (value - 1) * STEP_DEG;
}

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
}

/**
 * Volymratten: albumbetyg 1–10 med tio tydliga lägen.
 * Dra uppåt/nedåt (eller åt höger/vänster) på ratten, eller tryck/vrid
 * direkt på LED-ringen. Piltangenter, Home/End och siffror fungerar också.
 */
export function VolumeKnob({
  value,
  onChange,
  label,
  size = 160,
  readOnly,
  showReadout = true,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<
    | { mode: "relative"; startX: number; startY: number; startValue: number }
    | { mode: "absolute" }
    | null
  >(null);
  const [active, setActive] = useState(false);
  const gradId = useId();

  const { ariaProps, commit, valueRef, interactive } = useRatingControl({
    value,
    onChange,
    label,
    readOnly,
  });

  /** Pekarens vinkel (0° = upp, medurs positivt) och avstånd från mitten, i viewBox-enheter. */
  function locate(e: React.PointerEvent) {
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = 100 / rect.width;
    const dx = (e.clientX - rect.left) * scale - C;
    const dy = (e.clientY - rect.top) * scale - C;
    return {
      angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
      dist: Math.hypot(dx, dy),
    };
  }

  function valueFromAngle(angle: number): number | null {
    if (angle < SWEEP_START - STEP_DEG || angle > -SWEEP_START + STEP_DEG) return null;
    return Math.round((angle - SWEEP_START) / STEP_DEG) + 1;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!interactive || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActive(true);
    const { angle, dist } = locate(e);
    if (dist > KNOB_R + 2) {
      // Tryck på LED-ringen: hoppa direkt till läget och vrid därifrån.
      drag.current = { mode: "absolute" };
      const v = valueFromAngle(angle);
      if (v != null) commit(v);
    } else {
      drag.current = {
        mode: "relative",
        startX: e.clientX,
        startY: e.clientY,
        startValue: valueRef.current ?? 0,
      };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    if (d.mode === "absolute") {
      const v = valueFromAngle(locate(e).angle);
      if (v != null) commit(v);
    } else {
      const delta = (d.startY - e.clientY + (e.clientX - d.startX)) / DRAG_PX_PER_STEP;
      commit(Math.max(1, d.startValue + Math.round(delta)));
    }
  }

  function endDrag() {
    drag.current = null;
    setActive(false);
  }

  const angle = angleFor(value);
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 900, damping: 26, mass: 0.5 };

  return (
    <div
      className={`inline-flex flex-col items-center gap-3 ${className}`}
      style={{ width: size }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        width={size}
        height={size}
        {...ariaProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`select-none rounded-full outline-offset-4 ${
          interactive ? (active ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
        style={{ touchAction: interactive ? "none" : undefined }}
      >
        <defs>
          <radialGradient id={`${gradId}-top`} cx="40%" cy="32%" r="75%">
            <stop offset="0%" stopColor="var(--knob-top)" />
            <stop offset="100%" stopColor="var(--knob-side)" />
          </radialGradient>
          <radialGradient id={`${gradId}-shadow`} cx="50%" cy="56%" r="50%">
            <stop offset="60%" stopColor="black" stopOpacity="0.22" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* LED-ring: tio segment, det sista i accentfärg (peak). */}
        {Array.from({ length: RATING_MAX }, (_, i) => {
          const step = i + 1;
          const deg = SWEEP_START + i * STEP_DEG;
          const a = polar(40, deg);
          const b = polar(46, deg);
          const lit = value != null && step <= value;
          const peak = step === RATING_MAX;
          return (
            <line
              key={step}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={peak ? 4.2 : 3.4}
              strokeLinecap="round"
              style={{
                stroke: lit ? (peak ? "var(--accent)" : "var(--led-on)") : "var(--led-off)",
                filter: lit && peak ? "drop-shadow(0 0 2.5px var(--accent))" : undefined,
                transition: "stroke 90ms linear",
              }}
            />
          );
        })}

        {/* Skugga under ratten */}
        <circle cx={C} cy={C + 2.5} r={KNOB_R + 3} fill={`url(#${gradId}-shadow)`} />

        {/* Själva ratten – roterar som en enhet och snäpper i lägen. */}
        <motion.g
          initial={false}
          animate={{ rotate: angle }}
          transition={spring}
          style={{ transformOrigin: "50px 50px", transformBox: "view-box" }}
        >
          <circle
            cx={C}
            cy={C}
            r={KNOB_R}
            fill={`url(#${gradId}-top)`}
            stroke="var(--line)"
            strokeWidth={0.6}
          />
          {/* Räffling längs kanten */}
          {Array.from({ length: 48 }, (_, i) => {
            const a = polar(KNOB_R - 0.4, i * 7.5);
            const b = polar(KNOB_R - 2.8, i * 7.5);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--fg)"
                strokeOpacity={0.09}
                strokeWidth={0.6}
              />
            );
          })}
          <circle cx={C} cy={C} r={KNOB_R - 6} fill="none" stroke="var(--fg)" strokeOpacity={0.05} />
          {/* Markering */}
          <line
            x1={C}
            y1={C - KNOB_R + 5}
            x2={C}
            y2={C - KNOB_R + 13}
            strokeWidth={2.6}
            strokeLinecap="round"
            style={{
              stroke: value === RATING_MAX ? "var(--accent)" : "var(--fg)",
              transition: "stroke 120ms linear",
            }}
          />
        </motion.g>
      </svg>

      {showReadout && <KnobReadout value={value} />}
    </div>
  );
}

function KnobReadout({ value }: { value: Rating }) {
  return (
    <div
      aria-hidden
      className="lcd relative rounded-md bg-lcd-bg px-2.5 py-1 text-lg leading-none text-lcd-fg"
    >
      {/* "Spöksegment" bakom siffrorna, som på en riktig display */}
      <span className="absolute inset-0 px-2.5 py-1" style={{ color: "var(--lcd-ghost)" }}>
        88
      </span>
      <span
        className="relative"
        style={{ color: value === RATING_MAX ? "var(--accent)" : undefined }}
      >
        {value == null ? "--" : String(value).padStart(2, "0")}
      </span>
    </div>
  );
}
