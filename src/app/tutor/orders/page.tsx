import OrdersPage from "@/components/Tutor/Orders/OrdersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказы учеников — Tutorio",
  description: "Просматривайте и отвечайте на заказы от учеников",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TutorOrdersPage() {
  return <OrdersPage />;
}
