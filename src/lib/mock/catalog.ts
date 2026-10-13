import type { Album, AlbumSummary, CoverArt } from "@/lib/music/types";

/*
 * Demokatalog: påhittade album och artister. Används när iTunes inte går att nå
 * (t.ex. offline) och för att visa vänflödet innan Supabase är inkopplat.
 */

type Seed = {
  slug: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  art: CoverArt;
  tracks: [string, string][]; // [titel, längd]
};

const SEEDS: Seed[] = [
  {
    slug: "sodermalm-i-regn",
    title: "Södermalm i regn",
    artist: "Elin Vass",
    year: 2019,
    genre: "Pop",
    art: { bg: "#1f3a5f", fg: "#f2c14e", motif: "circle" },
    tracks: [
      ["Inledning", "1:48"],
      ["Nattbuss", "3:52"],
      ["Södermalm i regn", "4:31"],
      ["Kassettband", "3:07"],
      ["Fönster mot gården", "3:44"],
      ["Lågt i mixen", "2:59"],
      ["Allt du sa i juni", "4:04"],
      ["Sista spåret", "6:21"],
    ],
  },
  {
    slug: "kassettbandet",
    title: "Kassettbandet",
    artist: "Mikael & Mörkret",
    year: 1987,
    genre: "Rock",
    art: { bg: "#e9e2d0", fg: "#c0392b", motif: "stripes" },
    tracks: [
      ["Spola tillbaka", "3:21"],
      ["Bandsallad", "2:48"],
      ["Sida A", "4:10"],
      ["Mörkret kommer", "5:02"],
      ["Bilradio", "3:33"],
      ["Sida B", "4:27"],
      ["Chrome 90", "3:15"],
      ["Spola fram", "2:41"],
      ["Slutet av bandet", "6:08"],
    ],
  },
  {
    slug: "varvtal",
    title: "Varvtal",
    artist: "Nordkust",
    year: 2023,
    genre: "Elektroniskt",
    art: { bg: "#0f0f10", fg: "#ff3b30", motif: "grid" },
    tracks: [
      ["33", "4:12"],
      ["45", "5:30"],
      ["78", "3:58"],
      ["Tonarm", "6:44"],
      ["Statisk", "4:01"],
      ["Rillor", "5:17"],
      ["Utlopp", "7:22"],
    ],
  },
  {
    slug: "sommaren-som-aldrig-kom",
    title: "Sommaren som aldrig kom",
    artist: "Tove Linnea",
    year: 2021,
    genre: "Singer/songwriter",
    art: { bg: "#f4d8c8", fg: "#2d4a3e", motif: "wave" },
    tracks: [
      ["Midsommarafton i november", "3:41"],
      ["Brygga", "2:56"],
      ["Myggor & minnen", "3:30"],
      ["Regnjacka", "4:18"],
      ["Vi badar ändå", "3:02"],
      ["Augustimörker", "4:45"],
      ["Kom igen nästa år", "5:10"],
    ],
  },
  {
    slug: "betong-och-blommor",
    title: "Betong & blommor",
    artist: "Ord från förorten",
    year: 2016,
    genre: "Hiphop",
    art: { bg: "#7a7a72", fg: "#f6f5f1", motif: "split" },
    tracks: [
      ["Intro (Centrum)", "1:20"],
      ["Tunnelbanan", "3:44"],
      ["Grå", "3:12"],
      ["Blommor i asfalten", "4:02"],
      ["Mamma sa", "3:55"],
      ["Balkongen", "3:28"],
      ["Linje 17", "4:10"],
      ["Hem", "4:33"],
      ["Outro (Förort)", "2:05"],
    ],
  },
  {
    slug: "langsamma-latar",
    title: "Långsamma låtar",
    artist: "Kvartetten Grå",
    year: 2008,
    genre: "Jazz",
    art: { bg: "#2b2a28", fg: "#d8cfb8", motif: "dot" },
    tracks: [
      ["Adagio för kontrabas", "7:12"],
      ["Söndag", "6:03"],
      ["Rökringar", "8:21"],
      ["Långsamt, långsamt", "5:48"],
      ["Efter stängning", "9:40"],
    ],
  },
  {
    slug: "peak",
    title: "Peak",
    artist: "REC",
    year: 2024,
    genre: "Elektroniskt",
    art: { bg: "#e5322d", fg: "#141414", motif: "circle" },
    tracks: [
      ["Nivå", "3:33"],
      ["Clip", "2:58"],
      ["Rött ljus", "4:20"],
      ["Overdrive", "3:47"],
      ["0 dB", "5:05"],
      ["Brus", "4:11"],
      ["Tystnad efter", "3:02"],
    ],
  },
  {
    slug: "fjarde-vaningen",
    title: "Fjärde våningen",
    artist: "Hus",
    year: 2012,
    genre: "Indie",
    art: { bg: "#d7e3e8", fg: "#1e1e1e", motif: "grid" },
    tracks: [
      ["Hiss ur funktion", "3:10"],
      ["Grannen spelar piano", "4:02"],
      ["Trapphus", "3:36"],
      ["Takterrass", "4:44"],
      ["Tvättstugan", "2:51"],
      ["Fjärde våningen", "5:23"],
      ["Flyttkartonger", "3:58"],
      ["Nyckeln under mattan", "4:15"],
    ],
  },
  {
    slug: "glod",
    title: "Glöd",
    artist: "Ida Strand",
    year: 2018,
    genre: "Soul",
    art: { bg: "#3b1f1a", fg: "#f0a35e", motif: "wave" },
    tracks: [
      ["Glöd", "4:05"],
      ["Värme", "3:50"],
      ["Långsam eld", "4:38"],
      ["Aska", "3:21"],
      ["Tänd igen", "4:12"],
      ["Natten är ung", "5:01"],
    ],
  },
  {
    slug: "b-sidor",
    title: "B-sidor 1995–2005",
    artist: "Radiovåg",
    year: 2006,
    genre: "Alternativ",
    art: { bg: "#f6f5f1", fg: "#1f3a5f", motif: "stripes" },
    tracks: [
      ["Bonusspår", "3:12"],
      ["Demo 4", "2:44"],
      ["Repetitionslokalen", "4:30"],
      ["Akustisk version", "3:51"],
      ["Outtake", "2:20"],
      ["Liveversion (Göteborg)", "5:43"],
      ["Singelversion", "3:35"],
      ["Den vi glömde", "4:08"],
      ["Gömt spår", "7:01"],
    ],
  },
];

function ms(len: string) {
  const [m, s] = len.split(":").map(Number);
  return (m * 60 + s) * 1000;
}

export const DEMO_ALBUMS: Album[] = SEEDS.map((s) => ({
  id: `demo-${s.slug}`,
  title: s.title,
  artist: s.artist,
  year: s.year,
  coverUrl: null,
  art: s.art,
  genre: s.genre,
  trackCount: s.tracks.length,
  copyright: `℗ ${s.year} ${s.artist}`,
  tracks: s.tracks.map(([title, len], i) => ({
    id: `demo-${s.slug}-${i + 1}`,
    number: i + 1,
    disc: 1,
    title,
    durationMs: ms(len),
    previewUrl: null,
  })),
}));

const BY_ID = new Map(DEMO_ALBUMS.map((a) => [a.id, a]));

export function getDemoAlbum(id: string): Album | null {
  return BY_ID.get(id) ?? null;
}

export function toSummary(a: Album | AlbumSummary): AlbumSummary {
  return {
    id: a.id,
    title: a.title,
    artist: a.artist,
    year: a.year,
    coverUrl: a.coverUrl,
    art: a.art,
    genre: a.genre,
    trackCount: a.trackCount,
  };
}

function normalize(s: string) {
  return s
    .toLocaleLowerCase("sv-SE")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function searchDemoAlbums(query: string): AlbumSummary[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return DEMO_ALBUMS.filter((a) =>
    [a.title, a.artist, a.genre ?? "", ...a.tracks.map((t) => t.title)].some((f) =>
      normalize(f).includes(q),
    ),
  ).map(toSummary);
}
