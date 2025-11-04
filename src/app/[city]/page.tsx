import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { IndexServer } from "@/components/Landing/Index/IndexServer";
import { Footer } from "@/components/Footer/Footer";
import {
  fetchDetectUserRegion,
  fetchGetCityBySlug,
} from "@/api/server/locationApi";
import { Metadata } from "next";
import { validSlug } from "@/utils/region/validSlug";
import { fetchRegionBySlug } from "@/utils/region/fetchRegion";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(context: any): Promise<Metadata> {
  const params = await Promise.resolve(context.params);
  const city = params.city;

  // Если slug нет — считаем Москвой
  const citySlug = city || "msk";

  if (!validSlug.includes(citySlug)) {
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  // Дергаем API, чтобы получить название города для мета-тегов
  const region = await fetchRegionBySlug(citySlug);

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

  // Если slug нет — считаем Москвой
  const citySlug = city || "msk";

  // Проверяем что city валидный
  if (!validSlug.includes(citySlug)) {
    notFound(); // Покажет 404 если slug невалидный
  }

  // Дергаем API ещё раз, чтобы спустить в дочерние для заголовков
  const region = await fetchRegionBySlug(citySlug);

  if (!region) notFound();

  return (
    <>
      <Header city={citySlug} />
      <IndexServer
        region_name_dative={region?.region_name_dative || "Москве и области"}
      />
      <Footer city={citySlug} />
    </>
  );
}
