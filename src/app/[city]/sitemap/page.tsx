import { Metadata } from "next";
import { validSlug } from "@/utils/region/validSlug";
import { fetchRegionBySlug } from "@/utils/region/fetchRegion";
import Sitemap from "@/app/sitemap/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default Sitemap;
