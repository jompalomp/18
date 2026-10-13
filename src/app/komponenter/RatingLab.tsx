"use client";

import Link from "next/link";
import { useState } from "react";
import { Fader, VolumeKnob } from "@/components/rating";
import { Lcd } from "@/components/ui/Lcd";
import { ClickSoundToggle, ThemeToggle } from "@/components/ui/SettingsToggles";
import { average, formatAverage, type Rating } from "@/lib/rating";

// Mockdata: ett påhittat album, bara för att visa komponenterna.
const TRACKS = [
  { n: 1, title: "Inledning", length: "1:48" },
  { n: 2, title: "Nattbuss", length: "3:52" },
  { n: 3, title: "Södermalm i regn", length: "4:31" },
  { n: 4, title: "Kassettband", length: "3:07" },
  { n: 5, title: "Varvtal", length: "5:12" },
  { n: 6, title: "Lågt i mixen", length: "2:59" },
  { n: 7, title: "B-sidan", length: "4:04" },
  { n: 8, title: "Sista spåret", length: "6:21" },
];

export function RatingLab() {
  const [album, setAlbum] = useState<Rating>(8);
  const [tracks, setTracks] = useState<Rating[]>([6, 9, 10, 7, 8, null, 5, 9]);
  const avg = average(tracks);

  const setTrack = (i: number, v: number) =>
    setTracks((prev) => prev.map((p, j) => (j === i ? v : p)));

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 py-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          varvtal<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ClickSoundToggle />
          <ThemeToggle />
        </div>
      </header>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Betygskomponenterna</h1>
      <p className="mt-3 max-w-prose text-muted">
        Volymratten för album, fadrar för låtar. Samma komponenter används överallt i appen. Prova
        att dra, trycka på LED-ringen, eller använda piltangenter, Home/End och siffrorna 1–0.
      </p>

      {/* ---------------------------------------------------------- Ratten */}
      <section className="mt-14" aria-labelledby="knob-h">
        <h2 id="knob-h" className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Volymratten · albumbetyg
        </h2>
        <div className="mt-6 flex flex-col items-center gap-10 rounded-2xl border border-line bg-surface p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <VolumeKnob value={album} onChange={setAlbum} label="Albumbetyg" size={200} />
          <dl className="grid w-full max-w-xs gap-4 text-sm">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <dt className="text-muted">Ditt albumbetyg</dt>
              <dd>
                <Lcd className="text-2xl" peak={album === 10}>
                  {album ?? "–"}
                </Lcd>
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <dt className="text-muted">Dina låtar snittar</dt>
              <dd>
                <Lcd className="text-2xl">{avg == null ? "–" : formatAverage(avg)}</Lcd>
              </dd>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Albumbetyget sätts separat. Ett album kan vara mer (eller mindre) än summan av sina
              låtar.
            </p>
            <button
              onClick={() => setAlbum(null)}
              className="justify-self-start text-xs text-muted underline underline-offset-4 hover:text-fg"
            >
              Nollställ
            </button>
          </dl>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {([null, 3, 7, 10] as Rating[]).map((v, i) => (
            <figure
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl border border-line p-4"
            >
              <VolumeKnob value={v} label={`Exempel ${v ?? "utan betyg"}`} size={72} readOnly showReadout={false} />
              <figcaption className="text-xs text-muted">
                {v == null ? "Inget betyg" : v === 10 ? "Peak" : `Läge ${v}`}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Mixerbordet */}
      <section className="mt-16" aria-labelledby="fader-h">
        <h2 id="fader-h" className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Fadrarna · låtbetyg
        </h2>

        <div className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-6">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2">
            {TRACKS.map((t, i) => (
              <div
                key={t.n}
                className="flex w-16 shrink-0 flex-col items-center gap-3 rounded-lg py-3 sm:w-[4.5rem]"
              >
                <Lcd className="text-sm" peak={tracks[i] === 10}>
                  {tracks[i] == null ? "--" : String(tracks[i]).padStart(2, "0")}
                </Lcd>
                <Fader
                  value={tracks[i]}
                  onChange={(v) => setTrack(i, v)}
                  label={`Betyg för ${t.n}. ${t.title}`}
                  length={160}
                />
                <span className="lcd text-[11px] text-muted">{String(t.n).padStart(2, "0")}</span>
                <span className="line-clamp-2 h-8 text-center text-[11px] leading-tight">{t.title}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Liggande variant · för listor på smal skärm
        </h3>
        <ol className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
          {TRACKS.slice(0, 4).map((t, i) => (
            <li key={t.n} className="flex items-center gap-3 px-4 py-2.5">
              <span className="lcd w-5 text-xs text-muted">{t.n}</span>
              <span className="min-w-0 flex-1 truncate text-sm">{t.title}</span>
              <Fader
                orientation="horizontal"
                value={tracks[i]}
                onChange={(v) => setTrack(i, v)}
                label={`Betyg för ${t.n}. ${t.title}`}
                length={128}
              />
              <Lcd className="w-6 text-right text-sm" peak={tracks[i] === 10}>
                {tracks[i] ?? "–"}
              </Lcd>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
