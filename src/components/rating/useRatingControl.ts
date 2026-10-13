"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSettings } from "@/components/providers/settings";
import { playDetentClick } from "@/lib/click-sound";
import { RATING_MAX, RATING_MIN, clampRating, type Rating } from "@/lib/rating";

type Options = {
  value: Rating;
  onChange?: (value: number) => void;
  label: string;
  readOnly?: boolean;
  orientation?: "horizontal" | "vertical";
};

/**
 * Gemensam logik för ratten och fadern: tangentbord, ARIA,
 * och "klicket" (ljud + haptik) när ett nytt läge nås.
 */
export function useRatingControl({
  value,
  onChange,
  label,
  readOnly,
  orientation,
}: Options) {
  const { clickSound } = useSettings();
  const interactive = !readOnly && !!onChange;

  // Senaste värdet i en ref så att pekarhanterare alltid ser aktuellt läge.
  const valueRef = useRef<Rating>(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const commit = useCallback(
    (next: number) => {
      if (!interactive) return;
      const v = clampRating(next);
      if (v === valueRef.current) return;
      valueRef.current = v;
      if (clickSound) playDetentClick(v === RATING_MAX);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(v === RATING_MAX ? 12 : 4);
        } catch {
          /* ignoreras */
        }
      }
      onChange?.(v);
    },
    [interactive, clickSound, onChange],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!interactive) return;
      const current = valueRef.current;
      let next: number | null = null;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          next = current == null ? RATING_MIN : current + 1;
          break;
        case "ArrowDown":
        case "ArrowLeft":
          next = current == null ? RATING_MIN : current - 1;
          break;
        case "PageUp":
          next = (current ?? RATING_MIN) + 3;
          break;
        case "PageDown":
          next = (current ?? RATING_MIN) - 3;
          break;
        case "Home":
          next = RATING_MIN;
          break;
        case "End":
          next = RATING_MAX;
          break;
        default:
          // Sifferkortkommandon: 1–9, och 0 = 10.
          if (/^[0-9]$/.test(e.key)) next = e.key === "0" ? 10 : Number(e.key);
      }
      if (next != null) {
        e.preventDefault();
        commit(next);
      }
    },
    [interactive, commit],
  );

  const ariaProps = {
    role: "slider" as const,
    tabIndex: interactive ? 0 : -1,
    "aria-label": label,
    "aria-valuemin": RATING_MIN,
    "aria-valuemax": RATING_MAX,
    "aria-valuenow": value ?? undefined,
    "aria-valuetext": value == null ? "Inget betyg" : `${value} av ${RATING_MAX}`,
    "aria-readonly": readOnly || undefined,
    "aria-orientation": orientation,
    onKeyDown,
  };

  return { ariaProps, commit, valueRef, interactive };
}
