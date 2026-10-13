"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { QuickLogButton } from "@/components/album/QuickLog";
import { JewelCase } from "@/components/cd/JewelCase";
import { PageHeader } from "@/components/layout/AppShell";
import { formatDay } from "@/lib/format";
import { toggleQueue, useVarvtal } from "@/lib/store";

export function QueueView() {
  const { queue, albums } = useVarvtal();
  const reduce = useReducedMotion();
  const items = queue.map((q) => ({ ...q, album: albums[q.albumId] })).filter((q) => q.album);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <PageHeader title="Kö" eyebrow="Att lyssna på">
        {items.length > 0 && (
          <p className="text-sm text-muted">
            <span className="lcd text-fg">{items.length}</span> album
          </p>
        )}
      </PageHeader>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-medium">Kön är tom</p>
          <p className="mt-1 text-sm text-muted">
            Lägg till album du vill lyssna på, så hamnar de här.
          </p>
          <Link
            href="/sok"
            className="mt-6 inline-block rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg"
          >
            Hitta något att lyssna på
          </Link>
        </div>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          <AnimatePresence initial={false}>
            {items.map(({ album, addedAt }, i) => (
              <motion.li
                key={album.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                className="flex items-center gap-4 py-3"
              >
                <span className="lcd w-5 text-right text-xs text-muted">{i + 1}</span>
                <Link href={`/album/${album.id}`} className="w-14 shrink-0 sm:w-16">
                  <JewelCase album={album} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/album/${album.id}`} className="block truncate font-medium hover:underline">
                    {album.title}
                  </Link>
                  <p className="truncate text-sm text-muted">{album.artist}</p>
                  <p className="text-xs text-muted">Tillagd {formatDay(addedAt)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                  <QuickLogButton album={album} />
                  <button
                    type="button"
                    onClick={() => toggleQueue(album)}
                    className="rounded-full px-2 py-1 text-xs text-muted hover:text-accent"
                    aria-label={`Ta bort ${album.title} från kön`}
                  >
                    Ta bort
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </main>
  );
}
