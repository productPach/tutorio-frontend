import LocationsPage from "@/components/Tutor/Profile/Location/LocationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Место занятий и локации репетитора — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocationProfil() {
  return <LocationsPage />;
}
