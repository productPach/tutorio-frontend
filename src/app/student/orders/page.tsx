import OrdersPage from "@/components/Student/Orders/OrdersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказы — Tutorio",
  description:
    "Следите за своими заказами, просматривайте статус и отклики репетиторов",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentOrdersPage() {
  return <OrdersPage />;
}
