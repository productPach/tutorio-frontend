import GeneralPage from "@/components/Tutor/Profile/GeneralInfo/GeneralPage";
import SettingsPage from "@/components/Tutor/Settings/SettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки личного кабинета репетитора — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsProfil() {
  return <SettingsPage />;
}
