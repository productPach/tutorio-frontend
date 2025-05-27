import WalletPage from "@/components/Tutor/Wallet/WalletPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Баланс личного кабинета — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WalletProfil() {
  return <WalletPage />;
}
