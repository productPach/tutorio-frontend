import SubjectsPage from "@/components/Tutor/Profile/Subject/SubjectPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Выбранные предметы репетитора, ставки по занятиям — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubjectProfil() {
  return <SubjectsPage />;
}
