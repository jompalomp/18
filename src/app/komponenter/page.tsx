import type { Metadata } from "next";
import { RatingLab } from "./RatingLab";

export const metadata: Metadata = { title: "Komponenter" };

export default function Page() {
  return <RatingLab />;
}
