import GeneralPage from "@/components/Tutor/Profile/GeneralInfo/GeneralPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Общая информация анкеты репетитора — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GeneralProfil() {
  return <GeneralPage />;
}
