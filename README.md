# Varvtal

En social musikapp: logga och betygsätt album och varje låt, följ vänner och testa din smak i ett dagligt blindtest. Ju högre betyg, desto fortare snurrar skivan.

## Kom igång

```bash
npm install
npm run dev
```

| Sida | Innehåll |
| --- | --- |
| `/` | Landningssida – ratten styr hur fort skivan snurrar |
| `/hem` | Vänflöde |
| `/sok` | Sök album (iTunes Search API) |
| `/album/[id]` | Albumsida: fodral och skiva, ratt, albumkurva, låtlista som CD-baksida med fadrar, recension |
| `/ko` | Kö |
| `/u/[användarnamn]` | Profil: CD-ställ, statistik, betygsfördelning, senast loggade |
| `/komponenter` | Demosida för betygskomponenterna |

Loggar, betyg, kö och favoriter sparas i webbläsarens localStorage tills Supabase kopplas in.
Vänner och deras betyg är demodata (`src/lib/mock/`), liksom en liten påhittad albumkatalog
som används om iTunes inte går att nå. Sätt `VARVTAL_MUSIC_SOURCE=demo` för att bara använda demokatalogen.

## Struktur

- `src/app/globals.css` – designtoken (färger, typsnitt, mörkt/ljust läge)
- `src/components/rating/` – `VolumeKnob` (albumbetyg) och `Fader` (låtbetyg), med gemensam logik i `useRatingControl`
- `src/components/providers/settings.tsx` – tema och klickljud (localStorage)
- `src/components/cd/` – omslag, CD-fodral, skiva och fodral+skiva (`AlbumCd`)
- `src/components/album/` – albumsidan, albumkurvan, låtlistan och snabbloggning
- `src/lib/music/` – musikdata (iTunes med reserv i demokatalogen)
- `src/lib/store.ts` – lokal lagring av loggar, låtbetyg, kö, favoriter och följningar
- `src/lib/rating.ts` – hjälpfunktioner för betyg (snitt, varvtal per betyg)

Teknik: Next.js (App Router), TypeScript, Tailwind CSS 4, Framer Motion.
