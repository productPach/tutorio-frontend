import SignInStudent from "@/components/SignIn/SignInStudent/SignInStudent";
import { Metadata } from "next";

const formMetaMap: { [key: string]: { title: string; description: string } } = {
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

export async function generateMetadata({
  params,
}: {
  params: { typeForm: string };
}): Promise<Metadata> {
  const meta = formMetaMap[params.typeForm];

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
