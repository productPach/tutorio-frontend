import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";
import { validSlug } from "@/utils/region/validSlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const validCities = validSlug;

export async function generateMetadata(context: any): Promise<Metadata> {
  const params = await Promise.resolve(context.params);
  const city = params.city;

  if (!validCities.includes(city)) {
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  // Можно дернуть API, чтобы получить название города для мета-тегов
  let region;
  try {
    region = await fetchDetectUserRegion({ set_cookie: false });
  } catch (err) {
    console.error("Ошибка при определении региона:", err);
  }

  return {
    title: region
      ? `Репетиторы в ${region.region_name_dative} — Tutorio`
      : "Tutorio — репетиторы по всей России",
    description: region
      ? `Найди репетитора для занятий в ${region.region_name_dative}`
      : "Найди репетитора для занятий в любом регионе России",
  };
}

export default async function CityPage(context: any) {
  // ✅ Принудительно ждём params
  const params = await Promise.resolve(context.params);
  const city = params.city;

  // Проверяем что city валидный
  if (!validCities.includes(city)) {
    notFound(); // Покажет 404 если slug невалидный
  }

  return (
    <>
      <Header city={city} />
      <Index />
      <Footer city={city} />
    </>
  );
}
