import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import { SitemapServer } from "@/components/Sitemap/SitemapServer";
import { fetchRegionBySlug } from "@/utils/region/fetchRegion";
import { validSlug } from "@/utils/region/validSlug";
import { notFound } from "next/navigation";
import { fetchSubjectsWithTutors } from "@/api/server/landingApi";

export async function generateMetadata(context: any): Promise<Metadata> {
  const params = await Promise.resolve(context.params);
  const city = params.city;

  // Если slug нет — считаем Москвой
  const citySlug = city || "msk";

  if (!validSlug.includes(citySlug)) {
    return {
      title: "Карта сайта, репетиторы по всей России — Tutorio",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  // Дергаем API, чтобы получить название города для мета-тегов
  const region = await fetchRegionBySlug(citySlug);

  return {
    title: region
      ? `Карта сайта, репетиторы в ${region.region_name_dative} — Tutorio`
      : "Карта сайта, репетиторы по всей России — Tutorio",

    description: region
      ? `Найди репетитора для занятий в ${region.region_name_dative}`
      : "Найди репетитора для занятий в любом регионе России",
  };
}

export default async function Sitemap(context: any) {
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

  // ✅ Здесь грузим предметы С СЕРВЕРА
  const subjects = await fetchSubjectsWithTutors(region.title);

  return (
    <>
      <Header city={citySlug} />
      <SitemapServer
        region_name_dative={region?.region_name_dative || "Москве и области"}
        subjects={subjects}
        region_slug={citySlug}
      />
      <Footer city={citySlug} />
    </>
  );
}
