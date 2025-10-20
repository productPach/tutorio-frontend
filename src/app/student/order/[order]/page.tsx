import { fetchGetPublicOrderById } from "@/api/server/orderApi";
import { fetchGetAllSubjects } from "@/api/server/subjectApi";
import OrderPage from "@/components/Student/Order/OrderPage";
import { Subject } from "@/types/types";
import type { Metadata } from "next";

export async function generateMetadata(context: any): Promise<Metadata> {
  // Принудительно ждём params (если это промис)
  const params = await Promise.resolve(context.params);
  const orderId = params.order;

  const order = await fetchGetPublicOrderById(orderId);

  let subjects: Subject[] = [];
  try {
    subjects = await fetchGetAllSubjects();
  } catch (err) {
    console.error("Ошибка загрузки subjects:", err);
    subjects = []; // безопасный fallback
  }

  if (!order) {
    return {
      title: "Заказ не найден — Tutorio",
      description: "Такой заказ не найден или он был удалён",
      robots: { index: false, follow: false },
    };
  }

  const subjectArr = subjects.find((subject) => subject.id_p === order.subject);
  const subjectNameForReq = subjectArr?.for_request || "предмету";

  return {
    title: `${order.goal} по ${subjectNameForReq} — Tutorio`,
    description: `Найди репетитора для подготовки по ${subjectNameForReq}`,
    robots: { index: true, follow: true },
  };
}

export default function StudentOrderPage() {
  return <OrderPage />;
}
