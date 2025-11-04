import { Metadata } from "next";
import { validSlug } from "@/utils/region/validSlug";
import { fetchRegionBySlug } from "@/utils/region/fetchRegion";
import RepetitorsPage from "@/app/repetitors/[[...params]]/page";
import { fetchGetTutorsByFilters } from "@/api/server/landingApi";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// === Функция для разбора params: определяет subjectSlug, goalSlug и placeSlug ===
function parseParams(paramsArray?: string[]) {
  let subjectSlug: string | undefined = undefined;
  let goalSlug: string | undefined = undefined;
  let placeSlug: string | undefined = undefined;

  if (paramsArray && paramsArray.length) {
    // Определяем слоты для параметров
    const slots = [];

    for (const param of paramsArray) {
      if (["online", "u-repetitora", "na-domu"].includes(param)) {
        // Это место занятий
        slots[2] = param; // placeSlug всегда в последней позиции
      } else if (
        param.includes("podgotovka-k-oge") ||
        param.includes("podgotovka-k-ege") ||
        param.includes("povyshenie-uspevaemosti") ||
        param.includes("podgotovka-k-ekzamenu-v-vuz") ||
        param.includes("podgotovka-k-olimpiade") ||
        param.includes("podgotovka-k-shkole") ||
        param.includes("dvi") ||
        param.includes("vpr") ||
        param.includes("dlya-sebya") ||
        param.includes("dlya-raboty") ||
        param.includes("drugoe") ||
        param.includes("podgotovka-k-konkursam") ||
        param.includes("podgotovka-k-spetsializirovannoy-shkole") ||
        param.includes("podgotovka-k-ekzamenu-kontrolnoy") ||
        param.includes("podgotovka-k-kontrolnoy") ||
        param.includes("podgotovka-k-mezhdunarodnomu-ekzamenu") ||
        param.includes("podgotovka-k-ekzamenu-v-posolstve") ||
        param.includes("podgotovka-k-international-baccalaureate") ||
        param.includes("pomoshch-po-programme") ||
        param.includes("vpr-po-matematike") ||
        param.includes("vpr-po-russkomu") ||
        param.includes("vpr-po-okruzhayushchemu-miru") ||
        param.includes("podgotovka-k-itogovomu-testirovaniyu") ||
        param.includes("obuchenie-chteniyu-pismu-schyotu") ||
        param.includes("podgotovka-po-metodike") ||
        param.includes("dlya-rebenka")
      ) {
        // Это цель
        slots[1] = param; // goalSlug во второй позиции
      } else {
        // Это предмет (занимает первую свободную позицию)
        if (!slots[0]) slots[0] = param;
        else if (!slots[1]) slots[1] = param;
      }
    }

    subjectSlug = slots[0];
    goalSlug = slots[1];
    placeSlug = slots[2];
  }

  return { subjectSlug, goalSlug, placeSlug };
}

export async function generateMetadata(context: any): Promise<Metadata> {
  const params = await Promise.resolve(context.params);
  const citySlug = params.city || "msk";
  const { subjectSlug, goalSlug, placeSlug } = parseParams(params.params);

  if (!validSlug.includes(citySlug)) {
    return {
      title: "Репетиторы на Tutorio",
      description: "Найди репетитора для занятий в любом регионе России",
    };
  }

  const region = await fetchRegionBySlug(citySlug);
  if (!region) return { title: "Репетиторы на Tutorio", description: "" };

  let data;
  try {
    data = await fetchGetTutorsByFilters(
      citySlug,
      subjectSlug,
      goalSlug,
      placeSlug,
      1,
      1
    );
  } catch (e) {
    data = null;
  }

  const subjectTitle = data?.subject?.for_request || "";
  const goalTitle = data?.goal?.title || "";
  const goalForRequest = data?.goal?.for_request || data?.goal?.title || "";

  let title = "";
  let description = "";

  // Определяем, нужно ли указывать предмет
  const shouldShowSubject =
    subjectTitle &&
    ![
      "Помощь по программе",
      "ВПР по математике",
      "ВПР по русскому",
      "ВПР по окружающему миру",
      "Подготовка к итоговому тестированию",
      "Обучение чтению, письму или счёту",
      "Подготовка по методике",
    ].includes(goalTitle || "");

  // Определяем цели, где предмет ставится ПЕРЕД целью
  const subjectBeforeGoalGoals = [
    "Подготовка к школе",
    "Для себя",
    "Для работы",
    "Подготовка к специализированной школе",
    "Для ребёнка",
  ];

  const shouldPutSubjectBeforeGoal =
    goalTitle && subjectBeforeGoalGoals.includes(goalTitle);

  // Новая логика формирования заголовков
  if (placeSlug === "online") {
    // Для online - убираем город
    if (subjectTitle && goalForRequest && shouldShowSubject) {
      if (shouldPutSubjectBeforeGoal) {
        title = `Репетиторы по ${subjectTitle} для ${goalForRequest} онлайн — Tutorio`;
        description = `Найди репетитора по ${subjectTitle} для ${goalForRequest} онлайн`;
      } else {
        title = `Репетиторы для ${goalForRequest} по ${subjectTitle} онлайн — Tutorio`;
        description = `Найди репетитора для ${goalForRequest} по ${subjectTitle} онлайн`;
      }
    } else if (goalForRequest && !shouldShowSubject) {
      title = `Репетиторы для ${goalForRequest} онлайн — Tutorio`;
      description = `Найди репетитора для ${goalForRequest} онлайн`;
    } else if (subjectTitle && shouldShowSubject) {
      title = `Репетиторы по ${subjectTitle} онлайн — Tutorio`;
      description = `Найди репетитора по ${subjectTitle} онлайн`;
    } else if (goalForRequest) {
      title = `Репетиторы для ${goalForRequest} онлайн — Tutorio`;
      description = `Найди репетитора для ${goalForRequest} онлайн`;
    } else {
      title = "Репетиторы онлайн — Tutorio";
      description = "Найди репетитора для занятий онлайн";
    }
  } else {
    // Для остальных случаев - оставляем город
    if (subjectTitle && goalForRequest && shouldShowSubject) {
      if (shouldPutSubjectBeforeGoal) {
        title = `Репетиторы по ${subjectTitle} для ${goalForRequest} в ${region.region_name_dative} — Tutorio`;
        description = `Найди репетитора по ${subjectTitle} для ${goalForRequest} в ${region.region_name_dative}`;
      } else {
        title = `Репетиторы для ${goalForRequest} по ${subjectTitle} в ${region.region_name_dative} — Tutorio`;
        description = `Найди репетитора для ${goalForRequest} по ${subjectTitle} в ${region.region_name_dative}`;
      }
    } else if (goalForRequest && !shouldShowSubject) {
      title = `Репетиторы для ${goalForRequest} в ${region.region_name_dative} — Tutorio`;
      description = `Найди репетитора для ${goalForRequest} в ${region.region_name_dative}`;
    } else if (subjectTitle && shouldShowSubject) {
      title = `Репетиторы по ${subjectTitle} в ${region.region_name_dative} — Tutorio`;
      description = `Найди репетитора по ${subjectTitle} в ${region.region_name_dative}`;
    } else if (goalForRequest) {
      title = `Репетиторы для ${goalForRequest} в ${region.region_name_dative} — Tutorio`;
      description = `Найди репетитора для ${goalForRequest} в ${region.region_name_dative}`;
    } else {
      title = `Репетиторы в ${region.region_name_dative} — Tutorio`;
      description = `Найди репетитора для занятий в ${region.region_name_dative}`;
    }

    // Добавляем только "на дому" в описание (для u-repetitora ничего не добавляем)
    if (placeSlug === "na-domu") {
      description += ` на дому`;
    }
  }

  return { title, description };
}

export default RepetitorsPage;
