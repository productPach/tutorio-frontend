import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";

interface Props {
  params: {
    city: string;
  };
}

// ✅ Валидные slugs (должны совпадать с slug в БД)
const validCities = ["spb", "ekb", "novosibirsk", "kazan", "nn", "chelyabinsk"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = params;

  // Проверяем что city валидный
  if (!validCities.includes(city)) {
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  try {
    let region = null;
    try {
      region = await fetchDetectUserRegion({ set_cookie: true });
    } catch (err) {
      console.error("Ошибка при определении региона:", err);
    }

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
  } catch (err) {
    return {
      title: "Tutorio — репетиторы по всей России",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }
}

export default async function CityPage({ params }: Props) {
  const { city } = params;

  // Проверяем что city валидный
  if (!validCities.includes(city)) {
    notFound(); // Покажет 404 если slug невалидный
  }

  return (
    <>
      <Header />
      <Index />
      <Footer />
    </>
  );
}

// ✅ Статическая генерация для популярных городов
export async function generateStaticParams() {
  return validCities.map((city) => ({
    city: city,
  }));
}
