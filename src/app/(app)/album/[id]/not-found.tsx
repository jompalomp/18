import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="lcd text-5xl text-accent">--:--</p>
      <h1 className="mt-6 text-2xl font-semibold">Skivan hittades inte</h1>
      <p className="mt-2 text-muted">
        Albumet finns inte, eller så gick musikkatalogen inte att nå just nu.
      </p>
      <Link href="/sok" className="mt-8 inline-block rounded-full bg-fg px-5 py-2.5 text-sm text-bg">
        Sök efter ett album
      </Link>
    </main>
  );
}
