"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeChoice = "system" | "light" | "dark";

type Settings = {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
  /** Klickljud när ratten passerar ett läge. Avstängt som standard. */
  clickSound: boolean;
  setClickSound: (on: boolean) => void;
};

const SettingsContext = createContext<Settings | null>(null);

const THEME_KEY = "varvtal:theme";
const SOUND_KEY = "varvtal:click-sound";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // privat läge e.d.
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [clickSound, setClickSoundState] = useState(false);

  useEffect(() => {
    const t = read(THEME_KEY);
    if (t === "light" || t === "dark") setThemeState(t);
    setClickSoundState(read(SOUND_KEY) === "1");
  }, []);

  const setTheme = useCallback((t: ThemeChoice) => {
    setThemeState(t);
    write(THEME_KEY, t);
    const root = document.documentElement;
    if (t === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", t);
  }, []);

  const setClickSound = useCallback((on: boolean) => {
    setClickSoundState(on);
    write(SOUND_KEY, on ? "1" : "0");
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, clickSound, setClickSound }),
    [theme, setTheme, clickSound, setClickSound],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings måste användas inom <SettingsProvider>");
  return ctx;
}

/** Körs före första målning så att rätt tema syns direkt (ingen blixt). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
