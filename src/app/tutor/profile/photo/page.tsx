import PhotoPage from "@/components/Tutor/Profile/Photo/PhotoPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Фотография анкеты репетитора — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PhotoProfil() {
  return <PhotoPage />;
}
