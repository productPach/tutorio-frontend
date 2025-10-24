import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { getCitySlug } from "@/utils/region/validSlug";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Карта сайта — Tutorio",
    description:
      "Пользовательское соглашение сервиса Tutorio — правила использования платформы для учеников и репетиторов",
    keywords: [
      "пользовательское соглашение",
      "Tutorio",
      "правила сервиса",
      "условия использования",
      "договор оферта",
      "репетиторский сервис",
      "онлайн обучение",
      "поиск репетиторов",
      "поиск учеников",
      "платформа для репетиторов",
      "услуги онлайн-обучения",
      "обязанности пользователя",
      "ответственность сторон",
      "согласие с условиями",
      "регистрация на платформе",
      "использование сайта",
      "дистанционное обучение",
      "взаимодействие с учениками",
      "взаимодействие с репетиторами",
    ],
  };
}

export default function Home({ params }: any) {
  const city = getCitySlug(params.city);

  if (!city) {
    return notFound();
  }
  return (
    <>
      <Header city={city} />
      <Index />
      <Footer city={city} />
    </>
  );
}
