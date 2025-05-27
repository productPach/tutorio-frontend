import ResponsesPage from "@/components/Tutor/Chat/ResponsePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отклики на заказы и чаты с учениками — Tutorio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Response() {
  return <ResponsesPage />;
}
