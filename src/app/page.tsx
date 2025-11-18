import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";
import { IndexServer } from "@/components/Landing/Index/IndexServer";

// Главная всегда Москва для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Репетиторы в Москве и области — Tutorio",
    description: "Найти репетитора для занятий в Москве и области",
  };
}

export default function Home() {
  return (
    <>
      <Header city="msk" />
      <IndexServer region_name_dative={"Москве и области"} />
      <Footer city="msk" />
    </>
  );
}
