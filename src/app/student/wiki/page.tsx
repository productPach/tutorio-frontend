import WikiPage from "@/components/Student/Wiki/WikiPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "База знаний — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentWikiPage() {
  return <WikiPage />;
}
