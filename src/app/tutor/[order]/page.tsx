import { fetchGetPublicOrderById } from "@/api/server/orderApi";
import OrderPage from "@/components/Tutor/Order/OrderPage";
import { data } from "@/utils/listSubjects";
import { Metadata } from "next";

type Props = {
  params: {
    order: string;
  };
};

// Динамическая генерация мета-тегов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await fetchGetPublicOrderById(params.order);

  if (!order) {
    return {
      title: "Заказ не найден — Tutorio",
      description: "Такой заказ не найден или он был удалён.",
      robots: { index: false, follow: false },
    };
  }

  const subjectArr = data.find((subject) => subject.id_p === order?.subject);
  const subjectNameForReq = subjectArr?.for_request;
  return {
    title: `${order.goal + " по " + subjectNameForReq} — Tutorio`,
    robots: { index: false, follow: false },
  };
}

export default function TutorOrderPage() {
  return <OrderPage />;
}
