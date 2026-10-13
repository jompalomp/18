import type { Metadata } from "next";
import { QueueView } from "./QueueView";

export const metadata: Metadata = { title: "Kö" };

export default function Page() {
  return <QueueView />;
}
