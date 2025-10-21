import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// ✅ Один вызов на весь запрос
let regionData: any = null;

async function getRegionData() {
  if (regionData) return regionData;

  try {
    regionData = await fetchDetectUserRegion({ set_cookie: true });
    return regionData;
  } catch (err) {
    console.error("Ошибка при определении региона:", err);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegionData();

  if (!region) {
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  return {
    title: `Репетиторы в ${region.region_name_dative} — Tutorio`,
    description: `Найди репетитора для занятий в ${region.region_name_dative}`,
  };
}

export default async function Home() {
  const region = await getRegionData();
  console.log("📍 Главная: Region data:", region);

  if (region && region.slug !== "msk") {
    redirect(`/${region.slug}`);
  }

  return (
    <>
      <Header />
      <Index />
      <Footer />
    </>
  );
}
