"use client";

import Link from "next/link";
import { useState } from "react";
import { AlbumCard } from "@/components/album/AlbumCard";
import { Avatar } from "@/components/ui/Avatar";
import { SectionTitle } from "@/components/layout/AppShell";
import { CdRack } from "@/components/profile/CdRack";
import { RatingDistribution } from "@/components/profile/RatingDistribution";
import { Lcd } from "@/components/ui/Lcd";
import { formatDay } from "@/lib/format";
import { getDemoAlbum, toSummary } from "@/lib/mock/catalog";
import { demoLogsFor, getDemoUser } from "@/lib/mock/social";
import type { AlbumSummary } from "@/lib/music/types";
import { average, formatAverage } from "@/lib/rating";
import {
  setFavoriteArtists,
  toggleFollow,
  updateProfile,
  useVarvtal,
  type State,
} from "@/lib/store";

type Entry = { album: AlbumSummary; rating: number | null; listenedOn: string };

type ProfileData = {
  username: string;
  displayName: string;
  bio: string;
  color: string;
  favorites: (AlbumSummary | null)[];
  favoriteArtists: string[];
  entries: Entry[];
  own: boolean;
};

function demoSummary(id: string) {
  const a = getDemoAlbum(id);
  return a ? toSummary(a) : null;
}

function ownProfile(s: State): ProfileData {
  return {
    ...s.profile,
    color: "var(--fg)",
    favorites: s.favorites.map((id) => (id ? (s.albums[id] ?? null) : null)),
    favoriteArtists: s.favoriteArtists,
    entries: Object.values(s.logs)
      .filter((l) => s.albums[l.albumId])
      .map((l) => ({ album: s.albums[l.albumId], rating: l.rating, listenedOn: l.listenedOn })),
    own: true,
  };
}

function demoProfile(username: string): ProfileData | null {
  const u = getDemoUser(username);
  if (!u) return null;
  return {
    username: u.username,
    displayName: u.displayName,
    bio: u.bio,
    color: u.color,
    favorites: u.favorites.map(demoSummary),
    favoriteArtists: u.favoriteArtists,
    entries: demoLogsFor(u.username).flatMap((l) => {
      const album = demoSummary(l.albumId);
      return album ? [{ album, rating: l.rating, listenedOn: l.listenedOn }] : [];
    }),
    own: false,
  };
}

export function ProfileView({ username }: { username: string }) {
  const s = useVarvtal();
  const data = username === s.profile.username ? ownProfile(s) : demoProfile(username);

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Ingen användare med namnet @{username}</h1>
        <Link href="/hem" className="mt-6 inline-block text-sm text-muted underline underline-offset-4">
          Till flödet
        </Link>
      </main>
    );
  }

  const entries = [...data.entries].sort((a, b) => b.listenedOn.localeCompare(a.listenedOn));
  const ratings = entries.map((e) => e.rating).filter((r): r is number => r != null);
  const avg = average(ratings);
  const following = s.follows.includes(data.username);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      {/* ------------------------------------------------ Huvud */}
      <section className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-12">
        <div className="flex items-center gap-4">
          <Avatar name={data.displayName} color={data.color} size={64} />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{data.displayName}</h1>
            <p className="text-sm text-muted">@{data.username}</p>
          </div>
        </div>
        {data.own ? (
          <EditProfile />
        ) : (
          <button
            type="button"
            onClick={() => toggleFollow(data.username)}
            aria-pressed={following}
            className={`self-start rounded-full border px-5 py-2 text-sm transition-colors sm:self-auto ${
              following ? "border-line text-muted hover:border-accent hover:text-accent" : "border-fg bg-fg text-bg"
            }`}
          >
            {following ? "Följer" : "Följ"}
          </button>
        )}
      </section>
      {data.bio && <p className="mt-4 max-w-prose text-muted">{data.bio}</p>}

      {/* ------------------------------------------------ CD-stället */}
      <section aria-labelledby="favoriter-h" className="mt-12">
        <SectionTitle id="favoriter-h">Favoriter</SectionTitle>
        <div className="mt-6 max-w-2xl">
          <CdRack albums={data.favorites} own={data.own} />
        </div>
        {data.own && (
          <p className="mt-4 text-xs text-muted">
            Ställ album i CD-stället från albumsidan. Fyra platser, välj med omsorg.
          </p>
        )}
      </section>

      {/* ------------------------------------------------ Statistik */}
      <section aria-labelledby="stat-h" className="mt-14 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionTitle id="stat-h">Statistik</SectionTitle>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <dt className="text-xs text-muted">Album loggade</dt>
              <dd>
                <Lcd className="text-4xl">{entries.length}</Lcd>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Snittbetyg</dt>
              <dd>
                <Lcd className="text-4xl">{avg == null ? "–" : formatAverage(avg)}</Lcd>
              </dd>
            </div>
          </dl>
          <FavoriteArtists artists={data.favoriteArtists} own={data.own} />
        </div>
        <div>
          <SectionTitle>Betygsfördelning</SectionTitle>
          <div className="mt-6">
            {ratings.length > 0 ? (
              <RatingDistribution ratings={ratings} />
            ) : (
              <p className="text-sm text-muted">Inga betyg än.</p>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Senast loggade */}
      <section aria-labelledby="senast-h" className="mt-14">
        <SectionTitle id="senast-h">Senast loggade</SectionTitle>
        {entries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
            <p className="text-sm text-muted">Inget loggat än.</p>
            {data.own && (
              <Link href="/sok" className="mt-4 inline-block rounded-full bg-fg px-5 py-2.5 text-sm text-bg">
                Logga ditt första album
              </Link>
            )}
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
            {entries.slice(0, 12).map((e) => (
              <li key={e.album.id}>
                <AlbumCard album={e.album} rating={e.rating} meta={formatDay(e.listenedOn)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function FavoriteArtists({ artists, own }: { artists: string[]; own: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="mt-10">
      <SectionTitle>Favoritartister</SectionTitle>
      <ul className="mt-4 flex flex-wrap gap-2">
        {artists.map((a) => (
          <li
            key={a}
            className="inline-flex items-center gap-1.5 rounded-full border border-line py-1 pr-1.5 pl-3 text-sm"
          >
            {a}
            {own && (
              <button
                type="button"
                onClick={() => setFavoriteArtists(artists.filter((x) => x !== a))}
                aria-label={`Ta bort ${a}`}
                className="grid h-5 w-5 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              >
                ×
              </button>
            )}
          </li>
        ))}
        {artists.length === 0 && !own && <li className="text-sm text-muted">Inga valda.</li>}
      </ul>
      {own && (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const name = draft.trim();
            if (name && !artists.includes(name)) setFavoriteArtists([...artists, name]);
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Lägg till artist"
            aria-label="Lägg till favoritartist"
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-1.5 text-sm focus:border-fg focus-visible:outline-none"
          />
          <button type="submit" className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-fg">
            Lägg till
          </button>
        </form>
      )}
    </div>
  );
}

function EditProfile() {
  const { profile } = useVarvtal();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setName(profile.displayName);
          setBio(profile.bio);
          setOpen(true);
        }}
        className="self-start rounded-full border border-line px-4 py-2 text-sm hover:border-fg sm:self-auto"
      >
        Redigera profil
      </button>
    );
  }
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile({ displayName: name.trim() || "Du", bio: bio.trim() });
        setOpen(false);
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Visningsnamn"
        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-fg focus-visible:outline-none"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        aria-label="Bio"
        placeholder="Något om din musiksmak"
        rows={2}
        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-fg focus-visible:outline-none"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-muted">
          Avbryt
        </button>
        <button type="submit" className="rounded-full bg-fg px-4 py-1.5 text-sm text-bg">
          Spara
        </button>
      </div>
    </form>
  );
}
