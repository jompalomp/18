"use client";

import { useSettings, type ThemeChoice } from "@/components/providers/settings";

const THEMES: { id: ThemeChoice; label: string }[] = [
  { id: "system", label: "Auto" },
  { id: "light", label: "Ljust" },
  { id: "dark", label: "Mörkt" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useSettings();
  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className="inline-flex rounded-full border border-line p-0.5 text-xs"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={theme === t.id}
          onClick={() => setTheme(t.id)}
          className={`rounded-full px-3 py-1 transition-colors ${
            theme === t.id ? "bg-fg text-bg" : "text-muted hover:text-fg"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ClickSoundToggle() {
  const { clickSound, setClickSound } = useSettings();
  return (
    <button
      role="switch"
      aria-checked={clickSound}
      onClick={() => setClickSound(!clickSound)}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:text-fg"
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full transition-colors"
        style={{ background: clickSound ? "var(--accent)" : "var(--led-off)" }}
      />
      Klickljud {clickSound ? "på" : "av"}
    </button>
  );
}
