import clsx from "clsx";
import styles from "../../../app/page.module.css";
import { Tutor } from "@/types/types";
import { RepetitorsClient } from "./RepetitorsClient";

interface RepetitorsServerProps {
  region_name_dative: string;
  tutors: Tutor[];
  total: number;
  page: number;
  pages: number;
  subject?: {
    id_p: string;
    title: string;
    for_request: string;
    nextPage?: string;
  };
  goal?: {
    title: string;
    for_request: string;
    for_chpu: string;
  };
  place?: {
    slug: string;
    title: string;
  };
  city: string;
}

export const RepetitorsServer = ({
  region_name_dative,
  tutors,
  total,
  page,
  pages,
  subject,
  goal,
  place,
  city,
}: RepetitorsServerProps) => {
  // формируем заголовок по новой логике
  const buildTitle = () => {
    const parts = [];
    const regionWithNonBreakingSpaces = region_name_dative.replace(
      /\s/g,
      "\u00A0"
    );

    // Определяем, нужно ли указывать предмет
    const shouldShowSubject =
      subject &&
      ![
        "Помощь по\u00A0программе",
        "ВПР по\u00A0математике",
        "ВПР по\u00A0русскому",
        "ВПР по\u00A0окружающему миру",
        "Обучение чтению, письму или\u00A0счёту",
        "Подготовка по\u00A0методике",
      ].includes(goal?.title || "");

    // Определяем цели, где предмет ставится ПЕРЕД целью
    const subjectBeforeGoalGoals = [
      "Подготовка к\u00A0школе",
      "Для себя",
      "Для работы",
      "Подготовка к\u00A0специализированной школе",
      "Для ребёнка",
    ];

    const shouldPutSubjectBeforeGoal =
      goal && subjectBeforeGoalGoals.includes(goal.title);

    // Если есть место "online" - убираем город из заголовка
    if (place?.slug === "online") {
      if (subject && goal && shouldShowSubject) {
        if (shouldPutSubjectBeforeGoal) {
          parts.push(
            `Репетиторы по\u00A0${subject.for_request} для\u00A0${goal.for_request} онлайн`
          );
        } else {
          parts.push(
            `Репетиторы для\u00A0${goal.for_request} по\u00A0${subject.for_request} онлайн`
          );
        }
      } else if (goal && !shouldShowSubject) {
        // Для целей где предмет не указывается
        parts.push(`Репетиторы для\u00A0${goal.for_request} онлайн`);
      } else if (subject && shouldShowSubject) {
        parts.push(`Репетиторы по\u00A0${subject.for_request} онлайн`);
      } else if (goal) {
        parts.push(`Репетиторы для\u00A0${goal.for_request} онлайн`);
      } else {
        parts.push(`Репетиторы онлайн`);
      }
    } else {
      // Логика с городом для других случаев
      if (subject && goal && shouldShowSubject) {
        if (shouldPutSubjectBeforeGoal) {
          parts.push(
            `Репетиторы по\u00A0${subject.for_request} для\u00A0${goal.for_request} в\u00A0${regionWithNonBreakingSpaces}`
          );
        } else {
          parts.push(
            `Репетиторы для\u00A0${goal.for_request} по\u00A0${subject.for_request} в\u00A0${regionWithNonBreakingSpaces}`
          );
        }
      } else if (goal && !shouldShowSubject) {
        // Для целей где предмет не указывается
        parts.push(
          `Репетиторы для\u00A0${goal.for_request} в\u00A0${regionWithNonBreakingSpaces}`
        );
      } else if (subject && shouldShowSubject) {
        parts.push(
          `Репетиторы по\u00A0${subject.for_request} в\u00A0${regionWithNonBreakingSpaces}`
        );
      } else if (goal) {
        parts.push(
          `Репетиторы для\u00A0${goal.for_request} в\u00A0${regionWithNonBreakingSpaces}`
        );
      } else {
        parts.push(`Репетиторы в\u00A0${regionWithNonBreakingSpaces}`);
      }

      // Добавляем только "на дому", "у репетитора" не добавляем
      if (place?.slug === "na-domu") {
        parts.push(`на\u00A0дому`);
      }
    }

    return parts.join(" ");
  };

  return (
    <main>
      {/* === Первый блок === */}
      <section className={clsx(styles.firstSection, styles.center)}>
        <div className={styles.mContainer}>
          <h1>{buildTitle()}</h1>
          <h2>
            Выбирайте репетиторов и&nbsp;общайтесь с&nbsp;ними напрямую
            без&nbsp;лишних посредников
          </h2>
        </div>

        {/* <SelectSubject /> */}
      </section>

      <RepetitorsClient
        tutors={tutors}
        subject={subject}
        totalPages={pages}
        currentPage={page}
        goal={goal}
        place={place}
        city={city}
      />
    </main>
  );
};
