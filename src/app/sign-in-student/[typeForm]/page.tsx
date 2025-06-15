import SignInStudent from "@/components/SignIn/SignInStudent/SignInStudent";
import { Metadata } from "next";

const formMetaMap: Record<string, { title: string; description: string }> = {
  phone: {
    title: "Вход для учеников — Tutorio",
    description:
      "Введите номер телефона, чтобы войти или зарегистрироваться в Tutorio — сервисе подбора репетиторов",
  },
  confirmation: {
    title: "Подтвердите номер телефона — Tutorio",
    description: "Введите код из СМС, чтобы подтвердить номер телефона",
  },
};

export async function generateMetadata(context: any): Promise<Metadata> {
  // Вытащим params из переданного контекста:
  const params = (context as { params: { typeForm: string } }).params;
  const meta = params?.typeForm ? formMetaMap[params.typeForm] : undefined;

  return {
    title: meta?.title || "Авторизация ученика — Tutorio",
    description: meta?.description || "Вход ученика в Tutorio",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function SignInStudentPage() {
  return <SignInStudent />;
}
