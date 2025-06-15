import { fetchGetPublicOrderById } from "@/api/server/orderApi";
import OrderPage from "@/components/Student/Order/OrderPage";
import { data } from "@/utils/listSubjects";
import type { Metadata } from "next";

export async function generateMetadata(context: any): Promise<Metadata> {
  // Вытянем params.order из переданного контекста:
  const params = (context as { params: { order: string } }).params;
  const orderId = params.order;

  // Делаем запрос за данными заказа
  const order = await fetchGetPublicOrderById(orderId);

  if (!order) {
    return {
      title: "Заказ не найден — Tutorio",
      description: "Такой заказ не найден или он был удалён.",
      robots: { index: false, follow: false },
    };
  }

  // Вычисляем название предмета для заголовка
  const subjectArr = data.find((subject) => subject.id_p === order.subject);
  const subjectNameForReq = subjectArr?.for_request;

  return {
    title: `${order.goal} по ${subjectNameForReq} — Tutorio`,
    robots: { index: false, follow: false },
  };
}

export default function StudentOrderPage() {
  return <OrderPage />;
}
