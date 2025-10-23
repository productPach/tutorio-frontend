import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";

// Главная всегда Москва для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tutorio — репетиторы в Москве и области",
    description: "Найди репетитора для занятий в Москве и области",
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
