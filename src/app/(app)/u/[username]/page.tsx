import type { Metadata } from "next";
import { ProfileView } from "./ProfileView";

type Params = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `@${decodeURIComponent((await params).username)}` };
}

export default async function Page({ params }: Params) {
  const { username } = await params;
  return <ProfileView username={decodeURIComponent(username)} />;
}
