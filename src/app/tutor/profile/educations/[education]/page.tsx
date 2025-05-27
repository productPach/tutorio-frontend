import EducationItemPage from "@/components/Tutor/Profile/Education/EducationItemPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактор образования — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GeneralProfil() {
  return <EducationItemPage />;
}
