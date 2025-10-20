import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import { fetchDetectUserRegion } from "@/api/server/locationApi";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // --------------------------
    // 1️⃣ Определяем регион через backend
    // --------------------------
    let region = null;
    try {
      region = await fetchDetectUserRegion(); // { title, area, shortTitle }
      console.log(region);
    } catch (err) {
      console.error("Ошибка при определении региона:", err);
    }

    if (!region) {
      return {
        title: "Tutorio — репетиторы по всей России",
        description: "Найди репетитора для занятий в любом регионе России",
        robots: { index: true, follow: true },
      };
    }

    // --------------------------
    // 2️⃣ Формируем метаданные с регионом
    // --------------------------
    return {
      title: `Репетиторы в ${region.shortTitle} — Tutorio`,
      description: `Найди репетитора для занятий в ${region.shortTitle}`,
      robots: { index: true, follow: true },
    };
  } catch (err) {
    console.error("Ошибка при генерации metadata:", err);
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
      robots: { index: true, follow: true },
    };
  }
}

export default function Home() {
  return (
    <>
      <Header />
      <Index />
      <Footer />
    </>
  );
}
