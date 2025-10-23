import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";
import { cookies } from "next/headers";

// Главная всегда Москва для SEO
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const regionCookie = cookieStore.get("region-id");

  // Если кука уже есть — пропускаем определение региона
  if (!regionCookie) {
    try {
      await fetchDetectUserRegion({ set_cookie: true });
    } catch (err) {
      console.error("Ошибка при определении региона:", err);
    }
  }

  return {
    title: "Tutorio — репетиторы в Москве",
    description: "Найди репетитора для занятий в Москве",
  };
}

export default function Home() {
  return (
    <>
      <Header city="msk" />
      <Index />
      <Footer city="msk" />
    </>
  );
}
