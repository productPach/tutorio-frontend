import WikiPage from "@/components/Tutor/Wiki/WikiPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "База знаний — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WikiProfil() {
  return <WikiPage />;
}
