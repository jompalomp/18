"use client";

import { useSyncExternalStore } from "react";
import type { AlbumSummary } from "@/lib/music/types";

/*
 * Lokal lagring (localStorage) tills Supabase är inkopplat.
 * Formen speglar datamodellen: album_logs, track_ratings, queue, favorites, follows.
 */

export type AlbumLog = {
  albumId: string;
  rating: number | null;
  review: string;
  listenedOn: string; // ÅÅÅÅ-MM-DD
  relisten: boolean;
  loggedAt: string; // ISO-tid
};

export type Profile = {
  username: string;
  displayName: string;
  bio: string;
};

export type State = {
  version: 1;
  profile: Profile;
  /** Ett loggat album per album-id. */
  logs: Record<string, AlbumLog>;
  /** Låtbetyg per låt-id. */
  trackRatings: Record<string, number>;
  /** Metadata för alla album vi refererar till, så att listor kan visas offline. */
  albums: Record<string, AlbumSummary>;
  queue: { albumId: string; addedAt: string }[];
  favorites: (string | null)[]; // exakt 4 platser
  favoriteArtists: string[];
  follows: string[];
};

const KEY = "varvtal:v1";

const INITIAL: State = {
  version: 1,
  profile: { username: "jag", displayName: "Du", bio: "" },
  logs: {},
  trackRatings: {},
  albums: {},
  queue: [],
  favorites: [null, null, null, null],
  favoriteArtists: [],
  follows: ["saga", "nora"],
};

let state: State = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...INITIAL, ...(JSON.parse(raw) as Partial<State>) };
  } catch {
    // Trasig eller blockerad lagring: börja om från tomt.
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      state = { ...INITIAL, ...(JSON.parse(e.newValue) as Partial<State>) };
      listeners.forEach((l) => l());
    } catch {
      /* ignoreras */
    }
  });
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

export function useVarvtal(): State {
  return useSyncExternalStore(subscribe, getSnapshot, () => INITIAL);
}

export function update(fn: (s: State) => State) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* privat läge e.d. */
  }
  listeners.forEach((l) => l());
}

export function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function remember(s: State, album: AlbumSummary): State["albums"] {
  return { ...s.albums, [album.id]: album };
}

// ---------------------------------------------------------------- Åtgärder

/** Skapar eller uppdaterar loggen för ett album. */
export function saveLog(album: AlbumSummary, patch: Partial<Omit<AlbumLog, "albumId">>) {
  update((s) => {
    const prev = s.logs[album.id];
    const defaults: AlbumLog = {
      albumId: album.id,
      rating: null,
      review: "",
      listenedOn: today(),
      relisten: false,
      loggedAt: "",
    };
    const log: AlbumLog = {
      ...(prev ?? defaults),
      ...patch,
      loggedAt: prev?.loggedAt ?? new Date().toISOString(),
    };
    return {
      ...s,
      albums: remember(s, album),
      logs: { ...s.logs, [album.id]: log },
      // Har man lyssnat på det så ligger det inte kvar i kön.
      queue: s.queue.filter((q) => q.albumId !== album.id),
    };
  });
}

export function deleteLog(albumId: string) {
  update((s) => {
    const logs = { ...s.logs };
    delete logs[albumId];
    return { ...s, logs };
  });
}

export function rateTrack(album: AlbumSummary, trackId: string, rating: number) {
  update((s) => ({
    ...s,
    albums: remember(s, album),
    trackRatings: { ...s.trackRatings, [trackId]: rating },
  }));
}

export function toggleQueue(album: AlbumSummary) {
  update((s) => {
    const inQueue = s.queue.some((q) => q.albumId === album.id);
    return {
      ...s,
      albums: remember(s, album),
      queue: inQueue
        ? s.queue.filter((q) => q.albumId !== album.id)
        : [{ albumId: album.id, addedAt: new Date().toISOString() }, ...s.queue],
    };
  });
}

/** Lägger till albumet på första lediga plats i CD-stället, eller tar bort det. */
export function toggleFavorite(album: AlbumSummary): "added" | "removed" | "full" {
  let result: "added" | "removed" | "full" = "full";
  update((s) => {
    const idx = s.favorites.indexOf(album.id);
    if (idx >= 0) {
      result = "removed";
      return { ...s, favorites: s.favorites.map((f) => (f === album.id ? null : f)) };
    }
    const free = s.favorites.indexOf(null);
    if (free < 0) return s;
    result = "added";
    const favorites = [...s.favorites];
    favorites[free] = album.id;
    return { ...s, albums: remember(s, album), favorites };
  });
  return result;
}

export function setFavoriteArtists(artists: string[]) {
  update((s) => ({ ...s, favoriteArtists: artists }));
}

export function toggleFollow(username: string) {
  update((s) => ({
    ...s,
    follows: s.follows.includes(username)
      ? s.follows.filter((u) => u !== username)
      : [...s.follows, username],
  }));
}

export function updateProfile(patch: Partial<Profile>) {
  update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
}
