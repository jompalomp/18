# Varvtal

En social musikapp: logga och betygsätt album och varje låt, följ vänner och testa din smak i ett dagligt blindtest. Ju högre betyg, desto fortare snurrar skivan.

## Kom igång

```bash
npm install
npm run dev
```

- `/` – landningssida (tillfällig)
- `/komponenter` – demosida för betygskomponenterna

## Struktur

- `src/app/globals.css` – designtoken (färger, typsnitt, mörkt/ljust läge)
- `src/components/rating/` – `VolumeKnob` (albumbetyg) och `Fader` (låtbetyg), med gemensam logik i `useRatingControl`
- `src/components/providers/settings.tsx` – tema och klickljud (localStorage)
- `src/lib/rating.ts` – hjälpfunktioner för betyg (snitt, varvtal per betyg)

Teknik: Next.js (App Router), TypeScript, Tailwind CSS 4, Framer Motion.
