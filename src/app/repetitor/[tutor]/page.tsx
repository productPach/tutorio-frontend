import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import { getCitySlug, validSlug } from "@/utils/region/validSlug";
import { fetchRegionBySlug } from "@/utils/region/fetchRegion";
import { fetchTutorByIdPublic } from "@/api/server/tutorApi";
import { Tutor } from "@/types/types";
import { RepetitorClient } from "@/components/Landing/Repetitor/RepetitorClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(context: any): Promise<Metadata> {
  const params = await Promise.resolve(context.params);
  const tutorId = params.tutor; // предполагаем, что ID репетитора в параметрах
  const citySlug = params.city || "msk";

  if (!validSlug.includes(citySlug)) {
    return {
      title: "Репетиторы на Tutorio",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  const region = await fetchRegionBySlug(citySlug);
  if (!region) {
    return {
      title: "Репетиторы на Tutorio",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  // Получаем данные репетитора
  let tutor: Tutor | null = null;
  try {
    tutor = await fetchTutorByIdPublic(tutorId);
  } catch (e) {
    console.error("Ошибка при получении репетитора для метатегов:", e);
    return {
      title: "Страница не найдена — Tutorio",
      description:
        "К сожалению, страница не найдена. Возможно, она была удалена или перемещена.",
      robots: "noindex, nofollow",
    };
  }

  // Если репетитор не найден
  if (!tutor) {
    return {
      title: "Репетитор не найден — Tutorio",
      description: "Репетитор не найден или был удален",
      robots: "noindex, nofollow",
    };
  }

  // Генерация метатегов на основе данных репетитора
  const fullName = `${tutor.name} ${tutor.surname}`;
  const subjects = tutor.subjects?.join(", ") || "репетитор";
  const experience = tutor.experience
    ? ` с опытом ${tutor.experience} лет`
    : "";

  const title = `${fullName} - ${subjects}${experience} | Tutorio`;
  const description = tutor.description
    ? tutor.description.substring(0, 160)
    : `Репетитор ${fullName} по ${subjects}${experience}. Индивидуальные занятия.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      // Можно добавить другие Open Graph теги если есть фото репетитора
    },
  };
}

export default async function RepetitorPage(context: any) {
  const params = await Promise.resolve(context.params);
  const tutorId = params.tutor;
  const city = getCitySlug(params.city);
  if (!city) {
    return notFound();
  }

  const region = await fetchRegionBySlug(city);
  if (!region) notFound();

  // Получаем данные репетитора для отображения на странице
  let tutor: Tutor | null = null;
  try {
    tutor = await fetchTutorByIdPublic(tutorId);
  } catch (error) {
    console.error("Error fetching tutor:", error);
    notFound();
  }

  // Если репетитор не найден - показываем 404
  if (!tutor) {
    notFound();
  }

  return (
    <>
      <Header city={city} />
      <RepetitorClient tutor={tutor} />
      <Footer city={city} />
    </>
  );
}
