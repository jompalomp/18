/** Ett påhittat omslag för demodata – ritas med CSS, inga bildfiler. */
export type CoverArt = {
  bg: string;
  fg: string;
  motif: "circle" | "stripes" | "grid" | "wave" | "split" | "dot";
};

/** Det vi behöver för att visa ett album i listor, fodral och flöden. */
export type AlbumSummary = {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  art?: CoverArt;
  genre?: string;
  trackCount?: number;
};

export type Track = {
  id: string;
  number: number;
  disc: number;
  title: string;
  durationMs: number | null;
  previewUrl: string | null;
};

export type Album = AlbumSummary & {
  tracks: Track[];
  copyright?: string;
};

export type MusicSource = "itunes" | "demo";
