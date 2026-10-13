"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlbumCard } from "@/components/album/AlbumCard";
import { QuickLogButton } from "@/components/album/QuickLog";
import { PageHeader, SectionTitle } from "@/components/layout/AppShell";
import { DEMO_ALBUMS, toSummary } from "@/lib/mock/catalog";
import type { AlbumSummary, MusicSource } from "@/lib/music/types";
import { toggleQueue, useVarvtal } from "@/lib/store";

type Result = { query: string; results: AlbumSummary[]; source: MusicSource };

export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sök medan man skriver (med en kort fördröjning) och spegla i adressfältet.
  useEffect(() => {
    const q = query.trim();
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
      if (q.length < 2) {
        setResult(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(false);
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((data: Omit<Result, "query">) => setResult({ query: q, ...data }))
        .catch((e) => {
          if (e?.name !== "AbortError") setError(true);
        })
        .finally(() => !ctrl.signal.aborted && setLoading(false));
    }, 280);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, pathname, router]);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <PageHeader title="Sök album" />

      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="sok" className="sr-only">
          Sök på albumtitel eller artist
        </label>
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" strokeLinecap="round" />
        </svg>
        <input
          id="sok"
          ref={inputRef}
          type="search"
          autoFocus
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Albumtitel eller artist"
          className="w-full rounded-full border border-line bg-surface py-3.5 pr-12 pl-12 text-base shadow-card placeholder:text-muted/80 focus:border-fg focus-visible:outline-none"
        />
        <span
          aria-hidden
          className={`absolute top-1/2 right-5 h-2 w-2 -translate-y-1/2 rounded-full transition-colors ${
            loading ? "animate-pulse bg-accent" : "bg-led-off"
          }`}
        />
      </form>

      <div aria-live="polite" className="sr-only">
        {result ? `${result.results.length} album hittades` : ""}
      </div>

      {error && (
        <p className="mt-8 text-sm text-muted">Något gick fel med sökningen. Försök igen om en stund.</p>
      )}

      {result && result.source === "demo" && (
        <p className="mt-6 rounded-lg border border-line px-4 py-3 text-sm text-muted">
          Musikkatalogen (iTunes) gick inte att nå, så du ser träffar från demokatalogen.
        </p>
      )}

      {result ? (
        result.results.length > 0 ? (
          <Grid albums={result.results} />
        ) : (
          <p className="mt-10 text-muted">Inga album matchar ”{result.query}”.</p>
        )
      ) : (
        <section className="mt-12" aria-labelledby="demo-h">
          <SectionTitle id="demo-h">Bläddra i demokatalogen</SectionTitle>
          <Grid albums={DEMO_ALBUMS.map(toSummary)} />
        </section>
      )}
    </main>
  );
}

function Grid({ albums }: { albums: AlbumSummary[] }) {
  const { logs, queue } = useVarvtal();
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {albums.map((a) => {
        const inQueue = queue.some((q) => q.albumId === a.id);
        return (
          <li key={a.id}>
            <AlbumCard
              album={a}
              rating={logs[a.id]?.rating}
              actions={
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <QuickLogButton album={a} />
                  <button
                    type="button"
                    onClick={() => toggleQueue(a)}
                    aria-pressed={inQueue}
                    aria-label={inQueue ? `Ta bort ${a.title} från kön` : `Lägg ${a.title} i kön`}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      inQueue ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
                    }`}
                  >
                    {inQueue ? "I kön" : "+ Kö"}
                  </button>
                </div>
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
