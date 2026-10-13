import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AlbumView } from "@/components/album/AlbumView";
import { getAlbum } from "@/lib/music";

const load = cache(getAlbum);

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const album = await load((await params).id);
  return album ? { title: `${album.title} – ${album.artist}` } : { title: "Albumet hittades inte" };
}

export default async function AlbumPage({ params }: Params) {
  const album = await load((await params).id);
  if (!album) notFound();
  return <AlbumView album={album} />;
}
