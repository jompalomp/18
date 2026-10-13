import type { AlbumSummary, CoverArt } from "@/lib/music/types";

const FALLBACK_COLORS = ["#1f3a5f", "#e9e2d0", "#2d4a3e", "#3b1f1a", "#d7e3e8", "#2b2a28"];
const MOTIFS: CoverArt["motif"][] = ["circle", "stripes", "grid", "wave", "split", "dot"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ett omslag som går att rita utan bild: för demodata och album utan omslag. */
function artFor(album: Pick<AlbumSummary, "id" | "art">): CoverArt {
  if (album.art) return album.art;
  const h = hash(album.id);
  const bg = FALLBACK_COLORS[h % FALLBACK_COLORS.length];
  const light = bg === "#e9e2d0" || bg === "#d7e3e8";
  return { bg, fg: light ? "#141414" : "#f6f5f1", motif: MOTIFS[h % MOTIFS.length] };
}

function Motif({ art }: { art: CoverArt }) {
  const { fg } = art;
  switch (art.motif) {
    case "circle":
      return <circle cx="62" cy="40" r="24" fill={fg} />;
    case "stripes":
      return (
        <g fill={fg}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="0" y={18 + i * 9} width="100" height="3.5" />
          ))}
        </g>
      );
    case "grid":
      return (
        <g fill={fg}>
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={22 + (i % 5) * 14} cy={14 + Math.floor(i / 5) * 14} r={i === 12 ? 4 : 1.4} />
          ))}
        </g>
      );
    case "wave":
      return (
        <path
          d="M0 46 C 16 30, 33 30, 50 46 S 84 62, 100 46"
          stroke={fg}
          strokeWidth="5"
          fill="none"
        />
      );
    case "split":
      return <rect x="50" y="0" width="50" height="70" fill={fg} opacity="0.9" />;
    case "dot":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.2">
          {[6, 12, 18, 24].map((r) => (
            <circle key={r} cx="50" cy="38" r={r} />
          ))}
        </g>
      );
  }
}

export function Cover({
  album,
  className = "",
}: {
  album: Pick<AlbumSummary, "id" | "title" | "artist" | "coverUrl" | "art">;
  className?: string;
}) {
  if (album.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={album.coverUrl}
        alt=""
        loading="lazy"
        draggable={false}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const art = artFor(album);
  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full ${className}`} aria-hidden>
      <rect width="100" height="100" fill={art.bg} />
      <Motif art={art} />
      <text
        x="8"
        y="84"
        fill={art.fg}
        fontSize="5.2"
        fontWeight="600"
        fontFamily="var(--font-geist-sans), sans-serif"
        style={{ mixBlendMode: art.motif === "split" ? "difference" : undefined }}
      >
        {album.artist.toLocaleUpperCase("sv-SE")}
      </text>
      <text
        x="8"
        y="92"
        fill={art.fg}
        fontSize="5.2"
        fontFamily="var(--font-geist-sans), sans-serif"
        opacity="0.75"
        style={{ mixBlendMode: art.motif === "split" ? "difference" : undefined }}
      >
        {album.title}
      </text>
    </svg>
  );
}
