import SettingsPage from "@/components/Student/Settings/SettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки личного кабинета — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentSettingsPage() {
  return <SettingsPage />;
}
