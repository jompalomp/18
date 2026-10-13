import type { Metadata } from "next";
import { FeedView } from "./FeedView";

export const metadata: Metadata = { title: "Hem" };

export default function Page() {
  return <FeedView />;
}
