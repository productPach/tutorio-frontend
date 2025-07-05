import { fetchGetPublicOrderById } from "@/api/server/orderApi";
import { fetchGetAllSubjects } from "@/api/server/subjectApi";
import OrderPage from "@/components/Tutor/Order/OrderPage";
import type { Metadata } from "next";

export async function generateMetadata(context: any): Promise<Metadata> {
  // Вытянем params.order из переданного Next.js контекста:
  const params = (context as { params: { order: string } }).params;
  const orderId = params.order;

  const order = await fetchGetPublicOrderById(orderId);
  const subjects = await fetchGetAllSubjects();

  if (!order) {
    return {
      title: "Заказ не найден — Tutorio",
      description: "Такой заказ не найден или он был удалён.",
      robots: { index: false, follow: false },
    };
  }

  const subjectArr = subjects.find((subject) => subject.id_p === order.subject);
  const subjectNameForReq = subjectArr?.for_request;

  return {
    title: `${order.goal} по ${subjectNameForReq} — Tutorio`,
    robots: { index: false, follow: false },
  };
}

export default function TutorOrderPage() {
  return <OrderPage />;
}
