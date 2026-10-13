"use client";

import Link from "next/link";
import { MiniCurve } from "@/components/album/MiniCurve";
import { JewelCase } from "@/components/cd/JewelCase";
import { PageHeader, SectionTitle } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Lcd } from "@/components/ui/Lcd";
import { formatDay } from "@/lib/format";
import { getDemoAlbum, toSummary } from "@/lib/mock/catalog";
import { DEMO_LOGS, DEMO_USERS } from "@/lib/mock/social";
import type { AlbumSummary } from "@/lib/music/types";
import { RATING_MAX } from "@/lib/rating";
import { toggleFollow, useVarvtal } from "@/lib/store";

type FeedItem = {
  key: string;
  user: { username: string; displayName: string; color: string };
  album: AlbumSummary;
  rating: number | null;
  review?: string;
  listenedOn: string;
  relisten?: boolean;
  curve?: (number | null)[];
};

export function FeedView() {
  const s = useVarvtal();

  const friendItems: FeedItem[] = DEMO_LOGS.filter((l) => s.follows.includes(l.username)).flatMap((l) => {
    const album = getDemoAlbum(l.albumId);
    const user = DEMO_USERS.find((u) => u.username === l.username)!;
    if (!album) return [];
    return [
      {
        key: `${l.username}-${l.albumId}`,
        user,
        album: toSummary(album),
        rating: l.rating,
        review: l.review,
        listenedOn: l.listenedOn,
        relisten: l.relisten,
        curve: l.tracks,
      },
    ];
  });

  const myItems: FeedItem[] = Object.values(s.logs)
    .filter((l) => s.albums[l.albumId])
    .map((l) => {
      const full = getDemoAlbum(l.albumId);
      return {
        key: `me-${l.albumId}`,
        user: { username: s.profile.username, displayName: s.profile.displayName, color: "var(--fg)" },
        album: s.albums[l.albumId],
        rating: l.rating,
        review: l.review || undefined,
        listenedOn: l.listenedOn,
        relisten: l.relisten,
        curve: full?.tracks.map((t) => s.trackRatings[t.id] ?? null),
      };
    });

  const items = [...friendItems, ...myItems].sort(
    (a, b) => b.listenedOn.localeCompare(a.listenedOn) || a.key.localeCompare(b.key),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <PageHeader title="Vad har vi lyssnat på?" eyebrow="Flödet" />
      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        <section aria-label="Vänners loggar">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-medium">Tyst i högtalarna</p>
              <p className="mt-1 text-sm text-muted">Följ några vänner så ser du vad de lyssnar på.</p>
            </div>
          ) : (
            <ol className="divide-y divide-line border-y border-line">
              {items.map((it) => (
                <FeedRow key={it.key} item={it} me={it.user.username === s.profile.username} />
              ))}
            </ol>
          )}
        </section>

        <aside aria-labelledby="folj-h">
          <SectionTitle id="folj-h">Folk att följa</SectionTitle>
          <ul className="mt-4 flex flex-col gap-3">
            {DEMO_USERS.map((u) => {
              const following = s.follows.includes(u.username);
              return (
                <li key={u.username} className="flex items-center gap-3">
                  <Avatar name={u.displayName} color={u.color} />
                  <Link href={`/u/${u.username}`} className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium hover:underline">{u.displayName}</span>
                    <span className="block truncate text-xs text-muted">@{u.username}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFollow(u.username)}
                    aria-pressed={following}
                    aria-label={`${following ? "Sluta följa" : "Följ"} ${u.displayName}`}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      following ? "border-line text-muted hover:text-accent" : "border-fg bg-fg text-bg"
                    }`}
                  >
                    {following ? "Följer" : "Följ"}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Demoanvändare tills inloggning och riktiga konton är på plats.
          </p>
        </aside>
      </div>
    </main>
  );
}

function FeedRow({ item, me }: { item: FeedItem; me: boolean }) {
  const { user, album, rating } = item;
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/album/${album.id}`} className="w-16 shrink-0 sm:w-20" aria-hidden tabIndex={-1}>
        <JewelCase album={album} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">
          <Link href={`/u/${user.username}`} className="font-medium text-fg hover:underline">
            {me ? "Du" : user.displayName}
          </Link>{" "}
          {item.relisten ? "lyssnade igen på" : "loggade"}
        </p>
        <Link href={`/album/${album.id}`} className="mt-0.5 block truncate font-medium hover:underline">
          {album.title}
        </Link>
        <p className="truncate text-sm text-muted">{album.artist}</p>
        {item.review && <p className="mt-2 text-sm leading-relaxed">”{item.review}”</p>}
        <p className="mt-2 text-xs text-muted">{formatDay(item.listenedOn)}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        {rating != null ? (
          <Lcd className="text-2xl" peak={rating === RATING_MAX}>
            <span className="sr-only">Betyg </span>
            {String(rating).padStart(2, "0")}
          </Lcd>
        ) : (
          <span className="lcd text-2xl text-muted">--</span>
        )}
        {item.curve && <MiniCurve ratings={item.curve} />}
      </div>
    </li>
  );
}
