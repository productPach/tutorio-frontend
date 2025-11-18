"use client";

import clsx from "clsx";
import styles from "../../../app/page.module.css";
import stylesListTutor from "../../Student/Order/Order.module.css";
import generalStyles from "../../../app/student/layout.module.css";
import { Tutor } from "@/types/types";
import { getBackendUrl, host } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import Image from "next/image";
import { pluralize } from "numeralize-ru";
import { useCallback, useState } from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RepetitorsList } from "./RepetitorsList";
import { Faq } from "../Faq/Faq";

interface Props {
  tutors: Tutor[];
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
  // Добавляем пропсы для пагинации
  totalPages: number;
  currentPage: number;
  city: string;
}

export const RepetitorsClient = ({
  tutors,
  subject,
  goal,
  place,
  totalPages,
  currentPage,
  city,
}: Props) => {
  const router = useRouter();

  const buildAlternativeTitle = () => {
    const parts = [];

    // Определяем, нужно ли указывать предмет
    const shouldShowSubject =
      subject &&
      ![
        "Помощь по программе",
        "ВПР по математике",
        "ВПР по русскому",
        "ВПР по окружающему миру",
        "Обучение чтению, письму или счёту",
        "Подготовка по методике",
      ].includes(goal?.title || "");

    // Определяем цели, где предмет ставится ПЕРЕД целью
    const subjectBeforeGoalGoals = [
      "Подготовка к школе",
      "Для себя",
      "Для работы",
      "Подготовка к специализированной школе",
      "Для ребёнка",
    ];

    const shouldPutSubjectBeforeGoal =
      goal && subjectBeforeGoalGoals.includes(goal.title);

    // Формируем основную часть без "Репетиторы" и региона
    if (subject && goal && shouldShowSubject) {
      if (shouldPutSubjectBeforeGoal) {
        parts.push(`${goal.title} по ${subject.for_request}`);
      } else {
        parts.push(`${goal.title} по ${subject.for_request}`);
      }
    } else if (goal && !shouldShowSubject) {
      // Для целей где предмет не указывается
      parts.push(`${goal.title}`);
    } else if (subject && shouldShowSubject) {
      parts.push(`Выбирайте лучших репетиторов по ${subject.for_request}`);
    } else if (goal) {
      parts.push(`${goal.title}`);
    } else {
      parts.push(`Занятия с репетитором`);
    }

    // Добавляем место занятий если есть
    if (place) {
      parts.push(`${place.title}`);
    }

    return parts.join(" ");
  };

  const handleSubject = useCallback(() => {
    localStorage.removeItem("currentMatch");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("origin-phone");

    // const dataToSave = subject?.id_p
    //   ? [{ id: 0, subject: subject?.id_p }]
    //   : [{ id: 1, goal: goal?.title }];

    // ТУТ ВОЗМОЖНО СТОИТ ПЕРЕДЕЛАТЬ, ЧТОБЫ ДОБАВЛЯЛСЯ ТОЛЬКО ПРЕДМЕТ, ПОТОМУ ЧТО ВСЕ РАВНО ОТКРЫВАЕТСЯ СТРАНИЦА С ВЫБОРОМ ЦЕЛИ
    const dataToSave = goal?.title
      ? [
          { id: 0, subject: subject?.id_p },
          { id: 1, goal: goal?.title },
        ]
      : [{ id: 0, subject: subject?.id_p }];

    localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
    document.body.style.overflow = "auto";
    subject?.nextPage && router.push(subject?.nextPage);
  }, [subject, router]);

  return (
    <>
      <section className={styles.firstSection__snippetSearch}>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetMedium
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Оставьте заказ за 2 минуты&nbsp;🎯
          </div>
          <p className={styles.firstSection__snippetL}>
            Ответьте на несколько простых вопросов — предмет, цель, формат и
            стоимость занятий
          </p>
        </div>

        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Получайте отклики&nbsp;📢
          </div>

          <p className={styles.firstSection__snippetM}>
            Подходящие репетиторы сами откликаются на ваш запрос
          </p>
        </div>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Сравнивайте профили&nbsp;👀
          </div>

          <p className={styles.firstSection__snippetM}>
            Смотрите опыт, образование, отзывы и ставку за час
          </p>
        </div>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Общайтесь в чате&nbsp;💬
          </div>

          <p className={styles.firstSection__snippetM}>
            {/* Пишите репетиторам, обсуждайте детали и назначай первое занятие —
            без звонков и посредников */}
            Назначайте первое занятие — без звонков и посредников
          </p>
        </div>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Выбирайте по отзывам&nbsp;⭐
          </div>

          <p className={styles.firstSection__snippetM}>
            Рейтинг и отзывы помогают выбрать подходящего репетитора
          </p>
        </div>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Занимайтесь где удобно&nbsp;📍
          </div>

          <p className={styles.firstSection__snippetM}>
            Онлайн, у себя дома или у репетитора — как вам комфортно
          </p>
        </div>
        <div
          onClick={handleSubject}
          className={clsx(
            styles.firstSection__snippet_tutor,
            styles.snippetSmall
          )}
        >
          <div className={styles.fs_SnippetItemEmj}>
            Бесплатно для учеников&nbsp;🎁
          </div>

          <p className={styles.firstSection__snippetM}>
            Создание заказа и общение с репетиторами — всегда бесплатно
          </p>
        </div>
      </section>

      {/* === Список репетиторов === */}
      <section className={styles.tutorsList}>
        <h2 className={styles.howWork__title}>{buildAlternativeTitle()}</h2>
        <RepetitorsList
          tutors={tutors}
          subject={subject}
          totalPages={totalPages}
          currentPage={currentPage}
          handleSubject={handleSubject}
          city={city}
        />
      </section>
      <Faq />
    </>
  );
};
