import type { Album, AlbumSummary, Track } from "./types";

// iTunes Search API: gratis, ingen nyckel. Kontrollera villkoren före lansering.
const BASE = "https://itunes.apple.com";
const COUNTRY = "SE";

type ITunesCollection = {
  wrapperType: "collection";
  collectionId: number;
  collectionName: string;
  artistName: string;
  releaseDate?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  trackCount?: number;
  copyright?: string;
};

type ITunesTrack = {
  wrapperType: "track";
  trackId: number;
  trackName: string;
  trackNumber: number;
  discNumber?: number;
  trackTimeMillis?: number;
  previewUrl?: string;
};

function artwork(url: string | undefined, size = 600) {
  return url ? url.replace(/\/\d+x\d+bb\./, `/${size}x${size}bb.`) : null;
}

function toSummary(c: ITunesCollection): AlbumSummary {
  return {
    id: String(c.collectionId),
    title: c.collectionName,
    artist: c.artistName,
    year: c.releaseDate ? new Date(c.releaseDate).getFullYear() : null,
    coverUrl: artwork(c.artworkUrl100),
    genre: c.primaryGenreName,
    trackCount: c.trackCount,
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 60 * 60 * 24 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`iTunes svarade ${res.status}`);
  return res.json() as Promise<T>;
}

export async function itunesSearchAlbums(query: string): Promise<AlbumSummary[]> {
  const q = encodeURIComponent(query);
  const data = await get<{ results: ITunesCollection[] }>(
    `/search?term=${q}&media=music&entity=album&limit=30&country=${COUNTRY}`,
  );
  return data.results.filter((r) => r.wrapperType === "collection").map(toSummary);
}

export async function itunesGetAlbum(id: string): Promise<Album | null> {
  if (!/^\d+$/.test(id)) return null;
  const data = await get<{ results: (ITunesCollection | ITunesTrack)[] }>(
    `/lookup?id=${id}&entity=song&country=${COUNTRY}`,
  );
  const collection = data.results.find(
    (r): r is ITunesCollection => r.wrapperType === "collection",
  );
  if (!collection) return null;
  const tracks: Track[] = data.results
    .filter((r): r is ITunesTrack => r.wrapperType === "track")
    .map((t) => ({
      id: String(t.trackId),
      number: t.trackNumber,
      disc: t.discNumber ?? 1,
      title: t.trackName,
      durationMs: t.trackTimeMillis ?? null,
      previewUrl: t.previewUrl ?? null,
    }))
    .sort((a, b) => a.disc - b.disc || a.number - b.number);
  return { ...toSummary(collection), tracks, copyright: collection.copyright };
}
