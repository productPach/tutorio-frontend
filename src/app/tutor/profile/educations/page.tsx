import EducationPage from "@/components/Tutor/Profile/Education/EducationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Образование и опыт репетитора — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EducationProfil() {
  return <EducationPage />;
}
