"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClickSoundToggle, ThemeToggle } from "@/components/ui/SettingsToggles";
import { useVarvtal } from "@/lib/store";

const NAV = [
  { href: "/hem", label: "Hem", icon: "home" },
  { href: "/sok", label: "Sök", icon: "search" },
  { href: "/ko", label: "Kö", icon: "queue" },
  { href: "/u", label: "Profil", icon: "user" },
] as const;

function Icon({ name }: { name: (typeof NAV)[number]["icon"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
      );
    case "queue":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2" />
        </svg>
      );
  }
}

export function Wordmark() {
  return (
    <Link href="/" className="text-[15px] font-semibold tracking-tight">
      varvtal<span className="text-accent">.</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, queue } = useVarvtal();
  const hrefFor = (href: string) => (href === "/u" ? `/u/${profile.username}` : href);
  const isActive = (href: string) =>
    href === "/u" ? pathname === `/u/${profile.username}` : pathname.startsWith(href);

  return (
    <div className="min-h-dvh pb-24 sm:pb-0">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Hoppa till innehållet
      </a>
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />
          <nav aria-label="Huvudmeny" className="hidden items-center gap-1 sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={hrefFor(n.href)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive(n.href) ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {n.label}
                {n.href === "/ko" && queue.length > 0 && (
                  <span className="lcd ml-1.5 text-[11px] text-muted">{queue.length}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex">
              <ClickSoundToggle />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div id="innehall">{children}</div>

      {/* Flikrad längst ner på mobil */}
      <nav
        aria-label="Huvudmeny"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={hrefFor(n.href)}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${
                    active ? "text-fg" : "text-muted"
                  }`}
                >
                  <span className="relative">
                    <Icon name={n.icon} />
                    {active && (
                      <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </span>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-6 sm:pt-12">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
      {children}
    </h2>
  );
}
