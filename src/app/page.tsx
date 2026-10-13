import Link from "next/link";
import { ThemeToggle } from "@/components/ui/SettingsToggles";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-sm font-semibold tracking-tight">
          varvtal<span className="text-accent">.</span>
        </span>
        <ThemeToggle />
      </header>
      <section className="flex flex-1 flex-col justify-center pb-24">
        <p className="lcd text-xs text-muted">33 · 45 · 78</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          Ju bättre skiva,
          <br />
          desto fortare snurrar den.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Logga och betygsätt album – och varje låt på dem. Följ vänner och testa din smak i dagens
          blindtest.
        </p>
        <div className="mt-10">
          <Link
            href="/komponenter"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg"
          >
            Se betygskomponenterna →
          </Link>
        </div>
      </section>
    </main>
  );
}
