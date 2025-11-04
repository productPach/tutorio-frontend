// utils/region/fetchRegion.ts
import { fetchGetCityBySlug } from "@/api/server/locationApi";
import { validSlug } from "@/utils/region/validSlug";

export async function fetchRegionBySlug(slug: string) {
  if (!validSlug.includes(slug)) return null;

  try {
    const region = await fetchGetCityBySlug(slug);
    return region;
  } catch (err) {
    console.error("Ошибка при получении региона:", err);
    return null;
  }
}
