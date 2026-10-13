import { getDemoAlbum, searchDemoAlbums } from "@/lib/mock/catalog";
import { itunesGetAlbum, itunesSearchAlbums } from "./itunes";
import type { Album, AlbumSummary, MusicSource } from "./types";

/*
 * Musikdata på serversidan. iTunes används i första hand; går den inte att nå
 * faller vi tillbaka på demokatalogen så att appen alltid går att använda.
 * Sätt VARVTAL_MUSIC_SOURCE=demo för att bara använda demodata.
 */

const demoOnly = process.env.VARVTAL_MUSIC_SOURCE === "demo";

export async function searchAlbums(
  query: string,
): Promise<{ results: AlbumSummary[]; source: MusicSource }> {
  const demo = searchDemoAlbums(query);
  if (demoOnly) return { results: demo, source: "demo" };
  try {
    const results = await itunesSearchAlbums(query);
    return { results, source: "itunes" };
  } catch (err) {
    console.warn("[varvtal] iTunes-sökning misslyckades, visar demodata:", err);
    return { results: demo, source: "demo" };
  }
}

export async function getAlbum(id: string): Promise<Album | null> {
  if (id.startsWith("demo-")) return getDemoAlbum(id);
  if (demoOnly) return null;
  try {
    return await itunesGetAlbum(id);
  } catch (err) {
    console.warn(`[varvtal] Kunde inte hämta album ${id} från iTunes:`, err);
    return null;
  }
}

export type { Album, AlbumSummary, Track, MusicSource } from "./types";
