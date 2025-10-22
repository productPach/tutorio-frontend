import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";

// Главная всегда Москва для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tutorio — репетиторы в Москве",
    description: "Найди репетитора для занятий в Москве",
  };
}

export default function Home() {
  // Редирект убрали — middleware делает это
  return (
    <>
      <Header city="msk" />
      <Index />
      <Footer city="msk" />
    </>
  );
}
