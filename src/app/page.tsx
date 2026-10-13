import Link from "next/link";
import { Wordmark } from "@/components/layout/AppShell";
import { Hero } from "@/components/landing/Hero";
import { ThemeToggle } from "@/components/ui/SettingsToggles";

const FEATURES = [
  {
    n: "01",
    title: "Varje låt räknas",
    body: "Ge albumet ett betyg med volymratten och varje låt ett eget med fadrarna. Albumkurvan visar topparna och dalarna.",
  },
  {
    n: "02",
    title: "Se vad vännerna snurrar",
    body: "Följ vänner, läs deras recensioner och jämför ert snitt med alla andras.",
  },
  {
    n: "03",
    title: "Dagens tre",
    body: "Tre korta klipp om dagen, samma för alla. Ju färre sekunder du behöver, desto fler poäng. Kommer snart.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-3">
          <Link href="/hem" className="hidden text-sm text-muted hover:text-fg sm:inline">
            Öppna appen
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="grid items-center gap-12 py-12 md:min-h-[78vh] md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <p className="lcd text-xs text-muted">33 · 45 · 78 rpm</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
              Ju bättre skiva, desto fortare snurrar den.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Logga och betygsätt album, och varje låt på dem. Följ vänner och se vad de lyssnar på.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/sok"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Logga ett album
              </Link>
              <Link
                href="/hem"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium hover:border-fg"
              >
                Se flödet
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Hero />
          </div>
        </section>

        <section aria-label="Funktioner" className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.n} className="bg-bg p-6 sm:p-8">
              <p className="lcd text-xs text-accent">{f.n}</p>
              <h2 className="mt-3 font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="mx-auto mt-20 flex max-w-5xl flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-8 text-xs text-muted sm:px-6">
        <p>Varvtal</p>
        <Link href="/komponenter" className="hover:text-fg">
          Komponenter
        </Link>
      </footer>
    </div>
  );
}
