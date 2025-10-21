import { Header } from "@/components/Header/Header";
import { Index } from "@/components/Landing/Index/Index";
import { Footer } from "@/components/Footer/Footer";
import { fetchDetectUserRegion } from "@/api/server/locationApi";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Tutorio — подбор репетиторов и поиск учеников онлайн",
//   description:
//     "Tutorio — онлайн-сервис для поиска репетиторов и учеников. Индивидуальные занятия по математике, русскому, английскому и другим предметам. Подготовка к ЕГЭ, ОГЭ и помощь с домашними заданиями.",
//   keywords: [
//     "поиск репетитора",
//     "подбор репетитора",
//     "найти репетитора онлайн",
//     "репетитор по математике",
//     "репетитор по русскому языку",
//     "репетитор по английскому",
//     "подготовка к ЕГЭ",
//     "подготовка к ОГЭ",
//     "подготовка к ВПР",
//     "подготовка к школе",
//     "репетитор для школьника",
//     "онлайн репетитор",
//     "домашнее задание",
//     "помощь с дз",
//     "объяснение темы",
//     "занятия онлайн",
//     "занятия с репетитором",
//     "индивидуальные уроки",
//     "обучение школьников",
//     "репетиторская платформа",
//     "найти ученика",
//     "Tutorio",
//     "образовательный сервис",
//     "репетиторская помощь",
//     "дистанционное обучение",
//     "подготовка к экзаменам",
//     "обучение онлайн",
//     "уроки по Zoom",
//     "репетитор начальных классов",
//     "репетитор по литературе",
//     "репетитор по химии",
//     "репетитор по физике",
//     "репетитор по биологии",
//     "репетитор по истории",
//     "репетитор по обществознанию",
//     "индивидуальные занятия",
//     "репетитор недорого",
//     "лучшие репетиторы",
//     "поиск учеников",
//   ],
// };

// ✅ Один вызов на весь запрос
let regionData: any = null;

async function getRegionData() {
  if (regionData) return regionData; // Кешируем на время запроса

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
