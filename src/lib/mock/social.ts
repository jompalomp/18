/*
 * Påhittade användare och deras loggar, så att vänflödet och vänners snitt
 * går att visa innan Supabase är inkopplat. Allt gäller bara demoalbumen.
 */

export type DemoUser = {
  username: string;
  displayName: string;
  bio: string;
  color: string;
  favorites: string[]; // album-id, max 4
  favoriteArtists: string[];
};

export type DemoLog = {
  username: string;
  albumId: string;
  rating: number;
  review?: string;
  listenedOn: string; // ÅÅÅÅ-MM-DD
  relisten?: boolean;
  /** Låtbetyg i spårordning (null = inte betygsatt). */
  tracks?: (number | null)[];
};

export const DEMO_USERS: DemoUser[] = [
  {
    username: "saga",
    displayName: "Saga Lind",
    bio: "Lyssnar på album i sin helhet, i rätt ordning. Alltid.",
    color: "#1f3a5f",
    favorites: ["demo-sodermalm-i-regn", "demo-langsamma-latar", "demo-glod", "demo-fjarde-vaningen"],
    favoriteArtists: ["Elin Vass", "Ida Strand", "Kvartetten Grå"],
  },
  {
    username: "olle",
    displayName: "Olle Berg",
    bio: "B-sidor > A-sidor.",
    color: "#c0392b",
    favorites: ["demo-b-sidor", "demo-kassettbandet", "demo-peak"],
    favoriteArtists: ["Radiovåg", "Mikael & Mörkret"],
  },
  {
    username: "nora",
    displayName: "Nora Karim",
    bio: "Elektroniskt, hiphop och allt däremellan.",
    color: "#2d4a3e",
    favorites: ["demo-varvtal", "demo-betong-och-blommor", "demo-peak", "demo-glod"],
    favoriteArtists: ["Nordkust", "Ord från förorten", "REC"],
  },
];

export const DEMO_LOGS: DemoLog[] = [
  { username: "saga", albumId: "demo-sodermalm-i-regn", rating: 9, listenedOn: "2026-10-12", review: "Spår tre i hörlurar en regnig tisdag. Mer behöver inte sägas.", tracks: [7, 8, 10, 8, 7, 6, 9, 9] },
  { username: "nora", albumId: "demo-varvtal", rating: 10, listenedOn: "2026-10-12", review: "Varje låt snabbare än den förra. Peak på riktigt.", tracks: [8, 9, 10, 9, 7, 8, 10] },
  { username: "olle", albumId: "demo-b-sidor", rating: 8, listenedOn: "2026-10-11", relisten: true, review: "Gömt spår är bättre än hela deras första album.", tracks: [6, 7, 8, 7, 5, 9, 6, 8, 10] },
  { username: "saga", albumId: "demo-langsamma-latar", rating: 8, listenedOn: "2026-10-10", tracks: [9, 7, 8, 8, 9] },
  { username: "nora", albumId: "demo-betong-och-blommor", rating: 9, listenedOn: "2026-10-09", review: "Linje 17 är årets låt, fast den är tio år gammal.", tracks: [6, 8, 7, 9, 9, 8, 10, 9, 6] },
  { username: "olle", albumId: "demo-kassettbandet", rating: 7, listenedOn: "2026-10-08", tracks: [7, 6, 8, 9, 6, 7, 5, 6, 8] },
  { username: "saga", albumId: "demo-glod", rating: 7, listenedOn: "2026-10-06", review: "Varm men lite jämn.", tracks: [8, 7, 7, 6, 7, 6] },
  { username: "nora", albumId: "demo-peak", rating: 8, listenedOn: "2026-10-05", tracks: [7, 9, 8, 10, 8, 6, 5] },
  { username: "olle", albumId: "demo-peak", rating: 6, listenedOn: "2026-10-03", review: "För högt. Men kanske är det poängen.", tracks: [6, 7, 5, 6, 8, 4, 6] },
  { username: "saga", albumId: "demo-fjarde-vaningen", rating: 8, listenedOn: "2026-09-29", tracks: [7, 8, 7, 9, 6, 9, 7, 8] },
  { username: "olle", albumId: "demo-sodermalm-i-regn", rating: 6, listenedOn: "2026-09-27", tracks: [5, 6, 8, 6, 5, 5, 7, 6] },
  { username: "nora", albumId: "demo-sommaren-som-aldrig-kom", rating: 5, listenedOn: "2026-09-24", review: "Fint, men jag behövde fler BPM.", tracks: [6, 5, 5, 4, 6, 5, 6] },
  { username: "saga", albumId: "demo-sommaren-som-aldrig-kom", rating: 9, listenedOn: "2026-09-20", tracks: [9, 8, 8, 9, 7, 10, 9] },
  { username: "olle", albumId: "demo-langsamma-latar", rating: 4, listenedOn: "2026-09-18", review: "Somnade. Två gånger.", tracks: [4, 5, 3, 4, 5] },
];

export function getDemoUser(username: string) {
  return DEMO_USERS.find((u) => u.username === username) ?? null;
}

export function demoLogsFor(username: string) {
  return DEMO_LOGS.filter((l) => l.username === username);
}

export function demoLogsForAlbum(albumId: string) {
  return DEMO_LOGS.filter((l) => l.albumId === albumId);
}
