import SubjectsPage from "@/components/Tutor/Profile/Subject/SubjectPage";
import SubjectsSettingsPage from "@/components/Tutor/Profile/Subject/SubjectSettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактор предметов, ставки по занятиям — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubjectSettingsProfil() {
  return <SubjectsSettingsPage />;
}
