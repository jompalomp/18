import { NextResponse } from "next/server";
import { searchAlbums } from "@/lib/music";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [], source: "itunes" });
  const data = await searchAlbums(q.slice(0, 100));
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
